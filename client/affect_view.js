(function(){

  App.AffectBallView = Ember.View.extend({
    templateName: 'affect-ball',
    affectBinding: null,

    size: function(){
      var pos = this.get("affect.positive");
      var neg = this.get("affect.negative");
      return (pos + neg) * 0.75;
    }.property("affect"),

    calculateHue: function() {
      var pos = this.get("affect.positive");
      var neg = this.get("affect.negative");
      // because pos & neg is between 0 and 100
      var yellow = 60;
      var fact = yellow / 100;

      return yellow + (pos * fact) - (neg * fact);
    },

    color: function(){
      var hue = this.calculateHue();

      return "hsl("+hue + ",80%" + ",50%)";
    }.property("affect"),

    didInsertElement: function() {
      console.log("whut!");
    }
  })
})();
