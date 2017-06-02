var app = angular.module("cricketScores", []);

app.filter('isEmpty', [function() {
	return function(object) {
		return angular.equals({}, object);
	}
}])

app.controller ("cricketCtrl", function ($scope, $interval, $http, $sce) {
	// Api
	function yql(url) {
		return "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'" + url + "'&format=json"
	}
	var apiSummaryUrl = yql("http://www.espncricinfo.com/netstorage/summary.json");
	function apiMatchUrl(matchURL) {
		modMatchURL = matchURL.replace('.html', '');
		return yql("http://www.espncricinfo.com" + modMatchURL + ".json");
	}

	// $scope.currentMatchID = null;
	// $scope.matchData = {};
	$scope.matchData = {};
	$scope.teamData = {};
	$scope.summaryData = {};

	$scope.getMatchData = function(matchURL) {
		$http.jsonp($sce.trustAsResourceUrl(matchURL))
			.then(function(response) {
				rawResponse = response.data.query.results.body;
				if (rawResponse instanceof Object) { // if game is live, it has a .content in body (because of commentary?)
					$scope.matchData = JSON.parse(rawResponse.content);
				}
				else {
					$scope.matchData = JSON.parse(rawResponse);
				}
				$scope.getTeamData();
			}, function error(response) {
				console.log(response);
		});
	}

	$scope.getSummaryData = function() {
		$http.get(apiSummaryUrl)
			.then(function(response) {
				$scope.summaryData = JSON.parse(response.data.query.results.body);
			}, function error(response) {
				console.log(response);
		});
	}

	$scope.getTeamData = function() {
		$scope.teamData = [
			{
				id: $scope.matchData.team[0].team_id,
				name: $scope.matchData.team[0].team_general_name
			},
			{
				id: $scope.matchData.team[1].team_id,
				name: $scope.matchData.team[1].team_general_name
			}
		];
	}

	$scope.getTeamName = function(teamID) {
		return $scope.teamData.find(x => x.id === teamID).name;
	}

	$scope.changeCurrentMatch = function(match) {
		matchURL = apiMatchUrl(match.url);
		$scope.getMatchData(matchURL);
	}

	// Call once, and then call every 60 seconds
	$scope.getSummaryData();
	// $interval(getAPISummary, 60000);
});
