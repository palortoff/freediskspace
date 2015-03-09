# Install

    npm install freediskspace

# Usage (callbacks)

    var freediskspace = require('freediskspace')

    freediskspace.driveList(function(error, drives){
        console.log(drives);
        // ['/', '/tmp', '/home']
        // or
        // ['C:', 'D:', 'Z:']
    };

    freediskspace.detail('/', function(error, details){
        console.log(details);
        // { drive: '/',
        //   total: 2199023255552,
        //   used: 2199023255552,
        //   free: 155692564480 }
    };

# Usage (promises)


    var freediskspace = require('freediskspace');

    freediskspace.driveList()
        .then(function(drives) {
          console.log(drives);
            // ['/', '/tmp', '/home']
            // or
            // ['C:', 'D:', 'Z:']
        })
        .catch(function(error) {
          console.log(error);
        });

    freediskspace.detail('/')
        .then(function(detail) {
          console.log(detail);
            // { drive: '/',
            //   total: 2199023255552,
            //   used: 2199023255552,
            //   free: 155692564480 }
        })
        .catch(function(error) {
          console.log(error);
        });
