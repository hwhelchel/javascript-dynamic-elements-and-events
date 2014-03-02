var TodoApp = {};

TodoApp.Binder = function(targets, actions, builder){
  this.targets = targets;
  this.actions = actions;
  this.builder = builder;
};

TodoApp.Binder.prototype = {
  bind: function(){
    bindAdd();
    bindDelete();
    bindComplete();
  },
  bindAdd: function(){
    var sel = this.targets.addListener;
    var action = this.actions.addAction;
    $(sel).on(action,function(e){
      e.preventDefault();
      builder.addTodo();
    });

  },
  bindDelete: function(){
    var sel = this.targets.deleteListener;
    var action = this.actions.deleteAction;
    $(sel).on(action,function(e){
      e.preventDefault();
      builder.deleteTodo();
    });
  },
  bindComplete: function(){
    var sel = this.targets.completeListener;
    var action = this.actions.completeAction;
    $(sel).on(action,function(e){
      e.preventDefault();
      builder.completeTodo();
    });
  }
};













$(function() {

  var todoTemplate = $.trim($('#todo_template').html());

  TodoApp.Binder = function() {
    var form = 'form';
    var formEvent = 'submit';
    var list = '.todo_list';
    var listItem = $.trim($('#todo_template').html());
    var listTitle = '.todo_list .todo h2';

    $(form).on(formEvent,function(e){
      e.preventDefault();

      $.ajax({
      type: 'POST',
      url:  '/add_todo',
      data: $(form).serialize(),
      success: function(resp){
        var todo = JSON.parse(resp);
        $(list).append(listItem);
        $(listTitle).last().text(todo.title);
      },
      error: function(resp){
        console.log('error',resp);
      }
    });
  });
    // Bind functions which add, remove, and complete todos to the appropriate
    // elements
  };

  //Create functions to add, remove and complete todos



  TodoApp.Builder = function(todoName) {
    // Creates an jQueryDOMElement from the todoTemplate.
    var $todo = $(todoTemplate);
    // Modifies it's text to use the passed in todoName.
    $todo.find('h2').text(todoName);
    // Returns the jQueryDOMElement to be used elsewhere.
    return $todo;
  };

  TodoApp.View = function(){

  };


  bindEvents();
});
