import { endOfFunction } from './regexs';

export const parseNextPart = (text, parsers, parsersLength, accum) => {
  for (let i = 0; i < parsersLength; i++) {
    const match = parsers[i].regex.exec(text);
    if (match) {
      return parsers[i].parser(match, accum);
    }
  }

  throw new Error(`Token unrecognized near to ${text}`);
};

export const textParser = (text, parsers, parsersLength, intermediateCheck, endOfText, accum) => {
  let _text = text;
  let _accum = accum;

  while (_text && !endOfText.test(_text)) {
    const next = parseNextPart(_text, parsers, parsersLength, _accum);
    _accum = next.accum;
    _text = next.text.replace(intermediateCheck, '');
  }

  return {
    accum: _accum,
    text: _text.replace(endOfText, ''),
  };
};
