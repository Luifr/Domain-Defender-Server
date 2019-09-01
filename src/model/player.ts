import firebase from '../dbManager';

enum Team {
	A,
	B,
	C,
	D
}

export interface IPlayer {
	email: string;
	highScore: number;
	lastLogin?: number;
	money: number;
	team: Team
	upgradeLevel: [number, number, number, number, number, number];
}

let playersRef = firebase.collection('players');
let upgradesRef = firebase.collection('upgradeCost');

export async function get(email: string): Promise<IPlayer> {
	let playerDoc = await playersRef.doc(email).get();
	if (playerDoc.exists) {
		return playerDoc.data() as IPlayer;
	}
	else {
		return { email, highScore: 0, money: 0, upgradeLevel: [0, 0, 0, 0, 0, 0], team: Math.ceil(Math.random() * 3) };
	}
}

export async function save(email: string, player: Partial<IPlayer>): Promise<any> {
	playersRef.doc(email).set(player, { merge: true });
}

export async function getAll(team: Team): Promise<IPlayer[]> {
	let playerDocs = await playersRef.get();
	let players: IPlayer[] = [];
	for (let doc of playerDocs.docs) {
		let player = doc.data() as IPlayer;
		if (player.team == team)
			players.push(player);
	}
	return players;
}

export async function buyUpgrade(email: string, upgradeIndex: number): Promise<any> {
	if (upgradeIndex > 6 || upgradeIndex < 0)
		throw "Invalid index";
	let player = await get(email);
	let upgrade = await upgradesRef.doc(upgradeIndex.toString()).get();
	let upgradeCost = upgrade[player.upgradeLevel[upgradeIndex]];
	if (player.money >= upgradeCost) {
		player.money -= upgradeCost;
		player.upgradeLevel[upgradeIndex]++;
		save(email, player);
		return player;
	}
	throw "Cant buy upgrade";
}