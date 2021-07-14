"use strict";
exports.__esModule = true;
var lobby_1 = require("../lib/src/lobby");
var lobby = new lobby_1["default"]('10.200.10.1', 8080);
lobby.createContainer();
// lobby.startLobby();
// console.log(lobby.container.address);
