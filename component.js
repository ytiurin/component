/*
  Write managable components with public interface, events and async model observation.

  // Declare your component
  function MyComponent()
  {
    // `this` is now a public interface
    var component = new Component(this,'<p>My basic component</p>');

    // Observe component model
    component.onModelUpdate({

      // Observer for component.model.prop1
      prop1:function(value){
        // Model property changed
      },

      // Observer for component.model.prop2
      prop2:function(value){
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
  myComponent.set('prop2',2);

  // Subscribe to component events
  myComponent.on('myEvent',function(p1,p2,p3){
    alert('My component dispatched event');
  });

  // Mount component to a document body
  myComponent.mount(document.body);

  // Use component public interface
  myComponent.myMethod();

  // Destroy component
  myComponent.destroy();
  // Declare your component
  function MyComponent()
  {
    // `this` is now a public interface
    var component = new Component(this,'<p>My basic component</p>');

    // Observe component model
    component.onModelUpdate({

      // Observer for component.model.prop1
      prop1:function(value){
        // Model property changed
      },

      // Observer for component.model.prop2
      prop2:function(value){
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
  myComponent.set('prop2',2);

  // Subscribe to component events
  myComponent.on('myEvent',function(p1,p2,p3){
    alert('My component dispatched event');
  });

  // Mount component to a document body
  myComponent.mount(document.body);

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

  'use strict';

  function Component(publicInterface,HTML)
  {
    function toArray(obj,fromIndex)
    {
      return Array.prototype.slice.call(obj,fromIndex);
    }

    function argsToObj(args)
    {
      var argTypes=toArray(args).map(function(a){return typeof a});
      var obj={};

      if(argTypes[0]==='object')
        obj=args[0];

      else if(argTypes[0]==='string'){
        var keys=args[0].split(' ');
        for(var i in keys)
          obj[keys[i]]=args[1];
      }

      else if(argTypes[0]==='function')
        obj={'':args[0]};

      return obj;
    }

    function gainAnchorElements(elements,anchors)
    {
      var attrName;

      for(var i=0;i<elements.length;i++){
        for(var j=0;j<elements[i].attributes.length;j++){
          attrName=elements[i].attributes.item(j).name
            //dashToCamel
            .replace(/-([a-z])/g,function(g){return g[1].toUpperCase()});

          anchors[attrName]=anchors[attrName]||[];
          anchors[attrName].push(elements[i]);
        }

        gainAnchorElements(elements[i].children,anchors)
      }
    }

    function notifyObservers(propName)
    {
      clearTimeout(notifyTimeoutID[propName]);
      notifyTimeoutID[propName]=setTimeout(function(){
        for(var i in modelObservers[propName])
          modelObservers[propName][i](component.model[propName]);

        if(modelObservers[''])
          for(var i in modelObservers[''])
            modelObservers[''][i]();
      });
    }

    var

    component=this,
    eventCallbacks={},
    modelObservers={},
    notifyTimeoutID={};

    // COMPONENT PROPERTIES
    component.anchors=[];
    component.elements=[];
    component.model={};
    component.publ=publicInterface||{};

    // COMPONENT INTERFACE
    component.destroy=function()
    {
      component.unmount();
    };

    component.dispatch=function(eventName){
      var args=toArray(arguments,1);

      setTimeout(function(){
        for(var i in eventCallbacks[eventName])
          eventCallbacks[eventName][i].apply(component.publ,args);
      });
    };

    component.onModelUpdate=function(){
      var updateCallbacks=argsToObj(arguments);

      for(var propName in updateCallbacks){
        component.model[propName]=component.model[propName]||null;
        modelObservers[propName]=modelObservers[propName]||[];
        modelObservers[propName].push(updateCallbacks[propName]);
        notifyObservers(propName);
      }
    };

    component.mount=function(parent){
      parent = parent || document.body;

      try{
        var el,i=0;

        while(el = component.elements[i++])
          parent.appendChild(el);
      }
      catch(e){
        throw "Could not mount component: "+e.message;
      }
    };

    component.set=function(){
      var userObj=argsToObj(arguments);

      for(var propName in userObj){
        component.model[propName]=userObj[propName];

        notifyObservers(propName);
      }
    };

    component.unmount=function()
    {
      var el,i=0;

      while(el = component.elements[i++])
        el.parentNode&&
          el.parentNode.removeChild(el);
    };

    Object.defineProperty(component,'element',{
      configurable:true,
      enumerable:true,
      get:function(){return component.elements[0]},
      set:function(val){component.elements[0]=val}
    });

    // PUBLIC INTERFACE
    ['element','elements','model','set']

    .forEach(function(propName){
      Object.defineProperty(component.publ,propName,{
        configurable:true,
        enumerable:true,
        get:function(){return component[propName]},
        set:function(val){component[propName]=val}
      });
    });

    component.publ.destroy=function(){
      component.destroy();
    };

    component.publ.mount=function(parent){
      component.mount(parent);
    };

    component.publ.on=function(){
      var userEventCallbacks=argsToObj(arguments);

      for(var eventName in userEventCallbacks){
        eventCallbacks[eventName]=eventCallbacks[eventName]||[];
        eventCallbacks[eventName].push(userEventCallbacks[eventName]);
      }
    };

    component.publ.unmount=function(){
      component.unmount();
    };

    // HTML-> DOM
    if(HTML&&document){
      var p=document.createElement('div');
      p.innerHTML=HTML;
      component.elements=toArray(p.children);
      gainAnchorElements(component.elements,component.anchors);
    }
  }

  return Component;
}));
