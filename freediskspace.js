'use strict';

var cp = require('child_process');
var os = require('os');
var fd = require('freedisk');
var Q = require('q');

exports.drivelist = driveList; // for backward compatibility
exports.driveList = driveList;
exports.detail = detail;

function detail(drive, callback) {
  if (arguments.length === 1) {
    return detailPromise(drive)
  } else {
    detailCallback(drive, callback)
  }
}

function detailPromise(drive) {
  var deferred = Q.defer();

  detailCallback(drive, function (error, details) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(details);
    }
  });

  return deferred.promise;
}

function detailCallback(drive, callback) {
  if (os.platform() == "win32") {
    detailWindows(drive, callback);
  }
  else {
    detailPosix(drive, callback);
  }
}

var windowsDetailsPattern = /\s(\d+)\s*(\w:)\s*(\d+)\s/;

function detailWindows(drive, callback) {
  cp.exec("wmic logicaldisk where \"DeviceID='" + drive + "'\" get FreeSpace, Name, Size", function (error, stdout) {
      if (error) {
        callback(error);
        return;
      }
      var match = windowsDetailsPattern.exec(stdout);

      if (match) {
        var detail = {
          drive: match[2],
          total: match[3],
          used: match[3] - match[1],
          free: match[1]
        };
        callback(error, detail);
      }
      else {
        callback(new Error('Parsing error: ' + stdout));
      }
    }
  )
}
var windowsDriveListPattern = /\r\n(\w:)/g;

function detailPosix(drive, callback) {
  fd.detail(drive, function (error, total, used, free) {
    var detail = {
      drive: drive,
      total: total,
      used: used,
      free: free
    };
    callback(error, detail);
  })
}

function driveList(callback) {
  if (arguments.length === 0){
    return driveListPromise();
  }
  else{
    driveListCallback(callback);
  }
}

function driveListPromise(){
  var deferred = Q.defer();

  driveListCallback(function (error, drivelist) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(drivelist);
    }
  });

  return deferred.promise;
}

function driveListCallback(callback){
  if (os.platform() == "win32") {
    driveListWindows(callback);
  }
  else {
    driveListPosix(callback);
  }
}

function driveListWindows(callback) {
  cp.exec("wmic logicaldisk get caption,providername,drivetype,volumename", function (error, stdout) {
    if (error) {
      callback(error);
      return;
    }
    var drives = stdout.match(windowsDriveListPattern).map(function (x) {
      return x.substr(2, 2);
    });
    callback(undefined, drives);
  })
}

function driveListPosix(callback) {
  fd.drivelist(callback);
}


