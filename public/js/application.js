$(document).ready(function() {

  // $('table a').click(function(e) {
  //   console.log("entering on click remote")
  //   e.preventDefault();
  //   // $('body').css('background-color','red');

  //   $.ajax ({
  //     url: '/user/1/list/1',
  //     type: 'GET',
  //     dataType: 'json'
  //   }).done(function(response){
      
  //     List.init(response.list.id, response.list.name);
  //     View.showItemFields();
  //     View.disableListForm();
  //     View.disableUpdate();
  //     View.disableDelete();
  //     View.disableSave();
  //     View.hideListForm();
  //     View.changePageHeader(List.name);

  //     items = response.items
  //     for(x = 0; x< items.length; x ++) {
  //       // console.log(items[x].description);
  //       List.addItemDB(items[x].description, items[x].id, items[x].completed)
  //     };
  //   });

  // });

  $('#create_list_form').submit(function(e){
    e.preventDefault();
    

  if ($('input[name="name"]').val() == "") {
    View.errorEmptyListName();
  }
  else {
    $.ajax ({
      url: $(e.target).attr("action"),
      type: "POST",
      data: $(e.target).serialize(),
      dataType: "json"
    }).done(function(response){
      List.init(response.id, response.name);
      View.showItemFields();
      View.disableListForm();
      View.disableUpdate();
      View.disableDelete();
      View.disableSave();
      View.hideListForm();
      View.changePageHeader(List.name);
    });
  };

  });

  $('#add_button').click(function(e) {
    e.preventDefault();

    if ($('input[name="description"]').val() == "") {
      View.errorEmptyField();
    }
    else {
    List.addItem($('input[name="description"]').val());
    View.clearItemInput();
    View.enableSave();
    };
  });

  $('#update_button').click(function(e) {
    e.preventDefault();

    if ($('input[name="description"]').val() == "") {
      View.errorEmptyField();
    }
    else {
    item = List.items[$(".highlight").attr("id") -1];
    description = $('input[name="description"]').val();
    item.changeDescription(description);

    View.clearItemInput();
    View.enableAdd();
    View.enableSave();
    View.clearHighlighting();
    };

  });

  $('#delete_button').click(function(e) {
    e.preventDefault();

    item = List.items[$(".highlight").attr("id") -1];
    item.remove();

    View.clearItemInput();
    View.enableAdd();
    View.enableSave();
    View.clearHighlighting();
    View.disableUpdate();
    View.disableDelete();
  });

  $('#item_list').on('change','input[type="checkbox"]', function (e){

    item = List.items[$(e.target).parent().parent().attr("id") -1];
    item.toggleCompleted();
    View.enableSave();
  });

  $('#save_list_button').click(function(e) {
    e.preventDefault();
    List.save();

  });

  $('#item_list').on('click','input[type="checkbox"]', function(e){
    e.stopPropagation();
  });

  $('#item_list').click(function(e){
    item = List.items[$(e.target).closest('div').attr("id") -1];
    View.clearHighlighting();
    View.highlightItem(item.id);
    View.populateText(item.description);
    View.disableAdd();
    View.disableSave();
    View.enableUpdate();
    View.enableDelete();
  });

});

getData = function () {

    console.log(window.location.pathname);

    $('#spinner').append('<i class="fa fa-spinner"></i>');
    $.ajax ({
      url: window.location.pathname +"/data",
      type: 'GET',
      dataType: 'json'
    }).done(function(response){
      $('#spinner').hide();
      List.init(response.list.id, response.list.name);
      View.showItemFields();
      View.disableUpdate();
      View.disableDelete();
      View.disableSave();

      items = response.items
      for(x = 0; x< items.length; x ++) {
        List.addItemDB(items[x].description, items[x].id, items[x].completed)
      };
    });
}

var List = {
  items: [],
  init: function(id, name) {
    this.id = id
    this.name = name
  },
  addItem: function(description) {
    item = new Item(description, this.id, this.items.length + 1);
    this.items.push(item);
    View.printItem(item.id, item.description);
  },
  addItemDB: function(description, id, completed) {
    item = new Item(description, this.id, this.items.length + 1);
    item.DBid = id;
    item.completed = completed;
    item.status = "saved";
    this.items.push(item);
    if (completed) {
      View.printCompletedItem(item.id, item.description);
    }
    else {
      View.printItem(item.id, item.description);
    };
  },
  save: function() {
    this.items.forEach(function(item){
      switch(item.status) {
        case null:
          item.save();
          break;
        case "changed":
          item.update();
          break;
        case "delete":
          item.deleteDB();
          break;
      };
    });
    View.disableSave();
  }
}

