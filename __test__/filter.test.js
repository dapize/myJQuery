const $ = require('../jQuery-library');

const items = `
  <ul>
    <li class="odd">odd</li>
    <li><span>even</span></li>
    <li class="odd">odd</li>
    <li><span>even</span></li>
    <li class="odd">odd</li>
  </ul>
`;

describe('.filter()', () => {
  test('Selector (class name)', () => {
    document.body.innerHTML = items;
    $('li').filter('.odd').addClass('black');
    const lis = document.querySelectorAll('li');
    [0, 2, 4].forEach(function(index) {
      expect(lis[index].classList.contains('black')).toBeTruthy();
    })
  })

  test('function', () => {
    document.body.innerHTML = items;
    const lis = document.querySelectorAll('li');
    const $lis = $('li')
    const $events = $lis
      .filter(function (index) {
        return index % 2
      })
      .addClass('even');
    expect($events.length).toBe(2);
    expect(lis[1].classList.contains('even')).toBeTruthy();
    expect(lis[3].classList.contains('even')).toBeTruthy();

    const $lisSpans = $lis
      .filter(function () {
        return this.querySelector('span')
      })
    expect($lisSpans.length).toBe(2)
    expect($lisSpans[0]).toEqual(lis[1])
    expect($lisSpans[0]).toEqual(lis[3])
  })

  test('Node', () => {
    document.body.innerHTML = items;
    const $lis = $('li');
    const secondLi = document.querySelectorAll('li')[1];
    const $secondLi = $lis.filter(secondLi);
    expect($secondLi).toEqual({0: secondLi, length: 1, prevObject: $lis});
  })

  test('jQuery Node', () => {
    document.body.innerHTML = items;
    const $lis = $('li');
    const $odds = $('.odd');
    const $oddsLis = $lis.filter($odds);
    expect($oddsLis).toEqual({0: $odds[0], 1: $odds[1], 2: $odds[2], length: 3, prevObject: $lis});
  })

});

