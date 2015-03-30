/**
 * In-memory config. Just stores stuff so we can use it later.
 *
 */

var store = {}

module.exports = {
  get : function(k){
    return store[k]
  },
  set : function(k,v){
    store[k] = v
  }
}
