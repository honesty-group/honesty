/**
 * (c) 2019 Honesty Group
 *
 * This script is the core of Honesty.
 */

const _ = require("lodash");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const crypto = require("crypto");
const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

const profilePage = Handlebars.compile(
	fs
		.readFileSync(path.resolve(__dirname, "./templates/profile-main.html"))
		.toString()
);

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
const createJSON = (path, json) => {
	fs.writeFileSync(path, JSON.stringify(json));
};
const readJSON = (path, safe) => {
	let res;
	try {
		res = JSON.parse(fs.readFileSync(path));
	} catch (e) {
		res = {};
	}

	if (safe)
		res = _.pick(res, ["name", "id", "posts", "followers", "following"]);

	return res;
};
const profile = ({ name, email, phone, id, data, render }, create) => {
	let prof = db.profiles.get("data");

	name = name ? name.toLowerCase() : false;
	email = email ? email.toLowerCase() : false;
	id = id ? id.toLowerCase() : false;

	let user = name
		? prof.find({ name }).value()
		: email
		? prof.find({ email }).value()
		: phone
		? prof.find({ phone }).value()
		: id
		? prof.find({ id }).value()
		: false;

	if (create && !user && name && (email || phone) && data) {
		user = {
			name,
			email,
			phone,
			id: uuidv4()
		};
		prof.push(user).write();

		_.defaults(data, {
			name,
			email,
			phone,
			id: user.id,
			password: data.password || "",
			posts: [],
			followers: [],
			following: []
		});

		createJSON(
			path.resolve(__dirname, "./storage/profiles/", name + ".json"),
			data
		);
	}

	if (render) return profilePage(user);

	return user;
};
