import {ReferencedValue, ReferencedValueItemsAsObject} from './ReferencedValue';

interface IReferenceManager {
    load(references: ReferencedValueItemsAsObject[]): Promise<ReferencedValue[]>;
    store(references: ReferencedValue[]): Promise<void>;
}

export {IReferenceManager};
