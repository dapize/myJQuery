const $ = require('../jQuery-library');

describe('.last()', () => {

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
    expect($lis.last()).toEqual({0: lis[2], length: 1, prevObject: $lis})
  })
})