const $ = require('../jQuery-library');

describe('.first()', () => {

  test('Simple', () => {
    document.body.innerHTML =  `
      <ul>
        <li>list item 1</li>
        <li>list item 2</li>
        <li>list item 3</li>
      </ul>
    `;
    const lis = document.querySelectorAll('li')
    const $lis = $('li')
    expect($lis.first()).toEqual({0: lis[0], length: 1, prevObject: $lis})
  })
})