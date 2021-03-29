import { removeEndOfFunction } from './end-of-function';
import { property } from './executers';
import { constantAction, literalAction } from './constant-parser';
import { parseNormal, parseNumber, removeMatch, textParser, parseNextPart } from './parser';
import {
  elseRegEx,
  endOfPropertyRegEx,
  identifierRegEx,
  integerRegEx,
  propertyRegEx,
  propertySeparatorRegEx,
  squareBracketsRegEx,
} from './regexs';

const squareBracketsParser = (match, accum) => {
  const result = parseNextPart(match[1], squareBracketsParsers, 4, []);
  return {
    accum: accum.concat(result.accum),
    txt: removeEndOfFunction(result.txt),
  };
};

export const propertyFunctionParser = (match, accum) => {
  const result = propertyParser(match, accum);
  return {
    accum: result.accum,
    txt: removeEndOfFunction(result.txt),
  };
};

export const propertyParser = (match, accum) => {
  const { accum: accumResult, txt } = textParser(match[1], propertyParsers, 6, endOfPropertyRegEx, []);
  let i = accumResult.length - 1;
  let path = property(accumResult[i]);

  for (i = i - 1; i >= 0; i--) {
    path = property(accumResult[i], path);
  }

  return {
    accum: accum.concat(path),
    txt,
  };
};

export const propertyFunctionAction = [propertyRegEx, propertyFunctionParser];
export const propertyParserAction = [elseRegEx, propertyParser];

const propertyParsers = [
  [integerRegEx, parseNumber],
  literalAction,
  propertyFunctionAction,
  [identifierRegEx, parseNormal],
  [propertySeparatorRegEx, removeMatch],
  [squareBracketsRegEx, squareBracketsParser],
];

const squareBracketsParsers = [literalAction, constantAction, propertyFunctionAction, propertyParserAction];
