import { constant } from './executers';
import { parseNextPart } from './parser';
import { stringRegEx, endOfFunction, numberRegEx } from './regexs';

const booleanRegEx = /^(false|true)\s*(.*)/; // string argument, first group: the boolean, second group: rest.

const parseString = (match) => {
  return {
    value: match[1] || match[2] || '',
    text: match[3],
  };
};

const parseNumber = (match) => {
  return {
    value: +match[1], // convert into number
    text: match[2],
  };
};

const parseBoolean = (match) => {
  return {
    value: match[1] === 'true',
    text: match[2],
  };
};

const constantParsers = [
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNumber },
  { regex: booleanRegEx, parser: parseBoolean },
];

const constantParsersLength = constantParsers.length;

export function constantParser(match, accum) {
  const result = parseNextPart(match[1], constantParsers, constantParsersLength);

  return {
    accum: accum.concat(constant(result.value)),
    text: result.text.replace(endOfFunction, ''),
  };
}
