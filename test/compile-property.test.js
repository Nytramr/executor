import { Engine } from '../src/expression/engine';

describe('Compile Property', () => {
  const engine = new Engine();

  describe('Identifiers', () => {
    it('should return the property of the given object', () => {
      const executor = engine.compile('_name');

      expect(executor({ _name: 'name' })).toBe('name');
      expect(executor({ _name: 'another name' })).toBe('another name');
    });

    it('should return the falsy value', () => {
      const executor = engine.compile('name');

      expect(executor(0)).toBe(0);
      expect(executor(undefined)).toBe(undefined);
      expect(executor(null)).toBe(null);
      expect(executor('')).toBe('');
      expect(executor(false)).toBe(false);
    });

    it('should return the value of a complex property path of the given object', () => {
      const executor = engine.compile('body.name');

      expect(executor({ body: { name: 'name' } })).toBe('name');
      expect(executor({ body: { name: 'another name' } })).toBe('another name');
      expect(executor({})).toBeUndefined();
    });

    it('should return undefined when the value is not found', () => {
      const executor = engine.compile('body.name');

      expect(executor({ body: { name: undefined } })).toBeUndefined();
      expect(executor({ body: {} })).toBeUndefined();
      expect(executor({ body: undefined })).toBeUndefined();
      expect(executor({})).toBeUndefined();
    });

    it('should return the index of the array', () => {
      const executor = engine.compile('array.1');

      expect(executor({ array: ['cero', 'uno', 'dos'] })).toBe('uno');
    });

    it('should return the string like property', () => {
      const executor = engine.compile('obj."special property"');

      expect(executor({ obj: { 'special property': 'value' } })).toBe('value');
      expect(executor({ obj: { 'special property': 'another value' } })).toBe('another value');
      expect(executor({ obj: { special: { property: 'value' } } })).toBeUndefined();
      expect(executor({ obj: { special: { property: 'value' } } })).toBeUndefined();
      expect(executor({ 'obj special': { property: 'name' } })).toBeUndefined();
    });
  });

  describe('using accessors', () => {
    it('should return the value of a string accessor', () => {
      const executor = engine.compile('["body.name"]');

      expect(executor({ 'body.name': 'name' })).toBe('name');
      expect(executor({ 'body.name': 'another name' })).toBe('another name');
      expect(executor({ body: { name: 'name' } })).toBeUndefined();
    });

    it('should return the index of the array', () => {
      const executor = engine.compile('[1]');

      expect(executor(['cero', 'uno', 'dos'])).toBe('uno');

      const executor2 = engine.compile('array[1]');

      expect(executor2({ array: ['cero', 'uno', 'dos'] })).toBe('uno');
    });

    it('should return the value of the key obtained by a simple property', () => {
      const executor = engine.compile('[key]');
      expect(executor({ value: 'name', key: 'value' })).toBe('name');
      expect(executor({ 'another.value': 'another name', key: 'another.value' })).toBe('another name');
      expect(executor({ value: 'name', keyNotFound: 'value' })).toBeUndefined();
      expect(executor({})).toBeUndefined();
      // const executor2 = engine.compile('PP(PP(key))');
      // expect(executor2({ value: 'name', key: 'value' })).toBe('name');
      // expect(executor2({ 'another.value': 'another name', key: 'another.value' })).toBe('another name');
      // expect(executor2({ value: 'name', keyNotFound: 'value' })).toBeUndefined();
      // expect(executor2({})).toBeUndefined();
    });
    it('should return the value of the key obtained by a complex property', () => {
      const executor = engine.compile('[key.sub-key])');
      expect(executor({ value: 'name', key: { 'sub-key': 'value' } })).toBe('name');
      expect(executor({ 'another value': 'another name', key: { 'sub-key': 'another value' } })).toBe('another name');
      expect(executor({ value: 'name', keyNotFound: { 'sub-key': 'value' } })).toBeUndefined();
      expect(executor({ value: 'name', key: { 'sub-keyNotFound': 'value' } })).toBeUndefined();
      expect(executor({})).toBeUndefined();
      // const executor2 = engine.compile('PP(PP(key.sub-key))');
      // expect(executor2({ value: 'name', key: { 'sub-key': 'value' } })).toBe('name');
      // expect(executor2({ 'another value': 'another name', key: { 'sub-key': 'another value' } })).toBe(
      //   'another name',
      // );
      // expect(executor2({ value: 'name', keyNotFound: { 'sub-key': 'value' } })).toBeUndefined();
      // expect(executor2({ value: 'name', key: { 'sub-keyNotFound': 'value' } })).toBeUndefined();
      // expect(executor2({})).toBeUndefined();
    });
    // it('should return the value of the key obtained by a complex property', () => {
    //   const executor = engine.compile('PP([key.sub-key])');
    //   expect(executor({ value: 'name', key: { 'sub-key': 'value' } })).toBe('name');
    //   expect(executor({ 'another value': 'another name', key: { 'sub-key': 'another value' } })).toBe(
    //     'another name',
    //   );
    //   expect(executor({ value: 'name', keyNotFound: { 'sub-key': 'value' } })).toBeUndefined();
    //   expect(executor({ value: 'name', key: { 'sub-keyNotFound': 'value' } })).toBeUndefined();
    //   expect(executor({})).toBeUndefined();
    //   const executor2 = engine.compile('PP(PP(key.sub-key))');
    //   expect(executor2({ value: 'name', key: { 'sub-key': 'value' } })).toBe('name');
    //   expect(executor2({ 'another value': 'another name', key: { 'sub-key': 'another value' } })).toBe(
    //     'another name',
    //   );
    //   expect(executor2({ value: 'name', keyNotFound: { 'sub-key': 'value' } })).toBeUndefined();
    //   expect(executor2({ value: 'name', key: { 'sub-keyNotFound': 'value' } })).toBeUndefined();
    //   expect(executor2({})).toBeUndefined();
    // });
    //   it('should return the value of the key obtained by a simple property once in a dipper property context', () => {
    //     const executor = engine.compile('PP(context[key])');
    //     expect(executor({ context: { value: 'name' }, key: 'value' })).toBe('name');
    //     expect(executor({ context: { 'another.value': 'another name' }, key: 'another.value' })).toBe('another name');
    //     expect(executor({ context: { value: 'name' }, keyNotFound: 'value' })).toBeUndefined();
    //     expect(executor({})).toBeUndefined();
    //   });
  });

  // describe('Errors', () => {});
});
