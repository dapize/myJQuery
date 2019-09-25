require('../myJQuery');

describe('Selector', () => {

  test('Empty', () => {
    const empty = $();
    expect(empty).toEqual({});
    expect(empty.length).toBe(0);
  });

  test('Object Literal', () => {
    const foo = { foo: "bar", hello: "world" };
    const $foo = $(foo);
    expect($foo).toEqual({0: foo, length: 1});
  });

  test('jQuery Node', () => {
    document.body.innerHTML = '<div class="jquery" id="nodejQuery"></div>';
    const $nodejQuery = $('#nodejQuery');
    const controlObj = Object.assign(Object.create(null), $nodejQuery);
    const $cloneNodeJQ = $($nodejQuery);
    $nodejQuery.otherProp = "I'm other property";
    expect($cloneNodeJQ).toEqual(controlObj);
    expect($cloneNodeJQ).not.toEqual($nodejQuery);
  });

  test('Tag', () => {
    document.body.innerHTML = '<ul></ul>'
    const ulNode = document.querySelector('ul');
    const ul = $('ul');
    expect(ul).toEqual({0: ulNode, length: 1});
    expect(ul[0]).toEqual(ulNode);
  });

  test('Class Name (unic node)', () => {
    document.body.innerHTML = '<div class="wrapper"></div>'
    const wrapper = document.querySelector('.wrapper');
    const $wrapper = $('.wrapper');
    expect($wrapper).toEqual({0: wrapper, length: 1});
    expect($wrapper[0]).toEqual(wrapper);
  });

  test('Class Name (many nodes)', () => {
    document.body.innerHTML = '<div class="item"></div><div class="item"></div><div class="item"></div>'
    const item = document.querySelectorAll('.item');
    const $item = $('.item');
    expect($item).toEqual({0: item[0], 1: item[1], 2: item[2], length: 3});
  });

  test('ID', () => {
    document.body.innerHTML = '<div id="container"></div>'
    const container = document.getElementById('container');
    const $container = $('#container');
    expect($container).toEqual({0: container, length: 1});
  });

  

})