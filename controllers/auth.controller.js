const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const asyncHandler = require('express-async-handler');
const { signAccessToken, signRefreshToken } = require('../config/jwtHelper');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *   LoginRequest:
 *     type: object
 *     properties:
 *       usernameEmailOrPhoneNumber:
 *         type: string
 *         example: "john_doe@example.com"
 *       password:
 *         type: string
 *         example: "password123"
 *   RegisterRequest:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: "John Doe"
 *       email:
 *         type: string
 *         example: "john_doe@example.com"
 *       password:
 *         type: string
 *         example: "password123"
 *       role:
 *         type: string
 *         example: "User"
 *       username:
 *         type: string
 *         example: "johndoe123"
 *       phoneNumber:
 *         type: string
 *         example: "1234567890"
 *   ForgotPasswordRequest:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         example: "john_doe@example.com"
 *   ResetPasswordRequest:
 *     type: object
 *     properties:
 *       password:
 *         type: string
 *         example: "newpassword123"
 *   RefreshTokenRequest:
 *     type: object
 *     properties:
 *       refreshToken:
 *         type: string
 *         example: "refresh_token_here"
 *   UpdateDetailsRequest:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         example: "John Doe"
 *       email:
 *         type: string
 *         example: "john_doe@example.com"
 *       role:
 *         type: string
 *         example: "User"
 *       username:
 *         type: string
 *         example: "johndoe123"
 *       phoneNumber:
 *         type: string
 *         example: "1234567890"
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and return access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *       '400':
 *         description: Invalid username or password
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
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
            .json({ user, accessToken, refreshToken });
            return;
        }
    }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user and return access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       '200':
 *         description: Successful registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *       '400':
 *         description: User already exists
 *       '500':
 *         description: Internal server error
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
    const accessToken = await signAccessToken(user._id.toString());
    const refreshToken = await signRefreshToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path:'/'})
    .cookie('accessToken', accessToken, { httpOnly: true, maxAge: 24 * 60 * 1000, path:'/'})
    .json({ user, accessToken, refreshToken });
});


/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send a password reset link to user's email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       '200':
 *         description: Password reset link sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Password reset link has been sent
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
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
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset user's password using a token from the reset link
 *     tags: [Authentication]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token received in email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       '200':
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Password reset successfully
 *       '400':
 *         description: Invalid token
 *       '500':
 *         description: Internal server error
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
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and clear access and refresh tokens
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Logged out successfully
 *       '500':
 *         description: Internal server error
 */
const logout = asyncHandler(async (req, res) => {
    // remove all cookie
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    res.json({ message: 'Logged out successfully' });
});

/**
 * @swagger
 * /api/auth/refresh-tokens:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       '200':
 *         description: Access token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *       '401':
 *         description: Refresh token missing or invalid
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized, access token missing or invalid
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/auth/update-details:
 *   put:
 *     summary: Update authenticated user's profile details
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDetailsRequest'
 *     responses:
 *       '200':
 *         description: Updated user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized, access token missing or invalid
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
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
