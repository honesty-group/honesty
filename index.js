const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const db = {
	profiles: low(new FileSync(__dirname + "/storage/profiles.json"))
};

db.profiles
	.defaults({
		data: []
	})
	.write();
