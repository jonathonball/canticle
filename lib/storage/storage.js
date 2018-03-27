const EventEmitter = require('events');
const Sequelize = require('sequelize');
const config = require('./user_config');
const JobManager = require('./neuron');

class Storage extends EventEmitter {

    constructor() {
        super();
        this.config = config;
        this.sequelize = this.db = new Sequelize('sqlite:canticle.sql', {
            operatorsAliases: false,
            logging: (msg) => {
                this.emit('log', msg);
            },
        });
        this.JobManager = JobManager;
        this.schemaDefine();
        this.schemaSync();
    }

    schemaDefine() {
        this.Playlist = this.sequelize.import('./models/playlist');
        this.Track = this.sequelize.import('./models/track');
        
        this.Playlist.hasMany(this.Track, {
            as: 'tracks',
            foreignKey: 'playlist_id'
        });
        
    }
    
    schemaSync() {
        let force = false;
        this.Playlist.sync({ force: force }).then(() => {
            this.Track.sync({ force: force }).then(() => {
                this.emit('ready');
            });
        });        
    }

}

module.exports = Storage;
