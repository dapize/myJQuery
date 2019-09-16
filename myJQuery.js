(function (document, window) {
  // Data
  const data = new Map()

  // #region Utils Functions
  const fn = Object.create(null)

  fn.random = Object.create(null)
  fn.random.number = function (length) {
    let result = ''
    let init = 1;
    while (init <= length) {
      result += Math.floor((Math.random() * 9))
      init++
    }
    return result
  }

  fn.regex = Object.create(null)
  fn.regex.tag = /<[^>]+>/g
  
  fn.obj = Object.create(null)
  fn.obj.isLiteral = function (obj) {
    return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
  }

  fn.string = Object.create(null)
  fn.string.isDomString = function (stringHtml) {
    return fn.regex.tag.test(stringHtml)
  }
  fn.string.toNode = function (domString) {
    const div = document.createElement('div')
    div.innerHTML = domString
    return div.childNodes
  }
  // #endregion utils

  // #region jQuery Obj
  function jQueryObj (obj) {
    this[0] = obj
    this.length = 1
  }

  const jQprotoObj = jQueryObj.prototype

  jQprotoObj.jquery = '3.0.0',

  jQprotoObj.data = function (keyName, value) {
    const element0 = this[0]
    let valData
    if (Element.prototype.isPrototypeOf(element0)) {
      if (value) {
        valData = this 
        let objSet
        this.each(function (index, element) {
          if (data.has(element)) {
            data.get(element)[keyName] = value
          } else {
            objSet = Object.create(null)
            objSet[keyName] = value
            data.set(element, objSet)
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
      const suffNumber = fn.random.number(18)
      const filter = Object.keys(element0).filter(function (name) {
        return name.indexOf(preNameProp) >= 0
      })
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
          element0[filter[0]][keyName] = value
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
  // #endregion jQuery Obj

  // jQuery Utils
  const _find = function (selector, jqObj) {
    let i = 0
    while(i < jqObj.length) {
      jqObj[i].querySelectorAll(selector)
      i++
    }
  }

  // jQuery Nodes
  function jQuery (selector, context) {
    if (selector) { // se pasó algo, veamos que es...
      let elements
      context = context || document
      switch (typeof selector) {
        case 'string': // ... un selector CSS o un DOM String
          selector = selector.trim()
          if (fn.string.isDomString(selector)) {
            elements = fn.string.toNode(selector)
          } else {
            elements = (context instanceof arguments.callee) ? _find(selector, context) : context.querySelectorAll(selector);
          }
          break;

        case 'function':
          document.addEventListener('DOMContentLoaded', selector)
          break;

        default: 
          elements = (NodeList.prototype.isPrototypeOf(selector) || HTMLCollection.prototype.isPrototypeOf(selector)) ? selector : [selector]
      }
      if (elements) {
        const _this = this
        Array.prototype.forEach.call(elements, function (node, index) {
          _this[index] = node
        })
        this.length = elements.length
      }
    }
  }

  const jQproto = jQuery.prototype = Object.create(jQprotoObj)

  jQproto.html = function (html) {
    let _this = this
    if (html) {
      this.each(function (element) {
        element.innerHTML = html
      })
    } else {
      _this = this[0].innerHTML
    }
    return _this
  }

  jQproto.each = function (cb) {
    let i = 0
    while(i < this.length) {
      cb.call(this[i], i, this[i])
      i++
    }
  }

  jQproto.ready = function (cb) {
    if (this[0] instanceof HTMLDocument) document.addEventListener('DOMContentLoaded', cb)
  }

  // Export jQuery
  window.$ = window.jQuery = function (selector, context) {
    let retorno
    if (selector instanceof jQuery) {
      retorno = Object.create(selector)
      Object.keys(selector).forEach(function (keyName) {
        retorno[keyName] = selector[keyName]
      })
    } else {
      retorno = fn.obj.isLiteral(selector) ? new jQueryObj(selector) : new jQuery(selector, context)
    }
    return retorno
  }

}(document, window))