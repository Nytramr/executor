import { constantParser } from './constant-parser';
import { undef, executerRegEx, executers } from './executers';
import { propertyRegEx, constantRegEx } from './regexs';
import { textParser } from './parser';
import { propertyParser } from './property-parser';

// Instructions
const instructionParsers = [
  { regex: executerRegEx, parser: parseExecuter },
  { regex: propertyRegEx, parser: propertyParser },
  { regex: constantRegEx, parser: constantParser },
];

const instructionParsersLength = instructionParsers.length;

function parseExecuter(match, accum) {
  const executer = executers[match[1]];
  if (!executer) {
    throw new Error(`Executer ${match[1]} wasn't recognized`);
  }

  const args = textParser(match[2], instructionParsers, instructionParsersLength, []);

  return textParser(args.text, instructionParsers, instructionParsersLength, accum.concat(executer(...args.accum)));
}

export function textGraphIntoExecuter(text) {
  if (text === '') {
    return undef('');
  }

  const result = textParser(text, instructionParsers, instructionParsersLength, []);

  if (result.accum.length > 1) {
    throw new Error(`The expression ${text} has more than a main executer`);
  }

  return result.accum[0];
}
