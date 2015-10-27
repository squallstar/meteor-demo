Meteor.publish("links", function () {
  return Links.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });
});