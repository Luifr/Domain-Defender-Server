const jwt = require("jsonwebtoken");
const cryptoGen = require("crypto");
import * as Player from './model/player'

const isLocal = process.env.NODE_ENV !== "production";
const privateKey = isLocal ? "80d6cf3a8bc62ab2a1ae2d054a373caa810a462ee83740" : cryptoGen.randomBytes(64).toString("hex");


module.exports.verifyToken = function verifyToken(req, res, next) {

	if (req.url == "/login") {
		next();
		return;
	}

	const token = req.headers["authorization"];
	if (!token)
		res.status(403).send("Token is required");
	else {
		jwt.verify(token, privateKey, (err, authData) => {
			if (err) {
				res.status(403).send("Authentication problem");
				return;
			}
			// req.otherData = authData.otherData
			req.user = authData.user;
			next();
		});
	}
};

module.exports.sign = async function sign(email) {
	if (!email)
		throw "Email is required";

	if (true) { // TODO checar com o servidor da semcomp
		let token = await jwt.sign({ user: { email } }, privateKey);
		if (token) {
			updateLoginTimestamp(email);
			return token;
		}
		throw "Authentication problem";
	}
	else {
		throw "Invalid email/password combination";
	}
};

async function updateLoginTimestamp(email) {
	let player = await Player.get(email);
	player.lastLogin = Date.now();
	Player.save(email, player);
}
