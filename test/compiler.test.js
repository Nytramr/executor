import { constant } from '../src/expression/executers';
import { graphIntoExecuter, textIntoGraph } from '../src/expression/compiler';

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
      const graph = textIntoGraph('');

      expect(graph).toEqual([]);
    });
    it('should compile into a string constant executer', () => {
      const graph = textIntoGraph('_C("someText")');

      expect(graph).toEqual([constant, 'someText']);
    });
  });
});
