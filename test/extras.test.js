import { Engine } from '../src/expression/engine';

describe('Extras, tests common functions not included in the current build', () => {
  describe('Join', () => {
    const engine = new Engine();
    beforeAll(() => {
      engine.define('JN', (arrayGetter, string) => (context, topContext=context) => {
        const array = arrayGetter(context, topContext);
        if (Array.isArray(array)) return array.join(string(context, topContext));
        return ''; // you may choice to return undefined instead.
      });
    });

    it('should return the join of the given array', () => {
      const executer = engine.compile('JN(TOP(), ",")');

      expect(executer([1, 2, 3, 4, 5])).toEqual('1,2,3,4,5');
      expect(executer(['1', '2', '3', '4', '5'])).toEqual('1,2,3,4,5');
    });

    it('should return the join of the array retrieved by the property', () => {
      const executer = engine.compile('JN(PP("myArray"), ",")');

      expect(executer({ myArray: [1, 2, 3, 4, 5] })).toEqual('1,2,3,4,5');
      expect(executer({ myArray: ['1', '2', '3', '4', '5'] })).toEqual('1,2,3,4,5');
    });

    it('should return the join of the given array, using the string retrieved by a property', () => {
      const executer = engine.compile('JN(PP("myArray"), PP("myString"))');

      expect(executer({ myArray: [1, 2, 3, 4, 5], myString: '.' })).toEqual('1.2.3.4.5');
      expect(executer({ myArray: ['1', '2', '3', '4', '5'], myString: ' ,' })).toEqual('1 ,2 ,3 ,4 ,5');
    });

    it('should return empty when the the given array is not an array', () => {
      const executer = engine.compile('JN(TOP(), CT(","))');

      expect(executer()).toEqual('');
      expect(executer('string')).toEqual('');
      expect(executer({})).toEqual('');
    });
  });

  describe('Filter', () => {
    const engine = new Engine();
    beforeAll(() => {
      engine.define('filter', (arrayGetter, predicate) => (context, topContext=context) => {
        const array = arrayGetter(context, topContext);
        if (Array.isArray(array)) return array.filter((element) => predicate(element, topContext));
        return []; // you may choice to return undefined instead.
      });
    });

    it('should return every number grater or equals to 3', () => {
      const executer = engine.compile('filter(TOP(), GE(SL(), 3)');

      expect(executer([1, 2, 3, 4, 5])).toEqual([3, 4, 5]);
    });

    it('should return every element of the array retrieved by the property', () => {
      const executer = engine.compile('filter(PP("myArray"), true)');

      expect(executer({ myArray: [1, 2, 3, 4, 5] })).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return every "The Beatles" element of the given array, using properties in the predicate', () => {
      const executer = engine.compile('filter(PP("myArray"), EQ(PP("band"), TOP(PP("myBand"))))');

      expect(
        executer({
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
      const executer = engine.compile('filter(TOP(), GE(SL(), CT(3))');

      expect(executer()).toEqual([]);
      expect(executer('string')).toEqual([]);
      expect(executer({})).toEqual([]);
    });
  });

  describe('Find', () => {
    const engine = new Engine();
    beforeAll(() => {
      engine.define('find', (arrayGetter, predicate) => (context, topContext=context) => {
        const array = arrayGetter(context, topContext);
        if (Array.isArray(array)) return array.find((element) => predicate(element, topContext));
        return undefined;
      });
    });

    it('should return the first number grater than 3', () => {
      const executer = engine.compile('find(TOP(), GE(SL(), CT(3))');

      expect(executer([1, 2, 3, 4, 5])).toEqual(3);
    });

    it('should return the element for the given name, of the given array, using properties in the predicate', () => {
      const executer = engine.compile('find(PP("myArray"), EQ(PP("name"), TOP(PP("myName"))))');

      expect(
        executer({
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
      const executer = engine.compile('find(TOP(), GE(SL(), CT(3))');

      expect(executer()).toBeUndefined();
      expect(executer('string')).toBeUndefined();
      expect(executer({})).toBeUndefined();
    });
  });
});
