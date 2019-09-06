/**
 * (c) 2019 Honesty Group
 *
 * This script is the core of Honesty.
 */

const _ = require("lodash");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

// Database
const db = {
	profiles: low(new FileSync(__dirname + "/storage/profiles.json"))
};

db.profiles
	.defaults({
		data: []
	})
	.write();

// Functions
const profile = ({ name, email, phone, id }) => {
	let prof = db.profiles.get("profiles");
	let user = name
		? prof.find({ name }).value()
		: email
		? prof.find({ email }).value()
		: phone
		? prof.find({ phone }).value()
		: id
		? prof.find({ id }).value()
		: false;

	console.log(user);
};

profile({ name: "IceHacks" });
