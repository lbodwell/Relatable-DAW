const User = require("../models/User");

const getUser = async filter => {
	try {
		return await User.findOne(filter);
	} catch (err) {
		console.error(err);
	}
};

const getUsersByIds = async userIds => {
	try {
		return await User.find({_id: {$in: userIds}});
	} catch (err) {
		console.error(err);
	}
};

const addOrUpdateUser = async (filter, update) => {
	try {
		return await User.findOneAndUpdate(filter, update, {
			new: true,
			upsert: true
		});
	} catch (err) {
		console.error(err);
	}
};

const deleteUser = async filter => {
	try {
		await User.findOneAndDelete(filter);
	} catch (err) {
		console.error(err);
	}
};

module.exports = {getUser, getUsersByIds, addOrUpdateUser, deleteUser};