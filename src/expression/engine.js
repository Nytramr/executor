import { constantParser } from './constant-parser';
import {
  and,
  equals,
  greaterOrEqualsThan,
  greaterThan,
  lessOrEqualsThan,
  lessThan,
  nonEquals,
  not,
  or,
  undef,
} from './executers';
import { propertyRegEx, constantRegEx, executerRegExFactory } from './regexs';
import { textParser } from './parser';
import { propertyParser } from './property-parser';

const instructionParsers_ = Symbol();
const parseExecuter_ = Symbol();
const textParser_ = Symbol();
const executers_ = Symbol();
export class Engine {
  constructor() {
    this[executers_] = {
      'AN': and,
      'EQ': equals,
      'GE': greaterOrEqualsThan,
      'GT': greaterThan,
      'LE': lessOrEqualsThan,
      'LT': lessThan,
      'NE': nonEquals,
      'NT': not,
      'OR': or,
    };
    this[textParser_] = (text, accum) => {
      return textParser(text, this[instructionParsers_], 3, accum);
    };

    this[parseExecuter_] = (match, accum) => {
      const executer = this[executers_][match[1]];
      if (!executer) {
        throw new Error(`Executer ${match[1]} wasn't recognized`);
      }

      const args = this[textParser_](match[2], []);

      return this[textParser_](args.text, accum.concat(executer(...args.accum)));
    };

    this[instructionParsers_] = [
      { regex: executerRegExFactory(Object.keys(this[executers_])), parser: this[parseExecuter_] },
      { regex: propertyRegEx, parser: propertyParser },
      { regex: constantRegEx, parser: constantParser },
    ];
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
