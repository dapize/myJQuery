const $ = require('../jQuery-library');

const items = `
  <ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
    <li>item 4</li>
    <li>item 5</li>
  </ul>
`;

describe('.each()', () => {
  test('each li(s)', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li');
    const $li = $('li');

    $li.each(function (index) {
      expect(this).toBe(lis[index]);
    });
    expect($li.length).toBe(lis.length);
  })

  test('with Break and Continue', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li');
    const $li = $('li');

    let breaked = 0;
    $li.each(function (index) {
      breaked += 1;
      if (index === 2) return false;
    });
    expect(breaked).toBe(3);

    let arrNumbers = [];
    $li.each(function (index, item) {
      if (index === 3) return true;
      arrNumbers.push(item)
    });
    expect(arrNumbers).toEqual([lis[0], lis[1], lis[2], lis[4]]);
  })
});

describe('$.each', () => {
  const arrNumbers = [ 52, 97, 32, 14, 9 ];
  $.each([ 52, 97, 32, 14, 9 ], function( index, value ) {
    expect(value).toBe(arrNumbers[index])
  });

  const obj = { one: 1, two: 2, three: 3, four: 4, five: 5 };
  let iControl = 0;
  const keysObj = Object.keys(obj);
  $.each(obj, function (key, value) {
    expect(key).toBe(keysObj[iControl]);
    expect(value).toBe(obj[keysObj[iControl]]);
    iControl += 1;
  });
});