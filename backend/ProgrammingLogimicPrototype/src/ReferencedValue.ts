import {ValueType} from './ValueType';
import {Reference} from './Operators';

type ReferencedValueItemsAsObject = { parameterName: string; deviceId: number };

abstract class ReferencedValue {
    get parameterName(): string {
        return this._parameterName;
    }

    set parameterName(value: string) {
        this._parameterName = value;
    }

    get deviceId(): any {
        return this._deviceId;
    }

    set deviceId(value: any) {
        this._deviceId = value;
    }

    get dirty(): boolean {
        return this._dirty;
    }

    set dirty(value: boolean) {
        this._dirty = value;
    }

    get type(): ValueType {
        return this._type;
    }

    set type(value: ValueType) {
        this._type = value;
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
    }

    get referenceTarget(): string {
        return ReferencedValue.createReferenceTarget(this.deviceId, this.parameterName);
    }

    private _value: any;
    private _type: ValueType;
    private _dirty: boolean;
    private _deviceId: any;
    private _parameterName: string;

    public static createReferenceTarget(deviceId: number, parameterName: string): string {
        return `${deviceId}.${parameterName}`;
    }

    public static fromReferenceTarget(referenceTarget: string): ReferencedValueItemsAsObject {
        const [deviceIdFromReference, referenceTargetParameter] = referenceTarget.split('.');

        return {
            deviceId: +deviceIdFromReference,
            parameterName: referenceTargetParameter
        };
    }

    public static fromReference(reference: Reference): ReferencedValueItemsAsObject {
        return this.fromReferenceTarget(reference.referenceTarget);
    }
}

export {ReferencedValue, ReferencedValueItemsAsObject};
