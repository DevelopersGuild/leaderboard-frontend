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


  this.herp = function(str){
    return "herp"
  }
}

if(typeof module !== "undefined") {
  module.exports = Class
}
