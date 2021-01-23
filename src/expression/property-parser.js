import { constant, property } from './executers';
import { constantParser } from './constant-parser';
import { textParser, parseNextPart } from './parser';
import { constantRegEx, elseRegEx, endOfFunction, stringRegEx, numberRegEx, propertyRegEx } from './regexs';

const squareBracketsRegEx = /^\[\s*(.*)/; // square brackets path part, first group: part, second group: rest.
const anyOtherPartRegEx = /^([\w][\w-\d_]*)\.?\s*(.*)/; // path part, first group: part name, second group: rest.

const parseNormal = (match, accum) => {
  return {
    accum: accum.concat(constant(match[1])),
    text: match[2],
  };
};

const parseString = (match, accum) => {
  return {
    accum: accum.concat(constant(match[1] || match[2])),
    text: match[3],
  };
};

const squareBracketsParser = (match, accum) => {
  const result = parseNextPart(match[1], squareBracketsParsers, 5, []);

  return {
    accum: accum.concat(result.accum),
    text: result.text.replace(endOfFunction, ''),
  };
};

export const propertyParser = (match, accum) => {
  const result = textParser(match[1], propertyParsers, 5, []);

  let i = result.accum.length - 1;
  let path = property(result.accum[i]);

  for (i = i - 1; i >= 0; i--) {
    path = property(result.accum[i], path);
  }

  return {
    accum: accum.concat(path),
    text: result.text,
  };
};

const propertyParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNormal },
  { regex: squareBracketsRegEx, parser: squareBracketsParser },
  { regex: propertyRegEx, parser: propertyParser },
  { regex: anyOtherPartRegEx, parser: parseNormal },
];

const squareBracketsParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNormal },
  { regex: constantRegEx, parser: constantParser },
  { regex: propertyRegEx, parser: propertyParser },
  { regex: elseRegEx, parser: propertyParser },
];
