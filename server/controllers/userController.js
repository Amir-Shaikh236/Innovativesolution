const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendVerificationEmail, sendEmail } = require('../utils/sendEmail');
const PasswordReset = require('../models/PasswordReset');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required in the request body" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)

    const token = jwt.sign(
      { name, email, password: hashPassword },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await sendVerificationEmail(email, token)

    res.status(200).json({ message: `Verification Link send to email: ${email}` })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {

    const { token } = req.query

    const frontendLoginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!token) {
      return res.redirect(`${frontendLoginUrl}/login?error=missing_token`);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userExist = await User.findOne({ email: decoded.email });
    if (userExist) {
      return res.redirect(`${frontendLoginUrl}/login?verified=true`);
    }

    const user = await User.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password
    });

    res.redirect(`${frontendLoginUrl}/login?verified=true`);

  } catch (error) {
    console.error(error);

    const frontendLoginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendLoginUrl}/login?error=invalid_token`);
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {

      // Generate the token
      const token = generateToken(user._id, user.role);

      // Define Cookie Options (Crucial for Localhost)
      const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // ⚠️ FIXED: Only use 'secure: true' in production (HTTPS).
        secure: process.env.NODE_ENV === 'production',

        // ⚠️ FIXED: 'Lax' works on localhost. 'None' fails without HTTPS.
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      };

      res.status(200)
        .cookie('token', token, options)
        .json({
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        });

    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logoutUser = (req, res) => {
  // We clear the cookie by setting it to empty and expiring it immediately
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Cannot fetch user profile" });
  }
};


exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If that email exists, a link has been sent' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await PasswordReset.deleteMany({ userId: user._id })

    await PasswordReset.create({
      userId: user._id,
      token: hashedToken,
    });

    const resetUrl = `${process.env.FRONTEND_URL}/passwordreset/${resetToken}`;

    const message = `
        <h2> Email Verification </h2>
        <p>Please click the button below to verify your email </p>
        <a href="${resetUrl}" style="padding:10px 15px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:5px"> Verify Email </a>
        <p> This link will expire in 1 Hour. </p>
        `

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message
      });

      res.status(200).json({ message: 'Email Sent' });
    } catch (err) {
      await PasswordReset.deleteMany({ userId: user._id });
      return res.status(500).json({ message: 'Email could not be sent' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const resetDoc = await PasswordReset.findOne({ token: hashedToken });
    if (!resetDoc) return res.status(400).json({ message: "Invalid or Expired Token" });

    const user = await User.findById(resetDoc.userId);
    if (!user) return res.status(404).json({ message: "User no longer exists" });

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();

    await PasswordReset.deleteOne({ _id: resetDoc._id });

    res.status(200).json({ message: 'Password Reset Successful' });

    res.status(200).json({ message: 'Password Reset Successfull' });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
