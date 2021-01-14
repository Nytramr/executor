import * as executers from '../src/expression/executers';
import { propertyParser } from '../src/expression/property-parser';

describe('Path Parser', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should compile a simple property', () => {
    const property = jest.spyOn(executers, 'property');
    const property1 = jest.fn();
    property.mockReturnValueOnce(property1);

    const result = propertyParser([, 'obj)'], []);

    expect(property).toHaveBeenCalledWith('obj');
    expect(result).toEqual({
      accum: [property1],
      text: '',
    });
  });

  it('should compile a multiple parts property', () => {
    const property = jest.spyOn(executers, 'property');
    const property1 = jest.fn();
    const property2 = jest.fn();
    property.mockReturnValueOnce(property1);
    property.mockReturnValueOnce(property2);

    const result = propertyParser([, 'obj.prop1)'], []);

    expect(property).toHaveBeenNthCalledWith(1, 'obj');
    expect(property).toHaveBeenNthCalledWith(2, 'prop1', property1);
    expect(result).toEqual({
      accum: [property2],
      text: '',
    });
  });

  it('should compile a property between square brackets, considering all inside it as a single property name', () => {
    const property = jest.spyOn(executers, 'property');
    const property1 = jest.fn();
    const property2 = jest.fn();
    property.mockReturnValueOnce(property1);
    property.mockReturnValueOnce(property2);
    const result = propertyParser([, "obj['prop1.name'])"], []);

    expect(property).toHaveBeenNthCalledWith(1, 'obj');
    expect(property).toHaveBeenNthCalledWith(2, 'prop1.name', property1);
    expect(result).toEqual({
      accum: [property2],
      text: '',
    });
  });

  it('should compile a property between quotes, considering all inside it as a single property name', () => {
    const property = jest.spyOn(executers, 'property');
    const property1 = jest.fn();
    property.mockReturnValueOnce(property1);
    const result = propertyParser([, "'prop1.name')"], []);

    expect(property).toHaveBeenCalledWith('prop1.name');
    expect(result).toEqual({
      accum: [property1],
      text: '',
    });
  });

  it('should compile a number property', () => {
    const property = jest.spyOn(executers, 'property');
    const property1 = jest.fn();
    property.mockReturnValueOnce(property1);
    const result = propertyParser([, '2)'], []);

    expect(property).toHaveBeenCalledWith('2');
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
