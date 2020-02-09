import * as Player from '../../model/player';
import * as Upgrade from '../../model/upgrade';
import * as Stats from '../../model/stats'

let updateMessage = "Por favor atualize, seu jogo";
let upgrades;
Upgrade.getAll().then(upgradesFromServer => {
	upgrades = upgradesFromServer;
});

export async function savePlayer(req, res) {
	let player = req.user as Player.IPlayer;
	let money = parseInt(req.body.money);
	let score = parseInt(req.body.score);
	let hacks: number = parseInt(req.body.hacks);

	// if (!req.body.levels || !req.body.upgrades) {
	// 	res.status(201).json({ message: updateMessage });
	// 	return;
	// }
	// if (JSON.stringify(req.body.levels.upgradeLevel) != JSON.stringify(player.upgradeLevel)) {
	// 	res.status(201).json({ message: updateMessage })
	// 	return;
	// }
	// for (let index = 0; index < upgrades.length; index++) {
	// 	if (JSON.stringify(req.body.upgrades[index].value) != JSON.stringify(upgrades[index].value)) {
	// 		res.status(201).json({ message: updateMessage })
	// 		return;
	// 	}
	// }

	if (req.body.upgrades) {
		req.body.upgrades
		if (score == undefined && money == undefined) {
			res.status(400).json({ message: "Score or money is required" });
			return;
		}
		if (score && score > player.highScore) {
			player.highScore = score;
		}
		if (money) {
			player.money += money * Player.getMoneyMultiply();
		}
		if (hacks > 0) {
			if (player.hacks == undefined) {
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
		res.status(201).json({ message: error });
	}
}
