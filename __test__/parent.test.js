const $ = require('../jQuery-library');

const html =  `
  <main>
    <div>div,
      <strong>strong,
        <span>span, </span>
        <em class="parent">em,
          <b>b - first, </b>
        </em>
      </strong>
      <b>b - second</b>
    </div>
  </main>
`;

describe('.parent()', () => {

  test('Simple', () => {
    document.body.innerHTML = html;
    const $b = $('b')
    expect($b.parent()).toEqual({0: document.querySelector('em'), 1: document.querySelector('div'), length: 2, prevObject: $b})
  })

  test('Selector', () => {
    document.body.innerHTML = html;
    const $b = $('b')
    expect($b.parent('.parent')).toEqual({0: document.querySelector('em'), length: 1, prevObject: $b})
  })

})