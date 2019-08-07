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
  window.jQuery.document = jQuery(document);
  window.jQuery.window = jQuery(window);
  
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

  myProto._clContains = function (type, el, nameClass) {
    return (type === 'contains' && el.classList.contains(nameClass)) ? true : el.classList[type](nameClass);
  };
  
  myProto._classList = function (nameS, type) {
    var _this = this;
    var csReturn = false;
    var elS = this.elS;
    nameS.split(' ').forEach( function (nameClass) {
      if (elS.length) {
        Array.prototype.forEach.call(elS, function (el) {
          if (!csReturn) csReturn = _this._clContains(type, el, nameClass);
        })
      } else {
        if (!csReturn) csReturn = _this._clContains(type, elS, nameClass);
      }
    });
    if (type === 'contains') _this = csReturn;
    return _this;
  };
  
  myProto.on = function (event, cb) {
    return this._forEach('addEventListener', event, cb)
  };
  
  myProto.addClass = function (nameS) {
    return this._classList(nameS, 'add');
  };
  
  myProto.removeClass = function (nameS) {
    return this._classList(nameS, 'remove');
  };

  myProto.hasClass = function (nameS) {
    return this._classList(nameS, 'contains');
  };

  myProto.attr = function (nameAttr, valAttr) {
    var _this = this;
    if (valAttr) {
      this._forEach('setAttribute', nameAttr, valAttr)
    } else {
      _this = this.elS.length ? this.elS[0].getAttribute(nameAttr) : this.elS.getAttribute(nameAttr);
    }
    return _this;
  };

  myProto.removeAttr = function (nameAttrS) {
    var _this = this;
    nameAttrS.split(' ').forEach( function (nameAttr) {
      _this._forEach('removeAttribute', nameAttr)
    });
    return this;
  };

  myProto.siblings = function () {
    // a trabajar
  };

  myProto.text = function (txt) {
    return this._forEach('textContent', txt)
  };
  
  myProto.find = function (selector) {
    // a trabajar
  };

}(document, window));