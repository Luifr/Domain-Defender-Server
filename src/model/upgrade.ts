import firebase from '../dbManager';

export interface IUpgrade {
	Cost: number[];
	value: number[];
}

let upgradeRef = firebase.collection('upgradeCost');

export async function get(upgrade: string): Promise<IUpgrade> {
	if (+upgrade < 0 || +upgrade > 5)
		throw "Upgrade does not exists";

	let data = await upgradeRef.doc(upgrade.toString()).get();
	if (data.exists) {
		return data.data() as IUpgrade;
	}
	throw "Error fetching upgrade";
}

export async function save(upgradeIndex: string, team: Partial<IUpgrade>): Promise<any> {
	upgradeRef.doc(upgradeIndex).set(team, { merge: true });
}