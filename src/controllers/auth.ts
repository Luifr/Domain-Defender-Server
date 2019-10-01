import * as auth from '../authentication';
import { Request, Response } from 'express';
import crypto from 'crypto';

export async function login(req: Request, res: Response) {

	let hash = crypto.createHash('sha1').update("xausemcomp" + req.body.username, 'utf8').digest('hex');
	console.log(hash);
	console.log(req.body.hash);
	if (hash != req.body.hash) {
		res.status(400).json({ message: "Por favor atualize o jogo!" });
		return;
	}


	if (!req.body.username || !req.body.password) {
		res.status(401).json({ message: "Username and password are required" });
		return;
	}
	try {
		let playerWithToken = await auth.sign(req.body.username, req.body.password);
		res.status(200).json(playerWithToken);
	}
	catch (error) {
		res.status(401).json({ message: error }); // TOFIX send -> json
	}
}

export async function register(req: Request, res: Response) {
	if (!req.body.username || !req.body.password || !req.body.email) {
		res.status(400).json({ message: "Email, Username and password are required" });
		return;
	}
	try {
		await auth.register(req.body.email, req.body.username, req.body.password);
		let playerWithToken = await auth.sign(req.body.username, req.body.password);
		res.status(200).json(playerWithToken);
	}
	catch (error) {
		res.status(401).json({ message: error });
	}
}
