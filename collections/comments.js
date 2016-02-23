Comments = new Meteor.Collection('comments');

Meteor.methods({
  comment: function(commentAttributes) {
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "Você deve estar logado para deixar um comentário!");
    if (!commentAttributes.body)
      throw new Meteor.Error(422, 'Deixe algum comentário');
    if (!post)
      throw new Meteor.Error(422, 'Você deve comentar em um post');
    comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });
    // update the post with the number of comments
    Posts.update(comment.postId, {$inc: {commentsCount: 1}});

    comment._id = Comments.insert(comment);
    return comment._id;
  }
});

