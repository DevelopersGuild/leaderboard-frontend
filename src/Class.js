/**
 *
 */
var Class = function() {
  this.doNothing = function(str){
    return str
  }

  this.derp = function(str){
    return "derp"
  }
}

if(typeof module !== "undefined") {
  module.exports = Class
}
