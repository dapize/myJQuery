const $ = require('../jQuery-library');

describe('.prop()', () => {

  test('In a Object', () => {
    const $obj = $({firstName:'John'});
    expect($obj.prop('firstName')).toBe('John');
  });

  test('In a Node', () => {
    document.body.innerHTML = `
      <input type="checkbox" class="check1" checked="checked">
      <input type="checkbox" class="check2">
      <input type="checkbox" class="check3">
      <input type="checkbox" class="check4" checked="checked">
    `;
    const check1 = document.querySelector('.check1');
    expect(check1.checked).toBeTruthy()

    $(check1).prop('checked', false);
    expect(check1.checked).toBeFalsy()

    const $inputs = $('input');
    $inputs.prop('checked', false);
    const inputs = document.querySelectorAll('input')
    inputs.forEach(function (input) {
      expect(input.checked).toBeFalsy()
    });

    const $input4 = $('.check4');
    $input4.prop({ name: 'item 4' })
    expect($input4.prop('name')).toBe('item 4');

    $($inputs[0]).prop('checked', true)
    $($inputs[3]).prop('checked', true)
    $inputs.prop('checked', function (index, state) {
      return !state
    })
    expect($($inputs[0]).prop('checked')).toBeFalsy();
    expect($($inputs[1]).prop('checked')).toBeTruthy();
    expect($($inputs[2]).prop('checked')).toBeTruthy();
    expect($($inputs[3]).prop('checked')).toBeFalsy();

  })
  
})