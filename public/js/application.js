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

  $('#add_button').click(function(e) {
    e.preventDefault();
    // $('body').css('background-color','blue');
    List.addItem($('input[name="description"]').val());
    View.clearItemInput();
  });

  $('#save_list_button').click(function(e) {
    e.preventDefault();
    // $('body').css('background-color','blue');
    List.save();
  });

});

var List = {
  items: [],
  init: function(id, name) {
    this.id = id
    this.name = name
  },
  addItem: function(description) {
    item = new Item(description, this.id)
    this.items.push(item);
    View.printItem(item.id, item.status, item.description);
  },
  save: function() {
    this.items.forEach(function(item){
      item.save();
    });
  }
}

function Item (description,owner) {
  this.description = description;
  this.list = owner;
  this.status = "";
};

Item.prototype.save = function () {
  console.log("saving")
};

var View = {
  showItemFields: function() {
    $('#create_items').show();
  },
  disableListForm: function() {
    $('#create_list_form :input').attr('disabled',true);
  },
  printItem: function(id, status, description) {
    $('#item_list').append('<h5 id="' + id + '">' + description + '</h5>')
  },
  clearItemInput: function() {
    $('input[name="description"]').val("");
  }
}
