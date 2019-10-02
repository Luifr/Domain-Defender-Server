import firebase from '../dbManager';

let statsRef = firebase.collection('stats');

let gamesPlayedDoc = statsRef.doc('gamesPlayed');
let highScoresDoc = statsRef.doc('highScores');

let date = new Date();

let dateString;

let updateDay = () => {
	dateString = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;
}

setInterval(updateDay, 1800000);
updateDay();
console.log(dateString);

let gamesPlayed;
gamesPlayedDoc.get().then(doc => {
	let data = doc.data() as any;
	gamesPlayed = data as any[];
	if (!gamesPlayed) {
		gamesPlayed = { total: 0 }
	}
});


let highScores: { score: number, username: string }[];
highScoresDoc.get().then(doc => {
	let data = doc.data() as any;
	highScores = data.scores as any[];
});

export function getHighScores() {
	return highScores;
}

export async function saveHighScores(highScores: any[]) {
	return highScoresDoc.set({ scores: highScores }, { merge: false });
}

export async function increaseGamesPlayed() {
	gamesPlayed.total++;
	if (!gamesPlayed[dateString])
		gamesPlayed[dateString] = 0;
	gamesPlayed[dateString]++;
	gamesPlayedDoc.set(gamesPlayed);
}
