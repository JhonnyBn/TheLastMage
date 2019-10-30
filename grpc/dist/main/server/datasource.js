"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveMsg = saveMsg;
exports.loadMsgs = loadMsgs;
exports.deleteDatasource = deleteDatasource;

var _fs = _interopRequireDefault(require("fs"));

var msgs = new Array();

function saveMsg(msg) {
  msgs.push({
    msg: msg
  });

  _fs["default"].writeFile('./database.json', JSON.stringify(msgs), function (err) {
    if (err) {
      console.log('Error writing file', err);
    } else {
      console.log('Successfully wrote file');
    }
  });
}

function loadMsgs(game) {
  return new Promise(function (resolve) {
    _fs["default"].readFile('./database.json', function (err, fileData) {
      if (err) {
        console.log('Error reading file', err);
        resolve(msgs);
        return;
      }

      var msgsLoaded = JSON.parse(fileData);
      console.log(msgsLoaded);
      msgsLoaded.forEach(function (data) {
        game.processInput(data.msg);
        msgs.push(data);
      });
      resolve(msgs);
    });
  });
}

function deleteDatasource() {
  _fs["default"].writeFile('./database.json', "[]", function (err) {
    if (err) {
      console.log('Error writing file', err);
    } else {
      console.log('Successfully wrote file');
    }
  });
}
//# sourceMappingURL=datasource.js.map