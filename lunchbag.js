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
      log("You pressed the create list button.");
      
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
  
  Template.list.events = {
	  'click #addItem' : function () {
		  log("You pressed the add item button.", this.items);
		  this.items.push({
			  text: document.getElementById("newItem").value
		  });
		  Lists.update({id: this.id}, this);
	  }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
	  // server startup code here.
  });
}
