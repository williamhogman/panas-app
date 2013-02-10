(function(){
  var App = window.App = Ember.Application.create({
    VERSION: '0.0.1',
  });

  var submissionsCls = Ember.Object.extend({
    stored: [],
    
    count: function(){
      return this.stored.length;
    }.property("stored"),
    
    latest: function() {
      var i = this.stored.length - 1;
      if(i != -1) {
        return this.stored[i];
      } else {
        return null;
      }
    }.property("stored"),


    push: function(obj) {
      this.propertyWillChange("stored");
      this.stored.push(obj);
      this.propertyDidChange("stored");
    }
    
  });

  var submissions = submissionsCls.create();

  App.Router.map(function(){
    this.resource("submission", {path: '/submissions/:submission_id'}, function(){

    });

    this.resource('submissions', function(){
      this.route('new');
    })
    
    this.route("trend", {path: "/trend"});
  });


  App.Question = Ember.Object.extend({
    options: [],
    response: null,
    varname: null,

    getNameResponsePair: function() {
      return [this.varname, this.response];
    }
  });

  App.Option = Ember.Object.extend({
    value: null,
    text: null
  });

  App.Submission = Ember.Object.extend({
    responses: {},
    addResponse: function(name, value) {
      this.propertyWillChange("responses");
      this.responses[name] = value;
      this.propertyDidChange("responses");
    },
    save: function() {
      console.log("Tried to save", this);
      submissions.push(this);
    }
  });

  App.Inventory = Ember.Object.extend({
    questions: [],

    getResponses: function() {
      var obj = {};
      var pairs = this.questions.map(function(x){
        return x.getNameResponsePair()
      }).forEach(function(x){
        obj[x[0]] = x[1];
      });
      return App.Submission.create({responses: obj});
    }
  });

  var mkOption = function(value, text) {
    return App.Option.create({value: value, text: text || value});
  };

  var mkQuestion = function(title, options) {
    return App.Question.create({title: title, options: options, varname: title});
  }


  App.ResponseView = Ember.View.extend({
    templateName: 'response',
    tagName: 'div',
    classNames: ['btn-toolbar'],
    click: function(event) {
      var src = $(event.toElement);

      if(src.hasClass('blank')) {
        this.$("button").removeClass("active");
      } 

      if(src.hasClass("btn")) {
        this.get("context").set("response", src.attr('data-value') || null);
      }
    },
  });

  
  var mk5opt = function() {
    return [1, 2, 3, 4, 5].map(function(x){return mkOption(x)});
  };

  var mkPanasQuestions = function() {
    var panas_affects = ["Interested", "Distressed", "Excited", "Upset",
                         "Strong", "Guilty", "Scared", "Hostile",
                         "Enthusiastic", "Proud", "Irritable", "Alert",
                         "Ashamed", "Inspired", "Nervous", "Determined",
                         "Attentive", "Jittery", "Active", "Afraid"];
    
    return panas_affects.map(function(x){
      return mkQuestion(x, mk5opt())
    });
  };

  var panas = App.Inventory.create({
    questions: mkPanasQuestions()
  });

  App.SubmissionsNewRoute = Ember.Route.extend();
  App.SubmissionsNewController = Ember.ObjectController.extend({
    inventory: panas,

    responses: App.Submission.create(),

    save: function() {
      var responses = this.get("inventory").getResponses();
      responses.save();
      this.transitionTo("index");
    }
  });



  App.IndexController = Ember.ObjectController.extend({
    username: 'foobar',
    submissions: submissions,

    currentAffects: function() {
      var latest = this.get("submissions.latest");
      return latest ? scorePanas(latest) : null;
    }.property("submissions.latest")
    
  });



  var addScores = function(names, object) {
    var nrs = 0;
    return names.map(function(x){
      if(x == null) {
        nrs += 1;
      }
      return object[x] || 0
    }).map(function(x){
      return x != null ? parseInt(x) : 0
    }).reduce(function(a, b){
      return a + b
    }) / (names.length - nrs) * names.length;
  }
  
  var scorePanas = function(submission) {
    var resp = submission.get("responses");
    var positive = addScores([
      "Interested",
      "Alert",
      "Attentive",
      "Excited",
      "Enthusiastic",
      "Inspired",
      "Proud",
      "Determined",
      "Strong",
      "Active"
    ], resp);

    var negative = addScores([
      "Distressed",
      "Upset",
      "Guilty",
      "Ashamed",
      "Hostile",
      "Irritable",
      "Nervous",
      "Jittery",
      "Scared",
      "Afraid",
    ], resp);

    return {positive: positive, negative: negative};
  };
})();



