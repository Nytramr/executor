import { constant, property } from './executers';
import { constantParser, literalParser } from './constant-parser';
import { textParser, parseNextPart } from './parser';
import { constantRegEx, elseRegEx, endOfFunction, propertyRegEx, literalRegEx } from './regexs';

const squareBracketsRegEx = /^\[\s*(.*)/; // square brackets path part, first group: part, second group: rest.
const anyOtherPartRegEx = /^([\w][\w-\d_]*)\.?\s*(.*)/; // path part, first group: part name, second group: rest.

const parseNormal = (match, accum) => {
  return {
    accum: accum.concat(constant(match[1])),
    text: match[2],
  };
};

const squareBracketsParser = (match, accum) => {
  const result = parseNextPart(match[1], squareBracketsParsers, 4, []);

  return {
    accum: accum.concat(result.accum),
    text: result.text.replace(endOfFunction, ''),
  };
};

export const propertyParser = (match, accum) => {
  const result = textParser(match[1], propertyParsers, 4, []);

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
  { regex: literalRegEx, parser: literalParser },
  { regex: squareBracketsRegEx, parser: squareBracketsParser },
  { regex: propertyRegEx, parser: propertyParser },
  { regex: anyOtherPartRegEx, parser: parseNormal },
];

const squareBracketsParsers = [
  { regex: literalRegEx, parser: literalParser },
  { regex: constantRegEx, parser: constantParser },
  { regex: propertyRegEx, parser: propertyParser },
  { regex: elseRegEx, parser: propertyParser },
];
