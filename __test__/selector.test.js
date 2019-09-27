const $ = require('../jQuery-library');

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
    expect(ul).toEqual({0: ulNode, length: 1, prevObject: { 0: document, length: 1 }});
    expect(ul[0]).toEqual(ulNode);
  });

  test('Class Name (unic node)', () => {
    document.body.innerHTML = '<div class="wrapper"></div>'
    const wrapper = document.querySelector('.wrapper');
    const $wrapper = $('.wrapper');
    expect($wrapper).toEqual({0: wrapper, length: 1, prevObject: { 0: document, length: 1 }});
    expect($wrapper[0]).toEqual(wrapper);
  });

  test('Class Name (many nodes)', () => {
    document.body.innerHTML = '<div class="item"></div><div class="item"></div><div class="item"></div>'
    const items = document.querySelectorAll('.item');
    const $items = $('.item');
    expect($items).toEqual({0: items[0], 1: items[1], 2: items[2], length: 3, prevObject: { 0: document, length: 1 }});
  });

  test('Tag and Class Name With Context', () => {
    document.body.innerHTML = `
      <main>
        <section class="principal block">
          <div class="item">item 1</div>
          <div class="item item-2">item 2</div>
          <div class="item item-3">item 3</div>
        </section>
        <article id="secondary" class="block">
          <div class="item">item outside 1</div>
          <div class="item item-2">item outside 1</div>
        </article>
      </main>
    `;
    const section = document.querySelector('section');
    const divs = section.querySelectorAll('div');

    const $divs = $('div', section); // by tag with context node
    const $items = $('.item', section); // by class with context node
    divs.forEach( (div, index) => {
      expect($divs[index]).toEqual(div);
      expect($items[index]).toEqual(div);
    });
    expect($divs.length).toBe(3);
    const prevObj = {0: section, length: 1, prevObject: {0: document, length: 1}};
    expect($divs).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: prevObj});
    expect($items.length).toBe(3);
    expect($items).toEqual({0: divs[0], 1: divs[1], 2: divs[2], length: 3, prevObject: prevObj});


     // by class with context node jQuery
    const $main = $('main');
    const $blocks = $('.block');
    
    const $item2b = $('.item-2', $blocks);
    const item2 = document.querySelectorAll('.item-2');

    const objReturn = {0: item2[0], 1: item2[1], length: 2};
    
    const $item2 = $('.item-2', $main);
    expect($item2).toEqual(objReturn);
    expect($item2b).toEqual(objReturn);

    const sectionPrincipal = document.querySelector('.principal');
    const item3 = document.querySelector('.item-3');
    const $item3 = $(item3, sectionPrincipal);
    expect($item3.length).toBe(1);
    expect($item3).toEqual({0: item3, length: 1});
  });

  test('ID', () => {
    document.body.innerHTML = '<div id="container"></div>'
    const container = document.getElementById('container');
    const $container = $('#container');
    expect($container).toEqual({0: container, length: 1, prevObject: { 0: document, length: 1 }});
    const $container2 = $('#container2');
    expect($container2.length).toBe(0);
  });

  test('Node DOM', () => {
    const newDiv = document.createElement('div');
    document.body.appendChild(newDiv);
    const div = document.querySelector('div');
    const $div = $(div);
    expect($div).toEqual({0: div, length: 1, prevObject: { 0: document, length: 1 }});
  });

  test('Nodes DOM', () => {
    document.body.innerHTML = '<div class="item"></div><div class="item"></div><div class="item"></div>'
    const items = document.querySelectorAll('.item');
    const $items = $(items);
    expect($items).toEqual({0: items[0], 1: items[1], 2: items[2], length: 3, prevObject: { 0: document, length: 1 }});
  });
})