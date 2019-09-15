(function (document, window) {
  // Data
  const data = new Map()
  window.veamos = data

  // funcions utils
  const fn = Object.create(null)
  fn.gral = Object.create(null)
  fn.gral.random = Object.create(null)
  fn.gral.random.number = function (length) {
    let result = '';
    let init = 1;
    while (init <= length) {
      result += Math.floor((Math.random() * 9))
      init++
    }
    return result
  }

  // Jquery Obj
  function jQueryObj (obj) {
    this[0] = obj;
    this.length = 1;
  };

  const jQprotoObj = jQueryObj.prototype;

  jQprotoObj.jquery = '3.0.0'

  jQprotoObj.data = function (keyName, value) {
    const element0 = this[0]
    let valData
    if (Element.prototype.isPrototypeOf(element0)) {
      if (value) {
        valData = this 
        this.each(function (index, element) {
          if (data.has(element)) {
            data.get(element)[keyName] = value;
          } else {
            data.set(element, {
              [keyName] : value
            });
          }
        })
      } else {
        if (data.has(element0)) {
          valData = data.get(element0)[keyName]
          if (!valData) valData = element0.dataset[keyName]
        } else {
          valData = element0.dataset[keyName]
        }
      }
    } else {
      const preNameProp = 'jQuery' + this.jquery.split('.').join('')
      const suffNumber = fn.gral.random.number(18)
      const filter = Object.keys(element0).filter(function (name) {
        return name.indexOf(preNameProp) >= 0
      });
      if (!keyName && !value) {
        if (filter.length) {
          valData = filter[0]
        } else {
          const objEmpty = Object.create(null)
          element0[preNameProp + suffNumber] = objEmpty
          valData = objEmpty
        }
      } else {
        if (value) {
          valData = this
         if (filter.length) {
          element0[filter[0]][keyName] = value;
         } else {
          element0[preNameProp + suffNumber] = value
         }
        } else {
          valData = (filter.length) ? element0[filter[0]][keyName] : undefined
        }
      }
    }
    return valData
  }

  jQprotoObj.prop = function (keyName, value) {
    const obj = this[0]
    if (value === undefined) return obj[keyName]
    obj[keyName] = value
    return obj
  }

  // Jquery Nodes
  function jQuery (selector, context) {
    if (selector) { // se pasó algo, veamos que es...
      let elements
      context = context || document
      if (typeof selector === 'string') { // ... un selector CSS
        elements = context.querySelectorAll(selector.trim())
      } else { // ... un nodo iterable
        elements = (NodeList.prototype.isPrototypeOf(selector) || HTMLCollection.prototype.isPrototypeOf(selector)) ? selector : [selector]
      }
      const _this = this
      Array.prototype.forEach.call(elements, function (node, index) {
        _this[index] = node
      })
      this.length = elements.length
    }
  }

  const jQproto = jQuery.prototype = Object.create(jQprotoObj)

  jQproto.html = function (html) {
    let _this = this;
    if (html) {
      this.each(function (element) {
        element.innerHTML = html;
      })
    } else {
      _this = this[0].innerHTML;
    }
    return _this;
  };

  jQproto.each = function (fn) {
    let i = 0;
    while(i < this.length) {
      fn.call(this[i], i, this[i])
      i++
    }
  }

  // Export jQuery
  window.$ = window.jQuery = function (selector, context) {
    let retorno;
    if (selector instanceof jQuery) {
      retorno = Object.create(selector)
      Object.keys(selector).forEach(function (keyName) {
        retorno[keyName] = selector[keyName]
      })
    } else {
      retorno = (Object.prototype.toString.call(selector).toLowerCase() === '[object object]') ? new jQueryObj(selector) : new jQuery(selector, context)
    }
    return retorno;
  }

}(document, window));  
