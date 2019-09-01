import * as Player from '../../model/player';

export async function saveHighScore(req, res) {
	let email = req.body.email;
	let money = parseInt(req.body.money);
	let score = parseInt(req.body.score);
	if (!score && !money) {
		res.send("Score or money is required");
		return;
	}
	let player = await Player.get(email);
	if (score && score > player.highScore) {
		player.highScore = score;
	}
	if (money) {
		player.money += money;
	}
	Player.save(email, player);
	res.send("Player updated");
	return;
}


export async function getHighScore(req, res) {
	let email = req.user.email;
	let player = await Player.get(email);
	res.send("Player highscore is " + player.highScore);
}