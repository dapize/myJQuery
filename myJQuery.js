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
  fn.regex.id = /#[0-9a-zA-Z]/g
  
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
  fn.jQuery.find.jQuery = function (elements, element, obj) {
    fn.jQuery.each(obj, function () {
      if (element.contains(this) && elements.indexOf(this) === -1) elements.push(this)
    })
  }
  fn.jQuery.find.node = function (elements, element, node) {
    if (element.contains(node) && elements.indexOf(node) === -1) elements.push(node)
  }
  fn.jQuery.find.core = function (selector, obj) {
    let find
    const elements = []
    if (typeof selector === 'string') {
      find = this.selector
    } else if (selector instanceof jQuery) {
      find = this.jQuery
    } else {
      find = this.node
    }
    fn.jQuery.each(obj, function () {
      find(elements, this, selector)
    })
    return elements
  }

  fn.jQuery.data = Object.create(null)
  fn.jQuery.data.name = function () {
    return 'jQuery' + jQueryObj.prototype.jquery.split('.').join('')
  }
  fn.jQuery.data.obj = function (element) {
    const preNameProp = this.name()
    const filter = Object.keys(element).filter(function (name) {
      return name.indexOf(preNameProp) >= 0
    })
    return filter.length ? filter[0] : false
  }
  fn.jQuery.data.set = function (keyName, value, isObj) {
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

  fn.jQuery.class = Object.create(null)
  fn.jQuery.class.string = function (names, index, item, method) {
    names.forEach(function (name) {
      item.classList[method](name)
    })
  }
  fn.jQuery.class.function = function (names, index, item, method, state) {
    const className = names.call(item, index, Array.prototype.join.call(item.classList, ' '), state)
    if (className) {
      className.split(' ').forEach(function (name) {
        item.classList[method](name)
      })
    }
  }
  fn.jQuery.class.addRemove = function (_this, names, method, state) {
    let fnClass
    if (typeof names === 'string') {
      names = names.split(' ')
      fnClass = this.string
    } else if (typeof names === 'function') {
      fnClass = this.function
    }
    fn.jQuery.each(_this, function (index, item) {
      fnClass(names, index, item, method, state)
    })
    return _this
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
          fn.jQuery.data.set.call(this, keyName, value, isObj)
        } else {
          if (isObj) {
            fn.jQuery.data.set.call(this, keyName, value, isObj)
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
      let nameObjData = fn.jQuery.data.obj(element0)
      if (!nameObjData) {
        const suffNumber = fn.random.number(18)
        const objEmpty = Object.create(null)
        const preNameProp = fn.jQuery.data.name()
        element0[preNameProp + suffNumber] = objEmpty
        nameObjData = preNameProp + suffNumber
      }
      if (!keyName && !value) {
        valData = element0[nameObjData]
      } else {
        valData = this
        if (value) {
          element0[nameObjData][keyName] = value
        } else {
          if (isObj) {
            element0[nameObjData] = Object.assign(element0[nameObjData], keyName)
          } else {
            valData = element0[nameObjData][keyName]
          }
        }
      }
    }
    return valData
  }

  jQprotoObj.prop = function (keyName, value) {
    const element0 = this[0]
    let retorno = this
    if (element0) {
      if (Element.prototype.isPrototypeOf(element0)) {
        if (value === undefined) {
          if (typeof keyName === 'object') {
            this.each(function () {
              for (var propName in keyName) {
                this[propName] = keyName[propName]
              }
            })
          } else {
            retorno = element0[keyName]
          }
        } else {
          this.each(function (index, item) {
            item[keyName] = typeof value === 'function' ? value.call(item, index, item[keyName]) : value
          })
        }
      } else {
        if (value === undefined) return element0[keyName]
        element0[keyName] = value
        retorno = element0
      }
    }
    return retorno
  }

  jQprotoObj.removeData = function (keyName) {
    const objData = fn.jQuery.data.obj(this)
    if (objData) {
      delete (keyName === undefined ? this[objData] : this[objData][keyName])
    } else {
      let getData
      this.each(function () {
        if (keyName === undefined) {
          data.set(this, Object.create(null))
        } else {
          if (data.has(this)) {
            if (!Array.isArray(keyName)) keyName = keyName.split(' ')
            getData = data.get(this)
            keyName.forEach(function (name) {
              delete getData[name]
            })
          }
        }
      })
    }
    return this
  }

  jQprotoObj.length = 0
  // #endregion jQuery Obj

  // jQuery Nodes
  function jQuery (selector, context) {
    if (selector) { // se pasó algo, veamos que es...
      let elements
      context = context || document
      const selectorType = typeof selector
      switch (selectorType) {
        case 'string': // ... un selector CSS o un DOM String
          selector = selector.trim()
          if (fn.string.isDomString(selector)) {
            elements = fn.string.toNode(selector)
          } else {
            elements = (context instanceof arguments.callee) ? fn.jQuery.find.core(selector, context) : context.querySelectorAll(selector)
          }
          break

        case 'function': // el callback de listo el DOM
          fn.jQuery.ready(selector)
          break

        default: // un iterable, yá sea 'Collection' o 'Array'
          if (selector !== null || selector !== undefined) elements = selector.length !== undefined ? selector : [selector]
      }
      if (elements) {
        if (elements.length) {
          const _this = this
          Array.prototype.forEach.call(elements, function (node, index) {
            _this[index] = node
          })
        }
        this.length = elements.length
        // prevObject
        if (selectorType === 'string' && !fn.regex.id.test(selector)) {
          this.prevObject = new arguments.callee(context)
        } else if (selector instanceof jQuery) {
          if (selector.prevObject) this.prevObject = selector.prevObject
        }
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
    const retorno = new jQuery(fn.jQuery.find.core(selector, this))
    retorno.prevObject = this
    return retorno
  }

  jQproto.hasClass = function (className) {
    let retorno = false
    this.each(function () {
      if (this.classList.contains(className)) {
        retorno = true
        return false
      }
    })
    return retorno
  }

  jQproto.addClass = function (className) {
    return fn.jQuery.class.addRemove(this, className, 'add')
  }

  jQproto.removeClass = function (className) {
    return fn.jQuery.class.addRemove(this, className, 'remove')
  }

  jQproto.toggleClass = function (className, state) {
    return fn.jQuery.class.addRemove(this, className, state === undefined ? 'toggle' : state ? 'add' : 'remove', state)
  }

  // Window.jQuery
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

  wjq.removeData = function (element, key) {
    const nodeJq = new jQuery(element)
    nodeJq.removeData(key)
  }

  wjq.hasData = function (element) {
    return data.has(element)
  }

  // Export jQuery
  if (typeof module === "object" && module.exports) {
    module.exports = window.jQuery
  } else {
    let $Bk
    if (window.$ !== undefined) $Bk = $
    window.$ = window.jQuery
  }
}(document, window))