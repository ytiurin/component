QUnit.test( "Component constructor", function( assert ) {
  assert.ok( Component!==undefined, "Component is defined");
  assert.ok( typeof Component==='function', "Component is a function");
});

QUnit.test( "Component interface", function( assert ) {
  var component=new Component;
  assert.ok( component!==undefined, "Component is defined");
  assert.ok( component!==null, "Component is not null");
  assert.ok( typeof component==='object', "Component is an object");
  assert.propEqual( component, {
    anchors:[],
    destroy:function(){},
    dispatch:function(){},
    element:undefined,
    elements:[],
    model:{},
    on:function(){},
    onModelUpdate:function(){},
    "publ": {
      "destroy": {},
      "element": undefined,
      "elements": [],
      "model": {},
      "on": {},
      "set": {}
    },
    set:function(){}
  }, "Component interface is consistent");
});

QUnit.test( "Component public interface", function( assert ) {
  var publicInterface={};
  var component=new Component(publicInterface);
  assert.propEqual( publicInterface, {
    destroy:function(){},
    element:undefined,
    elements:[],
    model:{},
    on:function(){},
    set:function(){}
  }, "Component public interface is consistent");
});

QUnit.test( "Model update notifications", function( assert ) {
  assert.expect( 3 );
  var done = assert.async( 3 );

  var component=new Component;
  component.onModelUpdate('prop',function(prop){
    assert.ok( prop===1, "String-style callback assigning" );
    done();
  });

  component.set('prop',1);

  component=new Component;
  component.onModelUpdate({prop:function(prop){
    assert.ok( prop===1, "Object-style callback assigning" );
    done();
  }});

  component.set({prop:1});

  component=new Component;
  component.onModelUpdate('prop',function(prop){
    assert.ok( prop===3, "Deferred notifications" );
    done();
  });

  component.set({prop:1});
  component.set({prop:2});
  component.set({prop:3});
});

QUnit.test( "Events subscription and dispatching", function( assert ) {
  assert.expect( 3 );
  var done = assert.async( 3 );

  var component=new Component;
  component.on('myEvent',function(){
    assert.ok( true, "Event subscription" );
    done();
  });
  component.dispatch('myEvent');

  var component=new Component;
  component.on({myEvent:function(param1,param2){
    assert.ok( param1===1&&param2===2, "Parameters passing" );
    done();
  }});
  component.dispatch('myEvent',1,2);

  var component=new Component;
  component.on({myEvent:function(param){
    assert.ok( param===3, "Deferred dispatching" );
    done();
  }});
  component.dispatch('myEvent',3);
});

QUnit.test( "Multiple event subscription", function( assert ) {
  assert.expect( 2 );
  var done = assert.async( 2 );

  var component=new Component;
  component.on('myEvent',function(){
    assert.ok( true, "First subscription passed" );
    done();
  });
  component.on('myEvent',function(){
    assert.ok( true, "Second subscription passed" );
    done();
  });
  component.dispatch('myEvent');
});

QUnit.test( "HTML elements", function( assert ) {
  var component=new Component({},'<br><br>');
  assert.ok( component.elements.length===2, "HTML elements created" );

  component=new Component({},'<div my-anchor><div my-anchor></div></div>');
  assert.ok( component.anchors.myAnchor.length===2, "HTML anchors exist" );
});
