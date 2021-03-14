import endOfFunction from './end-of-function';
import { constant } from './executers';
import { literalRegEx, constantRegEx } from './regexs';

export function parseAll(match) {
  const text = match[5] || '';
  if (match[4]) {
    //boolean
    return {
      val: match[4] === 'true',
      text,
    };
  }

  if (match[3]) {
    //number
    return {
      val: +match[3], // convert into number
      text,
    };
  }

  // string
  return {
    val: match[1] || match[2] || '',
    text,
  };
}

export function literalParser(match, accum) {
  const result = parseAll(match);

  return {
    accum: accum.concat(constant(result.val)),
    text: result.text,
  };
}

export function constantParser(match, accum) {
  const literalMatch = literalRegEx.exec(match[1]);
  const result = parseAll(literalMatch);

  return {
    accum: accum.concat(constant(result.val)),
    text: endOfFunction.remove(result.text),
  };
}

export const literalAction = { regex: literalRegEx, parser: literalParser };
export const constantAction = { regex: constantRegEx, parser: constantParser };
