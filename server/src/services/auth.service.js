const User = require("../models/user.model");
const AppError = require("../utils/AppError");

const registerUser = async (userData) => {

    const { email, username } = userData;

    // Check email
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
        throw new AppError("Email already exists", 409);
    }

    // Check username
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
        throw new AppError("Username already exists", 409);
    }

    // Create user
    const user = await User.create(userData);

    // return user; it return the whole data like password ko bhi 
    return await User.findById(user._id); // it return the whole data but it does not return the password
};

const loginUser = async ({ email, password }) => {

    const user = await User.findOne({
        email
    }).select("+password");

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    return await User.findById(user._id);

};

module.exports = {
    registerUser,
    loginUser
};