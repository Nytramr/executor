export const numberRegEx = /^(-?\d+(?:\.\d+)?)\.?\s*(.*)/;
export const stringRegEx = /^(?:"([^"]*)"|'([^']*)')\.?\s*(.*)/; // string, first group: double quotes part, second group: single quotes part, third group: rest.
export const endOfFunction = /^[\)\]],?\s*/; // end of function
export const propertyRegEx = /^PP\(\s*(.*)/; //only group: rest
export const constantRegEx = /^CT\(\s*(.*)/; //only group: rest
export const elseRegEx = /^\s*(.*)/; //only group: rest
