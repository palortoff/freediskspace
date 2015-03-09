var cp = require('child_process');
var os = require('os');
var fd = require('freedisk');

var windowsDetailsPattern = /\s(\d+)\s*(\w:)\s*(\d+)\s/;

function detailWindows(drive, callback) {
  cp.exec("wmic logicaldisk where \"DeviceID='" + drive + "'\" get FreeSpace, Name, Size", function(error, stdout) {
        if (error) {
          callback(error);
          return;
        }
        var match = windowsDetailsPattern.exec(stdout);

        if (match) {
          var detail = {
            drive: match[2],
            total: match[3],
            used:  match[3] - match[1],
            free:  match[1]
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
function drivelistWindows(callback){
  cp.exec("wmic logicaldisk get caption,providername,drivetype,volumename", function(error, stdout){
    if (error){
      callback(error);
      return;
    }
    var drives = stdout.match(windowsDriveListPattern).map(function(x){return x.substr(2,2);});
    callback(undefined, drives);
  })
}

function detailPosix(drive, callback) {
  fd.detail(drive, function(error, total, used, free) {
    var detail = {
      drive: drive,
      total: total,
      used:  used,
      free:  free
    };
    callback(error, detail);
  })
}

function drivelistPosix(callback) {
  fd.drivelist(callback);
}

function detail(drive, callback) {
  if (os.platform() == "win32") {
    detailWindows(drive, callback);
  }
  else {
    detailPosix(drive, callback);
  }
}

function drivelist(callback) {
  if (os.platform() == "win32") {
    drivelistWindows(callback);
  }
  else {
    drivelistPosix(callback);
  }
}

exports.drivelist = drivelist;
exports.detail = detail;