# :watermelon: Write components with interface, events and observable model.

Declare your component:

```javascript
function Counter()
{
  // Create component tooling
  const component = new Component( this,
    "<button inc-button>Increment</button><i total-count>0<i>" );
  // Observe component model
  component.onModelUpdate({
    total( value ) {
      component.anchors.totalCount[0].innerHTML = value;
    }
  });
  // Dispatch events
  component.anchors.incButton[0].addEventListener( "click", () => {
    component.dispatch( "increment" );
  });
  // Extend component public interface
  Object.assign( component.publ, {
    startOver() {
      component.set( "total", 0 );
    }
  });
}
```

Use your component:

```javascript
const counter = new Counter;
// Subscribe to component events
counter.on( "increment", () => {
  if ( counter.model.total < 10 )
    // Change component model
    counter.set( "total", counter.model.total + 1 );
  else
    counter.startOver();
});
// Mount component to a document body
counter.mount();
```

Destroy your component:

```javascript
counter.destroy();
```
