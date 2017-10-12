var appedoApp = angular.module('appedoApp', ['ui.router','ui.bootstrap','d3','ngSlider','ngToast', 'ui.tree']);

appedoApp.config(['$stateProvider', '$urlRouterProvider', 
	function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state( '/dashboard', {
                url: "/dashboard",
                templateUrl: 'modules/dashboard/dashboard.html',
                controller: 'dashBoard-controller'
            })
            .state( '/login', {
                url: '/login',
                templateUrl: 'modules/login/login.html',
                controller: 'login_controller'
            })
            .state( '/signup', {
                url: '/signup',
                templateUrl: 'modules/login/signup.html',
                controller: 'signup_controller'
            })
            .state( '/apm_home/application', {
                url: '/apm_home/application',
                templateUrl: 'modules/apm/apm_home.html'
            })
            .state( '/apm_home/servers', {
                url: '/apm_home/servers',
                templateUrl: 'modules/apm/apm_home.html'
            })
            .state( '/apm_home/db', {
                url: '/apm_home/db',
                templateUrl: 'modules/apm/apm_home.html'
            })
            .state( '/apm_details', {
                url: '/apm_details',
                templateUrl: 'modules/apm/apm_details.html'
            })
            .state( '/apm_all_details', {
                url: '/apm_all_details',
                templateUrl: 'modules/apm/apm_all_details.html'
            })
            .state( '/load_test', {
                url: '/load_test',
                templateUrl: 'modules/load_test/load_test_home.html'
            })
	        .state( '/ltRunningScenarioStauts/:loadTestType/:scenarioName', {
	            url: '/ltRunningScenarioStauts/:loadTestType/:scenarioName',
	            templateUrl: 'modules/load_test/loadTestRunnningScenario.html'
	        })
	        .state( '/ltScenarioReports/:loadTestType/:scenarioName', {
	            url: '/ltScenarioReports/:loadTestType/:scenarioName',
	            templateUrl: 'modules/load_test/loadTestScenarioReports.html'
	        })
            .state( '/sum_metrics', {
                url: '/sum_metrics',
                //templateUrl: 'modules/apm/apm_home.html'
                templateUrl: 'modules/sum/sumHome.html',
	            controller: 'sumHomeController'
            })
            .state( '/rum_metrics', {
                url: '/rum_metrics',
                templateUrl: 'modules/rum/rum_home.html'
            })
            .state( '/rum_details/:type/:moduleName', {
                url: '/rum_details/:type/:moduleName',
                templateUrl: 'modules/rum/rum_details.html'
            })
            .state( '/sla_home/actions', {
                url: '/sla_home/actions',
                templateUrl: 'modules/sla/manage_actions.html'
            })
            .state( '/sla_home/rule', {
                url: '/sla_home/rules',
                templateUrl: 'modules/sla/manage_rules.html'

            })
            .state( '/sla_home/slapolicy', {
                url: '/sla_home/slapolicy',
                templateUrl: 'modules/sla/sla_policy.html'
            })
            .state( '/sla_home/slave_status', {
                url: '/sla_home/slave_status',
                templateUrl: 'modules/sla/sla_slave_status.html'
            })
            .state( '/sla_home/alert_log', {
                url: '/sla_home/alert_log',
                templateUrl: 'modules/sla/sla_alert_log.html'
            })
            .state( '/sla_home/heal_log', {
                url: '/sla_home/heal_log',
                templateUrl: 'modules/sla/sla_heal_log.html'
            })

	        .state( '/loginResponse', {
	            url: '/loginResponse',
	            controller: 'login_response_controller'
	        })
	        .state( '/forgotPassword', {
	            url: '/forgotPassword',
                templateUrl: 'modules/login/forgot_password.html',
	        })
	        .state( '/resetPassword', {
	            url: '/resetPassword',
	            controller: 'resetPassword_controller',
                templateUrl: 'modules/login/reset_password.html'
	        })
	        .state( '/changePassword', {
	            url: '/changePassword',
	            controller: 'changePasswordController',
                templateUrl: 'common/views/changePassword.html'
	        })
	        .state( '/changePasswordResponse', {
	            url: '/changePasswordResponse',
	            controller: 'changePasswordResponseController'
	        })
	        .state( '/profileSettings', {
	            url: '/profileSettings',
	            controller: 'userProfileController',
                templateUrl: 'common/views/userProfileSettings.html'
	        })
	        .state( '/profileSettingsResponse', {
	            url: '/profileSettingsResponse',
	            controller: 'userProfileResponseController'
	        })
	        .state( '/sumHome', {
	            url: '/sumHome',
	            templateUrl: 'modules/sum/sumHome.html',
	            controller: 'sumHomeController'
	        })
	        .state( '/testCardLayout', {
                url: "/testCardLayout",
                templateUrl: 'common/views/testCardLayout.html'
            })
	        .state( '/sum_details', {
                url: '/sum_details',
                templateUrl: 'modules/sum/sum_details.html'
            })
	        .state( '/ltScenarioStauts', {
	            url: '/ltScenarioStauts',
	            templateUrl: 'modules/load_test/loadTestRunnningScenario.html'
	        })
	        .state( '/ltScenarioReports', {
	            url: '/ltScenarioReports',
	            templateUrl: 'modules/load_test/loadTestScenarioReports.html'
	        }).state( '/admin', {
                url: '/admin',
                templateUrl: 'modules/admin/view/admin_details.html',
                controller: 'adminController'
            });
	}
])
.run(['$state',
    function($state) {
        $state.transitionTo('/login');
    }
]);


appedoApp.filter("asDate", function() {
    return function (input) {
        return new Date(input);
    };
});

appedoApp.filter("millisecAsHoursMinSec", ['$appedoUtils', function($appedoUtils) {
    return function (input) {
        return $appedoUtils.convertMilliSecToHoursMinSec(input);
    };
}]);

appedoApp.filter('summaryReportIframeURL', function ($sce) {
	return function(runId) {
		return $sce.trustAsResourceUrl('./lt/summaryReport?runid=' + runId);
	};
});

appedoApp.filter('sumHarFileIframeURL', function ($sce) {
	return function(harFilePath) {
		return $sce.trustAsResourceUrl(harFilePath);
	};
});
