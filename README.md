Write managable components with public interface, events and async model observers

```javascript
function MyComponent()
{
  // `this` will become a public interface
  var component=new Component(this,'<p>My basic component</p>');

  component.onModelUpdate({
    prop1:function(value){
      //
    },
    prop2:function(value){
      //
    }
  });

  component.dispatch('myEvent',1,2,3);

  component.publ.myExtraMethod=function(){
    //
  }
}

//...

var myComponent=new MyComponent;

myComponent.set('prop1',1);
myComponent.set('prop2',2);

myComponent.on('myEvent',function(p1,p2,p3){
  alert('My component dispatched event');
});

document.body.appendChild(myComponent.element);

myComponent.myExtraMethod();
```
