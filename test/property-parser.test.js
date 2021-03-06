import * as executers from '../src/expression/executers';
import { propertyParser, propertyFunctionParser } from '../src/expression/property-parser';

describe('propertyFunctionParser', () => {
  const constant = jest.spyOn(executers, 'constant');
  const constant1 = jest.fn();
  const constant2 = jest.fn();
  const constant3 = jest.fn();
  const constant4 = jest.fn();
  const property = jest.spyOn(executers, 'property');
  const property1 = jest.fn();
  const property2 = jest.fn();
  const property3 = jest.fn();
  const property4 = jest.fn();
  const property5 = jest.fn();

  beforeEach(() => {
    constant.mockReturnValueOnce(constant1);
    constant.mockReturnValueOnce(constant2);
    constant.mockReturnValueOnce(constant3);
    constant.mockReturnValueOnce(constant4);
    property.mockReturnValueOnce(property1);
    property.mockReturnValueOnce(property2);
    property.mockReturnValueOnce(property3);
    property.mockReturnValueOnce(property4);
    property.mockReturnValueOnce(property5);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should compile a simple property', () => {
    const result = propertyFunctionParser([, 'obj)'], []);

    expect(constant).toHaveBeenCalledWith('obj');
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual([[property1], '']);
  });

  it('should compile a multiple parts property', () => {
    const result = propertyFunctionParser([, 'obj.prop1)'], []);

    expect(constant).toHaveBeenNthCalledWith(1, 'obj');
    expect(constant).toHaveBeenNthCalledWith(2, 'prop1');
    expect(property).toHaveBeenNthCalledWith(1, constant2);
    expect(property).toHaveBeenNthCalledWith(2, constant1, property1);
    expect(result).toEqual([[property2], '']);
  });

  it('should compile a property between quotes, considering all inside it as a single property name', () => {
    const result = propertyFunctionParser([, "'prop1.name')"], []);

    expect(constant).toHaveBeenCalledWith('prop1.name');
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual([[property1], '']);
  });

  it('should compile a number property', () => {
    const result = propertyFunctionParser([, '2)'], []);

    expect(constant).toHaveBeenCalledWith(2);
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual([[property1], '']);
  });

  it('should return any extra text after the match', () => {
    const [_, txt] = propertyFunctionParser([, "'prop1.name'), and more text after the final parenthesis"], []);

    expect(txt).toEqual(', and more text after the final parenthesis');
  });

  describe('between square brackets', () => {
    it('should compile a constant between quotes, considering all inside it as a single property name', () => {
      const result = propertyFunctionParser([, "obj['prop1.name'])"], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, 'prop1.name');
      expect(property).toHaveBeenNthCalledWith(1, constant2);
      expect(property).toHaveBeenNthCalledWith(2, constant1, property1);
      expect(result).toEqual([[property2], '']);
    });

    it('should compile a constant, literally', () => {
      const result = propertyFunctionParser([, "obj[CT('prop1.name')])"], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, 'prop1.name');
      expect(property).toHaveBeenNthCalledWith(1, constant2);
      expect(property).toHaveBeenNthCalledWith(2, constant1, property1);
      expect(result).toEqual([[property2], '']);
    });

    it('should compile a number constant', () => {
      const result = propertyFunctionParser([, 'obj[2])'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, 2);
      expect(property).toHaveBeenNthCalledWith(1, constant2);
      expect(property).toHaveBeenNthCalledWith(2, constant1, property1);
      expect(result).toEqual([[property2], '']);
    });

    describe('with a property call inside', () => {
      it('should compile a new property, and use it to retrieve the property name', () => {
        const result = propertyFunctionParser([, 'obj[PP(value)])'], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
        expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, property1); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(3, constant1, property2);
        expect(result).toEqual([[property3], '']);
      });

      it('should compile a new complex property, and use it to retrieve the property name', () => {
        const result = propertyFunctionParser([, 'obj[PP(value.prop)])'], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
        expect(constant).toHaveBeenNthCalledWith(3, 'prop'); // returns constant3
        expect(property).toHaveBeenNthCalledWith(1, constant3); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, constant2, property1); // we create a property using the 'prop' constant and the value sub-context
        expect(property).toHaveBeenNthCalledWith(3, property2); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(4, constant1, property3);
        expect(result).toEqual([[property4], '']);
      });

      it('should compile a new complex property, and use it to retrieve the property name', () => {
        const result = propertyFunctionParser([, 'obj[PP(value.prop)])'], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
        expect(constant).toHaveBeenNthCalledWith(3, 'prop'); // returns constant3
        expect(property).toHaveBeenNthCalledWith(1, constant3); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, constant2, property1); // we create a property using the 'prop' constant and the value sub-context
        expect(property).toHaveBeenNthCalledWith(3, property2); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(4, constant1, property3);
        expect(result).toEqual([[property4], '']);
      });

      it('should compile a new property between quotes, and use it to retrieve the property name', () => {
        const result = propertyFunctionParser([, "obj[PP('value.prop')])"], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value.prop'); // returns constant2
        expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, property1); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(3, constant1, property2);
        expect(result).toEqual([[property3], '']);
      });
    });

    it('should compile a non quoted text as a new property and use it to retrieve the property name', () => {
      const result = propertyFunctionParser([, 'obj[value])'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, property1); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(3, constant1, property2);
      expect(result).toEqual([[property3], '']);
    });

    it('should compile a non quoted text as a new complex property and use it to retrieve the property name', () => {
      const result = propertyFunctionParser([, 'obj[value.prop])'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(constant).toHaveBeenNthCalledWith(3, 'prop'); // returns constant3
      expect(property).toHaveBeenNthCalledWith(1, constant3); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, constant2, property1); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(3, property2); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(4, constant1, property3);
      expect(result).toEqual([[property4], '']);
    });

    it('should compile a non quoted text with numbers as a new complex property and use it to retrieve the property name', () => {
      const result = propertyFunctionParser([, 'obj[value.4.prop])'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(constant).toHaveBeenNthCalledWith(3, 4); // returns constant3
      expect(constant).toHaveBeenNthCalledWith(4, 'prop'); // returns constant4
      expect(property).toHaveBeenNthCalledWith(1, constant4); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, constant3, property1); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(3, constant2, property2); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(4, property3); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(5, constant1, property4);
      expect(result).toEqual([[property5], '']);
    });
  });
});

describe('propertyParser', () => {
  const constant = jest.spyOn(executers, 'constant');
  const constant1 = jest.fn();
  const constant2 = jest.fn();
  const constant3 = jest.fn();
  const constant4 = jest.fn();
  const property = jest.spyOn(executers, 'property');
  const property1 = jest.fn();
  const property2 = jest.fn();
  const property3 = jest.fn();
  const property4 = jest.fn();
  const property5 = jest.fn();

  beforeEach(() => {
    constant.mockReturnValueOnce(constant1);
    constant.mockReturnValueOnce(constant2);
    constant.mockReturnValueOnce(constant3);
    constant.mockReturnValueOnce(constant4);
    property.mockReturnValueOnce(property1);
    property.mockReturnValueOnce(property2);
    property.mockReturnValueOnce(property3);
    property.mockReturnValueOnce(property4);
    property.mockReturnValueOnce(property5);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should compile a simple property', () => {
    const result = propertyParser([, 'obj'], []);

    expect(constant).toHaveBeenCalledWith('obj');
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual([[property1], '']);
  });

  it('should compile a multiple parts property', () => {
    const result = propertyParser([, 'obj.prop1'], []);

    expect(constant).toHaveBeenNthCalledWith(1, 'obj');
    expect(constant).toHaveBeenNthCalledWith(2, 'prop1');
    expect(property).toHaveBeenNthCalledWith(1, constant2);
    expect(property).toHaveBeenNthCalledWith(2, constant1, property1);
    expect(result).toEqual([[property2], '']);
  });

  it('should compile a property between quotes, considering all inside it as a single property name', () => {
    const result = propertyParser([, "'prop1.name'"], []);

    expect(constant).toHaveBeenCalledWith('prop1.name');
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual([[property1], '']);
  });

  it('should compile a number property', () => {
    const result = propertyParser([, '2'], []);

    expect(constant).toHaveBeenCalledWith(2);
    expect(property).toHaveBeenCalledWith(constant1);
    expect(result).toEqual([[property1], '']);
  });

  it('should return any extra text after the match', () => {
    const [_, txt] = propertyParser([, "'prop1.name', and more text after the final parenthesis"], []);

    expect(txt).toEqual(', and more text after the final parenthesis');
  });

  describe('between square brackets', () => {
    it('should compile a constant between quotes, considering all inside it as a single property name', () => {
      const result = propertyParser([, "obj['prop1.name']"], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, 'prop1.name');
      expect(property).toHaveBeenNthCalledWith(1, constant2);
      expect(property).toHaveBeenNthCalledWith(2, constant1, property1);
      expect(result).toEqual([[property2], '']);
    });

    it('should compile a constant, literally', () => {
      const result = propertyParser([, "obj[CT('prop1.name')]"], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, 'prop1.name');
      expect(property).toHaveBeenNthCalledWith(1, constant2);
      expect(property).toHaveBeenNthCalledWith(2, constant1, property1);
      expect(result).toEqual([[property2], '']);
    });

    it('should compile a number constant', () => {
      const result = propertyParser([, 'obj[2]'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj');
      expect(constant).toHaveBeenNthCalledWith(2, 2);
      expect(property).toHaveBeenNthCalledWith(1, constant2);
      expect(property).toHaveBeenNthCalledWith(2, constant1, property1);
      expect(result).toEqual([[property2], '']);
    });

    describe('with a property call inside', () => {
      it('should compile a new property, and use it to retrieve the property name', () => {
        const result = propertyParser([, 'obj[PP(value)]'], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
        expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, property1); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(3, constant1, property2);
        expect(result).toEqual([[property3], '']);
      });

      it('should compile a new complex property, and use it to retrieve the property name', () => {
        const result = propertyParser([, 'obj[PP(value.prop)]'], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
        expect(constant).toHaveBeenNthCalledWith(3, 'prop'); // returns constant3
        expect(property).toHaveBeenNthCalledWith(1, constant3); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, constant2, property1); // we create a property using the 'prop' constant and the value sub-context
        expect(property).toHaveBeenNthCalledWith(3, property2); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(4, constant1, property3);
        expect(result).toEqual([[property4], '']);
      });

      it('should compile a new complex property, and use it to retrieve the property name', () => {
        const result = propertyParser([, 'obj[PP(value.prop)]'], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
        expect(constant).toHaveBeenNthCalledWith(3, 'prop'); // returns constant3
        expect(property).toHaveBeenNthCalledWith(1, constant3); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, constant2, property1); // we create a property using the 'prop' constant and the value sub-context
        expect(property).toHaveBeenNthCalledWith(3, property2); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(4, constant1, property3);
        expect(result).toEqual([[property4], '']);
      });

      it('should compile a new property between quotes, and use it to retrieve the property name', () => {
        const result = propertyParser([, "obj[PP('value.prop')]"], []);

        expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
        expect(constant).toHaveBeenNthCalledWith(2, 'value.prop'); // returns constant2
        expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
        expect(property).toHaveBeenNthCalledWith(2, property1); // we create a property using the 'obj' constant
        // we create a property using the return of the 'value property' as name and the 'obj property' as context
        expect(property).toHaveBeenNthCalledWith(3, constant1, property2);
        expect(result).toEqual([[property3], '']);
      });
    });

    it('should compile a non quoted text as a new property and use it to retrieve the property name', () => {
      const result = propertyParser([, 'obj[value]'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(property).toHaveBeenNthCalledWith(1, constant2); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, property1); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(3, constant1, property2);
      expect(result).toEqual([[property3], '']);
    });

    it('should compile a non quoted text as a new complex property and use it to retrieve the property name', () => {
      const result = propertyParser([, 'obj[value.prop]'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(constant).toHaveBeenNthCalledWith(3, 'prop'); // returns constant3
      expect(property).toHaveBeenNthCalledWith(1, constant3); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, constant2, property1); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(3, property2); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(4, constant1, property3);
      expect(result).toEqual([[property4], '']);
    });

    it('should compile a non quoted text with numbers as a new complex property and use it to retrieve the property name', () => {
      const result = propertyParser([, 'obj[value.4.prop]'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(constant).toHaveBeenNthCalledWith(3, 4); // returns constant3
      expect(constant).toHaveBeenNthCalledWith(4, 'prop'); // returns constant4
      expect(property).toHaveBeenNthCalledWith(1, constant4); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, constant3, property1); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(3, constant2, property2); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(4, property3); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(5, constant1, property4);
      expect(result).toEqual([[property5], '']);
    });

    it('should compile a non quoted text with consecutive numbers as a new complex property and use it to retrieve the property name', () => {
      const result = propertyParser([, 'obj[value.4.8]'], []);

      expect(constant).toHaveBeenNthCalledWith(1, 'obj'); // returns constant1
      expect(constant).toHaveBeenNthCalledWith(2, 'value'); // returns constant2
      expect(constant).toHaveBeenNthCalledWith(3, 4); // returns constant3
      expect(constant).toHaveBeenNthCalledWith(4, 8); // returns constant4
      expect(property).toHaveBeenNthCalledWith(1, constant4); // we create a property using the 'value' constant
      expect(property).toHaveBeenNthCalledWith(2, constant3, property1); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(3, constant2, property2); // we create a property using the 'prop' constant and the value sub-context
      expect(property).toHaveBeenNthCalledWith(4, property3); // we create a property using the 'obj' constant
      // we create a property using the return of the 'value.prop property' as name and the 'obj property' as context
      expect(property).toHaveBeenNthCalledWith(5, constant1, property4);
      expect(result).toEqual([[property5], '']);
    });
  });
});
