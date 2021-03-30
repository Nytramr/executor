import * as executers from '../src/expression/executers';
import { literalParser } from '../src/expression/constant-parser';

describe('Literal Parser', () => {
  const constant = jest.spyOn(executers, 'constant');
  const constant1 = jest.fn();

  beforeEach(() => {
    constant.mockReturnValueOnce(constant1);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return any extra text after the match', () => {
    const result = literalParser([, 'someText', , , , '), some more text to be parsed'], []);

    expect(result).toEqual([[constant1], '), some more text to be parsed']);
  });

  describe('string', () => {
    it('should compile into a constant executer, with the given double quotes string', () => {
      const result = literalParser([, /*simple quote*/ 'someText', , , ,], []);

      expect(constant).toHaveBeenCalledWith('someText');
      expect(result).toEqual([[constant1], '']);
    });

    it('should compile into a constant executer, with the given single quotes string', () => {
      const result = literalParser([, , /*double quote*/ 'someText', , ,], []);

      expect(constant).toHaveBeenCalledWith('someText');
      expect(result).toEqual([[constant1], '']);
    });

    it('should compile into a constant executer, with an empty string', () => {
      const result = literalParser([, /*simple quote*/ '', /*double quote*/ '', , ,], []);

      expect(constant).toHaveBeenCalledWith('');
      expect(result).toEqual([[constant1], '']);
    });
  });

  describe('numbers', () => {
    it('should compile into a constant executer, with the given positive number', () => {
      const result = literalParser([, , , /*number*/ '150', ,], []);
      // const result = literalParser([, '150)'], []);

      expect(constant).toHaveBeenCalledWith(150);
      expect(result).toEqual([[constant1], '']);
    });

    it('should compile into a constant executer, with 0', () => {
      const result = literalParser([, , , /*number*/ '0', ,], []);
      // const result = literalParser([, '0)'], []);

      expect(constant).toHaveBeenCalledWith(0);
      expect(result).toEqual([[constant1], '']);
    });

    it('should compile into a constant executer, with the given negative number', () => {
      const result = literalParser([, , , /*number*/ '-67', ,], []);
      // const result = literalParser([, '-67)'], []);

      expect(constant).toHaveBeenCalledWith(-67);
      expect(result).toEqual([[constant1], '']);
    });

    it('should compile into a constant executer, with the given float number', () => {
      const result = literalParser([, , , /*number*/ '0.89', ,], []);
      // const result = literalParser([, '0.890)'], []);

      expect(constant).toHaveBeenCalledWith(0.89);
      expect(result).toEqual([[constant1], '']);
    });
  });

  describe('boolean', () => {
    it('should compile into a constant executer, with a true value', () => {
      const result = literalParser([, , , , /*boolean*/ 'true'], []);
      // const result = literalParser([, 'true)'], []);

      expect(constant).toHaveBeenCalledWith(true);
      expect(result).toEqual([[constant1], '']);
    });

    it('should compile into a constant executer, with a false value', () => {
      const result = literalParser([, , , , /*boolean*/ 'false'], []);
      // const result = literalParser([, 'false)'], []);

      expect(constant).toHaveBeenCalledWith(false);
      expect(result).toEqual([[constant1], '']);
    });
  });
});
