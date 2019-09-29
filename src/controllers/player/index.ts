import * as Player from '../../model/player';
import * as Stats from '../../model/stats'

export async function savePlayer(req, res) {
	let player = req.user as Player.IPlayer;
	let money = parseInt(req.body.money);
	let score = parseInt(req.body.score);
	if (score == undefined && money == undefined) {
		res.status(400).json({ message: "Score or money is required" });
		return;
	}
	if (score && score > player.highScore) {
		player.highScore = score;
	}
	if (money) {
		player.money += money;
	}
	player.gamesPlayed++;
	Stats.increaseGamesPlayed();
	Player.save(player.username, player);
	res.json(player);
	return;
}


export async function getPlayer(req, res) {
	res.json(req.user);
}

export async function buyUpgrade(req, res) {
	try {
		res.json(await Player.buyUpgrade(req.user, req.body.upgrade));
	}
	catch (error) {
		res.status(400).json({ message: error });
	}
}
