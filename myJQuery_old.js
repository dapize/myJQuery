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
        elAll = this._map(fromEl.querySelectorAll(selectorTrim));
      }
      elS = elAll;
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
          _this._map(fnGo).forEach( function (item) {
            if (items.indexOf(item) === -1) items.push(item)
          });
        } else {
          if (!HTMLCollection.prototype.isPrototypeOf(fnGo)) {
            if (items.indexOf(fnGo) === -1) items.push(fnGo)
          }
        }
      }
    });
    return items;
  };

  myProto._classListTypes = function (type, el, nameClass) {
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
          if (!csReturn) csReturn = _this._classListTypes(type, el, nameClass);
        })
      });
      if (type === 'contains') _this = csReturn;
    }
    return _this;
  };

  myProto._classListFn = function (nameS, type) {
    var preName = type === 'contains' ? 'has' : type;
    if (typeof nameS === 'function') {
      this.elS.forEach(function (item, index) {
        jQuery(item)[preName + 'Class'](nameS.call(item, index, item.getAttribute('class')));
      });
    } else {
      this._classList(nameS, type);
    }
    return this;
  };

  // nexts: n , prevs: p, parents: p, closests: c
  myProto._nppc = function (selector, type, methodName, theFirst) {
    var elements = [], elNode, justOne = false;
    this.elS.forEach( function (el) {
      elNode = el[methodName];
      while(elNode !== null && Element.prototype.isPrototypeOf(elNode) && !justOne) {
        if (elements.indexOf(elNode) === -1) {
          if (selector === undefined) {
            elements.push(elNode);
          } else if (elNode.matches(selector) === type) {
            elements.push(elNode);
            if (theFirst) justOne = true;
          }
        }
        elNode = elNode[methodName];
      }
    });
    return elements;
  }


  // Essentials

  myProto.each = function (cb) {
    this.elS.forEach( function (item, index) {
      cb.call(item, index);
    });
  };


  // Class attribute

  myProto.addClass = function (nameS) {
    return this._classListFn(nameS, 'add');
  };

  myProto.removeClass = function (nameS) {
    return this._classListFn(nameS, 'remove');
  };

  myProto.toggleClass = function (nameS) {
    return this._classList(nameS, 'toggle');
  };

  myProto.hasClass = function (nameS) {
    return this._classList(nameS, 'contains');
  };
  

  // General attributes
  
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

  myProto.val = function () {
    return this.elS[0].value;
  };


  // Insertion inside

  myProto.append = function () {
    if (!arguments.length) return this;
    var docFrag = document.createDocumentFragment();
    Array.prototype.slice.call(arguments).forEach( function (node) {
      if (Array.isArray(node)) {
        node.forEach( function (el) {
          if (el.elS) { // node jquery
            el.elS.forEach (function (nodeJquery) {
              docFrag.append(nodeJquery)
            });
          } else if (el instanceof Node) {
            docFrag.append(el)
          } else { // puede ser string texto o DOM String // TRABAJAR EN ESTO
            docFrag.append(document.createTextNode(el));
          }
        });
      } else if (node.elS) { // node myJquery
        node.elS.forEach (function (nodeJquery) {
          docFrag.append(nodeJquery);
        });
      } else if (typeof node === 'string') {
        // puede ser string texto o DOM String // TRABAJAR EN ESTO
        docFrag.insertAdjacentHTML('afterend', node);
      } else {
        docFrag.append(node);
      }
    });
    this.elS.forEach( function (el) {
      el.appendChild(docFrag);
    });
    return this;
  };

  myProto.html = function (html) {
    var _this = this;
    html ? this.elS[0].innerHTML = html : _this = this.elS[0].innerHTML;
    return _this;
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


  // Removal

  myProto.detach = function () {
    var docFrag = document.createDocumentFragment();
    this.elS.forEach( function (el) { docFrag.appendChild(el) });
    return jQuery(docFrag.children);
  };

  myProto.remove = function (selector) {
    this.elS.forEach(function (el) {
      if (selector) {
        if (el.matches(selector)) {
          el.parentNode.removeChild(el)
        }
      } else {
        el.parentNode.removeChild(el)
      }
    });
    return this;
  };

  myProto.empty = function () {
    this.elS.forEach(function (el) { el.innerHTML = '' });
    return this;
  };


  // Tree traversal

  myProto.children = function () {
    return jQuery(this._ccpnps('children'));
  };

  myProto.contents = function () {
    return jQuery(this._ccpnps('childNodes'));
  };

  myProto.closest = function (selector) {
    var arrClosest = [];
    if (Element.prototype.closest) {
      var closest;
      this.elS.forEach(function (el) {
        closest = el.parentNode.closest(selector);
        if (closest !== null) arrClosest.push(closest);
      });
    } else {
      arrClosest = this._nppc(selector, true, 'parentNode', true);
    }
    return jQuery(arrClosest);
  };

  myProto.find = function (selector) {
    return jQuery(selector, this.elS);
  };

  myProto.next = function () {
    return jQuery(this._ccpnps('nextElementSibling'));
  };

  myProto.nextAll = function (selector) {
    return jQuery(this._nppc(selector, true, 'nextElementSibling'));
  };

  myProto.nextUntil = function (selector) {
    return jQuery(this._nppc(selector, false, 'nextElementSibling'));
  };

  myProto.prev = function () {
    return jQuery(this._ccpnps('previousElementSibling'));
  };

  myProto.prevAll = function (selector) {
    return jQuery(this._nppc(selector, true, 'previousElementSibling'));
  };

  myProto.prevUntil = function (selector) {
    return jQuery(this._nppc(selector, false, 'previousElementSibling'));
  };

  myProto.parent = function () {
    return jQuery(this._ccpnps('parentNode'));
  };

  myProto.parents = function (selector) {
    return jQuery(this._nppc(selector, true, 'parentNode'));
  };

  myProto.parentsUntil = function (selector) {
    return jQuery(this._nppc(selector, false, 'parentNode'));
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

  
  // Filtering

  myProto.eq = function (index) {
    return jQuery([this.elS[index]]);
  };

  myProto.first = function () {
    return this.eq(0);
  };

  myProto.last = function () {
    return this.eq(this.elS.length - 1);
  }

  myProto.slice = function (iStart, iEnd) {
    return jQuery(this.elS.slice(iStart, iEnd));
  }


  // Events

  myProto.on = function (eventName, cb) { //falta agregar recibir objeto
    return this._forEach('addEventListener', eventName, cb)
  };

  myProto.one = function (eventName, cb) {
    this.elS.forEach( function (el) {
      el.addEventListener(eventName, function (event) {
        cb();
        event.target.removeEventListener(event.type, arguments.callee);
      })
    });
    return this;
  };

  myProto.off = function (eventName, cb) { // solo off();
    return this._forEach('removeEventListener', eventName, cb)
  };

}(document, window));