import { removeEndOfFunction } from './end-of-function';
import { constant } from './executers';
import { literalRegEx, constantRegEx } from './regexs';

const parseAll = (match) => {
  const txt = match[5] || '';
  if (match[4]) {
    //boolean
    return {
      val: match[4] === 'true',
      txt,
    };
  }

  if (match[3]) {
    //number
    return {
      val: +match[3], // convert into number
      txt,
    };
  }

  // string
  return {
    val: match[1] || match[2] || '',
    txt,
  };
};

export const literalParser = (match, accum) => {
  const result = parseAll(match);

  return {
    accum: accum.concat(constant(result.val)),
    txt: result.txt,
  };
};

export const constantParser = (match, accum) => {
  const literalMatch = literalRegEx.exec(match[1]);
  const result = parseAll(literalMatch);

  return {
    accum: accum.concat(constant(result.val)),
    txt: removeEndOfFunction(result.txt),
  };
};

export const literalAction = { regex: literalRegEx, parser: literalParser };
export const constantAction = { regex: constantRegEx, parser: constantParser };
