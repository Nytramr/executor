import { Engine } from '../src/expression/engine';

describe('Engine', () => {
  describe('Define Operator', () => {
    const engine = new Engine();

    describe('Adding a new operation', () => {
      const operation = jest.fn((something) => () => something());
      engine.define('CC', operation);

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should add new operation', () => {
        expect(() => engine.compile('CC(CT("hello"))')).not.toThrow();
      });

      it('should compile the new operation', () => {
        const executor = engine.compile('CC(CT("hello"))');

        expect(operation).toHaveBeenCalledTimes(1);
        expect(executor({})).toEqual('hello');
      });

      it('should not exist in other engines', () => {
        const anotherEngine = new Engine();
        expect(() => anotherEngine.compile('CC(CT("hello"))')).toThrow("Executer CC wasn't recognized");
      });
    });
  });
});
