import * as Team from '../model/team';

export async function get(req, res): Promise<void> {
	let team = await Team.get(req.user.team);
	res.json(team);
	return;

}