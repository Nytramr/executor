import { Engine } from '../src/expression/engine';

describe('Engine', () => {
  describe('Getter and setter', () => {
    it('should set and get a value', () => {
      const engine = new Engine();

      const setExecutor = engine.compile('SET(CT("name"), CT("John"))');
      const getExecutor = engine.compile('GET(CT("name"))');

      setExecutor({});
      expect(getExecutor({})).toEqual('John');
    });

    it('should set a value from the context', () => {
      const engine = new Engine();

      const setExecutor = engine.compile('SET(CT("name"), PP("name"))');
      const getExecutor = engine.compile('GET(CT("name"))');

      setExecutor({ name: 'John' });
      expect(getExecutor({})).toEqual('John');
    });

    it('should set a value, taking the name from the context', () => {
      const engine = new Engine();

      const setExecutor = engine.compile('SET(PP("valueName"), CT("John"))');
      const getExecutor = engine.compile('GET(PP("valueName"))');

      setExecutor({ valueName: 'name' });
      expect(getExecutor({ valueName: 'name' })).toEqual('John');
    });
  });

  describe('Compiler and executors', () => {
    const engine = new Engine();
    describe('Empty', () => {
      it('should return undefined', () => {
        const executor = engine.compile('');

        expect(executor({})).toBeUndefined();
      });
    });

    describe('Self', () => {
      it('should return the entire context', () => {
        const executor = engine.compile('SL()');

        expect(executor({})).toEqual({});
        expect(executor({ name: 'John' })).toEqual({ name: 'John' });
      });

      it('should return the given property of the context', () => {
        const executor = engine.compile('SL(name)');

        expect(executor({})).toBeUndefined();
        expect(executor({ name: 'John' })).toEqual('John');
        expect(executor({ name: 'Paul' })).toEqual('Paul');
      });

      it('should return the given complex property of the context', () => {
        const executor = engine.compile('SL(body.name)');

        expect(executor({})).toBeUndefined();
        expect(executor({ body: { name: 'John' } })).toEqual('John');
        expect(executor({ body: { name: 'Paul' } })).toEqual('Paul');
      });
    });

    describe('Constant', () => {
      describe('string using CT', () => {
        it('should return a constant, with the given double quotes string', () => {
          const executor = engine.compile('CT("someText")');

          expect(executor({})).toEqual('someText');
        });

        it('should return a constant, with the given single quotes string', () => {
          const executor = engine.compile("CT('someText')");

          expect(executor({})).toEqual('someText');
        });

        it('should return a constant, with an empty string', () => {
          const executor = engine.compile('CT("")');

          expect(executor({})).toEqual('');
        });
      });

      describe('string', () => {
        it('should return a constant, with the given double quotes string', () => {
          const executor = engine.compile('"someText"');

          expect(executor({})).toEqual('someText');
        });

        it('should return a constant, with the given single quotes string', () => {
          const executor = engine.compile("'someText'");

          expect(executor({})).toEqual('someText');
        });

        it('should return a constant, with an empty string', () => {
          const executor = engine.compile('""');

          expect(executor({})).toEqual('');
        });
      });

      describe('numbers', () => {
        it('should return a constant, with the given positive number', () => {
          const executor = engine.compile('CT(150)');

          expect(executor({})).toEqual(150);
        });

        it('should return a constant, with 0', () => {
          const executor = engine.compile('CT(0)');

          expect(executor({})).toEqual(0);
        });

        it('should return a constant, with the given negative number', () => {
          const executor = engine.compile('CT(-67)');

          expect(executor({})).toEqual(-67);
        });

        it('should return a constant, with the given float number', () => {
          const executor = engine.compile('CT(0.890)');

          expect(executor({})).toEqual(0.89);
        });
      });

      describe('boolean', () => {
        it('should return a constant, with a true value', () => {
          const executor = engine.compile('CT(true)');

          expect(executor({})).toEqual(true);
        });

        it('should return a constant, with a false value', () => {
          const executor = engine.compile('CT(false)');

          expect(executor({})).toEqual(false);
        });
      });
    });

    describe('Property', () => {
      it('should return the property of the given object', () => {
        const executor = engine.compile('PP(name)');

        expect(executor({ name: 'name' })).toBe('name');
        expect(executor({ name: 'another name' })).toBe('another name');
      });

      it('should return the index of the given array', () => {
        const executor = engine.compile('PP(1)');

        expect(executor(['cero', 'uno', 'dos'])).toBe('uno');
      });

      it('should return the falsy value', () => {
        const executor = engine.compile('PP(name)');

        expect(executor(0)).toBe(0);
        expect(executor(undefined)).toBe(undefined);
        expect(executor(null)).toBe(null);
        expect(executor('')).toBe('');
        expect(executor(false)).toBe(false);
      });

      it('should return the value of a complex property path of the given object', () => {
        const executor = engine.compile('PP(body.name)');

        expect(executor({ body: { name: 'name' } })).toBe('name');
        expect(executor({ body: { name: 'another name' } })).toBe('another name');
        expect(executor({})).toBeUndefined();
      });

      it('should return undefined', () => {
        const executor = engine.compile('PP(body.name)');

        expect(executor({ body: { name: undefined } })).toBeUndefined();
        expect(executor({ body: {} })).toBeUndefined();
        expect(executor({ body: undefined })).toBeUndefined();
        expect(executor({})).toBeUndefined();
      });

      describe('using properties as indexes', () => {
        it('should return the value of the key obtained by a simple property', () => {
          const executor = engine.compile('PP([key])');

          expect(executor({ value: 'name', key: 'value' })).toBe('name');
          expect(executor({ 'another.value': 'another name', key: 'another.value' })).toBe('another name');
          expect(executor({ value: 'name', keyNotFound: 'value' })).toBeUndefined();
          expect(executor({})).toBeUndefined();

          const executor2 = engine.compile('PP(PP(key))');

          expect(executor2({ value: 'name', key: 'value' })).toBe('name');
          expect(executor2({ 'another.value': 'another name', key: 'another.value' })).toBe('another name');
          expect(executor2({ value: 'name', keyNotFound: 'value' })).toBeUndefined();
          expect(executor2({})).toBeUndefined();
        });

        it('should return the value of the key obtained by a complex property', () => {
          const executor = engine.compile('PP([key.sub-key])');

          expect(executor({ value: 'name', key: { 'sub-key': 'value' } })).toBe('name');
          expect(executor({ 'another value': 'another name', key: { 'sub-key': 'another value' } })).toBe(
            'another name',
          );
          expect(executor({ value: 'name', keyNotFound: { 'sub-key': 'value' } })).toBeUndefined();
          expect(executor({ value: 'name', key: { 'sub-keyNotFound': 'value' } })).toBeUndefined();
          expect(executor({})).toBeUndefined();

          const executor2 = engine.compile('PP(PP(key.sub-key))');

          expect(executor2({ value: 'name', key: { 'sub-key': 'value' } })).toBe('name');
          expect(executor2({ 'another value': 'another name', key: { 'sub-key': 'another value' } })).toBe(
            'another name',
          );
          expect(executor2({ value: 'name', keyNotFound: { 'sub-key': 'value' } })).toBeUndefined();
          expect(executor2({ value: 'name', key: { 'sub-keyNotFound': 'value' } })).toBeUndefined();
          expect(executor2({})).toBeUndefined();
        });

        it('should return the value of the key obtained by a simple property once in a dipper property context', () => {
          const executor = engine.compile('PP(context[key])');

          expect(executor({ context: { value: 'name' }, key: 'value' })).toBe('name');
          expect(executor({ context: { 'another.value': 'another name' }, key: 'another.value' })).toBe('another name');
          expect(executor({ context: { value: 'name' }, keyNotFound: 'value' })).toBeUndefined();
          expect(executor({})).toBeUndefined();
        });

        it('should return the value of the key obtained by a double lookup property access', () => {
          const executor = engine.compile('PP(context[keys[key]].a)');

          expect(executor({ context: { value: { a: 'name' } }, keys: { a: 'value' }, key: 'a' })).toBe('name');
          expect(
            executor({
              context: { 'another.value': { a: 'another name' } },
              keys: { key: 'another.value' },
              key: 'key',
            }),
          ).toBe('another name');
          expect(executor({ context: { value: 'name' }, keys: { keyNotFound: 'value' } })).toBeUndefined();
          expect(executor({})).toBeUndefined();
        });
      });
    });

    describe('Not', () => {
      it('should return true', () => {
        const executor = engine.compile('NT(PP(first))');

        expect(executor({ first: false })).toBe(true);
        expect(executor({ first: 0 })).toBe(true);
        expect(executor({ first: null })).toBe(true);
        expect(executor({})).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('NT(PP(first))');

        expect(executor({ first: true })).toBe(false);
        expect(executor({ first: 1 })).toBe(false);
        expect(executor({ first: {} })).toBe(false);
      });
    });

    describe('And', () => {
      it('should return true', () => {
        const executor = engine.compile('AN(PP(first), PP(second))');

        expect(executor({ first: true, second: true })).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('AN(PP(first), PP(second))');

        expect(executor({ first: true, second: false })).toBe(false);
        expect(executor({ first: false, second: true })).toBe(false);
        expect(executor({ first: false, second: false })).toBe(false);
      });

      it('should returns second argument', () => {
        const executor = engine.compile('AN(PP(first), PP(second))');

        expect(executor({ first: true, second: true })).toBe(true);
        expect(executor({ first: 10, second: true })).toBe(true);
        expect(executor({ first: true, second: 10 })).toBe(10);
      });

      it('should return falsy argument', () => {
        const executor = engine.compile('AN(PP(first), PP(second))');

        expect(executor({ first: true, second: false })).toBe(false);
        expect(executor({ first: 0, second: false })).toBe(0);
        expect(executor({ first: null, second: false })).toBe(null);
        expect(executor({ first: '', second: false })).toBe('');
        expect(executor({ second: true })).toBeUndefined();
      });

      it('should return false using 2 constants', () => {
        const executor = engine.compile('AN(true false)');
        expect(executor({})).toBe(false);

        const executor2 = engine.compile('AN(true,false)');
        expect(executor2({})).toBe(false);
      });
    });

    describe('Or', () => {
      it('should return true', () => {
        const executor = engine.compile('OR(PP(first), PP(second))');

        expect(executor({ first: true, second: false })).toBe(true);
        expect(executor({ first: false, second: true })).toBe(true);
        expect(executor({ first: true, second: true })).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('OR(PP(first), PP(second))');

        expect(executor({ first: false, second: false })).toBe(false);
      });

      it('should return truthy argument', () => {
        const executor = engine.compile('OR(PP(first), PP(second))');

        expect(executor({ first: true, second: false })).toBe(true);
        expect(executor({ first: 10, second: false })).toBe(10);
        expect(executor({ first: false, second: ['value1', 'value2'] })).toEqual(['value1', 'value2']);
        expect(executor({ second: true })).toBe(true);
      });
    });

    describe('Equals', () => {
      it('should return true', () => {
        const executor = engine.compile('EQ(PP(first), PP(second))');

        expect(executor({ first: 10, second: 10 })).toBe(true);
        expect(executor({ first: '10', second: '10' })).toBe(true);
        expect(executor({ first: true, second: true })).toBe(true);
        expect(executor({})).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('EQ(PP(first), PP(second))');

        expect(executor({ first: 10, second: '10' })).toBe(false);
        expect(executor({ first: false, second: true })).toBe(false);
        expect(executor({ first: false, second: undefined })).toBe(false);
        expect(executor({ first: false, second: 0 })).toBe(false);
      });
    });

    describe('Not Equals', () => {
      it('should return true', () => {
        const executor = engine.compile('NE(PP(first), PP(second))');
        expect(executor({ first: 10, second: '10' })).toBe(true);
        expect(executor({ first: false, second: true })).toBe(true);
        expect(executor({ first: false, second: undefined })).toBe(true);
        expect(executor({ first: false, second: 0 })).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('NE(PP(first), PP(second))');
        expect(executor({ first: 10, second: 10 })).toBe(false);
        expect(executor({ first: '10', second: '10' })).toBe(false);
        expect(executor({ first: true, second: true })).toBe(false);
        expect(executor({})).toBe(false);
      });
    });

    describe('Greater', () => {
      it('should return true', () => {
        const executor = engine.compile('GT(PP(first), PP(second))');

        expect(executor({ first: 10, second: 5 })).toBe(true);
        expect(executor({ first: -1, second: -12 })).toBe(true);
        expect(executor({ first: 'b', second: 'a' })).toBe(true);
        expect(executor({ first: 'a', second: 'A' })).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('GT(PP(first), PP(second))');

        expect(executor({ first: 10, second: 10 })).toBe(false);
        expect(executor({ first: -10, second: 10 })).toBe(false);
        expect(executor({ first: 'a', second: 'b' })).toBe(false);
        expect(executor({})).toBe(false);
      });
    });

    describe('Greater or Equals', () => {
      it('should return true', () => {
        const executor = engine.compile('GE(PP(first), PP(second))');

        expect(executor({ first: 10, second: 10 })).toBe(true);
        expect(executor({ first: 10, second: 5 })).toBe(true);
        expect(executor({ first: -1, second: -12 })).toBe(true);
        expect(executor({ first: 'b', second: 'a' })).toBe(true);
        expect(executor({ first: 'a', second: 'A' })).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('GE(PP(first), PP(second))');

        expect(executor({ first: -10, second: 10 })).toBe(false);
        expect(executor({ first: 'a', second: 'b' })).toBe(false);
        expect(executor({})).toBe(false);
      });
    });

    describe('Less', () => {
      it('should return true', () => {
        const executor = engine.compile('LT(PP(first), PP(second))');
        expect(executor({ first: 5, second: 6 })).toBe(true);
        expect(executor({ first: -2, second: 0 })).toBe(true);
        expect(executor({ first: 'a', second: 'b' })).toBe(true);
        expect(executor({ first: 'A', second: 'a' })).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('LT(PP(first), PP(second))');
        expect(executor({ first: 10, second: 10 })).toBe(false);
        expect(executor({ first: 10, second: -10 })).toBe(false);
        expect(executor({ first: 'b', second: 'a' })).toBe(false);
        expect(executor({})).toBe(false);
      });
    });

    describe('Less or Equals', () => {
      it('should return true', () => {
        const executor = engine.compile('LE(PP(first), PP(second))');
        expect(executor({ first: 10, second: 10 })).toBe(true);
        expect(executor({ first: 5, second: 10 })).toBe(true);
        expect(executor({ first: -1, second: 0 })).toBe(true);
        expect(executor({ first: 'a', second: 'b' })).toBe(true);
        expect(executor({ first: 'A', second: 'a' })).toBe(true);
      });

      it('should return false', () => {
        const executor = engine.compile('LE(PP(first), PP(second))');
        expect(executor({ first: 10, second: -10 })).toBe(false);
        expect(executor({ first: 'b', second: 'a' })).toBe(false);
        expect(executor({})).toBe(false);
      });
    });

    describe('Filter', () => {
      beforeAll(() => {
        engine.define('filter', (arrayGetter, predicate) => (context, subContext) => {
          const array = arrayGetter(context);
          if (Array.isArray(array)) return array.filter((element) => predicate(context, subContext, element));
          return []; // you may choice to return undefined instead.
        });
      });

      it('should return every number grater or equals to 3', () => {
        const executor = engine.compile('FLT(SL(), GE(SL(), 3)');

        expect(executor([1, 2, 3, 4, 5])).toEqual([3, 4, 5]);
      });

      it('should return every element of the array retrieved by the property', () => {
        const executor = engine.compile('FLT(PP("myArray"), true)');

        expect(executor({ myArray: [1, 2, 3, 4, 5] })).toEqual([1, 2, 3, 4, 5]);
      });

      it('should return every "The Beatles" element of the given array, using properties in the predicate', () => {
        const executor = engine.compile('FLT(PP("myArray"), EQ(SL(PP("band")), PP("myBand")))');

        expect(
          executor({
            myArray: [
              { name: 'John', band: 'The Beatles' },
              { name: 'Paul', band: 'The Beatles' },
              { name: 'Ringo', band: 'The Beatles' },
              { name: 'George', band: 'The Beatles' },
              { name: 'Yoko', band: 'None' },
            ],
            myBand: 'The Beatles',
          }),
        ).toEqual([
          { name: 'John', band: 'The Beatles' },
          { name: 'Paul', band: 'The Beatles' },
          { name: 'Ringo', band: 'The Beatles' },
          { name: 'George', band: 'The Beatles' },
        ]);
      });

      it('should return empty when the the given array is not an array', () => {
        const executor = engine.compile('FLT(SL(), GE(SL(), CT(3))');

        expect(executor()).toEqual([]);
        expect(executor('string')).toEqual([]);
        expect(executor({})).toEqual([]);
      });
    });

    describe('Find', () => {
      it('should return the first number grater than 3', () => {
        const executor = engine.compile('FND(SL(), GE(SL(), CT(3))');

        expect(executor([1, 2, 3, 4, 5])).toEqual(3);
      });

      it('should return the element for the given name, of the given array, using properties in the predicate', () => {
        const executor = engine.compile('FND(PP("myArray"), EQ(SL(PP("name")), PP("myName")))');

        expect(
          executor({
            myArray: [
              { name: 'John', band: 'The Beatles' },
              { name: 'Paul', band: 'The Beatles' },
              { name: 'Ringo', band: 'The Beatles' },
              { name: 'George', band: 'The Beatles' },
              { name: 'Yoko', band: 'None' },
            ],
            myName: 'Ringo',
          }),
        ).toEqual({ name: 'Ringo', band: 'The Beatles' });
      });

      it('should return empty when the the given array is not an array', () => {
        const executor = engine.compile('FND(SL(), GE(SL(), CT(3))');

        expect(executor()).toBeUndefined();
        expect(executor('string')).toBeUndefined();
        expect(executor({})).toBeUndefined();
      });
    });
  });
});
