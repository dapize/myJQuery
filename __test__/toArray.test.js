const $ = require('../jQuery-library');

describe('.toArray()', () => {
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
  expect($('li').toArray()).toEqual([lis[0], lis[1], lis[2], lis[3], lis[4]])
  })
})