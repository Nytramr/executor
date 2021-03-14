import { constant } from './executers';

export const parseNormal = (match, accum) => {
  return {
    accum: accum.concat(constant(match[1])),
    text: match[2],
  };
};

export const removeMatch = (match, accum) => {
  return {
    accum,
    text: match[2],
  };
};

export const parseNextPart = (text, parsers, parsersLength, accum) => {
  for (let i = 0; i < parsersLength; i++) {
    const match = parsers[i].regex.exec(text);
    if (match) {
      return parsers[i].parser(match, accum);
    }
  }

  throw new Error(`Token unrecognized near to ${text}`);
};

export const textParser = (text, parsers, parsersLength, endOfSequence, accum) => {
  let _text = text;
  let _accum = accum;

  while (_text && !endOfSequence.test(_text)) {
    const next = parseNextPart(_text, parsers, parsersLength, _accum);
    _accum = next.accum;
    _text = next.text;
  }

  return {
    accum: _accum,
    text: _text,
  };
};
