const $ = require('../jQuery-library');

const html =  `
  <ul class="level-1 parent">
    <li class="item-i">I</li>
    <li class="item-ii parent good">II
      <ul class="level-2 parent">
        <li class="item-a">A</li>
        <li class="item-b parent good">B
          <ul class="level-3 parent">
            <li class="item-1">1</li>
            <li class="item-2">2</li>
            <li class="item-3">3</li>
          </ul>
        </li>
        <li class="item-c">C</li>
      </ul>
    </li>
    <li class="item-iii">III</li>
  </ul>
`;

describe('.parents()', () => {

  test('Simple', () => {
    document.body.innerHTML = html;
    const $item1 = $('.item-1')
    const parents = document.querySelectorAll('.parent');
    expect($item1.parents()).toEqual({
      0: parents[4],
      1: parents[3],
      2: parents[2],
      3: parents[1],
      4: parents[0],
      5: document.body,
      6: document.documentElement,
      length: 7,
      prevObject: $item1
    })
  })

  test('Selector', () => {
    document.body.innerHTML = html;
    const $item1 = $('.item-1')
    const parents = document.querySelectorAll('.good');
    expect($item1.parents('.good')).toEqual({
      0: parents[1],
      1: parents[0],
      length: 2,
      prevObject: $item1
    })
  })

})