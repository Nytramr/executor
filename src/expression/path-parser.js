import { property } from './executers';

const stringRegEx = /^(?:"([^"]*)"|'([^']*)')\.?\s*(.*)/; // string path part, first group: double quotes part, second group: single quotes part, third group: rest.
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

function parseNormal(match) {
  return {
    part: match[1],
    text: match[2],
  };
}

function parseString(match) {
  return {
    part: match[1] || match[2],
    text: match[3],
  };
}

function parseNextPart(text) {
  for (let i = 0; i < pathParsersLength; i++) {
    const match = pathParsers[i].regex.exec(text);
    if (match) {
      return pathParsers[i].parser(match);
    }
  }

  throw new Error(`Token unrecognized near to ${text}`);
}

export function splitPath(text) {
  const result = {
    text,
    parts: [],
  };
  while (!result.text.startsWith(')')) {
    const next = parseNextPart(result.text);
    result.parts.push(next.part);
    result.text = next.text;
  }

  return result;
}

export function pathParser(match, accum) {
  const { text, parts } = splitPath(match[1]);

  let len = parts.length - 1;
  let path = property(parts[len]);

  for (len--; len >= 0; len--) {
    path = property(parts[len], path);
  }

  return {
    executers: accum.concat(path),
    text,
  };
}
