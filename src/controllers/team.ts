import * as Player from '../model/player';


export async function score(req, res): Promise<void> {
	let team = (await Player.get(req.user.email)).team;

	let players = await Player.getAll(team);

	let score = 0;

	for (let player of players) {
		score += player.highScore;
	}

	res.send(score.toString());
	return;

}