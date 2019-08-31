import firestore from "../../dbManager";

let playerRef = firestore.collection('players');

export async function saveHighScore(req, res) {
	let email = req.body.email;
	let score = req.body.score;

	let playerDoc = playerRef.doc(email);
	let doc = await playerDoc.get();
	if (doc.exists) {
		let playerData = doc.data() as FirebaseFirestore.DocumentData;
		if (!playerData.highScore || score > playerData.highScore) {
			playerDoc.set({ highScore: score }, { merge: true });
			res.send("Score saved");
			return;
		}
		res.send("Not a highscore");
		return;
	}
	playerDoc.set({ email, highScore: score }, { merge: true });
	res.send("New player");
}

export async function getHighScore(req, res) {
	let email = req.query.email;

	let playerDoc = playerRef.doc(email);
	let doc = await playerDoc.get();
	if (doc.exists) {
		let playerData = doc.data() as FirebaseFirestore.DocumentData;
		if (playerData.highScore) {
			res.send("Player highscore is " + playerData.highScore);
		}
		else {
			res.send("Player doesn't have a highscore");
		}
		return;
	}
	res.send("Player not found");
}