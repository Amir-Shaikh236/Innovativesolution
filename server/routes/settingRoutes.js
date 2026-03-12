"use strict";

const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { adminAuth } = require('../middleware/authMiddleware');
const router = express.Router();

const User = require("../models/User");
const Category = require("../models/Category");
const Blog = require("../models/Blog");
const Subscription = require("../models/Subscription");

// ══════════════════════════════════════════════════════════════════════════════
//  PROFILE
// ══════════════════════════════════════════════════════════════════════════════

// GET  /api/admin/settings/profile
router.get("/profile", adminAuth, async (req, res) => {
    try {
        // req.user is set by your authMiddleware (same as getAdmin)
        const admin = await User.findById(req.user.id).select("-password").lean();
        if (!admin) return res.status(404).json({ msg: "Admin not found" });

        return res.status(200).json({
            success: true,
            data: {
                firstName: admin.name?.split(" ")[0] ?? "",
                lastName: admin.name?.split(" ").slice(1).join(" ") ?? "",
                name: admin.name,
                email: admin.email,
                phone: admin.phone ?? "",
                company: admin.company ?? "Innovative Staffing Solutions",
                location: admin.location ?? "",
                bio: admin.bio ?? "",
                avatarUrl: admin.avatarUrl ?? null,
            },
        });
    } catch (err) {
        console.error("settings/profile GET error:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

// PUT  /api/admin/settings/profile
router.put("/profile", adminAuth, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, company, location, bio } = req.body;

        if (!firstName?.trim() || !lastName?.trim())
            return res.status(400).json({ msg: "First and last name are required." });

        if (!email || !email.includes("@"))
            return res.status(400).json({ msg: "A valid email is required." });

        // Check email uniqueness (excluding this admin)
        const conflict = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: req.user.id } });
        if (conflict)
            return res.status(400).json({ msg: "That email is already in use." });

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            {
                name: `${firstName.trim()} ${lastName.trim()}`,
                email: email.toLowerCase().trim(),
                phone: phone ?? "",
                company: company ?? "",
                location: location ?? "",
                bio: bio ?? "",
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updated) return res.status(404).json({ msg: "Admin not found" });

        return res.status(200).json({ success: true, msg: "Profile updated successfully.", data: updated });
    } catch (err) {
        console.error("settings/profile PUT error:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

// POST /api/admin/settings/profile/avatar
router.post("/profile/avatar", adminAuth, async (req, res) => {
    try {
        // Example with multer already applied upstream:
        // const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        // await User.findByIdAndUpdate(req.user.id, { avatarUrl });
        // return res.status(200).json({ success: true, avatarUrl });

        return res.status(200).json({ success: true, msg: "Avatar upload endpoint ready — attach multer middleware." });
    } catch (err) {
        console.error("settings/avatar POST error:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});


// ══════════════════════════════════════════════════════════════════════════════
//  SECURITY
// ══════════════════════════════════════════════════════════════════════════════

// PUT  /api/admin/settings/security/password
router.put("/security/password", adminAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword)
            return res.status(400).json({ msg: "All password fields are required." });

        if (newPassword !== confirmPassword)
            return res.status(400).json({ msg: "New passwords do not match." });

        if (newPassword.length < 8)
            return res.status(400).json({ msg: "Password must be at least 8 characters." });

        // Fetch full user (with password) — same pattern as login controller
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "Admin not found" });

        // Reuse your existing matchPassword() method from the User model
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch)
            return res.status(401).json({ msg: "Current password is incorrect." });

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        return res.status(200).json({ success: true, msg: "Password changed successfully." });
    } catch (err) {
        console.error("settings/password PUT error:", err);
        return res.status(500).json({ msg: "Server error" });
    }
});

// ══════════════════════════════════════════════════════════════════════════════
//  APPEARANCE  (light-only — dark theme not yet implemented)
// ══════════════════════════════════════════════════════════════════════════════

// GET  /api/admin/settings/appearance
router.get("/appearance", (req, res) => {
    return res.status(200).json({ success: true, data: getAppear(req.user.id) });
});

// PUT  /api/admin/settings/appearance
router.put("/appearance", (req, res) => {
    const VALID_LANGS = ["en", "en-gb", "es", "fr", "de"];
    const VALID_DENSITY = ["compact", "comfortable", "spacious"];

    const { language, timezone, density } = req.body;

    if (language && !VALID_LANGS.includes(language))
        return res.status(400).json({ msg: "Invalid language value." });
    if (density && !VALID_DENSITY.includes(density))
        return res.status(400).json({ msg: "Invalid density value." });

    const prefs = getAppear(req.user.id);
    if (language) prefs.language = language;
    if (timezone) prefs.timezone = timezone;
    if (density) prefs.density = density;

    appearStore[req.user.id] = prefs;
    return res.status(200).json({ success: true, msg: "Appearance settings saved.", data: prefs });
});


module.exports = router;