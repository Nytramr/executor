import { constantParser, literalParser } from './constant-parser';
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
  self,
  undef,
} from './executers';
import {
  propertyRegEx,
  constantRegEx,
  executerRegExFactory,
  functionPartsSeparator,
  literalRegEx,
  endOfFunction,
} from './regexs';
import { textParser } from './parser';
import { propertyParser } from './property-parser';

const instructionParsers_ = Symbol();
const parseExecuter_ = Symbol();
const textParser_ = Symbol();
const executers_ = Symbol();
const scope_ = Symbol();
export class Engine {
  constructor() {
    /**
     * Getter executer
     *
     * It returns an executor that retrieves a value stored under the name obtained by name.
     */

    const getter = (name) => {
      return (...context) => {
        return this.getVariable(name(...context));
      };
    };

    /**
     * Setter executer
     *
     * It returns an executor that stores a value, obtained by getter and stored under the name obtained by name.
     */

    const setter = (name, getter) => {
      return (...context) => {
        this.setVariable(name(...context), getter(...context));
      };
    };

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
      'SL': self,
      'GET': getter,
      'SET': setter,
    };

    this[textParser_] = (text, accum) => {
      return textParser(text, this[instructionParsers_], 4, functionPartsSeparator, endOfFunction, accum);
    };

    this[parseExecuter_] = (match, accum) => {
      const executer = this[executers_][match[1]];
      if (!executer) {
        throw new Error(`Executer ${match[1]} wasn't recognized`);
      }
      const args = this[textParser_](match[2], []);

      return {
        text: args.text,
        accum: accum.concat(executer(...args.accum)),
      };
    };

    this[instructionParsers_] = [
      { regex: executerRegExFactory(Object.keys(this[executers_])), parser: this[parseExecuter_] },
      { regex: propertyRegEx, parser: propertyParser },
      { regex: constantRegEx, parser: constantParser },
      { regex: literalRegEx, parser: literalParser },
    ];

    this[scope_] = {};
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

  /**
   * getVariable returns the value stored in the scope, under the property represented by the given `name`
   *
   * @param {string} name Name of the value to be retrieved
   *
   * @returns the stored value or undefined if the variable name doesn't exist
   */
  getVariable(name) {
    return this[scope_][name];
  }

  /**
   * setVariable stores a given value in the engine scope, in a property defined by name.
   *
   * @param {string} name the name under the value is stored
   * @param {any} value the value to be stored
   */
  setVariable(name, value) {
    this[scope_][name] = value;
  }
}
