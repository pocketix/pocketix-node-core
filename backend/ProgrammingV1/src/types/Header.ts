import {UserVariable} from "./Variables";

type Header = {
    userVariables: {
        [id: string]: UserVariable;
    };
};

export {Header};
