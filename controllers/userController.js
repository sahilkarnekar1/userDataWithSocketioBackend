const User = require('../models/userModel');
const cloudinary = require('../config/cloudinaryConfig');

// POST: Upload user data with images
exports.createUser = async (req, res, io) => {
    try {
        const { name, socialMediaHandle } = req.body;
        let imagesArray = [];

        if (req.files && req.files.length > 0) {
            // Loop through each uploaded file
            for (const file of req.files) {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: 'user_images' },  // Specify the folder in Cloudinary
                        (error, result) => {
                            if (error) reject(error); // Handle Cloudinary error
                            else resolve(result); // Resolve the promise with result
                        }
                    );
                    uploadStream.end(file.buffer);  // Use the file buffer from multer
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
