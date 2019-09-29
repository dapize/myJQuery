const $ = require('../jQuery-library');

describe('.data()', () => {

  test('Setting Data', () => {
    document.body.innerHTML = '<div id="vault1"></div>';
    
    const vault1 = document.getElementById('vault1');
    const dataVault1 = 'i\'m Fine';
    $(vault1).data('how-are-you', dataVault1);
    const $dataVault1 = $(vault1).data('howAreYou')
    const $dataVault1b = $(vault1).data('how-are-you')
    expect($dataVault1).toBe(dataVault1);
    expect($dataVault1b).toBe(dataVault1);
  });

  test('Getting Data with large name', () => {
    document.body.innerHTML = '<div id="vault3" data-perfect-code="myJQuery"></div>';

    const vault3 = document.getElementById('vault3');
    const $dataVault3 = $(vault3).data('perfectCode');
    const $dataVault3b = $(vault3).data('perfect-code');
    expect($dataVault3).toBe('myJQuery');
    expect($dataVault3b).toBe('myJQuery');
  }) 

  test('Getting Data with attribute and jQuery Data', () => {
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
})