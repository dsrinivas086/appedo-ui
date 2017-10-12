appedoApp.service('serviceMapService', ['$http', '$q', function($http, $q) {
	this.getServiceMapData = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './service/getServiceMapData',
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getServicesData = function($scope, serviceAddData, callback) {
	    $http({
	        method: 'POST',
	        //url: 'common/data/service_map.json'
	        url: './service/getModulesTypesDetails',
	        params: { 
	        	serviceMapId: serviceAddData.service_map_id || null
	        }
	    }).success(function(data) {
	        $scope.servicesMap = data.message;
	        $scope.$watch('serviceMapData.services', function() {
	            if ($scope.serviceMapData.services != undefined) {
	                if ($scope.serviceMapData.services.serviceType != undefined) {
	                    $scope.applicationData = $scope.serviceMapData.services.modules;
	                }
	            }
	        });
	    });
	};
	this.saveOrUpdateServiceMap = function($scope, params, url, callback) {
	    $http({
	        method: 'POST',
	        url: url,
	        params: params
	    }).success(function(data) {
	        if(callback) {
	        	callback(data);
	        }
	    });
	};
	
	this.getServiceMapCardData = function($scope, callback) {
		$http({
	        method: 'POST',
	        url: './service/getUserServiceMaps'
	    }).success(function(data) {
	    	if(callback){
	    		callback(data.message);
	    	}
	    });
	};
	
	this.deleteServiceMapRecord = function($scope, serviceMapId, callback) {
	    $http({
	        method: 'POST',
	        url: './service/deleteServiceMap',
	        params: {
	            serviceMapId: serviceMapId
	        }
	    }).success(function(responseData) {
	        if (callback) {
	            callback(responseData);
	        }
	    });
	};
	
	this.validateServiceMapName = function($scope, serviceMapName, serviceMapId, callback) {
		$http({
	        method: 'POST',
	        url: './service/checkServiceNameExists',
	        params: {
	        	serviceName: serviceMapName,
	        	serviceMapId:serviceMapId
	        }
	    }).success(function(data) {
	        if(callback) {
	        	callback(data);
	        }
	    });
	};
}]);
