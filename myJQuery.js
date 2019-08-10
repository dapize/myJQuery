(function (document, window) {

  function myjQuery (selector, from) {
    var elS, _this = this;
    if (typeof selector === 'string') { // cuando se pasa selector
      var fromEl = document;
      var elAll;
      var selectorTrim = selector.trim();
      if (from !== undefined) {
        elAll = [];
        from.forEach( function (el) {
          _this._map(el.querySelectorAll(selectorTrim)).forEach( function (node) { elAll.push(node) });
        });
      } else {
        elAll = fromEl.querySelectorAll(selectorTrim);
      }
      elS = this._map(elAll);
    } else { // cuando se pasa un nodo(s)...
      if (selector.length) {
        elS = this._map(selector);
      } else {
        elS = !Array.isArray(selector) ? [selector] : [];
      }
    }
    this.elS = elS;
    this.length = this.elS.length;
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
    this.elS.forEach( function (el) {
      el[methodName](arg1, arg2, arg3);
    });
    return this;
  };

  myProto._map = function (els) {
    return Array.isArray(els) ? els : Array.prototype.map.call(els, function (el) { return el });
  };

  myProto._ccpnps = function (nameMethod) {
    var _this = this, items = [], fnGo;
    this.elS.forEach( function (el) {
      fnGo = el[nameMethod];
      if (fnGo !== null) {
        if (fnGo.length) {
          _this._map(fnGo).forEach( function (item) { items.push(item) });
        } else {
          if (!HTMLCollection.prototype.isPrototypeOf(fnGo)) items.push(fnGo);
        }
      }
    });
    return items;
  };

  myProto._clTypes = function (type, el, nameClass) {
    var clReturn = false;
    if (type === 'add' || type === 'remove' || type === 'toggle') {
      el.classList[type](nameClass);
    } else { // contains
      if (el.classList.contains(nameClass)) clReturn = true
    }
    return clReturn;
  };
  
  myProto._classList = function (nameS, type) {
    var _this = this, elS = this.elS, csReturn = false;
    if (elS.length) {
      nameS.split(' ').forEach( function (nameClass) {
        elS.forEach( function (el) {
          if (!csReturn) csReturn = _this._clTypes(type, el, nameClass);
        })
      });
      if (type === 'contains') _this = csReturn;
    }
    return _this;
  };

  myProto.on = function (event, cb) {
    return this._forEach('addEventListener', event, cb)
  };

  myProto.hasClass = function (nameS) {
    return this._classList(nameS, 'contains');
  };
  
  myProto.addClass = function (nameS) {
    return this._classList(nameS, 'add');
  };
  
  myProto.removeClass = function (nameS) {
    return this._classList(nameS, 'remove');
  };

  myProto.toggleClass = function (nameS) {
    return this._classList(nameS, 'toggle');
  };

  myProto.attr = function (nameAttr, valAttr) {
    var _this = this;
    valAttr ? this._forEach('setAttribute', nameAttr, valAttr) : _this = this.elS[0].getAttribute(nameAttr);
    return _this;
  };

  myProto.removeAttr = function (nameAttrS) {
    var _this = this;
    nameAttrS.split(' ').forEach( function (nameAttr) { _this._forEach('removeAttribute', nameAttr) });
    return this;
  };

  myProto.text = function (txt) {
    var _this = this;
    if (txt) {
      textReturn = this._forEach('textContent', txt)
    } else {
      _this = this.elS.map( function (el) {
        return el.textContent;
      }).join('');
    }
    return _this;
  };

  myProto.val = function () {
    return this.elS[0].value;
  };

  myProto.html = function (html) {
    var _this = this;
    html ? this.elS[0].innerHTML = html : _this = this.elS[0].innerHTML;
    return _this;
  };

  myProto.remove = function () {
    this.elS.forEach(function (el) { el.parentNode.removeChild(el) });
    return this;
  };

  myProto.empty = function () {
    this.elS.forEach(function (el) { el.innerHTML = '' });
    return this;
  };

  myProto.children = function () {
    return jQuery(this._ccpnps('children'));
  };

  myProto.contents = function () {
    return jQuery(this._ccpnps('childNodes'));
  };

  myProto.parent = function () {
    return jQuery(this._ccpnps('parentNode'));
  };

  myProto.next = function () {
    return jQuery(this._ccpnps('nextElementSibling'));
  };

  myProto.prev = function () {
    return jQuery(this._ccpnps('previousElementSibling'));
  };
  
  myProto.siblings = function () {
    var siblings = [];
    this.elS.forEach( function (el) {
      Array.prototype.forEach.call(el.parentNode.children, function(child){
        if (child !== el) siblings.push(child);
      });
    });
    return jQuery(siblings);
  };
  
  myProto.find = function (selector) {
    return jQuery(selector, this.elS);
  };

  myProto.each = function (cb) {
    this.elS.forEach( function (i, e) {
      cb(i, e);
    });
  };

}(document, window));