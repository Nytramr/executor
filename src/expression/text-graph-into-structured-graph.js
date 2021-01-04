import {
  and,
  constant,
  equals,
  greaterOrEqualsThan,
  greaterThan,
  lessOrEqualsThan,
  lessThan,
  nonEquals,
  not,
  or,
} from './executers';

const executers = {
  AN: and,
  CT: constant,
  EQ: equals,
  GE: greaterOrEqualsThan,
  GT: greaterThan,
  LE: lessOrEqualsThan,
  LT: lessThan,
  NE: nonEquals,
  NT: not,
  OR: or,
};

const instructionRegEx = /^(AN|CT|EQ|GE|GT|LE|LT|NE|NT|OR)\(\s*(.*)/; //first group: the instruction, second group: rest
const endOfArgsRegEx = /^\),?\s*(.*)/; // detect and remove a closing parenthesis
const stringRegEx = /^(?:"([^"]*)"|'([^']*)'),?\s*(.*)/; // string argument, first group: double quotes string, second group: single quotes string, third group: rest.
const numberRegEx = /^(-?\d+(?:\.\d+)?),?\s*(.*)/; // string argument, first group: number, second group: rest.
const booleanRegEx = /^(false|true),?\s*(.*)/; // string argument, first group: the boolean, second group: rest.

function parseInstruction(match, accum) {
  const executer = executers[match[1]];
  if (!executer) {
    throw new Error(`Executer ${match[1]} wasn't recognized`);
  }

  const args = parseNext(match[2], []);

  return parseNext(args.text, [...accum, [executer, ...args.graph]]);
}

function parseMatch(match, accum) {
  // parseEndOfArguments
  return {
    graph: accum,
    text: match[1],
  };
}

function parseString(match, accum) {
  const value = match[1] || match[2] || '';

  return parseNext(match[3], accum.concat(value));
}

function parseNumber(match, accum) {
  const value = +match[1]; // convert into number

  return parseNext(match[2], accum.concat(value));
}

function parseBoolean(match, accum) {
  const value = match[1]; // convert into number

  return parseNext(match[2], accum.concat(value === 'true'));
}

const parsers = [
  { regex: instructionRegEx, parser: parseInstruction },
  { regex: endOfArgsRegEx, parser: parseMatch },
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNumber },
  { regex: booleanRegEx, parser: parseBoolean },
];

const parsersLength = parsers.length;

function parseNext(text, accum) {
  if (!text) {
    return {
      graph: accum,
      text: '',
    };
  }

  for (let i = 0; i < parsersLength; i++) {
    const match = parsers[i].regex.exec(text);
    if (match) {
      return parsers[i].parser(match, accum);
    }
  }

  throw new Error(`Token unrecognized near to ${text}`);
}

export function textGraphIntoStructureGraph(text) {
  if (text === '') {
    return [];
  }

  const textParsed = parseNext(text, []);

  if (textParsed.graph.length > 1) {
    throw new Error(`The expression ${text} has more than a main instruction close to ""`);
  }

  return textParsed.graph[0];
}
