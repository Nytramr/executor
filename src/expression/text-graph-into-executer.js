import { undef, executerRegEx, executers } from './executers';
import { pathParser } from './path-parser';

const propertyRegEx = /^PP\(\s*(.*)/; //only group: rest
const endOfArgsRegEx = /^\),?\s*(.*)/; // detect and remove a closing parenthesis
const stringRegEx = /^(?:"([^"]*)"|'([^']*)'),?\s*(.*)/; // string argument, first group: double quotes string, second group: single quotes string, third group: rest.
const numberRegEx = /^(-?\d+(?:\.\d+)?),?\s*(.*)/; // string argument, first group: number, second group: rest.
const booleanRegEx = /^(false|true),?\s*(.*)/; // string argument, first group: the boolean, second group: rest.

// Instructions
function parseExecuter(match, accum) {
  const executer = executers[match[1]];
  if (!executer) {
    throw new Error(`Executer ${match[1]} wasn't recognized`);
  }

  const args = parseNextInstruction(match[2], []);

  return parseNextInstruction(args.text, accum.concat(executer(...args.executers)));
}

function parseMatch(match, accum) {
  // parseEndOfArguments
  return {
    executers: accum,
    text: match[1],
  };
}

function parseString(match, accum) {
  const value = match[1] || match[2] || '';

  return parseNextInstruction(match[3], accum.concat(value));
}

function parseNumber(match, accum) {
  const value = +match[1]; // convert into number

  return parseNextInstruction(match[2], accum.concat(value));
}

function parseBoolean(match, accum) {
  const value = match[1]; // convert into number

  return parseNextInstruction(match[2], accum.concat(value === 'true'));
}

const instructionParsers = [
  { regex: executerRegEx, parser: parseExecuter },
  { regex: propertyRegEx, parser: pathParser },
  { regex: endOfArgsRegEx, parser: parseMatch },
  { regex: stringRegEx, parser: parseString },
  { regex: numberRegEx, parser: parseNumber },
  { regex: booleanRegEx, parser: parseBoolean },
];

const instructionParsersLength = instructionParsers.length;

function parseNextInstruction(text, accum) {
  if (!text) {
    return {
      executers: accum,
      text: '',
    };
  }

  for (let i = 0; i < instructionParsersLength; i++) {
    const match = instructionParsers[i].regex.exec(text);
    if (match) {
      return instructionParsers[i].parser(match, accum);
    }
  }

  throw new Error(`Token unrecognized near to ${text}`);
}

export function textGraphIntoExecuter(text) {
  if (text === '') {
    return undef('');
  }

  const textParsed = parseNextInstruction(text, []);

  if (textParsed.executers.length > 1) {
    throw new Error(`The expression ${text} has more than a main executer`);
  }

  return textParsed.executers[0];
}
