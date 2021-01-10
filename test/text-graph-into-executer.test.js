import * as executers from '../src/expression/executers';
import { textGraphIntoStructureGraph } from '../src/expression/text-graph-into-executer';

describe('Text Graph into Executers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should compile into an empty graph', () => {
    const undef = jest.spyOn(executers, 'undef');
    textGraphIntoStructureGraph('');

    expect(undef).toHaveBeenCalled();
  });

  describe('instructions', () => {
    it('should compile the instruction, with the given argument', () => {
      const constant = jest.spyOn(executers.executers, 'CT');
      textGraphIntoStructureGraph("CT('someText')");

      expect(constant).toHaveBeenCalledWith('someText');
    });

    it('should compile the instruction, with the given arguments', () => {
      const constant = jest.spyOn(executers.executers, 'CT');
      const and = jest.spyOn(executers.executers, 'AN');
      const constant1 = jest.fn();
      const constant2 = jest.fn();

      constant.mockReturnValueOnce(constant1);
      constant.mockReturnValueOnce(constant2);

      textGraphIntoStructureGraph('AN(CT(true), CT(false))');

      expect(constant).toHaveBeenCalledWith(true);
      expect(constant).toHaveBeenCalledWith(false);
      expect(and).toHaveBeenCalledWith(constant1, constant2);
    });

    it('should compile nested instructions', () => {
      const constant = jest.spyOn(executers.executers, 'CT');
      const not = jest.spyOn(executers.executers, 'NT');
      const constant1 = jest.fn();

      constant.mockReturnValueOnce(constant1);

      textGraphIntoStructureGraph('NT(CT(0))');

      expect(constant).toHaveBeenCalledWith(0);
      expect(not).toHaveBeenCalledWith(constant1);
    });
  });

  describe('properties', () => {
    //   it('should compile a simple property', () => {
    //     const property = jest.spyOn(executers, 'property');
    //     textGraphIntoStructureGraph('PP(obj)');
    //     expect(property).toHaveBeenCalledWith('obj');
    //   });
    //   it('should compile a multiple property', () => {
    //     const graph = textGraphIntoStructureGraph('PP(obj.prop1)');
    //     expect(graph).toEqual([property, 'obj', [property, 'prop1']]);
    //   });
    //   it('should compile a property between square brackets, considering all inside it as a single property name', () => {
    //     const graph = textGraphIntoStructureGraph("PP(obj['prop1.name'])");
    //     expect(graph).toEqual([property, 'obj', [property, 'prop1.name']]);
    //   });
    //   it('should compile a property between quotes, considering all inside it as a single property name', () => {
    //     const graph = textGraphIntoStructureGraph("PP('prop1.name')");
    //     expect(graph).toEqual([property, 'prop1.name']);
    //   });
  });

  describe('string', () => {
    it('should compile into a constant executer, with the given double quotes string', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph('CT("someText")');

      expect(constant).toHaveBeenCalledWith('someText');
    });

    it('should compile into a constant executer, with the given single quotes string', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph("CT('someText')");

      expect(constant).toHaveBeenCalledWith('someText');
    });

    it('should compile into a constant executer, with an empty string', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph('CT("")');

      expect(constant).toHaveBeenCalledWith('');
    });
  });

  describe('numbers', () => {
    it('should compile into a constant executer, with the given positive number', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph('CT(150)');

      expect(constant).toHaveBeenCalledWith(150);
    });

    it('should compile into a constant executer, with 0', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph('CT(0)');

      expect(constant).toHaveBeenCalledWith(0);
    });

    it('should compile into a constant executer, with the given negative number', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph('CT(-67)');

      expect(constant).toHaveBeenCalledWith(-67);
    });

    it('should compile into a constant executer, with the given float number', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph('CT(0.890)');

      expect(constant).toHaveBeenCalledWith(0.89);
    });
  });

  describe('boolean', () => {
    it('should compile into a constant executer, with a true value', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph('CT(true)');

      expect(constant).toHaveBeenCalledWith(true);
    });

    it('should compile into a constant executer, with a false value', () => {
      const constant = jest.spyOn(executers.executers, 'CT');

      textGraphIntoStructureGraph('CT(false)');

      expect(constant).toHaveBeenCalledWith(false);
    });
  });
});
