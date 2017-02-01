const Component = require('./component');

// CONSTRUCTOR
describe( "Component constructor", () => {
  test( "Component constructor is defined", () => {
    expect( Component ).toBeDefined()
  });

  test( "Component constructor is a function", () => {
    expect( typeof Component ).toBe( "function" )
  });
})

let myComponent = new Component

// INTERFACE
describe( "Component interface", () => {
  test( "Component interface is not null", () => {
    expect( myComponent ).not.toBeNull()
  });

  test( "Component interface is an object", () => {
    expect( typeof myComponent ).toBe( "object" )
  });

  test( "Component interface is consistent", () => {
    expect( typeof myComponent.anchors       ).toBe( "object" )
    expect( typeof myComponent.destroy       ).toBe( "function" )
    expect( typeof myComponent.dispatch      ).toBe( "function" )
    expect(        myComponent.element       ).toBeUndefined()
    expect( typeof myComponent.elements      ).toBe( "object" )
    expect( typeof myComponent.model         ).toBe( "object" )
    expect( typeof myComponent.mount         ).toBe( "function" )
    expect( typeof myComponent.onModelUpdate ).toBe( "function" )
    expect( typeof myComponent.publ          ).toBe( "object" )
    expect( typeof myComponent.publ.destroy  ).toBe( "function" )
    expect(        myComponent.publ.element  ).toBeUndefined()
    expect( typeof myComponent.publ.elements ).toBe( "object" )
    expect( typeof myComponent.publ.model    ).toBe( "object" )
    expect( typeof myComponent.publ.mount    ).toBe( "function" )
    expect( typeof myComponent.publ.on       ).toBe( "function" )
    expect( typeof myComponent.publ.set      ).toBe( "function" )
    expect( typeof myComponent.publ.unmount  ).toBe( "function" )
    expect( typeof myComponent.set           ).toBe( "function" )
    expect( typeof myComponent.unmount       ).toBe( "function" )
  });
})

// MODEL
describe( "Model update notifications", () => {
  test( "String-style callback assigning", done => {
    myComponent = new Component
    myComponent.onModelUpdate( "prop", val => {
      expect( val ).toBe( 1 )
      done()
    })
    myComponent.set( "prop", 1 )
  })

  test( "Object-style callback assigning", done => {
    myComponent = new Component
    myComponent.onModelUpdate( { prop: val => {
      expect( val ).toBe( 1 )
      done()
    }})
    myComponent.set( { prop: 1 } )
  })

  test( "Deferred notifications", done => {
    myComponent = new Component
    myComponent.onModelUpdate( "prop", val => {
      expect( val ).toBe( 3 )
      done()
    })
    myComponent.set( "prop", 1 )
    myComponent.set( "prop", 2 )
    myComponent.set( "prop", 3 )
  })
})

// EVENTS
describe( "Events subscription and dispatching", () => {
  test( "Event subscription", done => {
    myComponent = new Component
    myComponent.publ.on( "myEvent", done )
    myComponent.dispatch( "myEvent" )
  })

  test( "Parameters passing", done => {
    myComponent = new Component
    myComponent.publ.on( { "myEvent": ( a, b ) => {
      expect( a ).toBe( 1 )
      expect( b ).toBe( 2 )
      done()
    }})
    myComponent.dispatch( "myEvent", 1, 2 )
  })

  test( "Deferred dispatching", done => {
    myComponent = new Component
    myComponent.publ.on( "myEvent", () => {
      expect( a ).toBe( 1 )
      done()
    })
    myComponent.dispatch( "myEvent", 1, 2 )
    let a = 1
  })
})

// HTML -> DOM
describe( "HTML elements", () => {
  test( "HTML elements created", () => {
    myComponent = new Component( {}, "<br><br>" )
    expect( myComponent.elements.length ).toBe( 2 )
  })

  test( "HTML anchors exist", () => {
    myComponent = new Component( {}, "<div my-anchor><div my-anchor></div></div>" )
    expect( myComponent.anchors.myAnchor.length ).toBe( 2 )
  })
})
