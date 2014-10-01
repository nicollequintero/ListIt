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
    List.addItem($('input[name="description"]').val());
    View.clearItemInput();
  });

  $('#save_list_button').click(function(e) {
    e.preventDefault();
    List.save();
  });

  $('#create_items').click(function(e){
    item = List.items[$(e.target).attr("id") -1];
    View.highlightItem(item.id);
    View.populateText(item.description);
    View.disableAdd();
    View.disableSave();
  });

});

var List = {
  items: [],
  init: function(id, name) {
    this.id = id
    this.name = name
  },
  addItem: function(description) {
    item = new Item(description, this.id, this.items.length + 1)
    this.items.push(item);
    View.printItem(item.id, item.status, item.description);
  },
  save: function() {
    this.items.forEach(function(item){
      item.save();
    });
  }
}

function Item (description,owner, id) {
  this.description = description;
  this.list = owner;
  this.status = "";
  this.id = id
};

Item.prototype.save = function () {
  $.ajax({
    url: '/item',
    type: 'POST',
    data: {description: this.description, list: this.list}
  });
};

var View = {
  showItemFields: function() {
    $('#create_items').show();
  },
  disableListForm: function() {
    $('#create_list_form :input').attr('disabled',true);
  },
  printItem: function(id, status, description) {
    $('#item_list').append('<div id="' + id + '">' + description + '</div>')
  },
  clearItemInput: function() {
    $('input[name="description"]').val("");
  },
  highlightItem: function(id) {
    $('#item_list').children().removeClass('highlight');
    $('#'+ id).addClass('highlight');
  },
  populateText: function(description) {
    $('input[name="description"]').val(description);
  },
  disableAdd: function() {
    $('#add_button').prop('disabled',true);
  },
  disableSave: function() {
    $('#save_list_button').prop('disabled',true);
  }

}
