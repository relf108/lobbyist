var Docker = require('dockerode');
class Lobby {
	public parentHost: any;
	public parentPort: any;
	public endpoints: any;
	public host: any;
	public docker: any;
	public running: any;
	public container: any;

    constructor(parentHost, parentPort, endpoints) {
        this.parentHost = parentHost;
        this.parentPort = parentPort;
        ///List of lobby-endpoints
        this.endpoints = endpoints;
        this.host = parentHost + '/' + Math.floor(Math.random() * 9999);
        this.docker = new Docker({ host: this.host, port: this.parentPort })
        this.running = false;
        this.container = null;

    }
    createContainer() {
        this.container = this.docker.createContainer({
            Image: 'ubuntu',
            AttachStdin: false,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
            ///generate nodejs file with endpoints as set and push to docker container
            Cmd: ['/bin/bash', '-c', 'sudo apt install nodejs npm wget -y', 'wget ' + this.parentHost + '/lobyyist-gen/app.js' ],
            OpenStdin: false,
            StdinOnce: false
        })
    }

    startLobby() {
        try {
            if (this.running === false && this.container != null) {
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