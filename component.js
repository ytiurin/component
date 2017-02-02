/*
  Write components with interface, events and model observation.

  // Declare your component
  function MyComponent()
  {
    // Create component tooling
    var component = new Component(this,'<p>My basic component</p>');
    // Observe component model
    component.onModelUpdate({
      prop1:function(value){
        // Model property changed
      }
    });
    // Dispatch events
    component.dispatch('myEvent',1,2,3);
    // Extend component public interface
    component.publ.myMethod = function(){
      //...
    };
    // Override destructor
    component.publ.destoy = function(){
      // ... do some cleanup (unsubscribe events, etc.)
      component.destroy();
    };
  }
  //...
  // Create your new component
  var myComponent = new MyComponent;
  // Mutate component model
  myComponent.set('prop1',1);
  // Subscribe to component events
  myComponent.on('myEvent',function(p1,p2,p3){
    alert('My component dispatched event');
  });
  // Mount component to a document body
  myComponent.mount();
  // Use component public interface
  myComponent.myMethod();
  // Destroy component
  myComponent.destroy();
*/

(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports==="object"&&typeof module!=="undefined") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Define global constructor
        root.Component = factory();
    }

}(this,function(){

  function toArray(obj,fromIndex)
  {
    return Array.prototype.slice.call(obj,fromIndex);
  }

  function argsToObj(args)
  {
    var argType = typeof toArray(args)[0], obj = {}, keys, i;

    if ( argType == "object" )
      obj = args[0];

    if ( argType == "string" ) {
      keys = args[0].split(' ');
      for ( i in keys )
        obj[ keys[i] ] = args[1];
    }

    if ( argType == "function" )
      obj = { '': args[0] };

    return obj;
  }

  function Component(publicInterface,HTML)
  {
    function destroy()
    {
      unmount();
    }

    function gainAnchorElements(elements,anchors)
    {
      for ( var j = 0, attr, attrName, i = elements.length; i--; ) {
        for (; attr = elements[i].attributes[ j++ ]; ) {
          attrName = attr.name
            //dashToCamel
            .replace(/-([a-z])/g,function(g){return g[1].toUpperCase()});

          anchors[attrName]=anchors[attrName]||[];
          anchors[attrName].push(elements[i]);
        }

        gainAnchorElements(elements[i].children,anchors)
      }
    }

    function mount( parent )
    {
      parent = parent || d.body;

      try {
        for ( var i in elements )
          parent.appendChild( elements[i] );
      }
      catch ( e ) {
        throw "Could not mount component: " + e.message;
      }
    }

    function notifyObservers( propName )
    {
      clearTimeout( notifyTimeoutID[ propName ] );

      notifyTimeoutID[ propName ] = setTimeout( function() {
        for ( var i in modelObservers[ propName ] )
          modelObservers[ propName ][i]( model[ propName ] );

        if ( modelObservers[''] )
          for ( i in modelObservers[''] )
            modelObservers[''][i]();
      });
    }

    function on()
    {
      var userEventCallbacks = argsToObj( arguments ), eventName;

      for ( eventName in userEventCallbacks ) {
        eventCallbacks[ eventName ] = eventCallbacks[ eventName ] || [];
        eventCallbacks[ eventName ].push( userEventCallbacks[ eventName ] );
      }
    }

    function set()
    {
      var userObj = argsToObj( arguments ), propName;

      for ( propName in userObj ) {
        model[ propName ] = userObj[ propName ];

        notifyObservers( propName );
      }
    }

    function unmount()
    {
      for ( var i in elements )
        elements[i].parentNode &&
          elements[i].parentNode.removeChild( elements[i] );
    }

    var

    component = this,
    elements = [],
    eventCallbacks = {},
    model = {},
    modelObservers = {},
    notifyTimeoutID = {},
    s, d = document;

    // COMPONENT PROPERTIES
    component.anchors = [];
    component.elements = elements;
    component.model = model;

    // COMPONENT INTERFACE
    component.destroy = destroy;

    component.dispatch=function(eventName){
      var args = toArray( arguments, 1 ), i;

      setTimeout(function(){
        for ( i in eventCallbacks[ eventName ] )
          eventCallbacks[eventName][i].apply(component.publ,args);
      });
    };

    component.onModelUpdate=function(){
      var updateCallbacks = argsToObj( arguments ), propName;

      for ( propName in updateCallbacks ) {
        model[ propName ] = model[ propName ] || null;
        modelObservers[propName]=modelObservers[propName]||[];
        modelObservers[propName].push(updateCallbacks[propName]);
        notifyObservers(propName);
      }
    };

    component.mount = mount;
    component.set = set;
    component.unmount = unmount;

    // PUBLIC INTERFACE
    component.publ = publicInterface = publicInterface || {};

    publicInterface.elements = elements;
    publicInterface.destroy = destroy;
    publicInterface.model = model;
    publicInterface.mount = mount;
    publicInterface.on = on;
    publicInterface.set = set;
    publicInterface.unmount = unmount;

    // HTML-> DOM
    if( HTML && d ) {
      s = d.createElement( "div" );
      s.innerHTML = HTML;
      elements = component.elements = component.publ.elements =
        toArray( s.children );
      gainAnchorElements( elements, component.anchors );
    }
  }

  return Component;
}));
