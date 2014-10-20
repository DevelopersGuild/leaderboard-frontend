var should = require("should"),
    MyClass = require("../src/js/Class")

describe("A Class Suite", function(){
  var myclass

  beforeEach(function(){
    myclass = new MyClass()
  })

  it("should do nothing", function() {
    returnValue = myclass.doNothing('test')
    returnValue.should.equal("test")
  })

  it("derp", function() {
    returnValue = myclass.derp('test')
    returnValue.should.equal("derp")
  })

})
