# Component constructor :watermelon:

Write managable components with public interface, events and async model observation.

```javascript
// Declare your component
function MyComponent()
{
  // `this` will become a public interface
  const component = new Component(this,'<p>My basic component</p>');

  // Observe component model
  component.onModelUpdate({

    // Observer for component.model.prop1
    prop1 (value) {
      // Model property changed
    },

    // Observer for component.model.prop2
    prop2 (value) {
      // Model property changed
    }
  });

  // Dispatch events
  component.dispatch('myEvent',1,2,3);

  // Extend component public interface
  Object.assign(component.publ, {

    // Add new method
    myMethod () {
      //...
    },

    // Override destructor
    destoy () {
      // ... do some cleanup (unsubscribe events, etc.)

      component.destroy();
    }
  });
}

//...

// Create your new component
const myComponent = new MyComponent;

// Mutate component model
myComponent.set('prop1',1);
myComponent.set('prop2',2);

// Subscribe to component events
myComponent.on('myEvent', (p1,p2,p3) => {
  alert('My component dispatched event');
});

// Mount component to a document body
myComponent.mount(document.body);

// Use component public interface
myComponent.myMethod();

// Destroy component
myComponent.destroy();
```

##Same code in ES3:

```javascript
// Declare your component
function MyComponent()
{
  // `this` will become a public interface
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
```
