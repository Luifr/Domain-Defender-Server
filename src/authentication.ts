import jwt from "jsonwebtoken";
import cryptoGen from "crypto";
import * as Player from './model/player'
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const isLocal = process.env.NODE_ENV !== "production";
const privateKey = isLocal ? "80d6cf3a8bc62ab2a1ae2d054a373caa810a462ee83740" : cryptoGen.randomBytes(64).toString("hex");

let emails: string[];

Player.getAll().then((players) => {
	emails = players.map(player => player.email);
});

export function requestOrigin(req, res, next) {
	let unity_token = req.headers["unity_token"];
	if (unity_token == "66B1132A0173910B01EE3A15EF4E69583BBF2F7F1E4462C99EFBE1B9AB5BF808") {
		next();
		return;
	}
	res.status(400).json({ message: "" });
}

export function verifyToken(req, res, next) {
	if (/\/(?:(?:login)|(?:register)|(?:scores))\/?/.test(req.url)) {
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

			req.user = await Player.get(authData.user.username, undefined, true);
			if (!req.user)
				res.status(403).json({ message: "Login problem" });
			next();
		});
	}
};

export function checkHash(req, res, next) {
	let score = req.body.score || 0;
	let money = req.body.money || 0;
	let gamesPlayed = req.user.gamesPlayed || 0;
	let hash = crypto.createHash('sha1').update("oisemcomp" + score + money + gamesPlayed, 'utf8').digest('hex');
	console.log(hash);
	if (hash != req.body.hash) {
		res.status(400).json({ message: "" });
	}
	next();
}

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
	if (await Player.get(username) || emails.indexOf(email) > -1)
		throw "User already exists";
	if (!/^\w+@\w+\..+$/.test(email)) {
		throw "Invalid email";
	}

	emails.push(email);
	let hashedPassword = await bcrypt.hash(password, 10);
	let player = { email, username, highScore: 0, money: 0, upgradeLevel: [0, 0, 0, 0, 0, 0], lastLogin: Date.now(), password: hashedPassword, gamesPlayed: 0, hacks: 0 };
	return Player.save(username, player as any);
}

async function updateLoginTimestamp(username) {
	let player = await Player.get(username);
	if (!player)
		return;
	player.lastLogin = Date.now();
	Player.save(username, player);
}
