appedoApp.service('rumService', ['$http', '$q',
    function($http, $q) { 		

	this.getModuleTypes = function($scope, moduleCardContent) {
		    $scope.moduleTypes = {};
	        this.getModuleTypes = function() {
	            return $scope.moduleTypes;
	        };

		    $http({
		        method: 'POST',
		        url: 'apm/getModuleVersions',
		        params:{
		        	moduleName: "RUM",
		        }
		    }).success(function(moduleSelectData) {
		        $scope.moduleTypes = moduleSelectData;
		    });
	};
	
	this.saveRUM = function($scope, moduleCardContent, moduleTypes, callback) {
	    $http({
	        method: 'POST',
	        url: 'apm/addModule',
	        params: {
	        	moduleName: $scope.moduledata.moduleName,
	        	moduleDescription: $scope.moduledata.moduleDescription,
	        	moduleType: "RUM",
	        	moduleVersion: moduleTypes[0].versions[0].ctv_id
	        }
	    }).success(function(resultData) {
	    	if(callback) {
	    		callback(resultData);
	    	}
	    });
	};
	
	this.getDonutChartdata = function(moduleCode,uid,fromStartInterval) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'rum/getRUMDashDonut',
			params: {
				moduleCode: moduleCode,
				uid: uid,
				fromStartInterval:fromStartInterval
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	// details page visitors count graph
	this.getVisitorsCount = function(uid,fromStartInterval) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'rum/getDailyVisitorsCount',
			params: {
				uid: uid,
				fromStartInterval:fromStartInterval
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};

	// dashboard visitors count graph
	this.getRUMDashArea = function(uid,fromStartInterval) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'rum/getRUMDashArea',
			params: {
				uid: uid,
				fromStartInterval:fromStartInterval
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};

	this.getPagesLoadTime = function(uid, fromStartInterval, successCallBack) {
		//var deferredObject = $q.defer();
		$http({
			method: 'POST',
			//url: 'common/data/rumPagesLoadTime.json',
			url: './rum/getPagesLoadTime',
			params: {
				uid: uid,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getSelectedPageLoadTime = function(uid, url, fromStartInterval, successCallBack) {
		$http({
			method: 'POST',
			//url: 'common/data/rumPageLoadTime.json',
			url: './rum/getPageLoadTimeChartData',
			params: {
				uid: uid,
				url: url,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	// gets RUM
	this.getRUMLastReceivedOn = function(uid, successCallBack) {
		$http({
			method: 'POST',
			//url: 'common/data/rumPageLoadTime.json',
			url: './rum/getRUMLastReceivedOn',
			params: {
				uid: uid
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	
	// CI event
	this.getEventsSummary = function(uid, fromStartInterval, agentType, environmnet, successCallBack) {
		
		$http({
			method: 'POST',
			url: './ci/getEventsSummary',
			params: {
				uid: uid,
				fromStartInterval: fromStartInterval,
				agentType: agentType,
				environmnet: environmnet
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getsEventLoadTime = function(uid, eventId, fromStartInterval, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getEventLoadTime',
			params : {
				uid: uid,
				eventId: eventId,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getCIDailyVisitorsCount = function(uid, eventId, fromStartInterval, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getDailyVisitorsCount',
			params : {
				uid: uid,
				eventId: eventId,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};

	this.getBrowserWiseDonutData = function(uid, eventId, fromStartInterval, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getBrowserWiseDonutData',
			params : {
				uid: uid,
				eventId: eventId,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};

	this.getDeviceTypeWiseDonutData = function(uid, eventId, fromStartInterval, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getDeviceTypeWiseDonutData',
			params : {
				uid: uid,
				eventId: eventId,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getOSWiseDonutData = function(uid, eventId, fromStartInterval, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getOSWiseDonutData',
			params : {
				uid: uid,
				eventId: eventId,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getDeviceNameWiseDonutData = function(uid, eventId, fromStartInterval, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getDeviceNameWiseDonutData',
			params : {
				uid: uid,
				eventId: eventId,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	// gets particular module agent types 
	this.getModuleAgentTypes = function(uid, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getModuleAgentTypes',
			params : {
				uid: uid
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	

	// gets particular module's environments
	this.getModuleEnvironments = function(uid, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getModuleEnvironments',
			params : {
				uid: uid
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	
	// gets event last receivedon
	this.getEventLastReceivedOn = function(uid, eventId, successCallBack) {

		$http({
			method : 'POST',
			url : './ci/getEventLastReceivedOn',
			params : {
				uid: uid,
				eventId: eventId
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	

	// gets event last receivedon
	this.getPageBreakDownDetails = function(uid, rumId, fromStartInterval, successCallBack) {

		$http({
			method : 'POST',
			url : './rum/getPageBreakDownDetails',
			params : {
				uid: uid,
				rumId: rumId,
				fromStartInterval: fromStartInterval
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	
}]);

appedoApp.factory('rumModuleFactory', function() {
	return {
		rumSliderOptions: {
			from: 1,
			to: 5,
			step: 1,
			//dimension: (function(){return ' '+this.sliderValueMapping[sliderValue]})(),
			dimension: '',
			scale: ['Last 24 hrs', 'Last 7 days', 'Last 15 days', 'Last 30 days', 'Last 60 days'],
			smooth: false,
			qry_intervals: ['24 hours', '7 days', '15 days', '30 days', '60 days']
		},
		rumSliderOptions_velocityui: {
			from: 1,
			to: 5,
			step: 1,
			scale: ["Last 24 hrs", "Last 7 days", "Last 15 days", "Last 30 days", "Last 60 days"],
			//serverSideScale: ["1 hour", "1 day", "7 days", "30 days", "60 days", "120 days"],
			css: {
				after: {"background-color": "#42A6DB"},
				pointer: {"background-color": "#42A6DB"}
			},
			qry_intervals: ['24 hours', '7 days', '15 days', '30 days', '60 days']
		}
	};
});