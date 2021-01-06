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

export function not(arg) {
  return function (context) {
    return !arg(context);
  };
}

/**
 * And logic evaluator
 *
 * It returns an executor that returns true if the execution of both arguments returns true, returns false otherwise.
 */
export function and(oper1, oper2) {
  return function (context) {
    return oper1(context) && oper2(context);
  };
}

/**
 * Or logic evaluator
 *
 * It returns an executor that returns false if the execution of both arguments returns false, returns true otherwise.
 */
export function or(oper1, oper2) {
  return function (context) {
    return oper1(context) || oper2(context);
  };
}

/**
 * Equals comparator
 *
 * It returns an executor that returns true if the execution of both arguments are equals (=== equivalent), returns false otherwise.
 */
export function equals(oper1, oper2) {
  return function (context) {
    return oper1(context) === oper2(context);
  };
}

/**
 * Non Equals comparator
 *
 * It returns an executor that returns true if the execution of both arguments are different (!== equivalent), returns false otherwise.
 */
export function nonEquals(oper1, oper2) {
  return function (context) {
    return oper1(context) !== oper2(context);
  };
}

/**
 * Greater than comparator
 *
 * It returns an executor that returns true if the execution of first argument is greater than the execution of the second argument (> equivalent), returns false otherwise.
 */
export function greaterThan(oper1, oper2) {
  return function (context) {
    return oper1(context) > oper2(context);
  };
}

/**
 * Greater or equals than comparator
 *
 * It returns an executor that returns true if the execution of first argument is greater or equals than the execution of the second argument (>= equivalent), returns false otherwise.
 */
export function greaterOrEqualsThan(oper1, oper2) {
  return function (context) {
    return oper1(context) >= oper2(context);
  };
}

/**
 * Less than comparator
 *
 * It returns an executor that returns true if the execution of first argument is less than the execution of the second argument (< equivalent), returns false otherwise.
 */
export function lessThan(oper1, oper2) {
  return function (context) {
    return oper1(context) < oper2(context);
  };
}

/**
 * Less or equals than comparator
 *
 * It returns an executor that returns true if the execution of first argument is less or equals than the execution of the second argument (<= equivalent), returns false otherwise.
 */
export function lessOrEqualsThan(oper1, oper2) {
  return function (context) {
    return oper1(context) <= oper2(context);
  };
}

export const executers = {
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

export const executerRegEx = /^(AN|CT|EQ|GE|GT|LE|LT|NE|NT|OR)\(\s*(.*)/; //first group: the executer, second group: rest
