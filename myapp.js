var app = angular.module("cricketScores", []);
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
	$scope.summaryData = {};

	$scope.getMatchData = function(matchURL) {
		$http.jsonp($sce.trustAsResourceUrl(matchURL))
			.then(function(response) {
				rawResponse = response.data.query.results.body;
				if (rawResponse instanceof Object) { // if game is live, it has a .content in body (because of commentary?)
					console.log("Object");
					$scope.matchData = JSON.parse(rawResponse.content);
				}
				else {
					$scope.matchData = JSON.parse(rawResponse);
				}
				console.log($scope.matchData);
				// $scope.matchData = data;
				// $scope.currentMatchID = ;
				// $scope.matchData[$scope.currentMatchID] = data;
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

	// function getAPISummary() {
	// 	console.log(apiSummaryUrl);
	// 	// This uses ajax to solve CORS problems
	// 	$.ajax({
	// 	    url: apiSummaryUrl,
	// 	    type: 'GET',
	// 	    crossOrigin: true,
	// 	    dataType: 'jsonp',
	// 	    success: function (data) {
	// 	    	$scope.summaryData = JSON.parse(data);
	// 	    	$scope.$apply();
	// 	    }
	// 	});
	// }

	$scope.changeCurrentMatch = function(match) {
		matchURL = apiMatchUrl(match.url);
		$scope.getMatchData(matchURL);

		//$scope.currentMatch
	}

	// Call once, and then call every 60 seconds
	$scope.getSummaryData();
	// $interval(getAPISummary, 60000);
});
