# Install

    npm install freediskspace

# Usage

    var freediskspace = require('freediskspace')

    freediskspace.drivelist(function(error, drives){
        console.log(drives);
    };

    freediskspace.detail('/', function(error, details){
        console.log(details);
    };