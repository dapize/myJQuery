const $ = require('../jQuery-library');

describe('.removeProp()', () => {

  test('In a Object', () => {
    const obj = {firstName:'John', lastName: 'Smith'};
    const $obj = $(obj);
    $obj.removeProp('firstName')
    expect($obj).toEqual({0: {lastName: 'Smith'}, length: 1})
  });

  test('In a node', () => {
    document.body.innerHTML = '<div></di>';
    const div = document.querySelector('div')
    const $div = $(div);
    $div.prop('word', 'myJQuery');
    expect(div.word).toBe('myJQuery');

    $div.removeProp('word')
    expect(div.word).toBeUndefined()
  })
})