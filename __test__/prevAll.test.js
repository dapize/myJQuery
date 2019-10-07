const $ = require('../jQuery-library');

const items =  `
  <ul>
    <li class="odd">list item 1</li>
    <li class="even">list item 2</li>
    <li class="odd">list item 3</li>
    <li class="even">list item 4</li>
    <li class="fifth">list item 5</li>
    <li>list item 6</li>
  </ul>
`;

describe('.prevAll()', () => {

  test('Simple', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li')
    const $fifth = $('.fifth')
    expect($fifth.prevAll()).toEqual({0: lis[3], 1: lis[2], 2: lis[1], 3: lis[0], length: 4, prevObject: $fifth})
  })

  test('Selector', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li')
    const $fifth = $('.fifth')
    expect($fifth.prevAll('.odd')).toEqual({0: lis[2], 1: lis[0], length: 2, prevObject: $fifth})
    expect($fifth.prevAll('.even')).toEqual({0: lis[3], 1: lis[1], length: 2, prevObject: $fifth})
    expect($fifth.prevAll('.empty')).toEqual({length: 0, prevObject: $fifth})
  })
})