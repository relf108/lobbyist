import { readFile, writeFile } from "fs";
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
        this.parentHost = parentHost;
        this.parentPort = parentPort;
        try {
            if (localTesting === true) {
                this.docker = new Docker({ socketPath: '/var/run/docker.sock' })
            }
            else {
                this.docker = new Docker({ host: this.parentHost, port: this.parentPort })
            }
        }
        catch (e) {
            console.log('Cannot connect to Docker daemon. Ensure it is running and your specified host is valid.')
            throw (e);
        }
        this.host = parentHost + '/' + Math.floor(Math.random() * 9999);
        this.running = false;
        this.container = '';

    }

    ///TODO build default image with editDockerFile() and build container from that image
    async createContainer(imageName: String, nodeJsFile?: File) {
        var path: String;
        this.editDockerfile(path);
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
            Cmd: ['/bin/bash', '-c', 'echo'],
            OpenStdin: false,
            StdinOnce: false
        }).then(async function (container: Container) {
            return await container;
        }));
    }

    editDockerfile(path: String) {
        readFile('Dockerfile', 'utf-8', (err, data) => {
            while (data.includes('$path')) {
                data = data.replace(('$path'), `${path}`);
            }
            writeFile('Dockerfile', data, 'utf-8', function (err) {
                console.log(err);
            });
        })
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