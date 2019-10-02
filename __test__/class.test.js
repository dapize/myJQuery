const $ = require('../jQuery-library');

describe('.hasClass(), .addClass(), .removeClass()', () => {

  test('.hasClass()', () => {
    document.body.innerHTML = `
      <div class="container">
        <ul>
          <li>item 1</li>
          <li class="item">item 2</li>
          <li>item 3</li>
        </ul>
      </div>`;
    expect($(document.querySelector('div')).hasClass('container')).toBeTruthy();
    expect($('li').hasClass('item')).toBeTruthy();
    expect($('li').hasClass('section')).toBeFalsy();
  })

  test('.addClass()', () => {
    const htmlLis = `
      <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
      </ul>`;
    document.body.innerHTML = htmlLis;
    const lis = document.querySelectorAll('li');
    const $li = $('li');
    expect($li.addClass('item')).toEqual({0: lis[0], 1: lis[1], 2: lis[2], length: 3, prevObject: {0: document, length: 1}})

    $li.addClass(function (index, currentClassName) {
      return currentClassName + '-' + index
    })

    lis.forEach(function (li, index) {
      expect(li.classList.contains('item')).toBeTruthy()
      expect(li.classList.contains('item-' + index)).toBeTruthy()
    })
  })

  test('.removeClass()',  () => {
    const htmlLis = `
      <ul class="list">
        <li class="item item-1">item 1</li>
        <li class="item item-2">item 2</li>
        <li class="item item-3">item 3</li>
      </ul>`;
    $('ul').removeClass('list')
    expect(document.querySelector('ul').classList.contains('list')).toBeFalsy()

    const $li = $('li');
    $li.removeClass('item')
    $('li').removeClass(function (index, currentClassName){
      return currentClassName + '-' + index
    })
    document.querySelectorAll('li').forEach(function (li, index) {
      expect(li.classList.contains('item')).toBeFalsy()
      expect(li.classList.contains('item-' + index)).toBeFalsy()
    })
  })
  
})