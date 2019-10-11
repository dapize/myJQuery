const $ = require('../jQuery-library');

const div = `
  <style>
    .div-1 { width: 100px }
    .div-2 { width: 150px }
    .div-3 { width: 200px }
  </style>
  <div class="div-1"></div>
  <div class="div-2"></div>
  <div class="div-3"></div>
`;

describe('.width()', () => {

  test('Getting', () => {
    document.body.innerHTML = div;
    expect($('div').width()).toBe(100)
  });

  test('Getting with padding', () => {
    document.body.innerHTML = `
      <style>
        div {
          width: 100px;
          padding: 30px;
          box-sizing: border-box;
        }
      </style>
      <div></div>
    `;
    expect($('div').width()).toBe(40)
  });

  test('Setting simple', () => {
    document.body.innerHTML = div;
    const divs = document.querySelectorAll('div');
    const $div = $('div');
    const $width = $div.width('150px')
    expect($width).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: $(document)});
    expect($($div[0]).width()).toBe(150);
  });

  test('Setting simple with relative add', () => {
    document.body.innerHTML = div;
    const divs = document.querySelectorAll('div');
    const $div = $('div');
    const $width = $div.width('+=100');
    expect($width).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: $(document)});
    [200, 250, 300].forEach(function (item, index) {
      expect($($div[index]).width()).toBe(item);
    })
  });

  test('Setting simple with relative remove', () => {
    document.body.innerHTML = div;
    const divs = document.querySelectorAll('div');
    const $div = $('div');
    const $width = $div.width('-=50');
    expect($width).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: $(document)});
    [50, 100, 150].forEach(function (item, index) {
      expect($($div[index]).width()).toBe(item);
    })
  });

  test('Setting with function', () => {
    document.body.innerHTML = div;
    const divs = document.querySelectorAll('div');
    const $div = $('div');
    const $width = $div.width(function (index, currentWidth) {
      return currentWidth + 100
    });
    expect($width).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: $(document)});
    [200, 250, 300].forEach(function (item, index) {
      expect($($div[index]).width()).toBe(item);
    })
  })

});