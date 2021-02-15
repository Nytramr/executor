import {
  and,
  constant,
  equals,
  greaterOrEqualsThan,
  greaterThan,
  lessOrEqualsThan,
  lessThan,
  nonEquals,
  not,
  or,
  property,
  self,
} from '../src/expression/executers';

describe('Executers', () => {
  const firstProp = (obj) => obj.first;
  const secondProp = (obj) => obj.second;

  describe('Constant', () => {
    it('should return the given value regardless the argument', () => {
      const executor = constant(10);
      expect(executor()).toBe(10);
      expect(executor({ unused: 'value' })).toBe(10);
    });
  });

  describe('Self', () => {
    it('should return the given object', () => {
      const executor = self();

      expect(executor(10)).toBe(10);
      expect(executor('name')).toBe('name');
      const context = { name: 'name' };
      expect(executor(context)).toBe(context);
      expect(executor({ name: 'another name' })).toEqual({ name: 'another name' });
    });

    describe('using properties as indexes', () => {
      it('should return the value of the key obtained by a simple property', () => {
        const executor = self(property(constant('key')));

        expect(executor({ key: 'value' })).toBe('value');
        expect(executor({ 'another.value': 'another name', key: 'another.value' })).toBe('another.value');
        expect(executor({ value: 'name', keyNotFound: 'value' })).toBeUndefined();
        expect(executor({})).toBeUndefined();
      });

      it('should return the value of the key obtained by a complex property', () => {
        const executor = self(property(constant('key'), property(constant('sub-key'))));

        expect(executor({ value: 'name', key: { 'sub-key': 'value' } })).toBe('value');
        expect(executor({ 'another value': 'another name', key: { 'sub-key': 'another value' } })).toBe(
          'another value',
        );
        expect(executor({ value: 'name', keyNotFound: { 'sub-key': 'value' } })).toBeUndefined();
        expect(executor({ value: 'name', key: { 'sub-keyNotFound': 'value' } })).toBeUndefined();
        expect(executor({})).toBeUndefined();
      });
    });

    describe('improbable situations', () => {
      it('should reset the subContext to the context for the getter', () => {
        const executor = property(property(constant('key'), self(property(constant('sub-key')))));

        expect(executor({ value: 'name', value2: 'name 2', key: { 'sub-key': 'value' }, 'sub-key': 'value2' })).toBe(
          'name 2',
        );
      });
    });
  });

  describe('Property', () => {
    it('should return the property of the given object', () => {
      const executor = property(constant('name'));

      expect(executor({ name: 'name' })).toBe('name');
      expect(executor({ name: 'another name' })).toBe('another name');
    });

    it('should return the index of the given array', () => {
      const executor = property(constant('1'));

      expect(executor(['cero', 'uno', 'dos'])).toBe('uno');
    });

    it('should return the falsy value', () => {
      const executor = property(constant('name'));

      expect(executor(0)).toBe(0);
      expect(executor(undefined)).toBe(undefined);
      expect(executor(null)).toBe(null);
      expect(executor('')).toBe('');
      expect(executor(false)).toBe(false);
    });

    it('should return the value of a complex property path of the given object', () => {
      const executor = property(constant('body'), property(constant('name')));

      expect(executor({ body: { name: 'name' } })).toBe('name');
      expect(executor({ body: { name: 'another name' } })).toBe('another name');
      expect(executor({})).toBeUndefined();
    });

    it('should return undefined', () => {
      const executor = property(constant('body'), property(constant('name')));

      expect(executor({ body: { name: undefined } })).toBeUndefined();
      expect(executor({ body: {} })).toBeUndefined();
      expect(executor({ body: undefined })).toBeUndefined();
      expect(executor({})).toBeUndefined();
    });

    describe('using properties as indexes', () => {
      it('should return the value of the key obtained by a simple property', () => {
        const executor = property(property(constant('key')));

        expect(executor({ value: 'name', key: 'value' })).toBe('name');
        expect(executor({ 'another.value': 'another name', key: 'another.value' })).toBe('another name');
        expect(executor({ value: 'name', keyNotFound: 'value' })).toBeUndefined();
        expect(executor({})).toBeUndefined();
      });

      it('should return the value of the key obtained by a complex property', () => {
        const executor = property(property(constant('key'), property(constant('sub-key'))));

        expect(executor({ value: 'name', key: { 'sub-key': 'value' } })).toBe('name');
        expect(executor({ 'another value': 'another name', key: { 'sub-key': 'another value' } })).toBe('another name');
        expect(executor({ value: 'name', keyNotFound: { 'sub-key': 'value' } })).toBeUndefined();
        expect(executor({ value: 'name', key: { 'sub-keyNotFound': 'value' } })).toBeUndefined();
        expect(executor({})).toBeUndefined();
      });

      it('should return the value of the key obtained by a simple property once in a dipper property context', () => {
        const executor = property(constant('context'), property(property(constant('key'))));

        expect(executor({ context: { value: 'name' }, key: 'value' })).toBe('name');
        expect(executor({ context: { 'another.value': 'another name' }, key: 'another.value' })).toBe('another name');
        expect(executor({ context: { value: 'name' }, keyNotFound: 'value' })).toBeUndefined();
        expect(executor({})).toBeUndefined();
      });
    });
  });

  describe('Not', () => {
    it('should return true', () => {
      const executor = not(firstProp);
      expect(executor({ first: false })).toBe(true);
      expect(executor({ first: 0 })).toBe(true);
      expect(executor({ first: null })).toBe(true);
      expect(executor({})).toBe(true);
    });

    it('should return false', () => {
      const executor = not(firstProp);
      expect(executor({ first: true })).toBe(false);
      expect(executor({ first: 1 })).toBe(false);
      expect(executor({ first: {} })).toBe(false);
    });
  });

  describe('And', () => {
    it('should return true', () => {
      const executor = and(firstProp, secondProp);
      expect(executor({ first: true, second: true })).toBe(true);
    });

    it('should return false', () => {
      const executor = and(firstProp, secondProp);
      expect(executor({ first: true, second: false })).toBe(false);
      expect(executor({ first: false, second: true })).toBe(false);
      expect(executor({ first: false, second: false })).toBe(false);
    });

    it('should return falsy argument', () => {
      const executor = and(firstProp, secondProp);
      expect(executor({ first: true, second: false })).toBe(false);
      expect(executor({ first: 0, second: false })).toBe(0);
      expect(executor({ first: null, second: false })).toBe(null);
      expect(executor({ first: '', second: false })).toBe('');
      expect(executor({ second: true })).toBeUndefined();
    });

    it('should execute both arguments', () => {
      const firstArg = jest.fn(() => true);
      const secondArg = jest.fn(() => false);
      const executor = and(firstArg, secondArg);
      executor({});

      expect(firstArg).toHaveBeenCalled();
      expect(secondArg).toHaveBeenCalled();
    });

    it('should execute only the first argument', () => {
      const firstArg = jest.fn(() => false);
      const secondArg = jest.fn(() => false);
      const executor = and(firstArg, secondArg);
      executor({});

      expect(firstArg).toHaveBeenCalled();
      expect(secondArg).not.toHaveBeenCalled();
    });
  });

  describe('Or', () => {
    it('should return true', () => {
      const executor = or(firstProp, secondProp);
      expect(executor({ first: true, second: false })).toBe(true);
      expect(executor({ first: false, second: true })).toBe(true);
      expect(executor({ first: true, second: true })).toBe(true);
    });

    it('should return false', () => {
      const executor = or(firstProp, secondProp);
      expect(executor({ first: false, second: false })).toBe(false);
    });

    it('should return truthy argument', () => {
      const executor = or(firstProp, secondProp);
      expect(executor({ first: true, second: false })).toBe(true);
      expect(executor({ first: 10, second: false })).toBe(10);
      expect(executor({ first: false, second: ['value1', 'value2'] })).toEqual(['value1', 'value2']);
      expect(executor({ second: true })).toBe(true);
    });

    it('should execute both arguments', () => {
      const firstArg = jest.fn(() => false);
      const secondArg = jest.fn(() => true);
      const executor = or(firstArg, secondArg);
      executor({});

      expect(firstArg).toHaveBeenCalled();
      expect(secondArg).toHaveBeenCalled();
    });

    it('should execute only the first argument', () => {
      const firstArg = jest.fn(() => true);
      const secondArg = jest.fn(() => true);
      const executor = or(firstArg, secondArg);
      executor({});

      expect(firstArg).toHaveBeenCalled();
      expect(secondArg).not.toHaveBeenCalled();
    });
  });

  describe('Equals', () => {
    it('should return true', () => {
      const executor = equals(firstProp, secondProp);
      expect(executor({ first: 10, second: 10 })).toBe(true);
      expect(executor({ first: '10', second: '10' })).toBe(true);
      expect(executor({ first: true, second: true })).toBe(true);
      expect(executor({})).toBe(true);
    });

    it('should return false', () => {
      const executor = equals(firstProp, secondProp);
      expect(executor({ first: 10, second: '10' })).toBe(false);
      expect(executor({ first: false, second: true })).toBe(false);
      expect(executor({ first: false, second: undefined })).toBe(false);
      expect(executor({ first: false, second: 0 })).toBe(false);
    });
  });

  describe('Not Equals', () => {
    it('should return true', () => {
      const executor = nonEquals(firstProp, secondProp);
      expect(executor({ first: 10, second: '10' })).toBe(true);
      expect(executor({ first: false, second: true })).toBe(true);
      expect(executor({ first: false, second: undefined })).toBe(true);
      expect(executor({ first: false, second: 0 })).toBe(true);
    });

    it('should return false', () => {
      const executor = nonEquals(firstProp, secondProp);
      expect(executor({ first: 10, second: 10 })).toBe(false);
      expect(executor({ first: '10', second: '10' })).toBe(false);
      expect(executor({ first: true, second: true })).toBe(false);
      expect(executor({})).toBe(false);
    });
  });

  describe('Greater', () => {
    it('should return true', () => {
      const executor = greaterThan(firstProp, secondProp);
      expect(executor({ first: 10, second: 5 })).toBe(true);
      expect(executor({ first: -1, second: -12 })).toBe(true);
      expect(executor({ first: 'b', second: 'a' })).toBe(true);
      expect(executor({ first: 'a', second: 'A' })).toBe(true);
    });

    it('should return false', () => {
      const executor = greaterThan(firstProp, secondProp);
      expect(executor({ first: 10, second: 10 })).toBe(false);
      expect(executor({ first: -10, second: 10 })).toBe(false);
      expect(executor({ first: 'a', second: 'b' })).toBe(false);
      expect(executor({})).toBe(false);
    });
  });

  describe('Greater or Equals', () => {
    it('should return true', () => {
      const executor = greaterOrEqualsThan(firstProp, secondProp);
      expect(executor({ first: 10, second: 10 })).toBe(true);
      expect(executor({ first: 10, second: 5 })).toBe(true);
      expect(executor({ first: -1, second: -12 })).toBe(true);
      expect(executor({ first: 'b', second: 'a' })).toBe(true);
      expect(executor({ first: 'a', second: 'A' })).toBe(true);
    });

    it('should return false', () => {
      const executor = greaterOrEqualsThan(firstProp, secondProp);
      expect(executor({ first: -10, second: 10 })).toBe(false);
      expect(executor({ first: 'a', second: 'b' })).toBe(false);
      expect(executor({})).toBe(false);
    });
  });

  describe('Less', () => {
    it('should return true', () => {
      const executor = lessThan(firstProp, secondProp);
      expect(executor({ first: 5, second: 6 })).toBe(true);
      expect(executor({ first: -2, second: 0 })).toBe(true);
      expect(executor({ first: 'a', second: 'b' })).toBe(true);
      expect(executor({ first: 'A', second: 'a' })).toBe(true);
    });

    it('should return false', () => {
      const executor = lessThan(firstProp, secondProp);
      expect(executor({ first: 10, second: 10 })).toBe(false);
      expect(executor({ first: 10, second: -10 })).toBe(false);
      expect(executor({ first: 'b', second: 'a' })).toBe(false);
      expect(executor({})).toBe(false);
    });
  });

  describe('Less or Equals', () => {
    it('should return true', () => {
      const executor = lessOrEqualsThan(firstProp, secondProp);
      expect(executor({ first: 10, second: 10 })).toBe(true);
      expect(executor({ first: 5, second: 10 })).toBe(true);
      expect(executor({ first: -1, second: 0 })).toBe(true);
      expect(executor({ first: 'a', second: 'b' })).toBe(true);
      expect(executor({ first: 'A', second: 'a' })).toBe(true);
    });

    it('should return false', () => {
      const executor = lessOrEqualsThan(firstProp, secondProp);
      expect(executor({ first: 10, second: -10 })).toBe(false);
      expect(executor({ first: 'b', second: 'a' })).toBe(false);
      expect(executor({})).toBe(false);
    });
  });
});
