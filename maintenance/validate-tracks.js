#!/usr/bin/env node

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
    storage.Playlist.findByName(yargs.playlist).then((playlist) => {
        console.log('This may take some time.');
        playlist.validateTracks(storage.JobManager);
    }).catch((err) => {
        console.log(err.message);
    });
});
