import { and, constant, not } from '../src/expression/executers';
import { textGraphIntoStructureGraph } from '../src/expression/text-graph-into-structured-graph';

describe('Text Graph into Structured Graph', () => {
  it('should compile into an empty graph', () => {
    const graph = textGraphIntoStructureGraph('');

    expect(graph).toEqual([]);
  });

  describe('instructions', () => {
    it('should compile the instruction, with the given argument', () => {
      const graph = textGraphIntoStructureGraph("CT('someText')");

      expect(graph).toEqual([constant, 'someText']);
    });

    it('should compile the instruction, with the given arguments', () => {
      const graph = textGraphIntoStructureGraph('AN(CT(true), CT(true))');

      expect(graph).toEqual([and, [constant, true], [constant, true]]);
    });

    it('should compile nested instructions', () => {
      const graph = textGraphIntoStructureGraph('NT(CT(0))');

      expect(graph).toEqual([not, [constant, 0]]);
    });
  });

  describe('string', () => {
    it('should compile into a constant executer, with the given double quotes string', () => {
      const graph = textGraphIntoStructureGraph('CT("someText")');

      expect(graph).toEqual([constant, 'someText']);
    });

    it('should compile into a constant executer, with the given single quotes string', () => {
      const graph = textGraphIntoStructureGraph("CT('someText')");

      expect(graph).toEqual([constant, 'someText']);
    });

    it('should compile into a constant executer, with an empty string', () => {
      const graph = textGraphIntoStructureGraph('CT("")');

      expect(graph).toEqual([constant, '']);
    });
  });

  describe('numbers', () => {
    it('should compile into a constant executer, with the given positive number', () => {
      const graph = textGraphIntoStructureGraph('CT(150)');

      expect(graph).toEqual([constant, 150]);
    });

    it('should compile into a constant executer, with 0', () => {
      const graph = textGraphIntoStructureGraph('CT(0)');

      expect(graph).toEqual([constant, 0]);
    });

    it('should compile into a constant executer, with the given negative number', () => {
      const graph = textGraphIntoStructureGraph('CT(-67)');

      expect(graph).toEqual([constant, -67]);
    });

    it('should compile into a constant executer, with the given float number', () => {
      const graph = textGraphIntoStructureGraph('CT(0.890)');

      expect(graph).toEqual([constant, 0.89]);
    });
  });

  describe('boolean', () => {
    it('should compile into a constant executer, with a true value', () => {
      const graph = textGraphIntoStructureGraph('CT(true)');

      expect(graph).toEqual([constant, true]);
    });

    it('should compile into a constant executer, with a false value', () => {
      const graph = textGraphIntoStructureGraph('CT(false)');

      expect(graph).toEqual([constant, false]);
    });
  });
});