function Item (description,owner, id) {
  this.description = description;
  this.list = owner;
  this.id = id;
  this.DBid = null;
  this.status = null;
  this.completed = false;
};

Item.prototype.save = function() {

  var item = this;

  $.ajax({
    url: '/item',
    type: 'POST',
    data: {description: this.description, list: this.list, completed: this.completed},
    dataType: 'json'
  }).done(function(response){
    item.status = "saved";
    item.DBid = response.id;
    console.log(item);
  });
};

Item.prototype.changeDescription = function(description) {
  item.description = description;
  item.status = "changed";
  View.updateItem(item.id, item.description);
  View.disableUpdate();
  View.disableDelete();
};

Item.prototype.update = function() {

  var item = this;

  $.ajax ({
    url: '/item',
    type: 'PUT',
    data: {description: this.description, id: this.DBid, completed: this.completed}
  }).done(function(response){
    console.log(response);
    item.status = "saved";
  });
};

Item.prototype.remove = function() {
  if (this.status) {
    this.status = "delete"
  }
  View.removeItem(this.id);
};

Item.prototype.deleteDB = function() {

  item = this;

  $.ajax ({
    url: '/item',
    type: 'DELETE',
    data: {id: this.DBid}
  }).done(function(){
    item.status = "deleted"
  });
};

Item.prototype.toggleCompleted = function() {
  this.completed = !this.completed;
  if (this.status) {
    item.status = "changed";
  }
  View.toggleStrikeThrough(item.id);
};

var View = {
  showItemFields: function() {
    $('#create_items').show();
  },
  disableListForm: function() {
    $('#create_list_form :input').attr('disabled',true);
  },
  printItem: function(id, description) {
    $('#item_list').append('<div class="item" id="' + id + '"><form><input type="checkbox" class="checkbox"><span class="description">' + description + '</span></form></div>')
  },
  printCompletedItem: function(id, description) {
    $('#item_list').append('<div class="item, strike_through" id="' + id + '"><form><input type="checkbox" class="checkbox" checked><span class="description">' + description + '</span></form></div>')
  },
  clearItemInput: function() {
    $('input[name="description"]').val("");
  },
  highlightItem: function(id) {
    $('#'+ id).addClass('highlight');
  },
  clearHighlighting: function() {
    $('#item_list').children().removeClass('highlight');
  },
  populateText: function(description) {
    $('input[name="description"]').val(description);
  },
  disableAdd: function() {
    $('#add_button').prop('disabled',true);
  },
  disableSave: function() {
    $('#save_list_button').prop('disabled',true);
  },
  updateItem: function(id, description) {
    $('#'+id).children('form').children('span').text(description);
  },
  enableAdd: function() {
    $('#add_button').prop('disabled',false);
  },
  enableSave: function() {
    $('#save_list_button').prop('disabled',false);
  },
  disableUpdate: function() {
    $('#update_button').prop('disabled',true);
  },
  disableDelete: function() {
    $('#delete_button').prop('disabled',true);
  },
  enableUpdate: function() {
    $('#update_button').prop('disabled',false);
  },
  enableDelete: function() {
    $('#delete_button').prop('disabled',false);
  },
  removeItem: function(id) {
    $('#'+id).hide();
  },
  toggleStrikeThrough: function(id) {
    $('#'+id).toggleClass("strike_through");
  },
  hideListForm: function() {
    $('#create_list_form').hide();
  },
  changePageHeader: function(name) {
    $('h1').text(name)
  },
  errorEmptyField: function() {
    $('#item_description_error').text("Description cannot be empty");
    $('#item_description_error').fadeTo(3000,0);
  },
  errorEmptyListName: function() {
    $('#list_name_error').text("List name cannot be blank");
    $('#list_name_error').fadeTo(3000,0);
  }

}
