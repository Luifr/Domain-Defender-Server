import cluster from 'cluster';

console.log('started master with ' + process.pid);

//fork the first process
cluster.fork();

process.on('SIGHUP', function () {
	console.log('Reloading...');
	let new_worker = cluster.fork();
	new_worker.once('listening', function () {
		//stop all other workers
		if (!cluster.workers) return;
		for (var id in cluster.workers) {
			if (id === new_worker.id.toString()) continue;
			(cluster.workers as any)[id].kill('SIGTERM');
		}
	});
});