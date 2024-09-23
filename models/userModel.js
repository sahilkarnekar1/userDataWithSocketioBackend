const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    socialMediaHandle: [
        {
            platform: String,
            link: String,
        }
    ],
    images: [String],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
