const $ = require('../jQuery-library');

const items =  `
  <ul>
    <li>list item 1</li>
    <li class="second">list item 2</li>
    <li class="third">list item 3</li>
    <li>list item 4</li>
  </ul>
`;

describe('.prev()', () => {

  test('Simple', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li')
    const $third = $('.third')
    expect($third.prev()).toEqual({0: lis[1], length: 1, prevObject: $third})
  })

  test('Selector', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li')
    const $third = $('.third')
    expect($third.prev('.second')).toEqual({0: lis[1], length: 1, prevObject: $third})
    expect($third.prev('.first')).toEqual({length: 0, prevObject: $third})
  })
})