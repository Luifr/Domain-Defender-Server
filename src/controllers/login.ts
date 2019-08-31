const { sign } = require('../authentication');

export async function login(req, res) {
	try {
		let token = await sign(req.body.email);
		res.status(200).send(token);
	}
	catch (error) {
		res.status(401).send(error);
	}
}
