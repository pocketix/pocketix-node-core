import {Command} from './Command';
import {If, IfBranch} from './If';
import {While} from './While';
import {Write} from './Write';
import {Fork} from './Fork';

type Commandable = (If | IfBranch | Fork | While | Command | Write);
class CommandFactory {
    create(json: object | Array<any>): Commandable {
        if (Array.isArray(json)) {
            return new If(json);
        }

        if (json.hasOwnProperty('name') && (json as any).name === Fork.NAME) {
            return new Fork(json);
        }

        if (json.hasOwnProperty('name') && (json as any).name === 'if') {
            return new IfBranch(json);
        }

       /* if (json.hasOwnProperty('condition') && json.hasOwnProperty('block')) {
            return new While(json);
        }*/

        if (json.hasOwnProperty('name') && json.hasOwnProperty('params')) {
            return new Command(json);
        }

        if (json.hasOwnProperty('reference') && json.hasOwnProperty('value')) {
            return new Write(json);
        }

        throw new Error('No fitting commendable');
    }
}

export {
    CommandFactory,
    Commandable
};
