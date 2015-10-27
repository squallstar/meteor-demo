Links = new Mongo.Collection('links');

Meteor.methods({
  addLink: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Links.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteLink: function (linkId) {
    Links.remove({_id: linkId, owner: Meteor.userId()});
  },
  setChecked: function (linkId, setChecked) {
    Links.update({_id: linkId, owner: Meteor.userId()}, { $set: { checked: setChecked} });
  },
  setPrivate: function (linkId, setToPrivate) {
    var link = Links.findOne(linkId);

    // Make sure only the link owner can make a link private
    if (link.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Links.update(linkId, { $set: { private: setToPrivate } });
  }
});