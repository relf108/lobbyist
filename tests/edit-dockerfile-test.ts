import { suite, test } from '@testdeck/mocha';
import * as _chai from 'chai';
import Lobby from '../lib/src/lobby';

@suite class EditDockerFileUnitTest {
    public lobby: Lobby;
    before() {
        this.lobby = new Lobby('', 0, true);
    }

    @test  'call editDockerFile method on lobby'() {
        this.lobby.editDockerfile('test');
    }

}