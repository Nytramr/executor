const propertyRegEx = /^PP\(\s*(.*)/; //only group: rest
const endOfArgsRegEx = /^\),?\s*(.*)/; // detect and remove a closing parenthesis
const stringRegEx = /^(?:"([^"]*)"|'([^']*)'),?\s*(.*)/; // string argument, first group: double quotes string, second group: single quotes string, third group: rest.
const numberRegEx = /^(-?\d+(?:\.\d+)?),?\s*(.*)/; // string argument, first group: number, second group: rest.
const booleanRegEx = /^(false|true),?\s*(.*)/; // string argument, first group: the boolean, second group: rest.
