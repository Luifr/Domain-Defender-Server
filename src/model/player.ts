import firebase from '../dbManager';
import * as Upgrade from '../model/upgrade';
import bcrypt from 'bcrypt';

export interface IPlayer {
	username: string;
	highScore: number;
	lastLogin: number;
	money: number;
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
		//return { username, highScore: 0, money: 0, upgradeLevel: [0, 0, 0, 0, 0, 0]}; // TOFIX TOCHANGE nao gerar time aleatorio
		return undefined;
	}
}

export async function save(username: string, player: Partial<IPlayer>): Promise<any> {
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
	throw "Cant buy upgrade";
}