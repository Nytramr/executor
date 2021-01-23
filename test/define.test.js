import { Engine } from '../src/expression/engine';

describe('Engine', () => {
  describe('Define', () => {
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
        const executer = engine.compile('CC(CT("hello"))');

        expect(operation).toHaveBeenCalledTimes(1);
        expect(executer({})).toEqual('hello');
      });

      it('should not exist in other engines', () => {
        const anotherEngine = new Engine();
        expect(() => anotherEngine.compile('CC(CT("hello"))')).toThrow('Token unrecognized near to CC(CT("hello"))');
      });
    });
  });
});
