import firebase from '../dbManager';

enum Team {
	A,
	B,
	C,
	D
}

interface IPlayer {
	email: string;
	highScore: number;
	lastLogin?: number;
	money: number;
	team: Team
	upgradeLevel: [number, number, number, number, number, number];
}

let playersRef = firebase.collection('players');

export async function get(email: string): Promise<IPlayer> {
	let playerDoc = await playersRef.doc(email).get();
	if (playerDoc.exists) {
		return playerDoc.data() as IPlayer;
	}
	else {
		return { email, highScore: 0, money: 0, upgradeLevel: [0, 0, 0, 0, 0, 0], team: Math.ceil(Math.random() * 3) };
	}
}

export async function save(email: string, player: Partial<IPlayer>) {
	playersRef.doc(email).set(player, { merge: true });
}
