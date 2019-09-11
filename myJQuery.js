(function (document, window) {

  function jQueryObj (obj) {
    this[0] = obj;
    this.length = 1;
  };

  const jQprotoObj = jQueryObj.prototype;

  jQprotoObj.data = function (keyName, value) {
    
  }

  jQprotoObj.prop = function (keyName, value) {
    const obj = this[0]
    if (value === undefined) return obj[keyName]
    obj[keyName] = value
    return obj
  }



  function jQuery (selector, context) {
    const _this = this
    if (selector instanceof arguments.callee) { // si se pasa un objecto jquery
      Object.keys(selector).forEach(function (key) {
        _this[key] = selector[key]
      })
    } else {
      if (selector) { // se pasó algo, veamos que es...
        let elements
        context = context || document
        if (typeof selector === 'string') { // ... un selector CSS
          elements = context.querySelectorAll(selector.trim())
        } else { // ... un nodo iterable
          elements = (NodeList.prototype.isPrototypeOf(selector) || HTMLCollection.prototype.isPrototypeOf(selector)) ? selector : [selector]
        }
        Array.prototype.forEach.call(elements, function (node, index) {
          _this[index] = node
        })
        this.length = elements.length
      }
    }
  }

  const jQproto = jQuery.prototype;



  // Utils
  jQproto._map = function (nodeElements) {
    return Array.prototype.map.call(nodeElements, function (node) {
      return node
    })
  }

  window.$ = window.jQuery = function (selector, context) {
    return (Object.prototype.toString.call(selector) === '[object Object]') ? new jQueryObj(selector) : new jQuery(selector, context)
  }

}(document, window));  
console.time('comienza');


const elements = $(window);
console.log(elements);


console.timeEnd('comienza');

