import { constant } from './executers';
import { throwError } from './utils';

export const parseNormal = (match, accum) => {
  return {
    accum: accum.concat(constant(match[1])),
    txt: match[2],
  };
};

export const parseNumber = (match, accum) => {
  return {
    accum: accum.concat(constant(+match[1])),
    txt: match[2],
  };
};

export const removeMatch = (match, accum) => {
  return {
    accum,
    txt: match[2],
  };
};

export const parseNextPart = (text, parsers, parsersLength, accum) => {
  for (let i = 0; i < parsersLength; i++) {
    const match = parsers[i][0].exec(text);
    if (match) {
      return parsers[i][1](match, accum);
    }
  }

  throwError(`Token unrecognized near to ${text}`);
};

export const textParser = (text, parsers, parsersLength, endOfSequence, accum) => {
  let _text = text;
  let _accum = accum;

  while (_text && !endOfSequence.test(_text)) {
    const next = parseNextPart(_text, parsers, parsersLength, _accum);
    _accum = next.accum;
    _text = next.txt;
  }

  return {
    accum: _accum,
    txt: _text,
  };
};
