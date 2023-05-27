const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const { signAccessToken, signRefreshToken } = require('../config/jwtHelper');

/**
 * Authenticates a user by email and password.
 * 
 * @route POST /api/auth/login
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The user object with a JWT token.
 */
const login = asyncHandler(async (req, res) => {
    const { usernameEmailOrPhoneNumber, password } = req.body;
    
    const user = await User.findOne({ $or : [{ username: usernameEmailOrPhoneNumber }, { email: usernameEmailOrPhoneNumber }, { phoneNumber: usernameEmailOrPhoneNumber }]  });

    if (!user) {
        res.status(400).json({ error: 'User not found' });
    } else {
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            res.status(400).json({ error: 'Invalid username or password' });
        } else {
            // Generate access token and refresh token and set it to httponly cookie
            const accessToken = await signAccessToken(user._id.toString());
            const refreshToken = await signRefreshToken(user._id.toString());

            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path:'/'})
            .cookie('accessToken', accessToken, { httpOnly: true, maxAge: 24 * 60 * 1000, path:'/'})
            .json({ user, accessToken,refreshToken });
            return;
        }
    }
});

/**
 * Registers a new user user.
 * 
 * @route POST /api/auth/register
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The created user object.
 * 
 * Example request body:
 * {
 *  "name": "John Doe",
 * "email": "stanley121499@gmail.com",
 * "password": "password",
 * "role": "user",
 * "username": "johndoe",
 * "phoneNumber": "1234567890"
 * }
 */
const register = asyncHandler(async (req, res) => {
    const { name, email, password, role, username, phoneNumber } = req.body;

    // Check if user already exists
    const userFound = await User.find({ username });
    if (userFound.length > 0) {
        res.status(400).json({ error: 'User already exists' });
        return;
    }

    const user = new User({ name, email, password, role, username, phoneNumber });
    await user.save();

    // Generate access token and refresh token and set it to httponly cookie
    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000,});
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000,});
    res.json({ user, accessToken, refreshToken });
});

/**
 * Sends a password reset link to the user's email address.
 * 
 * @route POST /api/auth/reset-password
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} A success message indicating that the password reset link has been sent.
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: 'Password reset',
            html: `Click <a href="${process.env.RESET_PASSWORD_URL}/${token}">here</a> to reset your password.`,
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset link has been sent' });
    }
});

/**
 * Resets the user's password using a password reset link or token.
 * 
 * @route POST /api/auth/reset-password/:token
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The updated user object.
 */
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id);
    if (!user) {
        res.status(400).json({ error: 'Invalid token' });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Password reset successfully' });
    }
});

/**
 * Logout the user by destroying their session.
 * 
 * @route GET /api/auth/logout
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @access Private
 * @description This route is used to logout the user by destroying their session.
    */
const logout = asyncHandler(async (req, res) => {
    // remove all cookie
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
});

const refreshTokens = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    const refreshTokenHeader = authHeader && authHeader.split(' ')[1];
    console.log(refreshTokenHeader);
    const refreshToken = refreshTokenHeader || req.body.refreshToken;
    console.log("refreshToken", refreshToken);

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const savedRefreshToken = user.refreshToken;
        if (savedRefreshToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }
        const accessToken = signAccessToken(user._id);
        const newRefreshToken = signRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();
        res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000,});
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, });
        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

const getMe = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        console.log(user);
        res.json({ user });
    }
});

const updateDetails = asyncHandler(async (req, res) => {    
    const user = await User.findOneAndUpdate({_id: req.userId }, req.body, {new: true})
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        res.json({ user });
    }
});


module.exports = {
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    refreshTokens,
    getMe,
    updateDetails,
};
