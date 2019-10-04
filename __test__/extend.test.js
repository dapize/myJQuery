const $ = require('../jQuery-library');

describe('$.extend()', () => {
  test('with empty obj', () => {
    const obj1 = {first: 'item 1'};
    const obj2 = $.extend({}, obj1);
    const emptyObj = {};
    const obj3 = $.extend(emptyObj, obj1);
    expect(obj2).toEqual(obj1);
    expect(obj3).toEqual(obj1);
    expect(emptyObj).toEqual(obj1);
  })

  test('with one item', () => {
    const obj1 = {first: 'item 1', second: 'item 2'};
    const obj2 = {third: 'item 3'}
    const obj3 = $.extend(obj2, obj1);
    expect(obj3).toEqual({first: 'item 1', second: 'item 2', third: 'item 3'});
  })

  test('replace one item', () => {
    const obj1 = {first: 'item 1', second: 'item 2', third: 'item 3'};
    const obj2 = {third: 'I will replace'}
    const obj3 = $.extend(obj2, obj1);
    expect(obj3).toEqual(obj1);
    expect(obj2).not.toEqual({third: 'I will replace'})
  })

  test('Deep simple (recursive)', () => {
    const obj1 = {first: 'item 1', second: 'item 2', other: {first: 'item A', second: 'item B'}};
    const obj2 = {other: {third: 'item C'}};
    const obj3 = $.extend(true, obj2, obj1);
    const objExtend = {first: 'item 1', second: 'item 2', other: {first: 'item A', second: 'item B', third: 'item C'}};
    expect(obj3).toEqual(objExtend);
    expect(obj2).toEqual(objExtend);
  })

  test('Deep very multidimentional', () => {
    const object1 = { a : 1, b : 2, testArr : [888, { innArr : 1 }, 777 ], data : { e : 12, c : { lol : 1 }, rofl : { O : 3 } } };
    const object2 = { a : 6, b : 9, data : { a : 17, b : 18, e : 13, rofl : { O : 99, copter : { mao : 1 } } }, hexa : { tetra : 66 } };
    const object3 = { f : 13, g : 666, a : 333, data : { c : { xD : 45 } }, testArr : [888, { innArr : 3 }, 555 ]  };

    const object1Clone = Object.assign({}, object1);
    const mergeObjects = Object.assign(object1, object2, object3);
    const bigObject = $.extend(object1, object2, object3);

    expect(bigObject).toEqual(mergeObjects);
    expect(object1).toEqual(mergeObjects);
    expect(object1).not.toEqual(object1Clone);
  })
})