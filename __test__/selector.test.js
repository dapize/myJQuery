require('../myJQuery')

describe('Selector', () => {

  test('Empty', () => {
    const empty = $();
    expect(empty).toEqual({})
    expect(empty.length).toBe(0)
  })

  test('UL tag', () => {
    document.body.innerHTML = `
      <ul>
        <li>Item 3</li>
        <li>Item 3</li>
        <li>Item 3</li>
      </ul>
    `;
    const ulNode = document.querySelector('ul');
    const ul = $('ul')
    expect(ul).toEqual({0: ulNode, length: 1});
    expect(ul[0]).toEqual(ulNode);
  })

})