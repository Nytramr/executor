export const functionRegEx = /^(\w[\w\d]*)\s*\(\s*([^]*)/i;
export const functionPartsSeparator = /^\s*(,)\s*([^]*)/;
export const propertyRegEx = /^PP\(\s*([^]*)/; //only group: rest
export const constantRegEx = /^CT\(\s*([^]*)/; //only group: rest
export const elseRegEx = /^\s*([^]*)/; //only group: rest
export const identifierRegEx = /^(\w[\w\d\-]*)([^]*)/i;
export const squareBracketsRegEx = /^\[\s*([^]*)/; // square brackets path part, first group: part, second group: rest.
export const endOfPropertyRegEx = /^[\)\],\s]/; // possible end of properties
export const propertySeparatorRegEx = /^(\.(?!\[))([^]*)/;
export const endOfFunctionRegEx = /^\)/;
export const integerRegEx = /^(\d+)([^]*)/;

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
export const literalRegEx = /^(?:"([^"]*)"|'([^']*)'|(-?\d+(?:\.\d+)?)|(false|true))\s*([^]*)/;
