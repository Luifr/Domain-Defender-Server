import * as Player from '../../model/player';
import * as Team from '../../model/team';

export async function savePlayer(req, res) {
	let email = req.user.email;
	let money = parseInt(req.body.money);
	let score = parseInt(req.body.score);
	if (!score && !money) {
		res.status(400).send("Score or money is required");
		return;
	}
	let player = await Player.get(email);
	if (score && score > player.highScore) {
		let increase = score - player.highScore;
		let team = await Team.get(player.team)
		Team.save(player.team, { score: team.score + increase });
		player.highScore = score;
	}
	if (money) {
		player.money += money;
	}
	Player.save(email, player);
	res.json(player);
	return;
}


export async function getPlayer(req, res) {
	let email = req.user.email;
	let player = await Player.get(email);
	res.json(player);
}

export async function buyUpgrade(req, res) {
	try {
		res.json(Player.buyUpgrade(req.user.email, req.body.upgrade));
	}
	catch (error) {
		res.status(400).send(error);
	}
}
