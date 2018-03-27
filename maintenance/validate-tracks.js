const Storage = require('./../lib/storage/storage');
const storage = new Storage();

const yargs = require('yargs')
    .option('playlist', {
        alias: 'p',
        describe: 'A playlist name'
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        describe: 'Also include tracks that pass validation'
    })
    .option('prune', {
        type: 'boolean',
        describe: 'Remove tracks that fail validation'
    })
    .demandOption(['playlist'])
    .argv;

storage.JobManager.on('finish', function(job, worker) {
    if (worker.result.pass) {
        if (yargs.verbose) {
            console.log('[pass] ' + worker.result.track.title);
        }
    } else {
        console.log('[fail] ' + worker.result.track.title + ' has no streams');
        if (yargs.prune) {
            let title = worker.result.track.title;
            worker.result.track.destroy().then(() => {
                console.log('[info] ' + title + ' deleted');
                return null;
            });
        }
    }
});

storage.db.sync().then(() => {
    storage.Playlist.findByName(yargs.playlist).then((playlists) => {
        if (playlists.count > 1) {
            console.log('Playlist name is ambiguous.  Did you mean?');
            console.log(playlists.rows.map(({name}) => name));
            process.exit(1);
        }
        if (playlists.count < 1) {
            console.log('Playlist not found.');
            process.exit(1);
        }
        console.log('This may take some time.');
        playlists.rows[0].validateTracks(storage.JobManager);
    });
});
