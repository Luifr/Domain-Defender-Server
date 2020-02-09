import db from '../dbManager';

let gamesPlayedDoc;
let highScoresDoc;

db.stats.findOneAsync({ name: "gamesPlayed" }).then(data => {
	gamesPlayedDoc = data.value;
	gamesPlayedDoc.total = gamesPlayedDoc.total || 0;
});
db.stats.findOneAsync({ name: "highScores" }).then(data => {
	highScoresDoc = data.value;
});

let date = new Date();

let dateString;

let updateDay = () => {
	date = new Date();
	dateString = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
}

setInterval(updateDay, 1800000);
updateDay();
console.log(dateString);


export function getHighScores() {
	return highScoresDoc;
}

export async function saveHighScores(highScores: any[]) {
	return db.stats.update({ "name": "highScores" }, { $set: { value: highScores } });
}

export async function increaseGamesPlayed() {
	gamesPlayedDoc.total++;
	if (!gamesPlayedDoc[dateString])
		gamesPlayedDoc[dateString] = 0;
	gamesPlayedDoc[dateString]++;
	db.stats.update({ name: "gamesPlayed" }, { $set: { ...gamesPlayedDoc } })
}

