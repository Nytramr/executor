export const functionRegEx = /^(\w[\w\d]*)\s*\(\s*(.*)/i;
export const endOfFunction = /^[\]\)]\s*/;
export const functionPartsSeparator = /^,\s*/;
export const propertyRegEx = /^PP\(\s*(.*)/; //only group: rest
export const constantRegEx = /^CT\(\s*(.*)/; //only group: rest
export const elseRegEx = /^\s*(.*)/; //only group: rest

export const identifierRegEx = /^(\w[\w\d\-]*)(.*)/i;

/*
 * Literal regex
 *
 * group1: double quotes
 * group2: single quotes
 * group3: numbers
 * group4: boolean
 *
 * group5: rest
 *
 */
export const literalRegEx = /^(?:"([^"]*)"|'([^']*)'|(-?\d+(?:\.\d+)?)|(false|true))\s*(.*)/;
