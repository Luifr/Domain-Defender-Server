import * as Upgrade from '../model/upgrade';

export async function get(req, res): Promise<void> {
	let upgrade;
	if (!req.query.upgrade)
		upgrade = { upgrades: await Upgrade.getAll() };
	else
		upgrade = await Upgrade.get(req.query.upgrade);
	res.json(upgrade);
	return;
}