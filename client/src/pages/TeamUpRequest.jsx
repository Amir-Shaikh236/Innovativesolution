import React, { useState, useEffect } from "react";
import api from "../api";

export default function TeamUpRequest({ user }) {
    const [categoriesData, setCategoriesData] = useState([]);
    const [subpagesData, setSubpagesData] = useState([]); // State to hold all subpage data
    const [subcategories, setSubcategories] = useState([]); // State for filtered subcategories
    const [form, setForm] = useState({
        companyName: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        description: "",
        mainCategory: "",
        subCategory: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Auto-fill email and name when user is logged in
    useEffect(() => {
        if (user) {
            const nameParts = (user.name || "").split(" ");
            setForm((prev) => ({
                ...prev,
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                // Fetch both categories and subpages in parallel
                const [categoriesRes, subpagesRes] = await Promise.all([
                    api.get("/categories"),
                    api.get("/subpages"),
                ]);

                setCategoriesData(categoriesRes.data);
                setSubpagesData(subpagesRes.data);
            } catch (err) {
                setError("Failed to load categories and subcategories.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (form.mainCategory) {
            // Filter the list of all subpages based on the selected main category ID
            // Handle both populated (object) and non-populated (string) category fields
            const filteredSubcategories = subpagesData.filter((sub) => {
                const subCategoryId = sub.category?._id || sub.category;
                return String(subCategoryId) === String(form.mainCategory);
            });
            setSubcategories(filteredSubcategories);
            // Only reset subCategory if the currently selected one is not in the new list
            const currentSubId = form.subCategory;
            const isCurrentSubInList = filteredSubcategories.some(s => String(s._id) === String(currentSubId));
            if (!isCurrentSubInList) {
                setForm((f) => ({ ...f, subCategory: "" }));
            }
        } else {
            setSubcategories([]);
            setForm((f) => ({ ...f, subCategory: "" }));
        }
    }, [form.mainCategory, subpagesData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        if (!form.mainCategory || !form.subCategory) {
            alert("Please select both a main category and subcategory.");
            return;
        }
        
        setSubmitting(true);
        setSuccess(false);
        try {
            const res = await api.post("/teamup", form);
            setSuccess(true);
        } catch (err) {
            alert("Failed to send request. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 text-center text-slate-400">
                Loading categories...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4 text-center text-red-400 font-semibold">
                {error}
            </div>
        );
    }

    // Show message if no categories exist
    if (categoriesData.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-[#F5F5F5]">
                <div className="bg-gray-900/50 rounded-xl shadow-lg p-8 border border-gray-700 mt-20 text-center">
                    <h2 className="text-2xl font-bold text-[#008080] mb-4">No Categories Available</h2>
                    <p className="text-slate-300 mb-6">
                        Categories need to be created in the admin panel before they can be selected here.
                    </p>
                    <p className="text-slate-400 text-sm">
                        Please contact the administrator or log in to the admin panel to add categories.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-[#F5F5F5]">
            <div className="w-full max-w-md bg-gray-900/50 rounded-xl shadow-lg p-8 border border-gray-700 mt-20">
                <h2 className="text-3xl font-extrabold text-[#008080] mb-6 text-center">Team-Up Request</h2>
                {success ? (
                    <div className="text-center text-green-400 font-semibold">
                        <p className="text-5xl mb-4">🎉</p>
                        <p>Thank you for your request! We will contact you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            value={form.companyName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
                        />
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First name"
                            value={form.firstName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last name"
                            value={form.lastName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone number"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
                        />
                        <select
                            name="mainCategory"
                            value={form.mainCategory}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition appearance-none"
                        >
                            <option value="" disabled>
                                Select Main Category
                            </option>
                            {categoriesData.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="subCategory"
                            value={form.subCategory}
                            onChange={handleChange}
                            disabled={!form.mainCategory}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition disabled:opacity-50 appearance-none"
                        >
                            <option value="" disabled>
                                {form.mainCategory ? (subcategories.length > 0 ? "Select Sub Category" : "No subcategories available") : "Select Main Category first"}
                            </option>
                            {subcategories.map((sub) => (
                                <option key={sub._id} value={sub._id}>
                                    {sub.title || sub.name}
                                </option>
                            ))}
                        </select>
                        <textarea
                            name="description"
                            placeholder="Staffing Needs Description in short"
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#40E0D0] focus:border-[#40E0D0] transition"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full py-3 rounded-md font-bold transition ${submitting
                                ? "bg-[#2E8B57]/50 text-slate-400 cursor-not-allowed"
                                : "bg-[#40E0D0] text-black hover:bg-[#2E8B57] hover:text-white"
                                }`}
                        >
                            {submitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}