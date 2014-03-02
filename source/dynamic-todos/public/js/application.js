var ToDoApp = {};
ToDoApp.ToDo = function(data){
  this.title = data.title;
  this.isComplete = "__";
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
    var parent = this.targets.parentListener;
    this.bindAdd(parent,action,this);
    // bindDelete(parent);
    // bindComplete(parent);
  },
  bindAdd: function(parent,action,binder){
    var sel = this.targets.addListener;
    $(parent).on(action,sel,function(e){
      e.preventDefault();
      binder.manager.addTodo(binder.targets.parentListener);
    });
  }
  // bindDelete: function(parent){
  //   var sel = this.targets.deleteListener;
  //   var action = this.action;
  //   var binder = this;
  //   $(parent).on(action,sel,function(e){
  //     e.preventDefault();
  //     binder.node = e.target;
  //     manager.deleteTodo(binder);
  //   });
  // },
  // bindComplete: function(parent){
  //   var sel = this.targets.completeListener;
  //   var action = this.action;
  //   var binder = this;
  //   $(parent).on(action,sel,function(e){
  //     e.preventDefault();
  //     binder.node = e.target;
  //     manager.completeTodo(binder);
  //   });
  // }
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
  }
  // deleteTodo: function(dataSource){
  //     var manager = this;
  //     var error = 'Delete';
  //     $.ajax({
  //     type: 'DELETE',
  //     url:  '/delete_todo',
  //     data: $(dataSource.sel).serialize(),
  //     success: function(resp){
  //       manager.data = JSON.parse(resp);
  //       manager.view.update(manager);
  //     },
  //     error: function(resp){
  //       manager.data = {error: error + ' Error'};
  //       manager.view.update(manager);
  //     }
  //   });
  // },
  // completeTodo: function(dataSource){
  //     var manager = this;
  //     var error = 'Complete';
  //     $.ajax({
  //     type: 'PATCH',
  //     url:  '/complete_todo',
  //     data: $(dataSource.sel).serialize(),
  //     success: function(resp){
  //       manager.data = JSON.parse(resp);
  //       manager.view.update(manager);
  //     },
  //     error: function(resp){
  //       manager.data = {error: error + ' Error'};
  //       manager.view.update(manager);
  //     }
  //   });
  // }
};


ToDoApp.View = function(opts){
  this.opts = opts;
};

ToDoApp.View.prototype = {
  update: function(dataSource){
    this.showToDos(dataSource.todos);
    // if (dataSource.todos) {
    //   this.showComplete(dataSource.todos);
    //   this.removeDelete(dataSource.todos);
    // }
  },
  showToDos: function(todos){
    $(this.opts.todoList).empty();
    for (var todo in todos) {
      $(this.opts.todoList).append(this.opts.todoItem);
    }
    this.updateTitle(todos);
  },
  updateTitle: function(todos){
    $(this.opts.todoClass).each(function(i,item){
      $(item).find('h2').text(todos[i].title);
    });
  }
  // showComplete: function(todos){
  //   $(this.opts.todoClass).each(function(i,todo){
  //     // complete the elements marked
  //   });
  // },
  // removeDelete: function(todos){
  //   $(this.opts.todoClass).each(function(i,todo){
  //     // delete the elements marked
  //   });
  // }
};


$(function(){


ToDoApp.Binder.targets = {
    parentListener: 'form',
    addListener: 'input.submit',
    deleteListener: 'a.delete',
    completeListener: 'a.complete'
  };

ToDoApp.View.opts = {
  todoList: '.todo_list',
  todoItem: $.trim($('#todo_template').html()),
  todoClass: '.todo_item'
};
ToDoApp.manager = new ToDoApp.Manager({view: new ToDoApp.View(ToDoApp.View.opts)});
ToDoApp.binder = new ToDoApp.Binder(ToDoApp.Binder.targets,'click',ToDoApp.manager);
ToDoApp.binder.bind();
});




// $(function() {

//   var todoTemplate = $.trim($('#todo_template').html());

//   ToDoApp.Binder = function() {
//     var form = 'form';
//     var formEvent = 'submit';
//     var list = '.todo_list';
//     var listItem = $.trim($('#todo_template').html());
//     var listTitle = '.todo_list .todo h2';

//     $(form).on(formEvent,function(e){
//       e.preventDefault();

//       $.ajax({
//       type: 'POST',
//       url:  '/add_todo',
//       data: $(form).serialize(),
//       success: function(resp){
//         var todo = JSON.parse(resp);
//         $(list).append(listItem);
//         $(listTitle).last().text(todo.title);
//       },
//       error: function(resp){
//         console.log('error',resp);
//       }
//     });
//   });
//     // Bind functions which add, remove, and complete todos to the appropriate
//     // elements
//   };

//   //Create functions to add, remove and complete todos



//   ToDoApp.manager = function(todoName) {
//     // Creates an jQueryDOMElement from the todoTemplate.
//     var $todo = $(todoTemplate);
//     // Modifies it's text to use the passed in todoName.
//     $todo.find('h2').text(todoName);
//     // Returns the jQueryDOMElement to be used elsewhere.
//     return $todo;
//   };

//   ToDoApp.View = function(){

//   };


//   bindEvents();
// });
