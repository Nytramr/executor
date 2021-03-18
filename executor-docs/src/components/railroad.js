import React, { useRef, useEffect } from 'react';
import rr from 'railroad-diagrams';

const { Choice, Diagram, NonTerminal, Optional, OneOrMore, Sequence, Terminal, ZeroOrMore } = rr;

export const LiteralNumber = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(
      Optional('-', 'skip'),
      OneOrMore(NonTerminal('digit')),
      Optional(Sequence('.', OneOrMore(NonTerminal('digit')))),
    );
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const LiteralString = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(
      Choice(
        0,
        Sequence(Terminal('"'), ZeroOrMore(Terminal('Any char but "')), Terminal('"')),
        Sequence(Terminal("'"), ZeroOrMore(Terminal("Any char but '")), Terminal("'")),
      ),
    );
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const LiteralBoolean = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(Choice(0, Terminal('true'), Terminal('false')));
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const Char = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(NonTerminal(' Any character from a to z both upper and lower case '));
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const Digit = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(NonTerminal('Any number from 0 to 9'));
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const Term = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(
      Choice(
        0,
        NonTerminal('string'),
        NonTerminal('number'),
        NonTerminal('boolean'),
        NonTerminal('function'),
        NonTerminal('property'),
        // Terminal('undefined'),
        // Terminal('null'),
      ),
    );
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const Sentence = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(NonTerminal('term'));
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const Function = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(
      NonTerminal('identifier'),
      Terminal('('),
      Optional(Sequence(NonTerminal('term'), ZeroOrMore(Sequence(Terminal(','), NonTerminal('term'))))),
      Terminal(')'),
    );
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const Identifier = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(
      Choice(1, Terminal('_'), NonTerminal('chars from A to z')),
      ZeroOrMore(Choice(3, Terminal('_'), Terminal('-'), NonTerminal('digit'), NonTerminal('chars from A to z'))),
    );
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const PropertyAccessor = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(
      Sequence(
        Terminal('['),
        Choice(0, NonTerminal('string'), NonTerminal('number'), NonTerminal('property'), NonTerminal('function')),
        Terminal(']'),
      ),
    );
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};

export const Property = () => {
  const ref = useRef(null);

  useEffect(() => {
    const d = Diagram(
      Choice(1, NonTerminal('number'), NonTerminal('identifier'), NonTerminal('accessor')),
      ZeroOrMore(
        Choice(
          0,
          Sequence(Terminal('.'), Choice(1, NonTerminal('number'), NonTerminal('identifier'), NonTerminal('string'))),
          NonTerminal('accessor'),
        ),
      ),
    );
    d.addTo(ref.current);
  }, [ref]);

  return <div ref={ref}></div>;
};
