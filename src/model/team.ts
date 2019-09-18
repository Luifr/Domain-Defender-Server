import firebase from '../dbManager';

export interface ITeam {
	level: number;
	score: number;
}

let teamsRef = firebase.collection('teams');

export async function get(team: number): Promise<ITeam> {
	if (team < 0 || team > 3)
		throw "Team does not exists";

	let data = await teamsRef.doc(team.toString()).get();
	if (data.exists) {
		return data.data() as ITeam;
	}
	throw "Error fetching team";
}

export async function save(teamNumber: number, team: Partial<ITeam>): Promise<any> {
	teamsRef.doc(teamNumber.toString()).set(team, { merge: true });
}