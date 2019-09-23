import * as auth from '../authentication';
import { Request, Response } from 'express';

export async function login(req: Request, res: Response) {
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
	if (!req.body.username || !req.body.password) {
		res.status(400).json({ message: "Username and password are required" });
		return;
	}
	try {
		await auth.register(req.body.username, req.body.password);
		let playerWithToken = await auth.sign(req.body.username, req.body.password);
		res.status(200).json(playerWithToken);
	}
	catch (error) {
		res.status(401).json({ message: error });
	}
}
