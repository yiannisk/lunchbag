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

if (Meteor.isClient) {
    Template.hello.greeting = function () {
        return "Welcome to lunchbag.";
    };

    Template.hello.events({
        'click #createList' : function () {
            console.log('create list clicked.');
            // template data, if any, is available in 'this'

            // create the list
            var list = new List(0, 'List Title', 'me', [{
                text: "Item 1"
            }]);

            var found = Lists.findOne(list.id);
            if (found === undefined) Lists.insert(list);

            var fragmentRenderer = function () {
                return Template.list(Lists.findOne({id: list.id}));
            }

            $(Meteor.render(fragmentRenderer)).appendTo(".colB");
        }
    });

    Template.list.events({
        'click #addItem' : function () {
            this.items = this.items || [];
            this.items.push({
                text: document.getElementById("newItem").value
            });
            Lists.update({id: this.id}, this);
        },

        'click .listContainer .title': function (obj) {
            log("You clicked on the title of the list.");
            var list = this;
            var $target = $(obj.target);

            $target.html("<input type='text' value='"
                + $target.html() + "' class='textbox' />");
            $target.find("input")
                .css('width', '90%')
                .focus();

            $target.find("input").bind("blur", function (evt) {
                var $parent = $(this).parent();

                if (list.title != $(this).val()) {
                    list.title = $(this).val();
                    Lists.update({id: list.id}, list);
                }

                $parent.html($(this).val());
            });
        },

        'click .listItems > li': function (obj) {
            var list = this;
            var $target = $(obj.target);
            var $siblings = $target.siblings();

            $siblings.removeClass("selected");

            if ($target.hasClass("selected")
                && !$target.hasClass("editing")) {

                $target.addClass("editing");
                $target.html("<input type='text' value='"
                    + $target.html() + "' class='textbox' />");

                $target.find("input").focus();

                $target.find("input").bind("blur", function (evt) {
                    var $parent = $(this).parent();
                    var index = $parent.index();

                    if (list.items[index].text != $(this).val()) {
                        list.items[index].text = $(this).val();
                        Lists.update({id: list.id}, list);
                    }

                    $parent.html($(this).val());
                    $parent.removeClass("editing");
                });
            }

            $(obj.target).addClass("selected");
        },

        'click #deleteItem': function () {
            if ((".listItems .selected").length > 0) {
                var index = $(".listItems").find(".selected").index();
                log(index);
                if (index == -1) return;
                this.items.splice(index, 1);
                log(this.items);
                Lists.update({id: this.id}, this);
            }
        },

        'click #clearList': function () {
            this.items = [];
            Lists.update({id: this.id}, this);
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // server startup code here.
    });
}
