#!/usr/bin/env node

const Storage = require('./../lib/storage/storage');
const storage = new Storage();
const YouTubeDL = require('youtube-dl');
const ValidUrl = require('valid-url');

const yargs = require('yargs')
    .option('url', {
        alias: 'u',
        describe: 'A url containing a playlist'
    })
    .option('playlist', {
        alias: 'p',
        describe: 'The playlist to import into'
    })
    .demandOption(['url', 'playlist'])
    .check((args, opts) => (ValidUrl.isWebUri(args.url)) ? true : Error("Url not valid."))
    .check((args, opts) => (args.url.indexOf('playlist') != -1) ? true : Error("Url not a playlist"))
    .argv;

storage.db.sync().then(() => {
    storage.Playlist.findByName(yargs.playlist).then((playlist) => {
        YouTubeDL.getInfo(yargs.url, ['--flat-playlist'], (err, results) => {
            results.forEach((result) => {
                storage.Track.create({
                    title: result.title,
                    url: 'http://www.youtube.com/watch?v=' + result.url,
                    playlist_id: playlist.id
                }).then((track) => {
                    console.log(track.title, ' added');
                }).catch((err) => {
                    console.log(err.message);
                });
            });
        });
    }).catch((err) => {
        console.log(err.message);
    });
});
