Template.postItem.helpers({
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },

  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
});

Template.postItem.rendered = function(){
  // anima o artigo da posição prévia para a nova posição
var instance = this;
  var rank = instance.data._rank;
  var $this = $(this.firstNode);
  var postHeight = 80;
  var newPosition = rank * postHeight;

  // se o elemento tem uma currentPosition (vulgo não é a primeira renderização)
if (typeof(instance.currentPosition) !== 'undefined') {
    var previousPosition = instance.currentPosition;
    // calcule a diferença entra a posição antiga e a nova posição e envie o elemento para lá
var delta = previousPosition - newPosition;
    $this.css("top", delta + "px");
  } else {
    // é a primeira renderização, então esconda o elemento
$this.addClass("invisible");
  }

  // deixe desenhar na posição antiga, então..
Meteor.defer(function() {
    instance.currentPosition = newPosition;
    // traga elemento de volta a sua nova posição original
$this.css("top",  "0px").removeClass("invisible");
  });
};

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});