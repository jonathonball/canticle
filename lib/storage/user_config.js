const FS_FAILURE_LIMIT = 1;
const fs = require('fs');
const path = require('path');
const Config = require('config');
var config = Object.assign({}, Config);
const userHomePath = require('os').homedir();
const userConfigFile = 'config.json';
const userConfigPath = path.join(userHomePath, '.config', 'canticle');
const filterJson = file => path.extname(file) === '.json';

const getUserConfigs = function(failures = 0) {
    if (failures > FS_FAILURE_LIMIT) {
        console.log('Killing runaway process');
        process.exit(1);
    }
    let userConfigs = [];
    try {
        userConfigs = userConfigs.concat(fs.readdirSync(userConfigPath));
    } catch (readdirError) {
        failures++;
        if (readdirError.code === 'ENOENT') {
            try {
                fs.mkdirSync(userConfigPath);
                return getUserConfigs(failures);
            } catch (mkdirError) {
                console.log('Failed trying to create ', userConfigPath);
                console.log(mkdirError);
                process.exit(1);
            }
        }
    }
    return userConfigs.filter(filterJson);
};

getUserConfigs().forEach((file) => {
    let fullPath = path.join(userConfigPath, file);
    let raw = fs.readFileSync(fullPath);
    let json = JSON.parse(raw);
    config = Object.assign(config, json);
});

module.exports = config;
