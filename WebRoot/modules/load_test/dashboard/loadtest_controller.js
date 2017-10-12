appedoApp.controller('loadtest-controller', ['$scope', function ($scope) {
    $scope.appcardscontent = [
        {
            "appName": "bharatmatrimony",
            "Active_session_count": "60",
            "Request_count": "Running",
            "Request_location":"Chennai, Hyderabad, Bagalore",
            "active_monitor":true,
            "active_profiler":false
        },
        {
            "appName": "CaterPillerIndia",
           "Active_session_count": "60",
            "Request_count": "Running",
            "Request_location":"Germany - Frankfurt Am Main",
           "active_monitor":true,
            "active_profiler":true
        },
          {
             "appName": "CBazzar",
            "Active_session_count": "60",
            "Request_count": "Completed",
            "Request_location":"United States - Portland",
        },
           {
             "appName": "Ibuyfresh",
            "Active_session_count": "60",
            "Request_count": "Running",
            "Request_location":"Japan - Tokyo",
        }
    ];




    function getSummaryData() {};

    function getChartsData() {

    };
}]);

appedoApp.controller('DatepickerCtrl', function ($scope) {
  $scope.today = function() {
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    currentDate = new Date() ;
    $scope.dt = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear() ;
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

//  // Disable weekend selection
//  $scope.disabled = function(date, mode) {
//    return ( mode === 'day' && ( date.getDay() === 1 || date.getDay() === 6 ) );
//  };

  $scope.resetMaxMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
    $scope.maxDate = null;  
      
  };
  $scope.resetMaxMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    showWeeks: 'false',
    startingDay: 0,
    formatDay:'d'
  };

  $scope.format = 'd-MMM-yyyy' ;
});

appedoApp.controller('PaginationCtrl', function ($scope, $log) {
	$scope.totalItems = 64;
	$scope.currentPage = 5;
});

appedoApp.controller('metaphorCtrl', function ($scope) {
	$scope.stepperVal = 1;
	$scope.stepperInr = function(){
		$scope.stepperVal++;
	};
	$scope.stepperDec = function(){
		$scope.stepperVal--;
	};
});

appedoApp.controller ( 'sliderCtrl', function ($scope) {
	$scope.value = "1";
	$scope.options = {
			from:0.2,
			to: 100.2,
			step: 20,
			scale: ["last 24 hrs", "Last 7 days", "Last 15 days", "Last 30 days", "Last 60 days", "Last 120 days"],
			css: {
				after: {"background-color": "#42A6DB"},
				pointer: {"background-color": "#42A6DB"}
			}
	};
});

appedoApp.controller('progressbarCtrl', function ($scope, $log) {
	$scope.dynamic = 20;
	$scope.dc2 = 80;
});
