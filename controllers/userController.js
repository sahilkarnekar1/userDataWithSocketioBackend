const User = require('../models/userModel');
const cloudinary = require('../config/cloudinaryConfig');

// POST: Upload user data with images
exports.createUser = async (req, res, io) => {
    try {
        const { name, socialMediaHandle } = req.body;
        let imagesArray = [];

        if (req.files) {
            // Loop through uploaded files and upload each to Cloudinary
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'user_images'
                });
                imagesArray.push(result.secure_url); // Store Cloudinary image URL
            }
        }

        // Create new user with submitted data
        const newUser = new User({
            name,
            socialMediaHandle: JSON.parse(socialMediaHandle),  // Expects JSON array of {platform, link}
            images: imagesArray,
        });

        await newUser.save();

        // Emit the new user data to all connected clients
        io.emit('newUser', newUser); // Emit the new user data to all connected clients

        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Admin dashboard - fetch all users with their data
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(201).json({ users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
