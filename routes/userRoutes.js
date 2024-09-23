const express = require('express');
const multer = require('multer');
const { createUser, getUsers } = require('../controllers/userController');


// Use memory storage for multer to avoid saving images to disk
const storage = multer.memoryStorage();  
const upload = multer({ storage });

const router = express.Router();


module.exports = (io) => {
    // POST: Submit user data (with images) and pass `io` to the controller
    router.post('/submit', upload.array('images', 5), (req, res) => {
        createUser(req, res, io);  // Pass the `io` instance to the controller
    });

    // GET: Admin dashboard
    router.get('/admin', getUsers);

    return router;
};
