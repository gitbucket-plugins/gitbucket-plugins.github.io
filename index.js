'use strict';

global.__basedir = __dirname;

var yaml = require('node-yaml')
    , fs = require('fs')
    , mkdirp = require('mkdirp')
    , path  = require('path');


// Let's read the plugins.yaml data file and use it to generate our required data
yaml.read ('plugins.yaml', {}, function (err, data) {
    var nbPlugins = data.length;
    console.log('generating ' + nbPlugins + ' plugins definitions');

    generateMainPluginsJSONData(data);

    for (var i = 0; i < nbPlugins; i++) {
        generateIndividualPluginJSONData(data[i])
    }
    console.log('done.');
});


function generateIndividualPluginJSONData(plugin) {
    var pluginPath = path.join(__basedir, 'registry', 'plugin', plugin.id);
    mkdirSync(pluginPath);
    fs.writeFile(path.join(pluginPath, 'versions'), JSON.stringify(plugin.versions, null, 2), {flag:'w'}, function(err) {
        if (err) throw err;
    });
}

function generateMainPluginsJSONData(data) {
    var copy = JSON.parse(JSON.stringify(data));
    for (var plugin in copy) {
        delete plugin.versions;
    }
    var registryPath = path.join(__basedir, 'registry');
    mkdirSync(registryPath);
    fs.writeFile(path.join(registryPath, 'plugins'), JSON.stringify(copy, null, 2), {flag:'w'}, function(err) {
        if (err) throw err;
    });
}

/**
 * Simple wrapper that allows to handle already existing path
 * @param path the path to directory to create
 */
var mkdirSync = function (path) {
    try {
        mkdirp.sync(path);
        // mkdirp(path, function(err) {
        //     if (__debug) console.log('could not create ' + path + ' due to ' + err);
        // });
    } catch(e) {
        if ( e.code != 'EEXIST' ) {
            throw e;
        }
    }
};
