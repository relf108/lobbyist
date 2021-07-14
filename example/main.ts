import Lobby from '../lib/src/lobby';

///Host and port ignored for local testing
async function main() {
    var lobby: Lobby = new Lobby('10.200.10.1', 8080, true);
    await lobby.createContainer('ubuntu:latest');
    lobby.startLobby();
}
main()
// console.log(lobby.container.address);