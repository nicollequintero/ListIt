$(document).ready(function() {

  $('#create_list_form').submit(function(e){
    e.preventDefault();

    $.ajax ({
      url: $(e.target).attr("action"),
      type: "POST",
      data: $(e.target).serialize(),
      dataType: "json"
    }).done(function(response){
      List.init(response.id, response.name);
      View.showItemFields();
      View.disableListForm();
    });

  });

});

var List = {
  items: [],
  init: function(id, name) {
    this.id = id
    this.name = name
  }
}

var View = {
  showItemFields: function() {
    $('#create_items').show();
  },
  disableListForm: function() {
    $('#create_list_form :input').attr('disabled',true);
  }
}
