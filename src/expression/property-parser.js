import endOfFunction from './end-of-function';
import { property } from './executers';
import { constantAction, literalAction } from './constant-parser';
import { parseNormal, removeMatch, textParser, parseNextPart } from './parser';
import {
  elseRegEx,
  endOfPropertyRegEx,
  identifierRegEx,
  propertyRegEx,
  propertySeparatorRegEx,
  squareBracketsRegEx,
} from './regexs';

const squareBracketsParser = (match, accum) => {
  const result = parseNextPart(match[1], squareBracketsParsers, 4, []);
  return {
    accum: accum.concat(result.accum),
    txt: endOfFunction.remove(result.txt),
  };
};

export const propertyFunctionParser = (match, accum) => {
  const result = propertyParser(match, accum);
  return {
    accum: result.accum,
    txt: endOfFunction.remove(result.txt),
  };
};

export const propertyParser = (match, accum) => {
  const result = textParser(match[1], propertyParsers, 5, endOfPropertyRegEx, []);
  let i = result.accum.length - 1;
  let path = property(result.accum[i]);

  for (i = i - 1; i >= 0; i--) {
    path = property(result.accum[i], path);
  }

  return {
    accum: accum.concat(path),
    txt: result.txt,
  };
};

export const propertyFunctionAction = { regex: propertyRegEx, parser: propertyFunctionParser };
export const propertyParserAction = { regex: elseRegEx, parser: propertyParser };

const propertyParsers = [
  literalAction,
  propertyFunctionAction,
  { regex: identifierRegEx, parser: parseNormal },
  { regex: propertySeparatorRegEx, parser: removeMatch },
  { regex: squareBracketsRegEx, parser: squareBracketsParser },
];

const squareBracketsParsers = [literalAction, constantAction, propertyFunctionAction, propertyParserAction];
