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

  fn.iteration = Object.create(null)
  fn.iteration.for = function (fnName, elements, cb) {
    return Array.prototype[fnName].call(elements, function (element) {
      cb(element)
    })
  }

  fn.jQuery = Object.create(null)
  fn.jQuery.each = function (_this, fn) {
    let i = 0
    while(i < _this.length) {
      fn.call(_this[i], i, _this[i])
      i++
    }
    return _this
  }
  fn.jQuery.find = function (selector, obj) {
    let elements = []
    this.each(obj, function (i, element) {
      fn.iteration.for('forEach', element.querySelectorAll(selector), function (node) {
        if (elements.indexOf(node) === -1) elements.push(node)
      })
    })
    return elements
  }
  fn.jQuery.onReady = null
  fn.jQuery.holdReady = false
  fn.jQuery.ready = function (cb) {
    this.holdReady ? this.onReady = cb : document.addEventListener('DOMContentLoaded', cb)
  }
  
  // #endregion utils

  // #region jQuery Obj
  function jQueryObj (obj) {
    this[0] = obj
    this.length = 1
  }

  const jQprotoObj = jQueryObj.prototype

  jQprotoObj.jquery = '3.1.0',

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
          if (keyName) {
            valData = data.get(element0)[keyName]
            if (!valData) valData = element0.dataset[keyName]
          } else {
            valData = data.get(element0)
          }
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
            elements = (context instanceof arguments.callee) ? fn.jQuery.find(selector, context) : context.querySelectorAll(selector);
          }
          break;

        case 'function':
          fn.jQuery.ready(selector)
          break;

        default:
          elements = selector.length ? selector : [selector]
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

  jQproto.ready = function (cb) {
    if (this[0] instanceof HTMLDocument) fn.jQuery.ready(cb)
  }

  jQproto.html = function (html) {
    let _this = this
    if (html) {
      if (typeof html === 'function') html = html()
      this.each(function () {
        this.innerHTML = html
      })
    } else {
      _this = this[0].innerHTML
    }
    return _this
  }

  jQproto.each = function (cb) {
    return fn.jQuery.each(this, cb)
  }

  jQproto.find = function (selector) {
    return new jQuery(fn.jQuery.find(selector, this));
  }

  // Export jQuery
  window.jQuery = function (selector, context) {
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

  let $Bk;
  if (window.$ !== undefined) $Bk = $;
  window.$ = window.jQuery

  window.jQuery.holdReady = function (status) {
    if (status) {
      fn.jQuery.holdReady = status
    } else {
      if (fn.jQuery.onReady) fn.jQuery.onReady()
    }
  }

  window.jQuery.noConflict = function () {
    if ($Bk !== undefined) window.$ = $Bk
    return window.jQuery
  }

}(document, window))