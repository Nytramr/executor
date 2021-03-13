import { property } from './executers';
import { constantParser, literalParser } from './constant-parser';
import { parseNormal, removeMatch, textParser, parseNextPart } from './parser';
import { constantRegEx, elseRegEx, endOfFunction, identifierRegEx, propertyRegEx, literalRegEx } from './regexs';

const squareBracketsRegEx = /^\[\s*(.*)/; // square brackets path part, first group: part, second group: rest.
const anyOtherPartRegEx = /^([\w][\w-\d_]*)(.*)/; // path part, first group: part name, second group: rest.

const endOfPropertyRegEx = /^[\)\], ]/; // possible end of properties
const propertySeparatorRegEx = /^(\.(?!\[))(.*)/;

const squareBracketsParser = (match, accum) => {
  const result = parseNextPart(match[1], squareBracketsParsers, 4, []);
  return {
    accum: accum.concat(result.accum),
    text: result.text.replace(endOfFunction, ''),
  };
};

export const propertyFunctionParser = (match, accum) => {
  const result = propertyParser(match, accum);
  return {
    accum: result.accum,
    text: result.text.replace(endOfFunction, ''),
  };
};

export const propertyParser = (match, accum) => {
  const result = textParser(match[1], propertyParsers, 5, endOfPropertyRegEx, []);
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
  { regex: propertyRegEx, parser: propertyFunctionParser },
  { regex: identifierRegEx, parser: parseNormal },
  { regex: propertySeparatorRegEx, parser: removeMatch },
  { regex: squareBracketsRegEx, parser: squareBracketsParser },
];

const squareBracketsParsers = [
  { regex: literalRegEx, parser: literalParser },
  { regex: constantRegEx, parser: constantParser },
  { regex: propertyRegEx, parser: propertyFunctionParser },
  { regex: elseRegEx, parser: propertyParser },
];
