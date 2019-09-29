const $ = require('../jQuery-library');

describe('.html()', () => {

  test('Setting', () => {
    document.body.innerHTML = '<div></div>';
    const $div = $('div');
    const newHtml = '<div class="demo-box">Demonstration Box</div>';
    const $html = $div.html(newHtml);
    expect($html).toEqual($div);
  });

  test('Getting', () => {
    document.body.innerHTML = '<div id="container"><div class="demo-box">Demonstration Box</div></div>';
    const div = document.querySelector('div').innerHTML;
    const $html = $('#container').html();
    expect($html).toBe(div);
  });

  test('Function', () => {
    document.body.innerHTML = '<ul><li>item 1</li><li>item 2</li><li>item 3</li></ul><div class="wrapper"></div>';
    function newHtml (n) {
      return '<span>Exists Li: </span> <strong> ' + n + ' </strong>'
    }
    const $wrapper = $('.wrapper');
    $wrapper.html(function () {
      return newHtml($('li').length)
    })
    expect($wrapper.html()).toBe(newHtml(3))
  });
});