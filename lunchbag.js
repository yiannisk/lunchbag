// a list of lists
Lists = new Meteor.Collection('lists');

// the list's schema
function List(id, title, owner, items) {
	this.id = id;
	this.title = title;
	this.items = items;
	this.owner = owner;
}

function log() {
  if (typeof console !== 'undefined')
	console.log(arguments);
}

if (Meteor.is_client) {
  Template.hello.greeting = function () {
    return "Welcome to lunchbag.";
  };

  Template.hello.events = {
    'click #createList' : function () {
      // template data, if any, is available in 'this'
      
      // create the list
      var list = new List(0, 'List Title', 'me', [{
		  text: "Item 1"
	  }]);
	  
	  Lists.insert(list);
	  document.body.appendChild(Meteor.ui.render(function () {
		  return Template.list(Lists.findOne({id: list.id}));
	  }));
    }
  };
  
  var listItemIndex = -1;
  Template.list.events = {
	  'click #addItem' : function () {
		  this.items.push({
			  text: document.getElementById("newItem").value
		  });
		  Lists.update({id: this.id}, this);
	  },
	  
	  'click .listItems > li' : function (obj) {
		  log("You attempted to select an item", obj.target);
		  var list = this;
		  var $target = $(obj.target);
		  var $siblings = $target.siblings();
		  
		  $siblings.removeClass("selected");
		  
		  if ($target.hasClass("selected")
			  && !$target.hasClass("editing")) {
			  $target.addClass("editing");
			  $target.html("<input type='text' value='" 
				+ $target.html()
				+ "' />");
			  $target.find("input").focus();
				
			  $target.find("input").bind("blur", function (evt) {
				  var $parent = $(this).parent();
				  var index = $parent.index();
				  list.items[index].text = $(this).val();
				  Lists.update({id: list.id}, list);
				  $parent.html($(this).val());
				  $parent.removeClass("editing");
			  });
		  }
		  
		  $(obj.target).addClass("selected");
	  }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
	  // server startup code here.
  });
}
