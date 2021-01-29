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

  /**
   * This method allows the user to extend the built in operators with custom operators provided by the user.
   *
   * @param {string} command The string to identify the operator
   * @param {function} executer The executer like function to be used every time the operator is compiled.
   */
  define(command, executer) {
    this[executers_][command] = executer;

    this[instructionParsers_][0].regex = executerRegExFactory(Object.keys(this[executers_]));

    return;
  }

  /**
   * Compile will create an executer function based on the code passed by parameter.
   *
   * @param {string} code A code like string to be compiled into an executer
   *
   * @returns executer function
   */
  compile(code) {
    if (!code) {
      return undef();
    }

    const result = this[textParser_](code, []);

    if (result.accum.length > 1) {
      throw new Error(`The expression ${code} has more than a main executer`);
    }

    return result.accum[0];
  }
}
