/**
 * (c) 2019 Honesty Group
 *
 * This script is the core of Honesty.
 */

const _ = require("lodash");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const crypto = require("crypto");

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
const uuidv4 = () => {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
		(
			c ^
			(crypto.randomFillSync(new Uint8Array(1))[0] & (15 >> (c / 4)))
		).toString(16)
	);
};
const profile = ({ name, email, phone, id, data }) => {
	let prof = db.profiles.get("data");
	let user = name
		? prof.find({ name }).value()
		: email
		? prof.find({ email }).value()
		: phone
		? prof.find({ phone }).value()
		: id
		? prof.find({ id }).value()
		: false;

	if (!user && name && (email || phone) && data) {
		prof.push({
			name,
			email,
			phone,
			id: uuidv4(),
			data
		}).write();
	}
};
