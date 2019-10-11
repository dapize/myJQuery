const $ = require('../jQuery-library');

const div = `
  <style>
    .div-1 { height: 100px }
    .div-2 { height: 150px }
    .div-3 { height: 200px }
  </style>
  <div class="div-1"></div>
  <div class="div-2"></div>
  <div class="div-3"></div>
`;

describe('.height()', () => {

  test('Getting', () => {
    document.body.innerHTML = div;
    expect($('div').height()).toBe(100)
  });

  test('Getting with padding', () => {
    document.body.innerHTML = `
      <style>
        div {
          height: 100px;
          padding: 30px;
          box-sizing: border-box;
        }
      </style>
      <div></div>
    `;
    expect($('div').height()).toBe(40)
  });

  test('Setting simple', () => {
    document.body.innerHTML = div;
    const divs = document.querySelectorAll('div');
    const $div = $('div');
    const $height = $div.height('150px')
    expect($height).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: $(document)});
    expect($($div[0]).height()).toBe(150);
  });

  test('Setting simple with relative add', () => {
    document.body.innerHTML = div;
    const divs = document.querySelectorAll('div');
    const $div = $('div');
    const $height = $div.height('+=100');
    expect($height).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: $(document)});
    [200, 250, 300].forEach(function (item, index) {
      expect($($div[index]).height()).toBe(item);
    })
  });

  test('Setting simple with relative remove', () => {
    document.body.innerHTML = div;
    const divs = document.querySelectorAll('div');
    const $div = $('div');
    const $height = $div.height('-=50');
    expect($height).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: $(document)});
    [50, 100, 150].forEach(function (item, index) {
      expect($($div[index]).height()).toBe(item);
    })
  });

  test('Setting with function', () => {
    document.body.innerHTML = div;
    const divs = document.querySelectorAll('div');
    const $div = $('div');
    const $height = $div.height(function (index, currentHeight) {
      return currentHeight + 100
    });
    expect($height).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: $(document)});
    [200, 250, 300].forEach(function (item, index) {
      expect($($div[index]).height()).toBe(item);
    })
  })

});