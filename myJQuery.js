(function (document, window) {

  function myjQuery (selector, from) {
    var fromEl = from || document;
    var elS;
    if (typeof selector === 'string') {
      elS = fromEl.querySelectorAll(selector.trim());
      if (!elS.length) return console.log(selector + ' no found.');
    } else {
      if (selector === null) return console.log(selector + ' no found.');
      elS = selector;
    }
    this.elS = elS;
  };

  var jQuery = function (selector, from) {
    return new myjQuery(selector, from);
  };

  window.jQuery = jQuery;
  window.$ = jQuery;
  window.$document = jQuery(document);
  window.$window = jQuery(window);
  
  var myProto = myjQuery.prototype;
  
  myProto._forEach = function (methodName, arg1, arg2, arg3) {
    var elS = this.elS;
    if (elS.length) {
      Array.prototype.forEach.call(this.elS, function (el) {
        el[methodName](arg1, arg2, arg3);
      });
    } else {
      elS[methodName](arg1, arg2, arg3);
    }
    return this;
  };
  
  myProto._classList = function (nameS, type) {
    var elS = this.elS;
    nameS.split(' ').forEach( function (nameClass) {
      if (elS.length) {
        Array.prototype.forEach.call(elS, function (el) {
          el.classList[type](nameClass);
        })
      } else {
        elS.classList[type](nameClass);
      }
    });
    return this;
  };
  
  myProto.on = function (event, cb) {
    return this._forEach('addEventListener', event, cb)
  };
  
  myProto.text = function (txt) {
    return this._forEach('textContent', txt)
  };
  
  myProto.addClass = function (nameS) {
    return this._classList(nameS, 'add');
  };
  
  myProto.removeClass = function (nameS) {
    return this._classList(nameS, 'remove');
  };
  
  myProto.find = function (selector) {
    console.log(this.elS);
    // return jQuery(selector, this.elS);
  };

}(document, window));