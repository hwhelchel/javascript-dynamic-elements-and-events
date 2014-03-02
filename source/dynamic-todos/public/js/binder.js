var TodoApp = {};

var targets = {
  parentListener: 'form',
  addListener: 'input.submit',
  deleteListener: 'a.delete',
  completeListener: 'a.complete'
};

TodoApp.Binder = function(targets, action, builder){
  this.targets = targets;
  this.builder = builder;
  this.action = action;
};

TodoApp.Binder.prototype = {
  bind: function(){
    bindAdd(parent,action);
    bindDelete(parent);
    bindComplete(parent);
  },
  bindAdd: function(parent){
    var sel = this.targets.addListener;
    var action = this.action;
    var binder = this;
    $(parent).on(action,sel,function(e){
      e.preventDefault();
      builder.addTodo();
    });
  },
  bindDelete: function(parent){
    var sel = this.targets.deleteListener;
    var action = this.action;
    var binder = this;
    $(parent).on(action,sel,function(e){
      e.preventDefault();
      binder.node = e.target;
      builder.deleteTodo(binder);
    });
  },
  bindComplete: function(parent){
    var sel = this.targets.completeListener;
    var action = this.action;
    var binder = this;
    $(parent).on(action,sel,function(e){
      e.preventDefault();
      binder.node = e.target;
      builder.completeTodo(binder);
    });
  }
};