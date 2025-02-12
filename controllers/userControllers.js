const userModel = require('../models/user');
const fs = require('fs');

exports.createUser = async (req, res) => {
    try {
        // Extract the data from the request body
        const { fullName, email } = req.body;
        // Get the uploaded file from the request file
        const file = req.file;
        // Create an instance of the document and save to the database
        const user = await userModel.create({
            fullName,
            email,
            image: file.originalname
        });

        // Send a success response
        res.status(201).json({
            message: 'User create successfully',
            data: user
        })
    }
    catch (e) {
        res.status(500).json({
            message: 'Error creating user ' + e.message
        })
    }
};

exports.getOneUser = async (req, res) => {
    try {
        // Extract the ID from the params
        const { id } = req.params
        // Find the user by their ID 
        const user = await userModel.findById(id);
        // Check if the user Exists 
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Send a success response
        res.status(200).json({
            message: 'User found',
            data: user
        })
    } catch (e) {
        res.status(500).json({
            message: 'Error creating user ' + e.message
        })
    }
}

exports.update = async (req, res) => {
    try {
        // Extract the ID from the params
        const { id } = req.params
        // Get required fields from the request body
        const { fullName, email } = req.body;
        // Console.log(fullName);

        // Find the user by their ID
        const user = await userModel.findById(id);
        // Check if the user Exists
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }
        const data = {
            firstName,
            image: user.image
        };

        const oldFilepath = `./uploads/${user.image}`;

        if (req.file && req.file.filename) {
            if (fs.existsSync(oldFilepath)) {
                fs.unlink(oldFilepath);
                data.image = req.file.originalname
            }
        }

        const updatedUser = await userModel.findByIdAndupdate(id, data, { new: true });

        res.status(200).json({
            message: 'User has been updated  successfully',
            data: updatedUser
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
};


exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const oldFilePath = `./uploads/${user.image}`

        const deleteUser = await userModel.findByIdAndDelete(id);

        if (deleteUser) {
            fs.unlinkSync(oldFilePath);
        }

        res.status(200).json({
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}