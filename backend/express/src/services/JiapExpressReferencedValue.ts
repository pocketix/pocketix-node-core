import {ReferencedValue, ValueType} from "../../../ProgrammingLogimicPrototype";
import {ParameterValue} from "../model/ParameterValue";

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
