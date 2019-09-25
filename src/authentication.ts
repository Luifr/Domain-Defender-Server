import jwt from "jsonwebtoken";
import cryptoGen from "crypto";
import * as Player from './model/player'
import bcrypt from 'bcrypt';

const isLocal = process.env.NODE_ENV !== "production";
const privateKey = isLocal ? "80d6cf3a8bc62ab2a1ae2d054a373caa810a462ee83740" : cryptoGen.randomBytes(64).toString("hex");


export function verifyToken(req, res, next) {
	if (req.url == "/login" || req.url == "/register") {
		next();
		return;
	}

	const token = req.headers["authorization"];
	if (!token)
		return res.status(403).json({ message: "Token is required" });
	else {
		jwt.verify(token, privateKey, async (err, authData) => {
			if (err) {
				res.status(403).json({ message: "Authentication problem" });
				return;
			}
			// req.otherData = authData.otherData

			req.user = await Player.get(authData.user.username);
			if (!req.user)
				res.status(403).json({ message: "Login problem" });
			next();
		});
	}
};

export async function sign(username: string, password: string) {

	let player = await Player.get(username, password);
	if (player) {
		let token = await jwt.sign({ user: { username } }, privateKey);
		if (token) {
			updateLoginTimestamp(username);
			return { token, player };
		}
		throw "Authentication problem";
	}
	else {
		throw "Invalid username/password combination";
	}
};

export async function register(email: string, username: string, password: string) {
	if (await Player.get(username))
		throw "Username already exists";
	let hashedPassword = await bcrypt.hash(password, 10);
	let player = { email, username, highScore: 0, money: 0, upgradeLevel: [0, 0, 0, 0, 0, 0], lastLogin: Date.now(), password: hashedPassword, gamesPlayed: 0 };
	return Player.save(username, player as any);
}

async function updateLoginTimestamp(username) {
	let player = await Player.get(username);
	if (!player)
		return;
	player.lastLogin = Date.now();
	Player.save(username, player);
}
