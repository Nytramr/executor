import * as executers from '../src/expression/executers';
import { constantParser } from '../src/expression/constant-parser';

describe('Constant Parser', () => {
  const constant = jest.spyOn(executers, 'constant');
  const constant1 = jest.fn();

  beforeEach(() => {
    constant.mockReturnValueOnce(constant1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return any extra text after the match', () => {
    const result = constantParser([, '"someText"), some more text to be parsed'], []);

    expect(result).toEqual({
      accum: [constant1],
      txt: ', some more text to be parsed',
    });
  });

  describe('string', () => {
    it('should compile into a constant executer, with the given double quotes string', () => {
      const result = constantParser([, '"someText")'], []);

      expect(constant).toHaveBeenCalledWith('someText');
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });

    it('should compile into a constant executer, with the given single quotes string', () => {
      const result = constantParser([, "'someText')"], []);

      expect(constant).toHaveBeenCalledWith('someText');
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });

    it('should compile into a constant executer, with an empty string', () => {
      const result = constantParser([, '"")'], []);

      expect(constant).toHaveBeenCalledWith('');
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });
  });

  describe('numbers', () => {
    it('should compile into a constant executer, with the given positive number', () => {
      const result = constantParser([, '150)'], []);

      expect(constant).toHaveBeenCalledWith(150);
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });

    it('should compile into a constant executer, with 0', () => {
      const result = constantParser([, '0)'], []);

      expect(constant).toHaveBeenCalledWith(0);
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });

    it('should compile into a constant executer, with the given negative number', () => {
      const result = constantParser([, '-67)'], []);

      expect(constant).toHaveBeenCalledWith(-67);
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });

    it('should compile into a constant executer, with the given float number', () => {
      const result = constantParser([, '0.890)'], []);

      expect(constant).toHaveBeenCalledWith(0.89);
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });
  });

  describe('boolean', () => {
    it('should compile into a constant executer, with a true value', () => {
      const result = constantParser([, 'true)'], []);

      expect(constant).toHaveBeenCalledWith(true);
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });

    it('should compile into a constant executer, with a false value', () => {
      const result = constantParser([, 'false)'], []);

      expect(constant).toHaveBeenCalledWith(false);
      expect(result).toEqual({
        accum: [constant1],
        txt: '',
      });
    });
  });
});
