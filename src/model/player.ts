import firebase from '../dbManager';
import * as Upgrade from '../model/upgrade';
import bcrypt from 'bcrypt';
import { getHighScores, saveHighScores } from './stats';

export interface IPlayer {
	username: string;
	email: string;
	highScore: number;
	lastLogin: number;
	money: number;
	gamesPlayed: number;
	upgradeLevel: [number, number, number, number, number, number];
}

let playersRef = firebase.collection('players');

export async function get(username: string, password?: string): Promise<IPlayer | undefined> {
	let playerDoc = await playersRef.doc(username).get();
	if (playerDoc.exists) {
		let player: IPlayer = playerDoc.data() as IPlayer;
		let hashedPassword = (player as any).password;
		delete (player as any).password;
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
	else {
		return undefined;
	}
}

export async function save(username: string, player: Partial<IPlayer>): Promise<any> {
	let highScores = getHighScores();
	let highScorePlayerIndex = highScores.findIndex((val) => val.username == player.username);
	if (player.highScore && highScorePlayerIndex == -1) {
		highScores.push({ score: player.highScore, username: player.username as string });
		highScores.sort((a, b) => { return b.score - a.score });
		highScores = highScores.slice(0, 20);
	}
	else if (player.highScore && highScorePlayerIndex !== -1) {
		highScores[highScorePlayerIndex].score = player.highScore;
		highScores.sort((a, b) => { return b.score - a.score });
	}
	await saveHighScores(highScores);
	return playersRef.doc(username).set(player, { merge: true });
}

export async function getAll(): Promise<IPlayer[]> {
	let playerDocs = await playersRef.get();
	let players: IPlayer[] = [];
	for (let doc of playerDocs.docs) {
		let player = doc.data() as IPlayer;
		players.push(player);
	}
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