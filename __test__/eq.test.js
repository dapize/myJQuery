const $ = require('../jQuery-library');

describe('.eq()', () => {
  test('Simple', () => {
    document.body.innerHTML = `
    <ul>
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
      <li>item 4</li>
      <li>item 5</li>
    </ul>
  `;
    const lis = document.querySelectorAll('li');
    const $li = $('li');
    let nLis = lis.length - 1;
    lis.forEach(function (li, index) {
      expect($li.eq(index)).toEqual({0: li, length: 1, prevObject: $li})
      if (index) {
        expect($li.eq(index * -1)).toEqual({0: lis[nLis], length: 1, prevObject: $li})
        nLis -= 1
      }
    })
  })
})