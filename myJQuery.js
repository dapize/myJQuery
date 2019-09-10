(function (document, window) {

  function myjQuery (selector, context) {
    const _this = this
    if (selector instanceof myjQuery) { // si se pasa un objecto jquery
      Object.keys(selector).forEach(function (key) {
        _this[key] = selector[key]
      })
    } else {
      let elements
      if (selector) { // se pasó algo, veamos que es...


        context = context || document
        if (typeof selector === 'string') { // ... un selector CSS
          elements = context.querySelectorAll(selector.trim())
        } else { 
          if (NodeList.prototype.isPrototypeOf(selector) || HTMLCollection.prototype.isPrototypeOf(selector)) { // ... un nodo iterable
            elements = selector
          } else {
            elements = [selector] 
          }
        }
        Array.prototype.forEach.call(elements, function (node, index) {
          _this[index] = node
        })
        
      } else { // no se pasó nada
        elements = [];
      }
      this.length = elements.length
    }
  };

  const myProto = myjQuery.prototype;

  myProto._map = function (nodeElements) {
    return Array.prototype.map.call(nodeElements, function (node) {
      return node
    })
  }

  var $ = function (selector) {
    return new myjQuery(selector);
  };

  window.$ = $;
  window.jQuery = myjQuery;

}(document, window));  
console.time('comienza');


const elements = $(window);
console.log(elements);


console.timeEnd('comienza');
