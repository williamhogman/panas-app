angular.module('components', []).
  directive('likert-selection', function() {
    return {
      transclude: false,
      controller: function($scope, $element) {
        var options = $scope.options = [];
        var selected = null;

        $scope.select = function(selected) {
        };
      },
      template:
      "<div class='btn-toolbar>'" +
        "<div class='btn-group' data-toggle='buttons-radio'>" +
        "<button ng-repeat='option in options' class='btn' ng-click='select(option)'>" +
        + "{{option.name}}" +
        "</button>" +
        "</div>" +
        "<div class='btn-group'><button ng-click='select(null)' class='btn btn-danger'>Blank</button></div>"
    };
  });
