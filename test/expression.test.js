import { and, constant, equals, nonEquals, not, or, property } from '../src/expression/executers';


describe('Executers', () => {
  const firstProp = (obj) => obj.first;
  const secondProp = (obj) => obj.second;

  describe('Constant', () => {
    it('should return the given value regardless the argument', () => {
      const tenNum = constant(10);
      expect(tenNum()).toBe(10);
      expect(tenNum({ unused: 'value' })).toBe(10);
    });
  });

  describe('Property', () => {
    it('should return the property of the given object', () => {
      const prop = property('name');

      expect(prop({ name: 'name' })).toBe('name');
      expect(prop({ name: 'another name' })).toBe('another name');
    });

    it('should return the index of the given array', () => {
      const prop = property('1');

      expect(prop(['cero', 'uno', 'dos'])).toBe('uno');
    });

    it('should return the falsy value', () => {
      const prop = property('name');

      expect(prop(0)).toBe(0);
      expect(prop(undefined)).toBe(undefined);
      expect(prop(null)).toBe(null);
      expect(prop('')).toBe('');
      expect(prop(false)).toBe(false);
    });

    it('should return the value of a complex property path of the given object', () => {
      const prop = property('body', property('name'));

      expect(prop({ body: { name: 'name' } })).toBe('name');
      expect(prop({ body: { name: 'another name' } })).toBe('another name');
      expect(prop({})).toBeUndefined();
    });

    it('should return undefined', () => {
      const prop = property('body', property('name'));

      expect(prop({ body: { name: undefined } })).toBeUndefined();
      expect(prop({ body: {} })).toBeUndefined();
      expect(prop({ body: undefined })).toBeUndefined();
      expect(prop({})).toBeUndefined();
    });
  });

  describe('Not', () => {
    it('should return true', () => {
      const executor = not(firstProp)
      expect(executor({first: false})).toBe(true);
      expect(executor({first: 0})).toBe(true);
      expect(executor({first: null})).toBe(true);
      expect(executor({})).toBe(true);
    });

    it('should return false', () => {
      const executor = not(firstProp)
      expect(executor({first: true})).toBe(false);
      expect(executor({first: 1})).toBe(false);
      expect(executor({first: {}})).toBe(false);
    });
  });

  describe('And', () => {
    it('should return true', () => {
      const executor = and(firstProp, secondProp);
      expect(executor({first: true, second:true})).toBe(true);
    });

    it('should return false', () => {
      const executor = and(firstProp, secondProp);
      expect(executor({first: true, second:false})).toBe(false);
      expect(executor({first: false, second:true})).toBe(false);
      expect(executor({first: false, second:false})).toBe(false);
    });
  });

  describe('Or', () => {
    it('should return true', () => {
      const executor = or(firstProp, secondProp);
      expect(executor({first: true, second:false})).toBe(true);
      expect(executor({first: false, second:true})).toBe(true);
      expect(executor({first: true, second:true})).toBe(true);
    });

    it('should return false', () => {
      const executor = or(firstProp, secondProp);
      expect(executor({first: false, second:false})).toBe(false);
    });
  });

  describe('Equals', () => {
    it('should return true', () => {
      const executor = equals(firstProp, secondProp);
      expect(executor({first: 10, second:10})).toBe(true);
      expect(executor({first: '10', second:'10'})).toBe(true);
      expect(executor({first: true, second:true})).toBe(true);
      expect(executor({})).toBe(true);
    });

    it('should return false', () => {
      const executor = equals(firstProp, secondProp);
      expect(executor({first: 10, second:'10'})).toBe(false);
      expect(executor({first: false, second:true})).toBe(false);
      expect(executor({first: false, second:undefined})).toBe(false);
      expect(executor({first: false, second:0})).toBe(false);
    });
  });

  describe('Not Equals', () => {
    it('should return true', () => {
      const executor = nonEquals(firstProp, secondProp);
      expect(executor({first: 10, second:'10'})).toBe(true);
      expect(executor({first: false, second:true})).toBe(true);
      expect(executor({first: false, second:undefined})).toBe(true);
      expect(executor({first: false, second:0})).toBe(true);
    });

    it('should return false', () => {
      const executor = nonEquals(firstProp, secondProp);
      expect(executor({first: 10, second:10})).toBe(false);
      expect(executor({first: '10', second:'10'})).toBe(false);
      expect(executor({first: true, second:true})).toBe(false);
      expect(executor({})).toBe(false);
    });
  });
});
