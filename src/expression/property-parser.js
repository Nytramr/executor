import { constant, property } from './executers';
import { constantParser } from './constant-parser';
import { textParser, parseNextPart } from './parser';
import { constantRegEx, elseRegEx, endOfFunction, stringRegEx, numberRegEx, propertyRegEx } from './regexs';

const squareBracketsRegEx = /^\[\s*(.*)/; // square brackets path part, first group: part, second group: rest.
const anyOtherPartRegEx = /^([\w][\w-\d_]*)\.?\s*(.*)/; // path part, first group: part name, second group: rest.

const propertyParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNormal },
  { regex: squareBracketsRegEx, parser: squareBracketsParser },
  { regex: anyOtherPartRegEx, parser: parseNormal },
];

const propertyParsersLength = propertyParsers.length;

const squareBracketsParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNormal },
  { regex: constantRegEx, parser: constantParser },
  { regex: propertyRegEx, parser: propertyParser },
  { regex: elseRegEx, parser: propertyParser },
];

const squareBracketsParsersLength = squareBracketsParsers.length;

function parseNormal(match, accum) {
  return {
    accum: accum.concat(constant(match[1])),
    text: match[2],
  };
}

function parseString(match, accum) {
  return {
    accum: accum.concat(constant(match[1] || match[2])),
    text: match[3],
  };
}

function squareBracketsParser(match, accum) {
  const { text, accum: value } = parseNextPart(match[1], squareBracketsParsers, squareBracketsParsersLength, []);

  return {
    accum: accum.concat(value),
    text: text.replace(endOfFunction, ''),
  };
}

export function propertyParser(match, accum) {
  const { text, accum: parts } = textParser(match[1], propertyParsers, propertyParsersLength, []);

  let len = parts.length;
  let path = property(parts[0]);

  for (let i = 1; i < len; i++) {
    path = property(parts[i], path);
  }

  return {
    accum: accum.concat(path),
    text,
  };
}
