import { Engine } from '../src/expression/engine';

describe('Extras, tests common functions not included in the current build', () => {
  describe('Join', () => {
    const engine = new Engine();
    beforeAll(() => {
      engine.define('JN', (arrayGetter, string) => (context) => {
        const array = arrayGetter(context);
        if (Array.isArray(array)) return array.join(string(context));
        return ''; // you may choice to return undefined instead.
      });
    });

    it('should return the join of the given array', () => {
      const executor = engine.compile('JN(SL(), ",")');

      expect(executor([1, 2, 3, 4, 5])).toEqual('1,2,3,4,5');
      expect(executor(['1', '2', '3', '4', '5'])).toEqual('1,2,3,4,5');
    });

    it('should return the join of the array retrieved by the property', () => {
      const executor = engine.compile('JN(PP("myArray"), ",")');

      expect(executor({ myArray: [1, 2, 3, 4, 5] })).toEqual('1,2,3,4,5');
      expect(executor({ myArray: ['1', '2', '3', '4', '5'] })).toEqual('1,2,3,4,5');
    });

    it('should return the join of the given array, using the string retrieved by a property', () => {
      const executor = engine.compile('JN(PP("myArray"), PP("myString"))');

      expect(executor({ myArray: [1, 2, 3, 4, 5], myString: '.' })).toEqual('1.2.3.4.5');
      expect(executor({ myArray: ['1', '2', '3', '4', '5'], myString: ' ,' })).toEqual('1 ,2 ,3 ,4 ,5');
    });

    it('should return empty when the the given array is not an array', () => {
      const executor = engine.compile('JN(SL(), CT(","))');

      expect(executor()).toEqual('');
      expect(executor('string')).toEqual('');
      expect(executor({})).toEqual('');
    });
  });

  describe('Filter', () => {
    const engine = new Engine();
    beforeAll(() => {
      engine.define('filter', (arrayGetter, predicate) => (context, subContext) => {
        const array = arrayGetter(context);
        if (Array.isArray(array)) return array.filter((element) => predicate(context, subContext, element));
        return []; // you may choice to return undefined instead.
      });
    });

    it('should return every number grater or equals to 3', () => {
      const executor = engine.compile('filter(SL(), GE(SL(), 3)');

      expect(executor([1, 2, 3, 4, 5])).toEqual([3, 4, 5]);
    });

    it('should return every element of the array retrieved by the property', () => {
      const executor = engine.compile('filter(PP("myArray"), true)');

      expect(executor({ myArray: [1, 2, 3, 4, 5] })).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return every "The Beatles" element of the given array, using properties in the predicate', () => {
      const executor = engine.compile('filter(PP("myArray"), EQ(SL(PP("band")), PP("myBand")))');

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
      const executor = engine.compile('filter(SL(), GE(SL(), CT(3))');

      expect(executor()).toEqual([]);
      expect(executor('string')).toEqual([]);
      expect(executor({})).toEqual([]);
    });
  });

  describe('Find', () => {
    const engine = new Engine();
    beforeAll(() => {
      engine.define('find', (arrayGetter, predicate) => (context, subContext) => {
        const array = arrayGetter(context);
        if (Array.isArray(array)) return array.find((element) => predicate(context, subContext, element));
        return undefined;
      });
    });

    it('should return the first number grater than 3', () => {
      const executor = engine.compile('find(SL(), GE(SL(), CT(3))');

      expect(executor([1, 2, 3, 4, 5])).toEqual(3);
    });

    it('should return the element for the given name, of the given array, using properties in the predicate', () => {
      const executor = engine.compile('find(PP("myArray"), EQ(SL(PP("name")), PP("myName")))');

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
      const executor = engine.compile('find(SL(), GE(SL(), CT(3))');

      expect(executor()).toBeUndefined();
      expect(executor('string')).toBeUndefined();
      expect(executor({})).toBeUndefined();
    });
  });
});
