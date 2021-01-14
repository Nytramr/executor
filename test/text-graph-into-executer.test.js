import * as executers from '../src/expression/executers';
import { textGraphIntoExecuter } from '../src/expression/text-graph-into-executer';

describe('Text Graph into Executers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should compile into an empty graph', () => {
    const undef = jest.spyOn(executers, 'undef');
    textGraphIntoExecuter('');

    expect(undef).toHaveBeenCalled();
  });

  describe('instructions', () => {
    it('should compile the instruction, with the given argument', () => {
      const constant = jest.spyOn(executers, 'constant');
      textGraphIntoExecuter("CT('someText')");

      expect(constant).toHaveBeenCalledWith('someText');
    });

    it('should compile the instruction, with the given arguments', () => {
      const constant = jest.spyOn(executers, 'constant');
      const and = jest.spyOn(executers.executers, 'AN');
      const constant1 = jest.fn();
      const constant2 = jest.fn();

      constant.mockReturnValueOnce(constant1);
      constant.mockReturnValueOnce(constant2);

      textGraphIntoExecuter('AN(CT(true), CT(false))');

      expect(constant).toHaveBeenCalledWith(true);
      expect(constant).toHaveBeenCalledWith(false);
      expect(and).toHaveBeenCalledWith(constant1, constant2);
    });

    it('should compile nested instructions', () => {
      const constant = jest.spyOn(executers, 'constant');
      const not = jest.spyOn(executers.executers, 'NT');
      const constant1 = jest.fn();

      constant.mockReturnValueOnce(constant1);

      textGraphIntoExecuter('NT(CT(0))');

      expect(constant).toHaveBeenCalledWith(0);
      expect(not).toHaveBeenCalledWith(constant1);
    });
  });

  describe('properties', () => {
    it('should compile a simple property', () => {
      const property = jest.spyOn(executers, 'property');
      textGraphIntoExecuter('PP(obj)');
      expect(property).toHaveBeenCalledWith('obj');
    });
    it('should compile a multiple property', () => {
      const property = jest.spyOn(executers, 'property');
      const property1 = jest.fn();
      const property2 = jest.fn();

      property.mockReturnValueOnce(property1);
      property.mockReturnValueOnce(property2);

      const graph = textGraphIntoExecuter('PP(obj.prop1)');

      expect(property).toHaveBeenCalledWith('obj');
      expect(property).toHaveBeenCalledWith('prop1', property1);
      expect(graph).toEqual(property2);
    });
    it('should compile a property between square brackets, considering all inside it as a single property name', () => {
      const property = jest.spyOn(executers, 'property');
      const property1 = jest.fn();
      const property2 = jest.fn();

      property.mockReturnValueOnce(property1);
      property.mockReturnValueOnce(property2);

      const graph = textGraphIntoExecuter("PP(obj['prop1.name'])");

      expect(property).toHaveBeenCalledWith('prop1.name', property1);
      expect(property).toHaveBeenCalledWith('obj');
      expect(graph).toEqual(property2);
    });
    it('should compile a property between quotes, considering all inside it as a single property name', () => {
      const property = jest.spyOn(executers, 'property');

      textGraphIntoExecuter("PP('prop1.name')");

      expect(property).toHaveBeenCalledWith('prop1.name');
    });
  });

  describe('string', () => {
    it('should compile into a constant executer, with the given double quotes string', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter('CT("someText")');

      expect(constant).toHaveBeenCalledWith('someText');
    });

    it('should compile into a constant executer, with the given single quotes string', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter("CT('someText')");

      expect(constant).toHaveBeenCalledWith('someText');
    });

    it('should compile into a constant executer, with an empty string', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter('CT("")');

      expect(constant).toHaveBeenCalledWith('');
    });
  });

  describe('numbers', () => {
    it('should compile into a constant executer, with the given positive number', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter('CT(150)');

      expect(constant).toHaveBeenCalledWith(150);
    });

    it('should compile into a constant executer, with 0', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter('CT(0)');

      expect(constant).toHaveBeenCalledWith(0);
    });

    it('should compile into a constant executer, with the given negative number', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter('CT(-67)');

      expect(constant).toHaveBeenCalledWith(-67);
    });

    it('should compile into a constant executer, with the given float number', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter('CT(0.890)');

      expect(constant).toHaveBeenCalledWith(0.89);
    });
  });

  describe('boolean', () => {
    it('should compile into a constant executer, with a true value', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter('CT(true)');

      expect(constant).toHaveBeenCalledWith(true);
    });

    it('should compile into a constant executer, with a false value', () => {
      const constant = jest.spyOn(executers, 'constant');

      textGraphIntoExecuter('CT(false)');

      expect(constant).toHaveBeenCalledWith(false);
    });
  });
});
