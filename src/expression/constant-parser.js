import { constant } from './executers';
import { stringRegEx } from './regexs';

const numberRegEx = /^(-?\d+(?:\.\d+)?),?\s*(.*)/; // number constant, first group: number, second group: rest.
const booleanRegEx = /^(false|true),?\s*(.*)/; // string argument, first group: the boolean, second group: rest.

const pathParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNumber },
  { regex: booleanRegEx, parser: parseBoolean },
];

const pathParsersLength = pathParsers.length;

function parseNumber(match) {
  return {
    c: +match[1], // convert into number
    text: match[2],
  };
}

function parseBoolean(match) {
  return {
    c: match[1] === 'true',
    text: match[2],
  };
}

function parseString(match) {
  return {
    c: match[1] || match[2] || '',
    text: match[3],
  };
}

function parseConstant(text) {
  for (let i = 0; i < pathParsersLength; i++) {
    const match = pathParsers[i].regex.exec(text);
    if (match) {
      return pathParsers[i].parser(match);
    }
  }

  throw new Error(`Token unrecognized near to ${text}`);
}

export function constantParser(match, accum) {
  const { text, c } = parseConstant(match[1]);

  return {
    executers: accum.concat(constant(c)),
    text,
  };
}
