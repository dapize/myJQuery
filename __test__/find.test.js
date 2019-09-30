const $ = require('../jQuery-library');

const items = `
  <main>
    <section class="principal block">
      <div class="item">item 1</div>
      <div class="item item-2">item 2</div>
      <div class="item">item 3</div>
    </section>
    <article id="secondary" class="block">
      <div class="item" id="outside">item outside 1</div>
      <div class="item item-2">item outside 1</div>
    </article>
    <ul>
      <li>item 1</li>
      <li class="item-2" id="item-2">item 2</li>
      <li>item 3</li>
    </ul>
  </main>
`;

describe('.find()', () => {

  test('By tag', () => {
    document.body.innerHTML = items
    const $ul = $('ul');
    const $lis = $ul.find('li');
    const li = document.querySelectorAll('li');
    expect($lis).toEqual({0: li[0], 1: li[1], 2: li[2], length: 3, prevObject: $ul});
  });

  test('By ClassName', () => {
    document.body.innerHTML = items
    const divItems = document.querySelector('.principal').querySelectorAll('.item');
    const $principal = $('.principal')
    const $items = $principal.find('.item');
    expect($items).toEqual({0: divItems[0], 1: divItems[1], 2: divItems[2], length: 3, prevObject: $principal})

    const $video = $principal.find('.video');
    expect($video.length).toBe(0);
  });

  test('By Node', () => {
    document.body.innerHTML = items
    const item2 = document.getElementById('item-2');
    const $ul = $('ul');
    const $item2 = $ul.find(item2);
    expect($item2).toEqual({0: item2, length: 1, prevObject: $ul});

    const article = document.querySelector('article');
    const $article = $(article)
    const $item2Find = $article.find(item2);
    expect($item2Find).toEqual({length: 0, prevObject: $article});
  });

  test('By jQuery Node', () => {
    document.body.innerHTML = items
    const outside = document.getElementById('outside');
    const $secondary = $('#secondary');
    const $outside = $secondary.find($('#outside'));
    expect($outside).toEqual({0: outside, length: 1, prevObject: $secondary});
  });
})
