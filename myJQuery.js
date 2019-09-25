(function (document, window) {
  // Polyfill
  (function () {
    if (typeof Object.assign !== 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function () {
          const target = arguments[0], nArgs = arguments.length
          let i = 1, obj
          while(i < nArgs) {
            obj = arguments[i]
            Object.keys(obj).forEach(function (keyName) {
              target[keyName] = obj[keyName]
            })
            i++
          }
          return target
        },
        writable: true,
        configurable: true
      })
    }
  }())

  // Data
  const data = new Map()

  // #region Utils Functions
  const fn = Object.create(null)

  fn.random = Object.create(null)
  fn.random.number = function (length) {
    let result = ''
    let init = 1
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
  fn.string.lowerCamelCase = function (txt, separator) {
    separator = separator || ' '
    return txt.split(separator).map(function (text, i) {
      return i ? text.substring(0, 1).toUpperCase() + text.substring(1) : text
    }).join('')
  }

  fn.iteration = Object.create(null)
  fn.iteration.for = function (fnName, elements, cb) {
    return Array.prototype[fnName].call(elements, function (element) {
      cb(element)
    })
  }

  fn.jQuery = Object.create(null)
  fn.jQuery.each = function (_this, cb) {
    let i = 0, cbReturn
    while(i < _this.length) {
      cbReturn = cb.call(_this[i], i, _this[i])
      if (cbReturn !== undefined && !cbReturn) break
      i++
    }
    return _this
  }

  fn.jQuery.find = Object.create(null)
  fn.jQuery.find.selector = function (elements, element, selector) {
    fn.iteration.for('forEach', element.querySelectorAll(selector), function (node) {
      if (elements.indexOf(node) === -1) elements.push(node)
    })
  }
  fn.jQuery.find.obj = function (elements, element, obj) {
    fn.jQuery.each(obj, function () {
      if (element.contains(this) && elements.indexOf(this) === -1) elements.push(this)
    })
  }
  fn.jQuery.find.core = function (selector, obj) {
    const find = (selector instanceof jQuery) ? this.obj : this.selector, elements = []
    fn.jQuery.each(obj, function () {
      find(elements, this, selector)
    })
    return elements
  }

  fn.jQuery.data = function (keyName, value, isObj) {
    let objSet, hasData
    this.each(function (i, element) {
      hasData = data.has(element)
      if (isObj) {
        objSet = Object.assign(hasData ? data.get(element) : Object.create(null), keyName)
      } else {
        objSet = Object.create(null)
        objSet[keyName] = value
        if (hasData) objSet = Object.assign(data.get(element), objSet)
      }
      data.set(element, objSet)
    })
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
    const isObj = fn.obj.isLiteral(keyName)
    if (keyName) {
      if (isObj) {
        let keyNameClean = Object.create(null)
        for (var element in keyName) {
          (element.indexOf('-') !== -1) ? keyNameClean[fn.string.lowerCamelCase(element, '-')] = keyName[element] : keyNameClean[element] = keyName[element]
        }
        keyName = keyNameClean
      } else {
        if (keyName.indexOf('-') !== -1) keyName = fn.string.lowerCamelCase(keyName, '-')
      }
    }
    if (Element.prototype.isPrototypeOf(element0)) {
      if (keyName === undefined && value === undefined) {
        valData = data.has(element0) ? data.get(element0) : Object.create(null)
      } else {
        valData = this
        if (value) {
          fn.jQuery.data.call(this, keyName, value, isObj)
        } else {
          if (isObj) {
            fn.jQuery.data.call(this, keyName, value, isObj)
          } else {
            if (data.has(element0)) {
              valData = data.get(element0)[keyName]
              if (valData === undefined) valData = element0.dataset[keyName]
            } else {
              valData = element0.dataset[keyName]
            }
          }
        }
      }
    } else {
      const preNameProp = 'jQuery' + this.jquery.split('.').join('')
      const filter = Object.keys(element0).filter(function (name) {
        return name.indexOf(preNameProp) >= 0
      })
      if (!filter.length) {
        const suffNumber = fn.random.number(18)
        const objEmpty = Object.create(null)
        element0[preNameProp + suffNumber] = objEmpty
        filter[0] = preNameProp + suffNumber
      }
      if (!keyName && !value) {
        valData = element0[filter[0]]
      } else {
        valData = this
        if (value) {
          element0[filter[0]][keyName] = value
        } else {
          if (isObj) {
            element0[filter[0]] = Object.assign(element0[filter[0]], keyName)
          } else {
            valData = element0[filter[0]][keyName]
          }
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

  jQprotoObj.length = 0
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
            elements = (context instanceof arguments.callee) ? fn.jQuery.find(selector, context) : context.querySelectorAll(selector)
          }
          break

        case 'function':
          fn.jQuery.ready(selector)
          break

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
    return new jQuery(fn.jQuery.find.core(selector, this))
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

  let $Bk
  if (window.$ !== undefined) $Bk = $
  window.$ = window.jQuery

  const wjq = window.jQuery

  wjq.holdReady = function (status) {
    if (status) {
      fn.jQuery.holdReady = status
    } else {
      if (fn.jQuery.onReady) fn.jQuery.onReady()
    }
  }

  wjq.noConflict = function () {
    if ($Bk !== undefined) window.$ = $Bk
    return wjq
  }

  wjq.each = function (arrObj, cb) {
    let cbReturn
    for (var item in arrObj) {
      cbReturn = cb.call(arrObj[item], item, arrObj[item])
      if (cbReturn !== undefined) {
        if (cbReturn) {
          continue
        } else {
          break
        }
      }
    }
    return arrObj
  }

  wjq.data = function (element, key, value) {
    const nodeJq = new jQuery(element)
    nodeJq.data(key, value)
    return fn.obj.isLiteral(key) ? key : value !== undefined ? value : nodeJq.data(key)
  }
}(document, window))