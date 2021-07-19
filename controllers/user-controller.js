const User = require("../models/User");

const getUser = async filter => {
	try {
		return await User.findOne(filter);
	} catch (err) {
		console.error(err);
		return null;
	}
};

const getUsersByIds = async userIds => {
	try {
		return await User.find({_id: {$in: userIds}});
	} catch (err) {
		console.error(err);
		return null;
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
		return null;
	}
};

const deleteUser = async userId => {
	try {
		return await User.findByIdAndDelete(userId);
	} catch (err) {
		console.error(err);
		return null;
	}
};

module.exports = {getUser, getUsersByIds, addOrUpdateUser, deleteUser};