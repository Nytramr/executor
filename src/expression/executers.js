/**
 * Undefined executer
 *
 * It returns an executor that returns always the given value.
 */
export const undef = () => {
  return () => {
    return undefined;
  };
};

/**
 * Constant executer
 *
 * It returns an executor that returns always the given value.
 */
export const constant = (value) => {
  return () => {
    return value;
  };
};

/**
 * Property executer
 *
 * It returns an executor that returns the given property of the given object, if the object argument is falsy, the object is return instead
 */

export const property = (name, getter) => {
  return (subContext, context = subContext) => {
    return (
      subContext && (getter && subContext ? getter(subContext[name(context)], context) : subContext[name(context)])
    );
  };
};

/**
 * Not converter
 *
 * It returns an executor that returns true if the execution of its argument returns false, returns false otherwise.
 */

export const not = (arg) => {
  return (context) => {
    return !arg(context);
  };
};

/**
 * And logic evaluator
 *
 * It returns an executor that returns true if the execution of both arguments returns true, returns false otherwise.
 */
export const and = (oper1, oper2) => {
  return (context) => {
    return oper1(context) && oper2(context);
  };
};

/**
 * Or logic evaluator
 *
 * It returns an executor that returns false if the execution of both arguments returns false, returns true otherwise.
 */
export const or = (oper1, oper2) => {
  return (context) => {
    return oper1(context) || oper2(context);
  };
};

/**
 * Equals comparator
 *
 * It returns an executor that returns true if the execution of both arguments are equals (=== equivalent), returns false otherwise.
 */
export const equals = (oper1, oper2) => {
  return (context) => {
    return oper1(context) === oper2(context);
  };
};

/**
 * Non Equals comparator
 *
 * It returns an executor that returns true if the execution of both arguments are different (!== equivalent), returns false otherwise.
 */
export const nonEquals = (oper1, oper2) => {
  return (context) => {
    return oper1(context) !== oper2(context);
  };
};

/**
 * Greater than comparator
 *
 * It returns an executor that returns true if the execution of first argument is greater than the execution of the second argument (> equivalent), returns false otherwise.
 */
export const greaterThan = (oper1, oper2) => {
  return (context) => {
    return oper1(context) > oper2(context);
  };
};

/**
 * Greater or equals than comparator
 *
 * It returns an executor that returns true if the execution of first argument is greater or equals than the execution of the second argument (>= equivalent), returns false otherwise.
 */
export const greaterOrEqualsThan = (oper1, oper2) => {
  return (context) => {
    return oper1(context) >= oper2(context);
  };
};

/**
 * Less than comparator
 *
 * It returns an executor that returns true if the execution of first argument is less than the execution of the second argument (< equivalent), returns false otherwise.
 */
export const lessThan = (oper1, oper2) => {
  return (context) => {
    return oper1(context) < oper2(context);
  };
};

/**
 * Less or equals than comparator
 *
 * It returns an executor that returns true if the execution of first argument is less or equals than the execution of the second argument (<= equivalent), returns false otherwise.
 */
export const lessOrEqualsThan = (oper1, oper2) => {
  return (context) => {
    return oper1(context) <= oper2(context);
  };
};

export const executers = {
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
