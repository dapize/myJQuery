const $ = require('../jQuery-library');

describe('Traversing > Miscellaneous Traversing', () => {
  test('.end()', () => {
    document.body.innerHTML = `
      <ul>
        <li class="first">item 1</li>
        <li class="second">item 2</li>
        <li class="third">item 3</li>
      </ul>
    `;
    const first = document.querySelector('.first');
    const third = document.querySelector('.third');
    $('ul').find('.first').addClass('item-1').end().find('.third').addClass('item-3');
    expect(first.classList.contains('item-1')).toBeTruthy();
    expect(third.classList.contains('item-3')).toBeTruthy();
  })
})