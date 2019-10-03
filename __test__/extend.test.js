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
    let newYorkCity = {
      'Manhattan': {
        'Uptown': {
          'Washington Heights': 'Daniel',
          'UWS': 'Cathy'
        },
        'Midtown': {
          'Madison Square': 'Susan',
          'Theater District': ['Robert', 'Latisha']
        },
        'Downtown': {
          'Tribeca': 'Billy',
          'Financial District': {
            'Fullstack': {
              '11th floor': ['David', 'Nimit'],
              '25th floor': 'Ashi'
            }
          }
        }
      },
      'Brooklyn': {
        'Bushwick': 'Marilyn',
        'Bed-Stuy': ['Juan', 'Denice']
      },
      'Queens': {
        'Astoria': 'Ella',
        'Flushing': 'Eric'
      },
      'Bronx': {
        'Fordham': 'Aaron',
        'Melrose': 'Krysten'
      },
      'Staten Island': {
        'Arlington': ['Nadine', 'Mose'],
        'Elm Park': 'Arthur'
      }
    };


  })
})