import * as Player from '../../model/player';
import * as Stats from '../../model/stats'

export async function savePlayer(req, res) {
	let player = req.user as Player.IPlayer;
	let money = parseInt(req.body.money);
	let score = parseInt(req.body.score);
	let hacks: number = parseInt(req.body.hacks);
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
	if (hacks > 0) {
		if(player.hacks == undefined){
			player.hacks = 0;
		}
		player.hacks += hacks;
	}
	player.gamesPlayed++;
	Stats.increaseGamesPlayed();
	Player.save(player.username, player);
	let p = { ...player };
	delete p.hacks;
	res.json(p);
	return;
}


export async function getPlayer(req, res) {
	let p = { ...req.user };
	delete p.hacks;
	res.json(p);
}

export async function buyUpgrade(req, res) {
	try {
		res.json(await Player.buyUpgrade(req.user, req.body.upgrade));
	}
	catch (error) {
		res.status(400).json({ message: error });
	}
}
