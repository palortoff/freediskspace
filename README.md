# Install

    npm install freediskspace

# Usage

    var freediskspace = require('freediskspace')

    freediskspace.driveList(function(error, drives){
        console.log(drives);
    };

    freediskspace.detail('/', function(error, details){
        console.log(details);
    };