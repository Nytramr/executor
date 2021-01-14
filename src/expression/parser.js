import { endOfFunction } from './regexs';

export function parseNextPart(text, pathParsers, pathParsersLength, accum) {
  for (let i = 0; i < pathParsersLength; i++) {
    const match = pathParsers[i].regex.exec(text);
    if (match) {
      return pathParsers[i].parser(match, accum);
    }
  }

  throw new Error(`Token unrecognized near to ${text}`);
}

export function textParser(text, pathParsers, pathParsersLength, accum) {
  let _text = text;
  let _accum = accum;

  while (_text && !_text.startsWith(')')) {
    const next = parseNextPart(_text, pathParsers, pathParsersLength, _accum);
    _accum = next.accum;
    _text = next.text;
  }

  return {
    accum: _accum,
    text: _text.replace(endOfFunction, ''),
  };
}
