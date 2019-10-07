const $ = require('../jQuery-library');

const items =  `
  <ul>
    <li>list item 1</li>
    <li class="second-item">list item 2</li>
    <li class="bad">list item 3</li>
    <li class="good">list item 4</li>
  </ul>
`;

describe('.next()', () => {

  test('Simple', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li')
    const $second = $('.second-item')
    expect($second.next()).toEqual({0: lis[2], length: 1, prevObject: $second})
  })

  test('Selector', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li')
    const $second = $('.second-item')
    expect($second.next('.bad')).toEqual({0: lis[2], length: 1, prevObject: $second})
    expect($second.next('.god')).toEqual({length: 0, prevObject: $second})
  })
})