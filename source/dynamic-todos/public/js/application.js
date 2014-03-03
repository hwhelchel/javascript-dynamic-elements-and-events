var ToDoApp = {};

ToDoApp.ToDo = function(data){
  this.title = data.title;
  this.isComplete = false;
  this.isDelete = false;
};

ToDoApp.Binder = function(targets, action, manager){
  this.targets = targets;
  this.manager = manager;
  this.action = action;
};

ToDoApp.Binder.prototype = {
  bind: function(){
    var action = this.action;
    var addParent = this.targets.parentAddListener;
    var parent = this.targets.parentDeleteAndCompleteListener;
    this.bindAdd(addParent,action,this);
    this.bindDelete(parent);
    this.bindComplete(parent);
  },
  bindAdd: function(parent,action,binder){
    var sel = this.targets.addListener;
    $(parent).on(action,sel,function(e){
      e.preventDefault();
      binder.manager.addTodo(binder.targets.parentAddListener);
    });
  },
  bindDelete: function(parent){
    var sel = this.targets.deleteListener;
    var action = this.action;
    var binder = this;
    $(parent).on(action,sel,function(e){
      e.preventDefault();
      binder.node = e.target.parentElement.parentElement.parentElement;
      binder.manager.deleteTodo($(binder.node).find('h2').text());
    });
  },
  bindComplete: function(parent){
    var sel = this.targets.completeListener;
    var action = this.action;
    var binder = this;
    $(parent).on(action,sel,function(e){
      e.preventDefault();
      binder.node = e.target.parentElement.parentElement.parentElement;
      binder.manager.completeTodo($(binder.node).find('h2').text());
    });
  }
};

ToDoApp.Manager = function(config){
  this.view = config.view;
  this.errors = [];
};

ToDoApp.Manager.prototype = {
  addTodo: function(dataSource){
    var manager = this;
    var error = 'Add';
    $.ajax({
      type: 'POST',
      url:  '/add_todo',
      data: $(dataSource).serialize(),
      success: function(resp){
        if (!manager.todos) { manager.makeToDos(); }
        manager.todos.push(new ToDoApp.ToDo(JSON.parse(resp)));
        manager.view.update(manager);
      },
      error: function(resp){
        manager.errors.push({error: error + ' Error'});
        manager.view.update(manager);
      }
    });
  },
  makeToDos: function(){
    this.todos = [];
  },
  deleteTodo: function(title){
      var manager = this;
      var error = 'Delete';
      var request = {title: title };
      $.ajax({
      type: 'DELETE',
      url:  '/delete_todo',
      data: request,
      success: function(resp){
        for (var i = 0; i < manager.todos.length; i++) {
          if (JSON.parse(resp).title === manager.todos[i].title) {
             manager.todos.splice(i,1);
          }
        }
        manager.view.update(manager);
      },
      error: function(resp){
        manager.errors.push({error: error + ' Error'});
        manager.view.update(manager);
      }
    });
  },
  completeTodo: function(title){
      var manager = this;
      var error = 'Complete';
      var request = { title: title };
      $.ajax({
      type: 'PATCH',
      url:  '/complete_todo',
      data: request,
      success: function(resp){
        for (var i = 0; i < manager.todos.length; i++) {
          if (JSON.parse(resp).title === manager.todos[i].title) {
             manager.todos[i].isComplete = true;
          }
        }
        manager.view.update(manager);
      },
      error: function(resp){
        manager.errors.push({error: error + ' Error'});
        manager.view.update(manager);
      }
    });
  }
};


ToDoApp.View = function(opts){
  this.opts = opts;
};

ToDoApp.View.prototype = {
  update: function(dataSource){
    this.showToDos(dataSource.todos);
    if (dataSource.todos) {
      this.showComplete(dataSource.todos);
    }
  },
  showToDos: function(todos){
    $(this.opts.todoList).empty();
    for (var todo in todos) {
      $(this.opts.todoList).append(this.opts.todoItem);
    }
    this.addTitle(todos);
  },
  addTitle: function(todos){
    $(this.opts.todoClass).each(function(i,item){
      $(item).find('h2').text(todos[i].title);
    });
  },
  showComplete: function(todos){
    $(this.opts.todoClass).each(function(i,item){
      if (todos[i].isComplete) {
        $(item).find('a.complete').replaceWith('Completed');
      }
    });
  }
};

$(function(){

ToDoApp.Binder.targets = {
    parentAddListener: 'form',
    addListener: 'input.submit',
    parentDeleteAndCompleteListener: '.todo_list',
    deleteListener: 'a.delete',
    completeListener: 'a.complete'
  };

ToDoApp.View.opts = {
  todoList: '.todo_list',
  todoItem: $.trim($('#todo_template').html()),
  todoClass: '.todo_list .todo_item'
};
ToDoApp.manager = new ToDoApp.Manager({view: new ToDoApp.View(ToDoApp.View.opts)});
ToDoApp.binder = new ToDoApp.Binder(ToDoApp.Binder.targets,'click',ToDoApp.manager);
ToDoApp.binder.bind();
});

