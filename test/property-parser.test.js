import * as executers from '../src/expression/executers';
import { propertyParser } from '../src/expression/property-parser';

describe('Path Parser', () => {
  const constant = jest.spyOn(executers, 'constant');
  const constant1 = jest.fn();
  const constant2 = jest.fn();
  const constant3 = jest.fn();
  const property = jest.spyOn(executers, 'property');
  const property1 = jest.fn();
  const property2 = jest.fn();
  const property3 = jest.fn();
  const property4 = jest.fn();

  beforeEach(() => {
    constant.mockReturnValueOnce(constant1);
    constant.mockReturnValueOnce(constant2);
    constant.mockReturnValueOnce(constant3);
    property.mockReturnValueOnce(property1);
    property.mockReturnValueOnce(property2);
    property.mockReturnValueOnce(property3);
    property.mockReturnValueOnce(property4);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should compile a simple property', () => {
    const result = propertyParser([, 'obj)'], []);

    expect(constant).toHaveBeenCalledWith('obj');
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual({
      accum: [property1],
      text: '',
    });
  });

  it('should compile a multiple parts property', () => {
    const result = propertyParser([, 'obj.prop1)'], []);

    expect(constant).toHaveBeenNthCalledWith(1, 'obj');
    expect(constant).toHaveBeenNthCalledWith(2, 'prop1');
    expect(property).toHaveBeenNthCalledWith(1, constant1);
    expect(property).toHaveBeenNthCalledWith(2, constant2, property1);
    expect(result).toEqual({
      accum: [property2],
      text: '',
    });
  });

  it('should compile a property between quotes, considering all inside it as a single property name', () => {
    const result = propertyParser([, "'prop1.name')"], []);

    expect(constant).toHaveBeenCalledWith('prop1.name');
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual({
      accum: [property1],
      text: '',
    });
  });

  it('should compile a number property', () => {
    const result = propertyParser([, '2)'], []);

    expect(constant).toHaveBeenCalledWith('2');
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual({
      accum: [property1],
      text: '',
    });
  });

  it('should return any extra text after the match', () => {
    const result = propertyParser([, "'prop1.name') and more text after the final parenthesis"], []);

    expect(result.text).toEqual('and more text after the final parenthesis');
  });

  describe('between square brackets', () => {
    it('should compile a constant between quotes, considering all inside it as a single property name', () => {
      const result = propertyParser([, "obj['prop1.name'])"], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, 'prop1.name');
      expect(property).toHaveBeenNthCalledWith(1, constant1);
      expect(property).toHaveBeenNthCalledWith(2, constant2, property1);
      expect(result).toEqual({
        accum: [property2],
        text: '',
      });
    });

    it('should compile a constant, literally', () => {
      const result = propertyParser([, "obj[CT('prop1.name')])"], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, 'prop1.name');
      expect(property).toHaveBeenNthCalledWith(1, constant1);
      expect(property).toHaveBeenNthCalledWith(2, constant2, property1);
      expect(result).toEqual({
        accum: [property2],
        text: '',
      });
    });

    it('should compile a number constant', () => {
      const result = propertyParser([, 'obj[2])'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, '2');
      expect(property).toHaveBeenNthCalledWith(1, constant1);
      expect(property).toHaveBeenNthCalledWith(2, constant2, property1);
      expect(result).toEqual({
        accum: [property2],
        text: '',
      });
    });

    describe('with a property call inside', () => {
      it('should compile a new property, and use it to retrieve the property name', () => {
        const result = propertyParser([, 'obj[PP(value)])'], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
        expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, constant1); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(3, property1, property2);
        expect(result).toEqual({
          accum: [property3],
          text: '',
        });
      });

      it('should compile a new complex property, and use it to retrieve the property name', () => {
        const result = propertyParser([, 'obj[PP(value.prop)])'], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
        expect(constant).toHaveBeenNthCalledWith(3, 'prop'); // returns constant3
        expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, constant3, property1); // we create a property using the 'prop' constant and the value sub-context
        expect(property).toHaveBeenNthCalledWith(3, constant1); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(4, property2, property3);
        expect(result).toEqual({
          accum: [property4],
          text: '',
        });
      });

      it('should compile a new property between quotes, and use it to retrieve the property name', () => {
        const result = propertyParser([, "obj[PP('value.prop')])"], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value.prop'); // returns constant2
        expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, constant1); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(3, property1, property2);
        expect(result).toEqual({
          accum: [property3],
          text: '',
        });
      });
    });

    it('should compile a non quoted text as a new property and use it to retrieve the property name', () => {
      const result = propertyParser([, 'obj[value])'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, constant1); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(3, property1, property2);
      expect(result).toEqual({
        accum: [property3],
        text: '',
      });
    });

    it('should compile a non quoted text as a new complex property and use it to retrieve the property name', () => {
      const result = propertyParser([, 'obj[value.prop])'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(constant).toHaveBeenNthCalledWith(3, 'prop'); // returns constant3
      expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, constant3, property1); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(3, constant1); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(4, property2, property3);
      expect(result).toEqual({
        accum: [property4],
        text: '',
      });
    });
  });
});
