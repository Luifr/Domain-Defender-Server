import db from '../dbManager';
import * as Upgrade from '../model/upgrade';
import bcrypt from 'bcrypt';
import { getHighScores, saveHighScores } from './stats';

export interface IPlayer {
	username: string;
	email: string;
	highScore: number;
	lastLogin: number;
	money: number;
	hacks: number;
	gamesPlayed: number;
	upgradeLevel: [number, number, number, number, number, number];
}

let moneyMultiply = 1;

setInterval(async () => {
	getAll().then(players => {
		let highScores: any[] = [];
		for (let player of players) {
			highScores.push({ username: player.username, score: player.highScore })
		}
		highScores.sort((a, b) => { return b.score - a.score });
		saveHighScores(highScores);
	});
	moneyMultiply = (await db.configs.findOneAsync({ name: "moneyMultiply" })).value;
}, 60000);

export async function get(username: string, password?: string, getAll?: boolean): Promise<IPlayer | undefined> {
	let player: IPlayer = await db.players.findOneAsync({ username });

	let hashedPassword = (player as any).password;
	if (!getAll) {
		delete (player as any).password;
		delete (player as any).hacks;
	}
	if (password) {
		if (await bcrypt.compare(password, hashedPassword)) {
			return player;
		}
		else {
			throw ("Invalid username/password combination");
		}
	}
	else {
		return player;
	}
}

export async function save(username: string, player: Partial<IPlayer>): Promise<any> {
	let highScores = getHighScores();
	let highScorePlayerIndex = highScores.findIndex((val) => val.username == player.username);
	if (player.highScore && highScorePlayerIndex == -1) {
		highScores.push({ score: player.highScore, username: player.username as string });
		highScores.sort((a, b) => { return b.score - a.score });
	}
	else if (player.highScore && highScorePlayerIndex !== -1) {
		highScores[highScorePlayerIndex].score = player.highScore;
		highScores.sort((a, b) => { return b.score - a.score });
	}
	await saveHighScores(highScores);
	return db.players.update({ username }, { $set: { ...player } });
}

export async function getAll(): Promise<IPlayer[]> {
	let players = await db.players.findAllAsync();
	return players;
}

export async function buyUpgrade(player: IPlayer, upgradeIndex: string): Promise<any> {
	if (+upgradeIndex > 5 || +upgradeIndex < 0)
		throw "Invalid index";
	let upgrade = await Upgrade.get(upgradeIndex);
	let upgradeCost = upgrade.cost[player.upgradeLevel[+upgradeIndex]];
	if (player.money >= upgradeCost) {
		player.money -= upgradeCost;
		player.upgradeLevel[+upgradeIndex]++;
		save(player.username, player);
		return player;
	}
	throw "Not enough money";
}

export function getMoneyMultiply(): number {
	return moneyMultiply;
}