import db from '../dbManager';

export interface IUpgrade {
	cost: number[];
	value: number[];
}

export async function getAll(): Promise<IUpgrade[]> {
	return db.upgrades.findAllAsync().then((upgrades: any[]) => { return upgrades.sort((a, b) => { return a.index - b.index }) });
}

export async function get(upgrade: string): Promise<IUpgrade> {
	if (+upgrade < 0 || +upgrade > 5)
		throw "Upgrade does not exists";
	return db.upgrades.findOneAsync({ index: +upgrade });
}

export async function save(upgradeIndex: string, upgrade: Partial<IUpgrade>): Promise<any> {
	db.upgrades.update({ index: +upgradeIndex }, { $set: { ...upgrade } })
}