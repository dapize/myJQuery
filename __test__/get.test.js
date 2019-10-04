const $ = require('../jQuery-library');

describe('.get()', () => {
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
      expect($li.get(index)).toEqual(li)
      if (index) {
        expect($li.get(index * -1)).toEqual(lis[nLis])
        nLis -= 1
      }
    })
  })
})