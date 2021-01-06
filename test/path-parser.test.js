import { property } from '../src/expression/executers';
import { splitPath } from '../src/expression/path-parser';

describe('path', () => {
  describe('splitPath', () => {
    it('should compile a simple property', () => {
      const graph = splitPath('obj)');

      expect(graph.parts).toEqual(['obj']);
      expect(graph.text).toEqual(')');
    });

    it('should compile a multiple parts property', () => {
      const graph = splitPath('obj.prop1)');

      expect(graph.parts).toEqual(['obj', 'prop1']);
      expect(graph.text).toEqual(')');
    });

    it('should compile a property between square brackets, considering all inside it as a single property name', () => {
      const graph = splitPath("obj['prop1.name'])");

      expect(graph.parts).toEqual(['obj', 'prop1.name']);
      expect(graph.text).toEqual(')');
    });

    it('should compile a property between quotes, considering all inside it as a single property name', () => {
      const graph = splitPath("'prop1.name')");

      expect(graph.parts).toEqual(['prop1.name']);
      expect(graph.text).toEqual(')');
    });

    it('should compile a number property', () => {
      const graph = splitPath('2)');

      expect(graph.parts).toEqual(['2']);
      expect(graph.text).toEqual(')');
    });

    it("should return the final ')' followed by any other text", () => {
      const graph = splitPath("'prop1.name') and more text after the final parenthesis");

      expect(graph.parts).toEqual(['prop1.name']);
      expect(graph.text).toEqual(') and more text after the final parenthesis');
    });
  });
});
