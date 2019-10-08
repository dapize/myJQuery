const $ = require('../jQuery-library');

describe('.css()',  () => {

  test('Simple set', () => {
    document.body.innerHTML = '<div></div>';
    const $div = $('div');
    const div = document.querySelector('div');

    $div.css('margin-bottom', 100)
    expect(getComputedStyle(div).getPropertyValue('margin-bottom')).toBe('100px');

    $div.css('top', '50px');
    expect(getComputedStyle(div).getPropertyValue('top')).toBe('50px');
  })

  test('Simple set relative value', () => {
    document.body.innerHTML = `
      <style>
        .div1 {
          width: 100px;
        }
        .div2 {
          height: 200px;
        }
      </style>
      <div class="div1"></div>
      <div class="div2"></div>
    `;
    $('.div1').css('width', '+=50');
    $('.div2').css('height', '-=50');
    expect(getComputedStyle(document.querySelector('.div1')).getPropertyValue('width')).toBe('150px');
    expect(getComputedStyle(document.querySelector('.div2')).getPropertyValue('height')).toBe('150px');
  })

  test('Object set', () => {
    document.body.innerHTML = '<div></div>';
    const div = document.querySelector('div');
    $('div').css({
      'margin-bottom': 100,
      'top': '50px'
    });
    expect(getComputedStyle(div).getPropertyValue('margin-bottom')).toBe('100px');
    expect(getComputedStyle(div).getPropertyValue('top')).toBe('50px');
  })

  test('Function set', () => {
    document.body.innerHTML = `
      <style>
        .item-1 {
          width: 50px;
        }
        .item-2 {
          width: 100px;
        }
        .item-3 {
          width: 150px;
        }
      </style>
      <ul>
        <li class="item-1"></li>
        <li class="item-2"></li>
        <li class="item-3"></li>
      </ul>
    `;
    const $li = $('li');
    $li.css('width', function (index, value) {
      return parseFloat(value) + 50
    });
    expect($li.eq(0).css('width')).toBe('100px')
    expect($li.eq(1).css('width')).toBe('150px')
    expect($li.eq(2).css('width')).toBe('200px')
  })

  test('Simple get', () => {
    document.body.innerHTML = `
      <style>
        div {
          margin-bottom: 100px;
          top: 50px;
        }
      </style>
      <div></div>
    `;
    const $div = $('div');
    expect($div.css('margin-bottom')).toBe('100px');
    expect($div.css('top')).toBe('50px');
  });

  test('Array get', () => {
    document.body.innerHTML = `
      <style>
        div {
          margin-bottom: 100px;
          top: 50px;
        }
      </style>
      <div></div>
    `;
    expect($('div').css(['margin-bottom', 'top'])).toEqual({'margin-bottom': '100px', top: '50px'});
  });
})