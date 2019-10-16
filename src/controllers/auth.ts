import * as auth from '../authentication';
import { Request, Response } from 'express';
import crypto from 'crypto';

export async function login(req: Request, res: Response) {

	let hash = crypto.createHash('sha1').update("xausemcomp" + req.body.username, 'utf8').digest('hex');
	if (hash != req.body.hash) {
		res.status(201).json({ message: "Por favor atualize o jogo!" });
		return;
	}


	if (!req.body.username || !req.body.password) {
		res.status(201).json({ message: "Username and password are required" });
		return;
	}
	try {
		let playerWithToken = await auth.sign(req.body.username, req.body.password);
		res.status(200).json(playerWithToken);
	}
	catch (error) {
		res.status(201).json({ message: error }); // TOFIX send -> json
	}
}

export async function register(req: Request, res: Response) {
	if (!req.body.username || !req.body.password || !req.body.email || req.body.username == "") {
		res.status(201).json({ message: "Email, Username and password are required" });
		return;
	}
	try {
		let email = req.body.email.trim();
		let username = req.body.username.trim();
		let password = req.body.password.trim();
		await auth.register(email, username, password);
		let playerWithToken = await auth.sign(username, password);
		res.status(200).json(playerWithToken);
	}
	catch (error) {
		res.status(201).json({ message: error });
	}
}
