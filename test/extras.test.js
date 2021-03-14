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
});
