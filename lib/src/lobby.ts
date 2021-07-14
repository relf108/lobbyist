import { exists } from "fs";
import { Domain } from "node:domain";
import { Container } from "dockerode";
import { Docker } from "dockerode";

var Docker = require('dockerode');
class Lobby {
    public parentHost: String;
    public parentPort: number;
    public host: String;
    public running: boolean;
    public docker: any;
    public container: Container;

    constructor(parentHost: String, parentPort: number, localTesting?: Boolean) {
        if (localTesting === true) {
            this.docker = new Docker({ socketPath: '/var/run/docker.sock' })
        }
        else {
            this.docker = new Docker({ host: this.parentHost, port: this.parentPort })
        }
        this.parentHost = parentHost;
        this.parentPort = parentPort;
        this.host = parentHost + '/' + Math.floor(Math.random() * 9999);

        this.running = false;
        this.container = '';

    }
    async createContainer(imageName: String, nodeJsFile?: File) {
        var path: String;
        if (nodeJsFile === undefined) {
            path = `${this.parentHost}/lobyyist-gen/app.js`;
        }
        else {
            path = nodeJsFile.name
        }
        this.container = await (this.docker.createContainer({
            Image: imageName,
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            ///Find way to run commands (init.sh) up container creation/start
            Cmd: ['/bin/bash/', '-c', `./init.sh`],
            OpenStdin: false,
            StdinOnce: false
        }).then(async function (container: Container) {
            return await container;
        }));
    }

    startLobby() {
        console.log(this.container);

        try {
            if (this.running === false && this.container != '') {
                //TODO attempt at running all comands when lobby is built
                this.container.start();
                this.running = true;
            }
            else {
                console.log("Container with address " + this.host + " is already running or has not been created.")
            }
        }
        catch (e) {
            console.log("failed to start lobby:\n" + e);
        }


    }

    stopLobby() {
        if (this.running === true) {
            try {
                if (this.running === true && this.container != null) {
                    this.container.stop()
                    this.running = false;
                }
                else {
                    console.log("Container with address " + this.host + " is already stopped or has not been created.")
                }
            }
            catch (e) {
                console.log("failed to stop lobby:\n" + e);
            }
        }
    }
}
export default Lobby;