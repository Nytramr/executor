import { constant } from './executers';
import { parseNextPart } from './parser';
import { stringRegEx, endOfFunction, numberRegEx } from './regexs';

const booleanRegEx = /^(false|true)\s*(.*)/; // string argument, first group: the boolean, second group: rest.

const constantParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNumber },
  { regex: booleanRegEx, parser: parseBoolean },
];

const constantParsersLength = constantParsers.length;

function parseNumber(match) {
  return {
    value: +match[1], // convert into number
    text: match[2],
  };
}

function parseBoolean(match) {
  return {
    value: match[1] === 'true',
    text: match[2],
  };
}

function parseString(match) {
  return {
    value: match[1] || match[2] || '',
    text: match[3],
  };
}

export function constantParser(match, accum) {
  // console.log('constantParser', match[1]);
  const { text, value } = parseNextPart(match[1], constantParsers, constantParsersLength);

  return {
    accum: accum.concat(constant(value)),
    text: text.replace(endOfFunction, ''),
  };
}
