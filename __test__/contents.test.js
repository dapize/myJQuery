const $ = require('../jQuery-library');

describe('.contents()', () => {
  test('Simple', () => {
    document.body.innerHTML = `
      <div class="container">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
        do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <br><br>
        Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.
        <br><br>
        Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore eu fugiat nulla pariatur.
      </div>
    `;
    const $container = $('.container');
    const $contents = $('.container').contents();
    const childNodes = document.querySelector('.container').childNodes;
    childNodes.forEach(function (child, index) {
      expect(child).toEqual($contents[index]);
    })
    expect($contents.length).toBe(childNodes.length);
    expect($contents.prevObject).toEqual($container);
  })
})