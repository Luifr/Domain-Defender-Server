import express from 'express';
const router = express.Router();

import auth from './auth';
import player from './player';
import * as upgradeController from '../controllers/upgrade';
import { getHighScores } from '../model/stats'


router.use('/', auth);
router.use('/player', player);
router.get('/upgrade', upgradeController.get);
router.get('/highScores', (_, res) => {
	return res.json({ highScores: getHighScores() });
});
router.get('/scores', (_, res) => {
	// return res.send();
	let id = 1;
	let hs = getHighScores().map(scores => {
		return `
			<tr>
				<th scope="row">${id++}</th>
				<td>${scores.username}</td>
				<td>${scores.score}</td>
			</tr>`;
	}).join('\n');
	console.log(hs);
	let html = `
	<table class="table">
		<thead>
			<tr>
				<th scope="col">#</th>
				<th scope="col">Nome</th>
				<th scope="col">Highscore</th>
			</tr>
		</thead>
		<tbody>
	` + hs +
		`</tbody>
	</table>`;
	return res.send(html);
});

export default router;