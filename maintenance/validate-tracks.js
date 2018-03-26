const Storage = require('./../lib/storage/storage');
const storage = new Storage();
const JobManager = require('./../lib/neuron.js');

const yargs = require('yargs')
    .option('playlist', {
        alias: 'p',
        describe: 'A playlist name'
    })
    .demandOption(['playlist'])
    .argv;

JobManager.on('finish', function(job, worker) {
    if (! worker.result.pass) {
        console.log(worker.result.track.title + ' has no streams');
    }
});

storage.db.sync().then(() => {
    storage.Playlist.scope({
        method: ['findByName', yargs.playlist]
    }).findAndCountAll().then((playlists) => {
        if (playlists.count > 1) {
            console.log('Playlist name is ambiguous.  Did you mean?');
            console.log(playlists.rows.map(({name}) => name));
            process.exit(1);
        }
        if (playlists.count < 1) {
            console.log('Playlist not found.');
            process.exit(1);
        }
        playlists.rows[0].getTracks().then((tracks) => {
            console.log('Checking ' + tracks.length + ' tracks this may take some time.');
            tracks.forEach((track) => {
                JobManager.enqueue('validateUrl', track);
            });
        });
    });
});
