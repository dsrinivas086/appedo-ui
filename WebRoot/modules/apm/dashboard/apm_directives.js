
appedoApp.directive('apmDashSmrDetails', function() {
    return {
        restrict: "E",
		templateUrl: "modules/apm/dashboard/summary.html",
        controller: "summaryController"
        
    };
});	

/*  APM - Application Start   */
appedoApp.directive('apmDashApplication', function() {
    return {
        restrict: "AE",
		templateUrl: "modules/apm/dashboard/apmApplication.html"
    };
});		

appedoApp.directive('apmDashAppPri', function() {
    return {
        restrict: "E",
		templateUrl: "modules/apm/dashboard/apmApplicationPrimary.html",
        controller: "apmApplicationPrimaryController"
    };
});

appedoApp.directive('apmDashAppSec', function() {
    return {
        restrict: "E",
		templateUrl: "modules/apm/dashboard/apmApplicationSecondary.html"
    };
});

appedoApp.directive('apmDashAppSecSmr', function() {
    return {
        restrict: "AE",
		controller: "apmApplicationSecondarySummaryController",
		templateUrl: "modules/apm/dashboard/apmApplicationSecondarySummary.html"
    };
});		
/*  APM - Application End   */

/*  APM - Server Start   */
appedoApp.directive('apmDashServer', function() {
    return {
        restrict: "AE",
		templateUrl: "modules/apm/dashboard/apmServer.html"
    };
});		

appedoApp.directive('apmDashServerPri', function() {
    return {
        restrict: "E",
		templateUrl: "modules/apm/dashboard/apmServerPrimary.html",
        controller: "apmServerPrimaryController"
    };
});

appedoApp.directive('apmDashServerSec', function() {
    return {
        restrict: "E",
		templateUrl: "modules/apm/dashboard/apmServerSecondary.html"
    };
});

appedoApp.directive('apmDashServerSecSmr', function() {
    return {
        restrict: "AE",
		controller: "apmServerSecondarySummaryController",
		templateUrl: "modules/apm/dashboard/apmServerSecondarySummary.html"
    };
});		

/*  APM - Server End   */

/*  APM - DBs Start   */

appedoApp.directive('apmDashDbs', function() {
    return {
        restrict: "AE",
		templateUrl: "modules/apm/dashboard/apmDBs.html"
    };
});		

appedoApp.directive('apmDashDbsPri', function() {
    return {
        restrict: "E",
		templateUrl: "modules/apm/dashboard/apmDBsPrimary.html",
        controller: "apmDBsPrimaryController"
    };
});

appedoApp.directive('apmDashDbsSec', function() {
    return {
        restrict: "E",
		templateUrl: "modules/apm/dashboard/apmDBsSecondary.html"
    };
});

appedoApp.directive('apmDashDbsSecSmr', function() {
    return {
        restrict: "AE",
		controller: "apmDBsSecondarySummaryController",
		templateUrl: "modules/apm/dashboard/apmDBsSecondarySummary.html"
    };
});		

/*  APM - DBs End   */


	
