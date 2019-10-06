const $ = require('../jQuery-library');

describe('.children()', () => {

  test('Simple', () => {
    document.body.innerHTML = `
      <ul>
        <li>list item 1</li>
        <li>list item 2</li>
        <li>list item 3</li>
      </ul>
    `;
    const $ul = $('ul');
    const $lis = $ul.children();
    expect($lis.length).toBe(3);
    const lis = document.querySelectorAll('li');
    expect($lis).toEqual({0: lis[0], 1: lis[1], 2: lis[2], length: 3, prevObject: $ul})
  })

  test('Selector', () => {
    document.body.innerHTML = `
      <ul>
        <li>list item 1</li>
        <li class="second">list item 2</li>
        <li class="bad">list item 3</li>
        <li class="good">list item 4</li>
        <li class="good">list item 5</li>
        <li class="bad">list item 6</li>
        <li class="bad">list item 7</li>
        <li class="good">list item 8</li>
      </ul>
    `;
    const $ul = $('ul');
    const bads = document.querySelectorAll('.bad');
    expect($ul.children('.bad')).toEqual({0: bads[0], 1: bads[1], 2: bads[2], length: 3, prevObject: $ul})
  })
})