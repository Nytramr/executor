import * as executers from '../src/expression/executers';
import { propertyParser } from '../src/expression/property-parser';

describe('Path Parser', () => {
  const constant = jest.spyOn(executers, 'constant');
  const constant1 = jest.fn();
  const constant2 = jest.fn();
  const property = jest.spyOn(executers, 'property');
  const property1 = jest.fn();
  const property2 = jest.fn();

  beforeEach(() => {
    constant.mockReturnValueOnce(constant1);
    constant.mockReturnValueOnce(constant2);
    property.mockReturnValueOnce(property1);
    property.mockReturnValueOnce(property2);
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

    expect(constant).toHaveBeenCalledWith('obj');
    expect(constant).toHaveBeenCalledWith('prop1');
    expect(property).toHaveBeenNthCalledWith(1, constant1);
    expect(property).toHaveBeenNthCalledWith(2, constant2, property1);
    expect(result).toEqual({
      accum: [property2],
      text: '',
    });
  });

  it('should compile a property between square brackets, considering all inside it as a single property name', () => {
    const result = propertyParser([, "obj['prop1.name'])"], []);

    expect(constant).toHaveBeenCalledWith('obj');
    expect(constant).toHaveBeenCalledWith('prop1.name');
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
});
