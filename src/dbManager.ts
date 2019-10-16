import Datastore from 'nedb';

class DatastoreAsync<T> extends Datastore<T> {

	constructor(pathOrOptions: any) {
		super(pathOrOptions);
	}

	findOneAsync(object: any): Promise<any> {
		let promise = new Promise<any>((resolve, reject) => {
			this.find(object, (err, data) => {
				if (err) {
					reject("Data not foud");
				}
				resolve(data);
			});
		});
		return promise.then((data: any[]) => { return data[0] });
	};

	findAsync(object: any): Promise<any> {
		let promise = new Promise((resolve, reject) => {
			this.find(object, (err, data) => {
				if (err) {
					reject("Data not foud");
				}
				resolve(data);
			});
		});
		return promise;
	};

	findAllAsync(): Promise<any> {
		let promise = new Promise((resolve, reject) => {
			this.find({}, (err, data) => {
				if (err) {
					reject("Data not foud");
				}
				resolve(data);
			});
		});
		return promise;
	};
}

interface Database {
	players: DatastoreAsync<any>;
	stats: DatastoreAsync<any>;
	configs: DatastoreAsync<any>;
	upgrades: DatastoreAsync<any>;
}

//@ts-ignore
let db: Database = {};


db.players = new DatastoreAsync({ filename: './databases/players', autoload: true });
db.configs = new DatastoreAsync({ filename: './databases/configs', autoload: true });
db.stats = new DatastoreAsync({ filename: './databases/stats', autoload: true });
db.upgrades = new DatastoreAsync({ filename: './databases/upgrades', autoload: true });


export default db;
