const $ = require('../jQuery-library');

describe('.data()', () => {

  test('Setting Data string in a Node', () => {
    document.body.innerHTML = '<div id="vault1"></div>';
    
    const vault1 = document.getElementById('vault1');
    const dataVault1 = 'i\'m Fine';
    $(vault1).data('how-are-you', dataVault1);
    const $dataVault1 = $(vault1).data('howAreYou')
    const $dataVault1b = $(vault1).data('how-are-you')
    expect($dataVault1).toBe(dataVault1);
    expect($dataVault1b).toBe(dataVault1);
  });

  test('Setting Data object in a Node', () => {
    document.body.innerHTML = '<div id="vault1"></div>';
    const $vault1 = $('#vault1');
    const objData = { first: 'data 1', second: 'data 2', third: 'data 3'};
    $vault1.data(objData);
    const $dataVault1 = $vault1.data();
    expect($dataVault1).toEqual(objData);
  })

  test('Getting Data with large name in a Node', () => {
    document.body.innerHTML = '<div id="vault3" data-perfect-code="myJQuery"></div>';

    const vault3 = document.getElementById('vault3');
    const $dataVault3 = $(vault3).data('perfectCode');
    const $dataVault3b = $(vault3).data('perfect-code');
    expect($dataVault3).toBe('myJQuery');
    expect($dataVault3b).toBe('myJQuery');
  }) 

  test('Getting Data with attribute and jQuery Data in a Node', () => {
    document.body.innerHTML = '<div id="vault2" data-content="secret-code"></div>';
  
    const vault2 = document.getElementById('vault2');
    const oldDataVault2 = 'secret-code';
    const $oldDataVault2 = $(vault2).data('content');
    expect($oldDataVault2).toBe(oldDataVault2);

    const newDataVault2 = 'public-code';
    $(vault2).data('content', newDataVault2);
    const $newDataVault2 = $(vault2).data('content');
    expect($newDataVault2).toBe(newDataVault2);
    expect($newDataVault2).not.toBe(oldDataVault2);
  });

  test('Removing Data in a Node', () => {
    document.body.innerHTML = '<div></div>';
    const $div = $('div');
    $div.data('first', 'word');
    $div.data('second', 'place');
    const $divData = $div.data();
    expect($divData).toEqual({first: 'word', second: 'place'});

    $div.removeData('second')
    expect($div.data()).toEqual({first: 'word'});

    $div.removeData()
    expect($div.data()).toEqual(Object.create(null));
  })

  test('Setting Data Object', () => {
    const objData = { first: 'data 1', second: 'data 2', third: 'data 3' };
    const objJquery = $({one: 'item'});
    objJquery.data(objData);
    expect(objJquery.data()).toEqual(objData);
  })
})

describe('$.data()', () => {

  test('Setting Data string', () => {
    document.body.innerHTML = '<div id="vault1"></div>';
    
    const vault1 = document.getElementById('vault1');
    const dataVault1 = 'i\'m Fine';
    const $settingData = $.data(vault1, 'how-are-you', dataVault1);
    expect($settingData).toBe(dataVault1);

    const $dataVault1 = $.data(vault1, 'howAreYou')
    const $dataVault1b = $.data(vault1, 'how-are-you')
    expect($dataVault1).toBe(dataVault1);
    expect($dataVault1b).toBe(dataVault1);

    const oneObject = {item1: 'simple value'};
    const $dataVault1c = $.data(vault1, 'one-object', oneObject)
    expect($dataVault1c).toEqual(oneObject);

    const $finalData = $.data(vault1);
    expect($finalData).toEqual({
      oneObject: oneObject,
      howAreYou: dataVault1
    });
  });

  test('Setting Data Object', () => {
    document.body.innerHTML = '<div></div>';
    const objData = { first: 'data 1', second: 'data 2', third: 'data 3' };
    const div = document.querySelector('div');
    $.data(div, objData);
    expect($.data(div)).toEqual(objData);
  });

  test('Removing Data string', () => {
    document.body.innerHTML = '<div></div>';
    const div = document.querySelector('div');
    const objData = { first: 'data 1', second: 'data 2', third: 'data 3' };
    $.data(div, objData);

    const secondData = $.data(div, 'second');
    expect(secondData).toBe('data 2');

    $.removeData(div, 'first');
    expect($.data(div)).toEqual({second: 'data 2', third: 'data 3'})

    $.removeData(div);
    expect($.data(div)).toEqual(Object.create(null));
  });

  test('HasData', () => {
    document.body.innerHTML = '<div></div>';
    const div = document.querySelector('div');
    expect($.hasData(div)).toBeFalsy();

    $.data(div, 'key', 'empty')
    expect($.hasData(div)).toBeTruthy();
  });
})