import {ParameterValue} from "../model/ParameterValue";
import { ReferencedValue, ValueType } from "@pocketix/pocketix-node";

class JiapExpressReferencedValue extends ReferencedValue {
    constructor(deviceUid: string, parameter: ParameterValue) {
        super();
        this.dirty = false;
        this.deviceId = deviceUid;

        this.type = parameter.type.type === "number" ? ValueType.Number : ValueType.String;

        this.value = parameter[parameter.type.type];
        this.parameterName = parameter.type.name;
    }
}

export {JiapExpressReferencedValue};
