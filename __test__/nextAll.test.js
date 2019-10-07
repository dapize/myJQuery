const $ = require('../jQuery-library');

const items =  `
  <ul>
    <li>list item 1</li>
    <li class="second-item">list item 2</li>
    <li class="bad">list item 3</li>
    <li class="good">list item 4</li>
    <li class="bad">list item 5</li>
    <li class="good">list item 6</li>
  </ul>
`;

describe('.nextAll()', () => {

  test('Simple', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li')
    const $second = $('.second-item')
    expect($second.nextAll()).toEqual({0: lis[2], 1: lis[3], 2: lis[4], 3: lis[5], length: 4, prevObject: $second})
  })

  test('Selector', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li')
    const $second = $('.second-item')
    expect($second.nextAll('.bad')).toEqual({0: lis[2], 1: lis[4], length: 2, prevObject: $second})
    expect($second.nextAll('.good')).toEqual({0: lis[3], 1: lis[5], length: 2, prevObject: $second})
  })
})