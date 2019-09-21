import * as Upgrade from '../model/upgrade';

export async function get(req, res): Promise<void> {
	console.log(req.query.upgrade);
	let team = await Upgrade.get(req.query.upgrade);
	res.json(team);
	return;
}