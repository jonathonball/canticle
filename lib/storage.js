const fs = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const EventEmitter = require('events');

class Storage extends EventEmitter {
    constructor() {
        super();
        const config = this.config = require('config');
        this.aliasConfigValues();
        switch (config.database.dialect) {
            case "mysql":
                console.log('MySQL not implemented');
                process.exit(1);
                break;
            case "sqlite":
                this.checkDatabaseFs();
                this.setupSqlite();
                break;
            default:
                console.log('Database type not set');
                process.exit(1);
        }
    }

    aliasConfigValues() {
        const storagePath = this.storagePath = this.config.database.storagePath;
        const storageFile = this.storageFile = this.config.database.storageFile;
        const storageFullPath = this.storageFullPath = storagePath + "/" + storageFile;
        const storageDialect = this.storageDialect = this.config.database.dialect;
    }

    setupSqlite() {
        return new Promise((resolve, reject) => {
            const sequelize = this.db = new Sequelize('sqlite:' + this.storageFullPath, {
                operatorsAliases: false,
                logging: false,
            });
            this.defineSchema();
            resolve();
        });
    }

    checkDatabaseFs() {
        if (! fs.existsSync(this.storagePath)) {
            console.log(this.storagePath + " doesn't exist.");
            process.exit(1);
        }
        if (! fs.existsSync(this.storageFullPath)) {
            console.log('Attempting first time database setup.  Restart application.');
            this.setupSqlite().then(() => {
                this.Playlist.sync({ force: true }).then(() => {
                    this.Track.sync({ force: true}).then(() => {
                        console.log('New database setup complete.  Restart');
                        process.exit(0);
                    });
                });

            });
        }
        return true;
    }

    defineSchema() {
        const Playlist = this.Playlist = this.db.define('playlist', {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            }
        });

        const Track = this.Track = this.db.define('track', {
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            youtubeUrl: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            }
        });
    }

    addPlaylist(playlistName) {
        this.Playlist.create({
            name: playlistName
        }).then(() => {
            this.emit('playlist_add', playlistName);
        }).catch((err) => {
            this.emit('playlist_add', {
                failure: true,
                playlistName: playlistName ,
                err: err
            });
        });
    }

    getPlaylists() {
        this.Playlist.findAll().then((playlists) => {
            this.emit('get_playlists', playlists);
        });
    }
}

module.exports = Storage;
