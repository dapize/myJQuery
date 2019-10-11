(function (document, window) {
  // Data
  const data = new Map()

  // #region Utils Functions
  const fn = {
    random: {
      number: function (length) {
        let result = ''
        let init = 1
        while (init <= length) {
          result += Math.floor((Math.random() * 9))
          init++
        }
        return result
      }
    },

    regex: {
      tag: /<[^>]+>/g,
      id: /#[0-9a-zA-Z]/g
    },

    obj: {
      isLiteral: function (obj) {
        return Object.prototype.toString.call(obj).toLowerCase() === '[object object]'
      },

      extend: {
        deep: function (target, source) {
          let sourceProp, targetProp
          for (var prop in source) {
            sourceProp = source[prop]
            targetProp = target[prop]
            if (typeof targetProp === 'object') {
              typeof sourceProp === 'object' ? arguments.callee(targetProp, sourceProp) : target[prop] = sourceProp
            } else {
              target[prop] = sourceProp
            }
          }
        },
        replace: function (target, source) {
          if (typeof Object.assign !== 'function') {
            for (var prop in source) target[prop] = source[prop]
          } else {
            Object.assign(target, source)
          }
        }
      }
    },

    string: {
      isDomString: function (stringHtml) {
        return fn.regex.tag.test(stringHtml)
      },

      toNode: function (domString) {
        const div = document.createElement('div')
        div.innerHTML = domString
        return div.childNodes
      },

      lowerCamelCase: function (txt, separator) {
        separator = separator || ' '
        return txt.split(separator).map(function (text, i) {
          return i ? text.substring(0, 1).toUpperCase() + text.substring(1) : text
        }).join('')
      }
    },

    iteration: {
      for: function (fnName, elements, cb) {
        return Array.prototype[fnName].call(elements, function (element) {
          cb(element)
        })
      }
    },

    css: {
      computed: function (element, propName) {
        const style = getComputedStyle(element).getPropertyValue(propName);
        return style === undefined || style === '' ? 0 : style
      },

      mergeValues: function (element, propName, type) {
        const _this = this
        const properties = propName === 'height' ? [type + '-top', type + '-bottom'] : [type + '-left', type + '-right']
        return properties.map(function (name) {
          return parseFloat(_this.computed(element, name))
        }).reduce(function (total, num) {
          return total + num
        }, 0)
      },

      pure: function (element, propName, includePadding, includeMargin) {
        let currentVal = parseFloat(this.computed(element, propName))
        if (propName === 'height' || propName === 'width') {
          if (includePadding !== undefined && !includePadding && this.computed(element, 'box-sizing') === 'border-box') {
            currentVal -= this.mergeValues(element, propName, 'padding')
          }
          if (includeMargin !== undefined && includeMargin) currentVal += this.mergeValues(element, propName, 'margin')
        }
        return currentVal
      }
    },

    jQuery: {
      each: function (_this, cb) {
        let i = 0, cbReturn
        while(i < _this.length) {
          cbReturn = cb.call(_this[i], i, _this[i])
          if (cbReturn !== undefined && !cbReturn) break
          i++
        }
        return _this
      },
      
      find: {
        selector: function (elements, element, selector) {
          fn.iteration.for('forEach', element.querySelectorAll(selector), function (node) {
            if (elements.indexOf(node) === -1) elements.push(node)
          })
        },

        jQuery: function (elements, element, obj) {
          fn.jQuery.each(obj, function () {
            if (element.contains(this) && elements.indexOf(this) === -1) elements.push(this)
          })
        },

        node: function (elements, element, node) {
          if (element.contains(node) && elements.indexOf(node) === -1) elements.push(node)
        },

        core: function (selector, obj) {
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
      },

      data: {
        name: function () {
          return 'jQuery' + jQueryObj.prototype.jquery.split('.').join('')
        },

        obj: function (element) {
          const preNameProp = this.name()
          const filter = Object.keys(element).filter(function (name) {
            return name.indexOf(preNameProp) >= 0
          })
          return filter.length ? filter[0] : false
        },

        set: function (keyName, value, isObj) {
          let objSet, hasData
          this.each(function (i, element) {
            hasData = data.has(element)
            if (isObj) {
              objSet = wjq.extend(hasData ? data.get(element) : Object.create(null), keyName)
            } else {
              objSet = Object.create(null)
              objSet[keyName] = value
              if (hasData) objSet = wjq.extend(data.get(element), objSet)
            }
            data.set(element, objSet)
          })
        }
      },

      class: {
        string: function (names, index, item, method) {
          names.forEach(function (name) {
            item.classList[method](name)
          })
        },

        fn: function (names, index, item, method, state) {
          const className = names.call(item, index, Array.prototype.join.call(item.classList, ' '), state)
          if (className) {
            className.split(' ').forEach(function (name) {
              item.classList[method](name)
            })
          }
        },

        addRemove: function (_this, names, method, state) {
          let fnClass
          if (typeof names === 'string') {
            names = names.split(' ')
            fnClass = this.string
          } else if (typeof names === 'function') {
            fnClass = this.fn
          }
          fn.jQuery.each(_this, function (index, item) {
            fnClass(names, index, item, method, state)
          })
          return _this
        }
      },

      traver: {
        elements: function (arr, item, selector) {
          if (arr.indexOf(item) === -1) {
            if (selector) {
              if (item.matches(selector)) arr.push(item)
            } else {
              arr.push(item)
            }
          }
        },

        specific: function (methodName, selector) {
          let elements = [], element
          fn.jQuery.each(this, function () {
            element = this[methodName]
            while(element !== null && Element.prototype.isPrototypeOf(element)) {
              fn.jQuery.traver.elements(elements, element, selector)
              element = element[methodName]
            }
          })
          return fn.jQuery.retorno.call(this, elements)
        },

        all: function (method, selector) {
          let list = [], elements
          fn.jQuery.each(this, function (i, element) {
            elements = element[method]
            if (elements !== null) {
              if (elements.length) {
                fn.iteration.for('forEach', elements, function (item) {
                  fn.jQuery.traver.elements(list, item, selector)
                })
              } else {
                if (!HTMLCollection.prototype.isPrototypeOf(elements)) {
                  fn.jQuery.traver.elements(list, elements, selector)
                }
              }
            }
          })
          return fn.jQuery.retorno.call(this, list)
        }
      },

      css: {   

        // fn.jQuery.css.dimentions.call(this, value, 'width', false, false)
        
        fn: function (value, includePadding, includeMargin) {
          let fnCss
          switch(typeof value) {
            case 'number':
              fnCss = function (val) {
                return val + 'px'
              }
              break
            case 'string':
              if (value.indexOf('+=') !== -1 || value.indexOf('-=') !== -1) {
                fnCss = function (val, propName) {
                  let toOperate = Number(val.replace(/(\+)?(\-)?(\=)/g, ''))
                  if (val.indexOf('+=') !== -1) toOperate = toOperate * -1
                  return (fn.css.pure(this, propName, includePadding, includeMargin) - toOperate) + 'px'
                }
              } else {
                fnCss = function (val) {
                  return val
                }
              }
              break
            case 'function':
              fnCss = function (val, propName, index) {
                const returnVal = val.call(this, index, fn.css.pure(this, propName, includePadding, includeMargin))
                if (returnVal !== undefined) {
                  const valOperated = parseFloat(returnVal)
                  return (isNaN(valOperated)) ? returnVal : valOperated + 'px'
                }
              }
          }
          return fnCss
        },
        
        dimentions: function (value, propertyName, includePadding, includeMargin) {
          let retorno = this
          if (value !== undefined) {
            const fnCss = fn.jQuery.css.fn(value, includePadding, includeMargin)
            fn.jQuery.each(this, function (index, item) {
              item.style[propertyName] = fnCss.call(item, value, propertyName, index)
            })
          } else {
            retorno = fn.css.pure(this[0], propertyName, includePadding, includeMargin)
          }
          return retorno
        },

        outer: function (value, propertyName, includeMargin) {
          let retorno
          switch(typeof value) {
            case 'undefined':
              retorno = fn.jQuery.css.dimentions.call(this, undefined, propertyName, true, false)
              break

            case 'boolean':
              retorno = fn.jQuery.css.dimentions.call(this, undefined, propertyName, true, value)
              break

            case 'number':
            case 'string':
            case 'function':
              retorno = fn.jQuery.css.dimentions.call(this, value, propertyName, true, includeMargin)
              break
          }
          return retorno
        }
      },

      onReady: null,

      holdReady: false,

      ready: function (cb) {
        this.holdReady ? this.onReady = cb : document.addEventListener('DOMContentLoaded', cb)
      },

      retorno: function (fn) {
        const retorno = new jQuery(fn)
        retorno.prevObject = this
        return retorno
      }
    }
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
            element0[nameObjData] = wjq.extend(element0[nameObjData], keyName)
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
              for (var propName in keyName) this[propName] = keyName[propName]
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

  jQprotoObj.removeProp = function (keyName) {
    const element0 = this[0]
    let retorno = this
    if (element0 && keyName) {
      if (Element.prototype.isPrototypeOf(element0)) {
        this.each(function () {
          delete this[keyName]
        })
      } else {
        delete element0[keyName]
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
    return fn.jQuery.retorno.call(this, fn.jQuery.find.core(selector, this))
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

  jQproto.toArray = function () {
    const elements = []
    let i = 0
    while (i < this.length) {
      elements.push(this[i])
      i++
    }
    return elements
  }

  jQproto.get = function (index) {
    let elements = this
    if (index < 0) {
      elements = this.toArray().reverse()
      index = (index * -1) - 1
    }
    return elements[index]
  }

  jQproto.eq = function (index) {
    return fn.jQuery.retorno.call(this, this.get(index))
  }

  jQproto.end = function () {
    return this.prevObject
  }

  jQproto.filter = function (selector) {
    const elements = []
    let filterFn = false, selectors
    if (typeof selector === 'string') {
      filterFn = function () {
        return this.matches(selector)
      }
    } else if (typeof selector == 'function') {
      filterFn = function (index, item) {
        return selector.call(this, index, item)
      }
    } else if (selector instanceof HTMLElement) {
      filterFn = function () {
        return this.isSameNode(selector)
      }
    } else if (selector.length) {
      selectors = new jQuery(selector)
    }

    let filterFnEach
    if (filterFn) {
      filterFnEach = function (item, index) {
        if (filterFn.call(this, index, item)) elements.push(item)
      }
    } else {
      filterFnEach = function (item) {
        if (selectors && selectors.length) {
          selectors.each(function (i, element) {
            if (element.isSameNode(item) && elements.indexOf(element) === -1) elements.push(element)
          })
        }
      }
    }

    this.each(function (index, item) {
      filterFnEach.call(this, item, index)
    })
    return fn.jQuery.retorno.call(this, elements)
  }

  jQproto.siblings = function (selector) {
    const elements = []
    this.each(function (i, item) {
      fn.iteration.for('forEach', this.parentNode.children, function (child) {
        if (elements.indexOf(child) === -1) {
          if (selector) {
            if (child.matches(selector)) elements.push(child)
          } else {
            if (!child.isSameNode(item)) elements.push(child)
          }
        }
      })
    })
    return fn.jQuery.retorno.call(this, elements)
  }

  jQproto.children = function (selector) {
    return fn.jQuery.traver.all.call(this, 'children', selector)
  }

  jQproto.contents = function () {
    return fn.jQuery.traver.all.call(this, 'childNodes')
  }

  jQproto.first = function () {
    return fn.jQuery.retorno.call(this, this[0])
  }

  jQproto.last = function () {
    return fn.jQuery.retorno.call(this, this[this.length - 1])
  }

  jQproto.next = function (selector) {
    return fn.jQuery.traver.all.call(this, 'nextElementSibling', selector)
  }

  jQproto.nextAll = function (selector) {
    return fn.jQuery.traver.specific.call(this, 'nextElementSibling', selector)
  }

  jQproto.prev = function (selector) {
    return fn.jQuery.traver.all.call(this, 'previousElementSibling', selector)
  }

  jQproto.prevAll = function (selector) {
    return fn.jQuery.traver.specific.call(this, 'previousElementSibling', selector)
  }

  jQproto.parent = function (selector) {
    return fn.jQuery.traver.all.call(this, 'parentNode', selector)
  }

  jQproto.parents = function (selector) {
    return fn.jQuery.traver.specific.call(this, 'parentNode', selector)
  }

  /*
  jQproto.offsetParent = function () {
  }

  jQproto.prevUntil = function (selector) {
  }

  jQproto.nextUntil = function (selector) {
  }

  jQproto.parentsUntil = function (selector) {
  }

  jQproto.closest = function (selector) {
  }
  */

  jQproto.css = function (propertyName, value) {
    let retorno = this
    const element0 = this[0]
    if (typeof propertyName === 'string') {
      if (value !== undefined) {
        const fnCss = fn.jQuery.css.fn(value)
        this.each(function (index) {
          this.style[propertyName] = fnCss.call(this, value, propertyName, index)
        })
      } else {
        retorno = fn.css.computed(element0, propertyName)
      }
    } else if (Array.isArray(propertyName)) {
      retorno = Object.create(null)
      propertyName.forEach(function (name) {
        retorno[name] = fn.css.computed(element0, name)
      })
    } else if (typeof propertyName === 'object') {
      for (name in propertyName) {
        this.each(function (index) {
          this.style[name] = fn.jQuery.css.fn(propertyName[name]).call(this, propertyName[name], name, index)
        })
      }

    }
    return retorno
  }

  // Dimensions
  jQproto.height = function (value) {
    return fn.jQuery.css.dimentions.call(this, value, 'height', false, false)
  }

  jQproto.innerHeight = function (value) {
    return fn.jQuery.css.dimentions.call(this, value, 'height', true, false)
  }

  /*
  jQproto.outerHeight = function (value, includeMargin) {
    return fn.jQuery.css.outer.call(this, value, 'height', includeMargin)
  }
  */

  jQproto.width = function (value) {
    return fn.jQuery.css.dimentions.call(this, value, 'width', false, false)
  }

  jQproto.innerWidth = function (value) {
    return fn.jQuery.css.dimentions.call(this, value, 'width', true, false)
  }

  /*
  jQproto.outerWidth = function (value, includeMargin) {
    return fn.jQuery.css.outer.call(this, value, 'width', includeMargin)
  }
  */

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

  wjq.extend = function () {
    const iTarget = typeof arguments[0] === 'boolean' ? 1 : 0
    const target = arguments[iTarget]
    const extendFn = fn.obj.extend[iTarget ? 'deep' : 'replace']
    Array.prototype.slice.call(arguments, iTarget).forEach(function (obj) {
      extendFn(target, obj)
    })
    return target
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