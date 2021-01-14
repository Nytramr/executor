import { constant, property } from './executers';
import { textParser } from './parser';
import { stringRegEx, numberRegEx } from './regexs';

const squareBracketsRegEx = /^\[['"]?([^\]'"]+)['"]?\]\.?\s*(.*)/; // square brackets path part, first group: part, second group: rest.
const anyOtherPartRegEx = /^([\w][\w-\d_]*)\.?\s*(.*)/; // path part, first group: part name, second group: rest.

const propertyParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNormal },
  { regex: squareBracketsRegEx, parser: parseNormal },
  { regex: anyOtherPartRegEx, parser: parseNormal },
];

const propertyParsersLength = propertyParsers.length;

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
