const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const prisma = require('../config/db');

// ── REGISTER ───────────────────────────────────────────
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all required fields" });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: { 
                name, 
                email, 
                phone: phone || null,
                password: hashedPassword 
            }
        });

        res.status(201).json({
            success: true,
            message: "User created successfully! Please login.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone
            }       
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── LOGIN ──────────────────────────────────────────────
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'access_secret',
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_SECRET || 'refresh_secret',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            accessToken,
            refreshToken,
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone,
                avatar: user.avatar,
                role: user.role 
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── UPDATE PROFILE ────────────────────────────────────
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                name, 
                phone: phone || null 
            }
        });

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ success: false, message: "Server error during update" });
    }
};

// ── UPLOAD AVATAR ─────────────────────────────────────
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        // Build public URL for the uploaded file
        const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { avatar: avatarUrl },
        });

        res.json({
            success: true,
            message: 'Avatar updated successfully',
            avatarUrl,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.error('Avatar Upload Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── CHANGE PASSWORD ───────────────────────────────────
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both current and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
        }

        // Fetch user with password hash
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
        }

        const hashedNewPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedNewPassword },
        });

        res.json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};