import { property } from './executers';
import { textParser } from './parser';
import { stringRegEx } from './regexs';

const squareBracketsRegEx = /^\[['"]?([^\]'"]+)['"]?\]\.?\s*(.*)/; // square brackets path part, first group: part, second group: rest.
const numberRegEx = /^(\d+)\.?\s*(.*)/; // number path part, first group: number index, second group: rest.
const anyOtherPartRegEx = /^([\w][\w-\d_]*)\.?\s*(.*)/; // path part, first group: part name, second group: rest.

const pathParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNormal },
  { regex: squareBracketsRegEx, parser: parseNormal },
  { regex: anyOtherPartRegEx, parser: parseNormal },
];

const pathParsersLength = pathParsers.length;

function parseNormal(match, accum) {
  return {
    accum: accum.concat(match[1]),
    text: match[2],
  };
}

function parseString(match, accum) {
  return {
    accum: accum.concat(match[1] || match[2]),
    text: match[3],
  };
}

export function pathParser(match, accum) {
  const { text, accum: parts } = textParser(match[1], pathParsers, pathParsersLength, []);

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
