/**
 * Constant executer
 * 
 * It returns an executor that returns always the given value.
 */
export function constant(value) {
  return function () {
    return value;
  };
}

/**
 * Property executer
 * 
 * It returns an executor that returns the given property of the given object, if the object argument is falsy, the object is return instead
 */

export function property(name, getter) {
  return function (context) {
    return context && (getter ? getter(context[name]) : context[name]);
  };
}

/**
 * Not converter
 * 
 * It returns an executor that returns true if the execution of its argument returns false, returns false otherwise.
 */

export function not(arg) { }

/**
 * And logic evaluator
 * 
 * It returns an executor that returns true if the execution of both arguments returns true, returns false otherwise.
 */
export function and(oper1, oper2) { }

/**
 * Or logic evaluator
 * 
 * It returns an executor that returns false if the execution of both arguments returns false, returns true otherwise.
 */
export function or(oper1, oper2) { }

/**
 * Equals comparator
 * 
 * It returns an executor that returns true if the execution of both arguments are equals (=== equivalent), returns false otherwise.
 */
export function equals(oper1, oper2) { }

/**
 * Non Equals comparator
 * 
 * It returns an executor that returns true if the execution of both arguments are different (!== equivalent), returns false otherwise.
 */
export function nonEquals(oper1, oper2) { }
