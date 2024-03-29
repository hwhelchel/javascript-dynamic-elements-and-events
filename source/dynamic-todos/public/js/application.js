var ToDoApp = {};

ToDoApp.ToDo = function(data){
  this.title = data.title;
  this.isComplete = false;
};

ToDoApp.Binder = function(targets, manager){
  this.targets = targets;
  this.manager = manager;
};

ToDoApp.Binder.prototype = {
  bind: function(){
    var addParent = this.targets.parentAddListener;
    var dragParent = this.targets.parentDragListener;
    this.bindAdd(addParent,this);
    this.bindDelete(this.targets.parentDeleteAndCompleteListener);
    this.bindComplete(this.targets.parentDeleteAndCompleteListener);
    this.bindDragStart(this.targets.parentDragListener);
    this.bindDragOver(this.targets.parentDragListener);
    this.bindDragEnter(this.targets.parentDragListener);
    this.bindDragLeave(this.targets.parentDragListener);
    this.bindDrop(this.targets.parentDragListener);
    this.bindDragEnd(this.targets.parentDragListener);
  },
  bindAdd: function(parent,binder){
    $(parent).on('submit',function(e){
      e.preventDefault();
      binder.manager.addTodo(binder.targets.parentAddListener);
    });
  },
  bindDelete: function(parent){
    var sel = this.targets.deleteListener;
    var binder = this;
    $(parent).on('click',sel,function(e){
      e.preventDefault();
      binder.node = e.target.parentElement.parentElement.parentElement;
      binder.manager.deleteTodo($(binder.node).find('h2').text());
    });
  },
  bindComplete: function(parent){
    var sel = this.targets.completeListener;
    var binder = this;
    $(parent).on('click',sel,function(e){
      e.preventDefault();
      binder.node = e.target.parentElement.parentElement.parentElement;
      binder.manager.completeTodo($(binder.node).find('h2').text());
    });
  },
  bindDragStart: function(parent){
    var sel = this.targets.dragListener;
    var binder = this;
    $(parent).on('dragstart',sel,function(e){
      binder.manager.startDrag({element: this, evt: e});
    });
  },
  bindDragOver: function(parent){
    var sel = this.targets.dragListener;
    var binder = this;
    $(parent).on('dragover',sel,function(e){
      binder.manager.dragOver({element: this, evt: e});
    });
  },
  bindDragEnter: function(parent){
    var sel = this.targets.dragListener;
    var binder = this;
    $(parent).on('dragenter',sel,function(e){
      binder.manager.dragEnter({element: this});
    });
  },
  bindDragLeave: function(parent){
    var sel = this.targets.dragListener;
    var binder = this;
    $(parent).on('dragleave',sel,function(e){
      binder.manager.dragLeave({element: this});
    });
  },
  bindDrop: function(parent){
    var sel = this.targets.dragListener;
    var binder = this;
    $(parent).on('drop',sel,function(e){
      binder.manager.drop({element: this, evt: e});
    });
  },
  bindDragEnd: function(parent){
    var sel = this.targets.dragListener;
    var binder = this;
    var list = parent;
    $(list).on('dragend',sel,function(e){
      binder.manager.dragEnd({list: list});
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
  },
  startDrag: function(config) {
    config.element.style.opacity = '0.4';

    dragSrcEl = config.element;
    config.evt.originalEvent.dataTransfer.effectAllowed = 'move';
    config.evt.originalEvent.dataTransfer.setData('text/html',config.element.innerHTML);
  },
  dragOver: function(config) {
    if (config.evt.preventDefault) {
      config.evt.preventDefault();
    }
    config.evt.originalEvent.dataTransfer.dropEffect = "move";

    return false;
  },
  dragEnter: function(config) {
    config.element.classList.add('over');
  },
  dragLeave: function(config) {
    config.element.classList.remove('over');
  },
  drop: function(config) {
    if (config.evt.stopPropagation) {
      config.evt.stopPropagation();
    }

    if (dragSrcEl != config.element) {
      dragSrcEl.innerHTML = config.element.innerHTML;
      config.element.innerHTML = config.evt.originalEvent.dataTransfer.getData('text/html');
    }
    return false;
  },
  dragEnd: function(config){
    $.each($(config.list).children(),function(i,todo){
      todo.classList.remove('over');
      todo.style.opacity = '1.0';
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
    parentDeleteAndCompleteListener: '.todo_list',
    deleteListener: 'a.delete',
    completeListener: 'a.complete',
    parentDragListener: '.todo_list',
    dragListener: '.todo_item'
  };

ToDoApp.View.opts = {
  todoList: '.todo_list',
  todoItem: $.trim($('#todo_template').html()),
  todoClass: '.todo_list .todo_item'
};

ToDoApp.manager = new ToDoApp.Manager({view: new ToDoApp.View(ToDoApp.View.opts)});
ToDoApp.binder = new ToDoApp.Binder(ToDoApp.Binder.targets,ToDoApp.manager);
ToDoApp.binder.bind();

});

