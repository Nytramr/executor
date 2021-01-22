import { constantParser } from './constant-parser';
import { undef, executers } from './executers';
import { executerRegEx, propertyRegEx, constantRegEx } from './regexs';
import { textParser } from './parser';
import { propertyParser } from './property-parser';

const instructionParsersLength_ = Symbol();
const instructionParsers_ = Symbol();
const parseExecuter_ = Symbol();
const textParser_ = Symbol();
// const instructions_ = Symbol();
export class Engine {
  constructor() {
    this[textParser_] = (text, accum) => {
      return textParser(text, this[instructionParsers_], this[instructionParsersLength_], accum);
    };

    this[parseExecuter_] = (match, accum) => {
      const executer = executers[match[1]];
      if (!executer) {
        throw new Error(`Executer ${match[1]} wasn't recognized`);
      }

      const args = this[textParser_](match[2], []);

      return this[textParser_](args.text, accum.concat(executer(...args.accum)));
    };

    this[instructionParsers_] = [
      { regex: executerRegEx, parser: this[parseExecuter_] },
      { regex: propertyRegEx, parser: propertyParser },
      { regex: constantRegEx, parser: constantParser },
    ];

    this[instructionParsersLength_] = this[instructionParsers_].length;
  }

  compile(text) {
    if (!text) {
      return undef();
    }

    const result = this[textParser_](text, []);

    if (result.accum.length > 1) {
      throw new Error(`The expression ${text} has more than a main executer`);
    }

    return result.accum[0];
  }
}
