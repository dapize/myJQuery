const $ = require('../jQuery-library');

describe('.siblings()', () => {
  test('Simple', () => {
    document.body.innerHTML = `
      <ul>
        <li>list item 1</li>
        <li>list item 2</li>
        <li class="third-item">list item 3</li>
        <li>list item 4</li>
        <li>list item 5</li>
      </ul>
    `;
    const $thirdItem = $('.third-item')
    const lis = document.querySelectorAll('li');
    expect($thirdItem.siblings()).toEqual({0: lis[0], 1: lis[1], 2: lis[3], 3: lis[4], length: 4, prevObject: $thirdItem})
  })

  test('Selector', () => {
    document.body.innerHTML = `
      <ul>
        <li>list item 1</li>
        <li class="good">list item 2</li>
        <li class="third-item">list item 3</li>
        <li>list item 4</li>
        <li class="good">list item 5</li>
        <li class="bad">list item 6</li>
        <li class="bad">list item 7</li>
        <li class="good">list item 8</li>
      </ul>
    `;
    const $thirdItem = $('.third-item');
    const gods = document.querySelectorAll('.good');
    expect($thirdItem.siblings('.good')).toEqual({0: gods[0], 1: gods[1], 2: gods[2], length: 3, prevObject: $thirdItem})
  })
})