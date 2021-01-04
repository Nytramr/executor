import { constant, not } from '../src/expression/executers';
import { graphIntoExecuter, textGraphIntoStructureGraph } from '../src/expression/compiler';

describe('Compiler', () => {
  describe('Graph into Executer', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a single function', () => {
      const graph = [() => () => {}, () => () => {}, () => () => {}];

      const compiledGraph = graphIntoExecuter(graph);

      expect(compiledGraph).toEqual(expect.any(Function));
    });

    it('should call the first function with the other two as arguments', () => {
      const operation = jest.fn();
      const arg1 = jest.fn();
      const arg2 = jest.fn();
      const graph = [operation, arg1, arg2];

      graphIntoExecuter(graph);

      expect(operation).toBeCalledWith(arg1, arg2);
    });

    it('should call the different operations', () => {
      const result1 = jest.fn();
      const result2 = jest.fn();
      const result3 = jest.fn();
      const operation1 = jest.fn(() => result1);
      const operation2 = jest.fn(() => result2);
      const operation3 = jest.fn(() => result3);
      const arg1 = jest.fn();
      const arg2 = jest.fn();
      const arg3 = jest.fn();
      const graph = [operation1, [operation2, arg1, [operation3, arg2]], arg3];

      graphIntoExecuter(graph);

      expect(operation3).toHaveBeenCalledWith(arg2, undefined);
      expect(operation2).toHaveBeenCalledWith(arg1, result3);
      expect(operation1).toHaveBeenCalledWith(result2, arg3);
    });
  });

  describe('Text into Graph', () => {
    it('should compile into an empty graph', () => {
      const graph = textGraphIntoStructureGraph('');

      expect(graph).toEqual([]);
    });

    it('should compile nested instructions', () => {
      const graph = textGraphIntoStructureGraph('NT(CT(0))');

      expect(graph).toEqual([not, [constant, 0]]);
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
});
