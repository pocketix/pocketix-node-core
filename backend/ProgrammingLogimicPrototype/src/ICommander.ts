import {Command} from './Command';

interface ICommander {
    sendCommands(dry: boolean, commands: Command[]): Promise<void>;
}

export {ICommander};
