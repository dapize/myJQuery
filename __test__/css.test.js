const $ = require('../jQuery-library');

describe('Manipulation > Class Attribute | CSS', () => {
  test('.hasClass()', () => {
    document.body.innerHTML = `
      <ul>
        <li class="top">item 1</li>
        <li class="second">item 2</li>
        <li class="item-3">item 3</li>
      </ul>
    `;
    const li = document.querySelector('li');
    expect(li.classList.contains('top')).toBeTruthy()
    expect($(li).hasClass('top')).toBeTruthy()

    const $lis = $('li');
    expect($lis.hasClass('second')).toBeTruthy();
    expect($lis.hasClass('any')).toBeFalsy()
  })
})