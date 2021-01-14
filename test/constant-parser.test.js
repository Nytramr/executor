import * as executers from '../src/expression/executers';
import { constantParser } from '../src/expression/constant-parser';

describe('Constant Parser', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return any extra text after the match', () => {
    const constant = jest.spyOn(executers, 'constant');
    const constant1 = jest.fn();
    constant.mockReturnValueOnce(constant1);

    const result = constantParser([, '"someText"), some more text to be parsed'], []);

    expect(result).toEqual({
      accum: [constant1],
      text: 'some more text to be parsed',
    });
  });

  describe('string', () => {
    it('should compile into a constant executer, with the given double quotes string', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, '"someText")'], []);

      expect(constant).toHaveBeenCalledWith('someText');
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });

    it('should compile into a constant executer, with the given single quotes string', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, "'someText')"], []);

      expect(constant).toHaveBeenCalledWith('someText');
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });

    it('should compile into a constant executer, with an empty string', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, '"")'], []);

      expect(constant).toHaveBeenCalledWith('');
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });
  });

  describe('numbers', () => {
    it('should compile into a constant executer, with the given positive number', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, '150)'], []);

      expect(constant).toHaveBeenCalledWith(150);
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });

    it('should compile into a constant executer, with 0', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, '0)'], []);

      expect(constant).toHaveBeenCalledWith(0);
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });

    it('should compile into a constant executer, with the given negative number', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, '-67)'], []);

      expect(constant).toHaveBeenCalledWith(-67);
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });

    it('should compile into a constant executer, with the given float number', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, '0.890)'], []);

      expect(constant).toHaveBeenCalledWith(0.89);
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });
  });

  describe('boolean', () => {
    it('should compile into a constant executer, with a true value', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, 'true)'], []);

      expect(constant).toHaveBeenCalledWith(true);
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });

    it('should compile into a constant executer, with a false value', () => {
      const constant = jest.spyOn(executers, 'constant');
      const constant1 = jest.fn();
      constant.mockReturnValueOnce(constant1);

      const result = constantParser([, 'false)'], []);

      expect(constant).toHaveBeenCalledWith(false);
      expect(result).toEqual({
        accum: [constant1],
        text: '',
      });
    });
  });
});
