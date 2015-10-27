// counter starts at 0
Session.setDefault('counter', 0);

Template.hello.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Meteor.subscribe("links")

Template.body.helpers({
  links: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Links.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    } else {
      // Otherwise, return all of the Links
      return Links.find({}, {sort: {createdAt: -1}});
    }
  },
  hideCompleted: function () {
    return Session.get("hideCompleted");
  }
});

Template.header.helpers({
  incompleteCount: function () {
    return Links.find({checked: {$ne: true}}).count();
  }
});

Template.header.events({
  "submit .new-link": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var text = event.target.text.value;

    Meteor.call("addLink", text);

    // Clear form
    event.target.text.value = "";
  },
  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }
});

Template.link.events({
  "click .toggle-checked": function () {
    Meteor.call("setChecked", this._id, ! this.checked);
  },
  "click .delete": function () {
    Meteor.call("deleteLink", this._id);
  },
  "click .toggle-private": function () {
    Meteor.call("setPrivate", this._id, ! this.private);
  }
});

Template.link.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  }
});

Template.hello.events({
  'click button': function () {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});