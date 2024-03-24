type Variables = {
    [id: string]: Variable
};

type Variable = {
    type: VariableType;
    label: string;
}

type VariableType = "str" | "num" | "bool" | "bool_expr" | "num_expr";

type UserVariable = {
    type: VariableType;
    value: any;
};


export {VariableType, Variable, Variables, UserVariable};
