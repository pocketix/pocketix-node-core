import {IReferenceManager} from '../src/IReferenceManager';
import {ICommander} from '../src/ICommander';
import { ReferencedValueItemsAsObject, ReferencedValue } from '../src/ReferencedValue';
import { Command } from '../src/Command';
import {MockReferencedValue} from './MockReferencedValue';
import {ValueType} from '../src/ValueType';

class MockCommanderAndReferenceManager implements IReferenceManager, ICommander {
    sendCommandsCalledWithCommands: Command[];
    dry: boolean;
    referencesLoaded: string[] = [];
    referencedValuesStored: string[] = [];

    sendCommands(dry: boolean, commands: Command[]): Promise<void> {
        this.dry = dry;
        this.sendCommandsCalledWithCommands = commands;
        return;
    }
    async load(references: ReferencedValueItemsAsObject[]): Promise<ReferencedValue[]> {
        const referencesToLoadFrom = {
            '5439.lvl_measurement_percent_full': Object.assign(new MockReferencedValue(), {
                _value: 50,
                _type: ValueType.Number,
                _dirty: false,
                _deviceId: 5439,
                _parameterName: 'lvl_measurement_percent_full'
            }),

            '5451.Relay1': Object.assign(new MockReferencedValue(), {
                _value: 'open',
                _type: ValueType.String,
                _dirty: false,
                _deviceId: 5451,
                _parameterName: 'Relay1'
            }),

            '5451.number': Object.assign(new MockReferencedValue(), {
                _value: 10,
                _type: ValueType.Number,
                _dirty: false,
                _deviceId: 5451,
                _parameterName: 'number'
            })
        };

        return references.map(item => {
            const referenceToLoad = referencesToLoadFrom[`${item.deviceId}.${item.parameterName}`];
            this.referencesLoaded.push(referenceToLoad.referenceTarget);
            return referenceToLoad;
        }) as ReferencedValue[];
    }
    store(referencedValues: ReferencedValue[]): Promise<void> {
        this.referencedValuesStored = referencedValues.map(reference => reference.referenceTarget);
        return;
    }

}

export {MockCommanderAndReferenceManager};
