import {IEvaluable} from './IEvaluable';
import {IRepresentable} from './IRepresentable';
import {Commandable, CommandFactory} from './CommandFactory';

class Block implements IEvaluable, IRepresentable {
    private commands: Commandable[];
    private commandFactory = new CommandFactory();

    constructor(rawBlock: any) {
        const raw = Array.from(rawBlock) as any[];

        if (!raw.length) {
            throw new Error('Empty block');
        }

        this.commands = raw.map(item => this.commandFactory.create(item));
    }

    represent(): any {
        return this.commands.map(command => command.represent());
    }

    evaluate(): any {
        return this.commands.map(command => command?.evaluate()).filter(item => item !== undefined);
    }
}

export {Block};
