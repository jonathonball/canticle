const EventEmitter = require('events');
const Sequelize = require('sequelize');
const config = require('./user_config');
const JobManager = require('./neuron');
const path = require('path');
const fs = require('fs');
const os = require('os');

class Storage extends EventEmitter {

    constructor(args = null) {
        super();
        this.config = (args) ? Object.assign(config, args) : config;
        this.sequelize = this.db = new Sequelize(this.getDatabaseFileName(), {
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

    getDatabaseFileName() {
      let prefix = 'sqlite:';
      let userPath = this.config.databaseFilename;
      if (userPath === null) {
          userPath = os.homedir() + '/.config/canticle/database.sql';
      }
      let data = path.parse(userPath);
      if (fs.existsSync(data.dir)) {
          return prefix + userPath;
      }
      console.error('Directory ' + data.dir + ' does not exist, cannot create "databaseFilename" from config');
      process.exit(1);
    };

}

module.exports = Storage;
