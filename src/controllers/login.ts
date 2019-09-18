import { sign } from '../authentication';

export async function login(req, res) {
	try {
		console.log(req.body.email);
		let token = await sign(req.body.email);
		res.status(200).send(token);
	}
	catch (error) {
		res.status(401).send(error);
	}
}
