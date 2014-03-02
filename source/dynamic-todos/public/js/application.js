$(function() {
  // Todo can be added
  $('form').on('submit',function(e){
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/add_todo',
      data: $('form').serialize(),
      success: function(resp){
        var todo = JSON.parse(resp);
        $('.todo_list').append($.trim($('#todo_template').html()));
        $('.todo_list .todo h2').last().text(todo.title);
      },
      error: function(resp){
        console.log('error',resp);
      }
    });
  });

  // var todoTemplate = $.trim($('#todo_template').html());

  // function bindEvents() {
  //   // Bind functions which add, remove, and complete todos to the appropriate
  //   // elements
  // }

  // //Create functions to add, remove and complete todos



  // function buildTodo(todoName) {
  //   // Creates an jQueryDOMElement from the todoTemplate.
  //   var $todo = $(todoTemplate);
  //   // Modifies it's text to use the passed in todoName.
  //   $todo.find('h2').text(todoName);
  //   // Returns the jQueryDOMElement to be used elsewhere.
  //   return $todo;
  // }


  // bindEvents();
});
