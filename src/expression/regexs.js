export const executerRegExFactory = (commands) => {
  return new RegExp(`^(${commands.join('|')})\\(s*(.*)`);
};
export const endOfFunction = /^[\)\]],?\s*/; // end of function
export const propertyRegEx = /^PP\(\s*(.*)/; //only group: rest
export const constantRegEx = /^CT\(\s*(.*)/; //only group: rest
export const elseRegEx = /^\s*(.*)/; //only group: rest

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
export const literalRegEx = /^(?:"([^"]*)"|'([^']*)'|(-?\d+(?:\.\d+)?)|(false|true))\.?\s*(.*)/;
