Write managable components with public interface, events and async model observers

Example:

```javascript
function MyComponentConstructor()
{
  // `this` becomes a public interface
  var component=new Component(this,'<p>My basic component</p>');

  component.onModelUpdate({
    prop1:function(){},
    prop2:function(){}
  });

  component.dispatch('myEvent','1','2','3');

  component.publ.myExtraMethod=function(){
    //
  }
}

//...

var myComponent=new MyComponentConstructor;

myComponent.set('prop1',1);
myComponent.set('prop2',2);

myComponent.on('myEvent',function(p1,p2,p3){
  alert('My component dispatched event',p1,p2,p3);
});

myComponent.myExtraMethod();
```
