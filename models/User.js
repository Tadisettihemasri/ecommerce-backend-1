const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
		required: [ true, "userId is required."],
        unique: true
    },
	name: {
		type: String,
		required: [ true, "Name is required."]
	},
	email: {
		type: String,
		required: [ true, "Email is required."]
	},
	password: {
		type: String,
		required: [ true, "Password is required."]
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	mobileNo: {
		type: String,
		required: [ true, "Mobile number is required."]
	},
    address: {
        type: String,
		required: [ true, "address is required."]
    }
})

module.exports = mongoose.model("User", userSchema);
