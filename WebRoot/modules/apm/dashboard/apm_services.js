appedoApp.factory('apmModulesFactory', ['$appedoUtils', function($appedoUtils){
	
	return {
		// 
		changeFormatToArrayInJSON: function(aryChartData) {
	    	var aryNewChartData = [], joDatum = {};
	    	
	    	for(var i = 0; i < aryChartData.length; i = i + 1) {
	    		var aryDatum = aryChartData[i];
	    		joDatum = {};
	    		 
	    		 
	    		joDatum.T = aryDatum[0];
	    		joDatum.V = aryDatum[1];
	    		
	    		aryNewChartData.push(joDatum);
	    	}
	    	
	    	return aryNewChartData;
	    },
	    getCounterSetsLength: function(aryData) {
	    	// each sets length
	    	var nCounterSetsLength = 0;
	    	
			for (var i = 0; i < aryData.length; i = i + 1) {
				nCounterSetsLength = nCounterSetsLength + aryData[i].length;
			}
			
			return nCounterSetsLength;
	    },
	    appendZeroAtFirst: function(aryChartData) {
	    	// for chart format in sets [[{'T': ..., 'V': ..}, {'T': ..., 'V': ..}], []], say apm chart format,  
	    	// append Zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
	    	var joDatum = aryChartData[0][0], now = new Date();
	    	var nDiffMinutes = $appedoUtils.timeDiffInMinutes(joDatum.T, now.getTime());
	    	
	    	//var joDiff = $appedoUtils.timeDiffToHoursMinSec(joDatum.T, now.getTime());
	    	//var joDiff = $appedoUtils.timeDiffToHoursMinSec(new Date(joDatum.T).getTime(), now.getTime());
			//var joDiff = $appedoUtils.timeDiffToHoursMinSec(new Date(joDatum.T).getTime(), $appedoUtils.getLocalTimeInMills(now));
			
			if ( nDiffMinutes < 60 ) {
				aryChartData.splice(0, 0, [{'T': new Date().setHours(now.getHours() - 1), 'V': 0}]);
	    	}
			
			return aryChartData;
	    },
	    sliceCounterSets: function(aryChartData, nRespCounterSetsLength) {
	    	var aryCounterSet = [];


	    	// 
	    	for(var i = 0; i < aryChartData.length; i = i + 1) {
	    		aryCounterSet = aryChartData[i];


	    		// 
	    		if ( aryCounterSet.length === nRespCounterSetsLength ) {
	    			// tried, to slice entire set
	    			aryChartData = aryChartData.slice(i + 1);
	    			break;
	    		} else if ( aryCounterSet.length > nRespCounterSetsLength ) {
	    			// tried, to slice data from current set
	    			//aryCounterSet = aryCounterSet.slice(nRespCounterSetsLength);
	    			aryChartData[i] = aryChartData[i].slice(nRespCounterSetsLength);
	    			break;
	    		} else if ( aryCounterSet.length < nRespCounterSetsLength ) {
	    			// tried, to slice the set and to reduce `nRespCounterSetsLength` its length
	    			aryChartData = aryChartData.slice(i + 1);
	    			nRespCounterSetsLength = nRespCounterSetsLength - aryCounterSet.length;

	    			// thinks since array sliced, array size would be reduced, while next iteration index is reduced
	    			i = i - 1;
	    		}
	    	}

	    	return aryChartData;
	    },
	    pushCounterSets: function(aryChartData, aryRespCounterChartData) {
			// push 
			var aryCounterSet = [], j = 0;
			// to push into last counter set, if diff between prev set's last datum time & current set first datum time is less than 1 min, `1` refers to 1 minute,
			if ( aryChartData.length > 0 ) {
				var aryLastCounterSet = aryChartData[aryChartData.length - 1];
				var nLastTime = aryLastCounterSet[aryLastCounterSet.length - 1].T, nCurrentFirstRespTime = aryRespCounterChartData[0][0].T;
				//var nDiffInMin = Math.round( (nCurrentFirstRespTime - nPrevTime) / (1000 * 60) );
		    	var nDiffMinutes = $appedoUtils.timeDiffInMinutes(nLastTime, nCurrentFirstRespTime);

				//var joDiff = $appedoUtils.timeDiffToHoursMinSec(nLastTime, nCurrentFirstRespTime);

				if ( nDiffMinutes < 1 ) {
					//
					j = 1;
					aryCounterSet = aryRespCounterChartData[0];
					aryChartData[aryChartData.length - 1] = aryLastCounterSet.concat(aryCounterSet);
				}
			}
			for (; j < aryRespCounterChartData.length; j = j + 1) {
				aryCounterSet = aryRespCounterChartData[j];
				aryChartData.push(aryCounterSet);
			}
			
			return aryChartData;
	    }
	};
}]);

appedoApp.service('apmModulesService', ['$http', '$q', function($http, $q) {
	
	this.getUserAddedCounterModules = function(moduleCode) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apm/getAPMDropDown',
			params: {
				moduleCode: moduleCode
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	

	this.getPrimaryCountersChartdata = function(guid) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apmCounters/getPrimaryCountersChartdata',
			params: {
				guid: guid
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getPrimaryCountersForAllDetailsPage = function(guid) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apmCounters/getPrimaryCountersForAllDetailsPage',
			params: {
				guid: guid
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getSelectedCounterSummary = function(guid) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apmCounters/getSelectedCounterSummary',
			params: {
				guid: guid
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getSecondaryCountersData = function(moduleCode,guid) {
		var deferredObject = $q.defer();
		console.log(moduleCode);
		console.log(guid);
		$http({
			method: 'POST',
			url: './apm/getSecondaryCounter',
			params: {
				guid: guid,
				moduleCode:moduleCode
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getSecondaryCountersValues = function(moduleCode,guid,counterIds) {
		var deferredObject = $q.defer();
		console.log(moduleCode);
		console.log(guid);
		$http({
			method: 'POST',
			url: './apm/getSecondaryCounterValues',
			params: {
				guid: guid,
				moduleCode:moduleCode,
				counterIds:counterIds
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getModuleCountersChartdata = function(guid, counter_id, maxTimeStamp, sliderValue) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apmCounters/getModuleCountersChartdata',
			params: {
				guid: guid,
				counterNames: counter_id,
				maxTimeStamp: maxTimeStamp,
				fromStartInterval: sliderValue
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getDonutChartdata = function(moduleCode) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apm/getAPMSummary',
			params: {
				moduleCode: moduleCode
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
		 
	this.getAPMLicense = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apm/getAPMLicense'
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
			 
	this.getSlowQueryData = function(guid,sliderValue, cardContentType) {
		var deferredObject = $q.defer();
		if(cardContentType=='Postgres') {
			$http({
				method: 'POST',
				url: './apm/getPostgresSlowQuery',
				params: {
					guid: guid,
					fromStartInterval: sliderValue
				}
			}).success(deferredObject.resolve)
		 	.error(deferredObject.resolve);
	
			return deferredObject.promise;
		} else {
			$http({
			method: 'POST',
			url: './apm/getSlowQuery',
			params: {
				guid: guid,
				fromStartInterval: sliderValue
			}
			}).success(deferredObject.resolve)
		 	.error(deferredObject.resolve);
		
			return deferredObject.promise;
			}
	};
	
/*	
	this.getModuleCountersData = function(guid, counter_id, maxTimeStamp) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apmCounters/getModuleCountersChartdata',
			params: {
				guid: guid,
				counter_id: counter_id,
				maxTimeStamp: maxTimeStamp
			}
		  }).success(deferredObject.resolve)
		   .error(deferredObject.resolve);

		return deferredObject.promise;
	};
*/
	
	this.getProfilerTransactions = function (guid, counterTypeName, fromStartInterval, callback) {
		$http({
			method: 'POST',
			url: './apmCounters/getProfilerTransactions',
			params: {
				guid: guid,
				counterTypeName: counterTypeName,
				fromStartInterval: fromStartInterval
			}				
		}).success(function(responseData) {
			if(callback){
				callback(responseData);
			}
		});	
	};
	
	this.getProfilerTransactionTimeTaken = function (guid, counterTypeName, localhost_name_ip, transactionName, fromStartInterval, callback) {
		$http({
			method: 'POST',
			url: './apmCounters/getProfilerTransactionTimeTaken',
			params: {
				guid: guid,
				counterTypeName: counterTypeName,
				localhost_name_ip: localhost_name_ip,
				transactionName: transactionName,
				fromStartInterval: fromStartInterval
			}				
		}).success(function(responseData) {
			if(callback){
				callback(responseData);
			}
		});	
	};
	

	this.getProfilerMethodTrace = function (guid, counterTypeName, localhost_name_ip, transactionName, time, duration, callback) {
		$http({
			method: 'POST',
			url: './apmCounters/getProfilerMethods',
			params: {
				guid: guid,
				counterTypeName: counterTypeName,
				localhost_name_ip: localhost_name_ip,
				transactionName: transactionName,
				time: time,
				duration: duration
			}				
		}).success(function(responseData) {
			if(callback){
				callback(responseData);
			}
		});	
	};
	
	this.addChartToDashboard = function(guid,counterid) {
		
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apmCounters/updateChartStausForDashboard',
			params: {
				guid: guid,
				counterid : counterid,
				status : true
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.removeChartToDashboard = function(guid,counterid) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apmCounters/updateChartStausForDashboard',
			params: {
				guid: guid,
				counterid : counterid,
				status : false
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
}]);

appedoApp.service('apmCardService', ['$http','$q', function($http, $q) { 
	this.populateApmCardData = function($scope, moduleType, callback) {	
		$scope.appcardscontent={};
		$http({
			method: 'POST',
			url: 'apm/getModules',	
			params: {	
				moduleType: moduleType,
				pageLimit: 10,
				pageOffset: 0,
			}				
		}).success(function(apmCardData) {
			if(callback instanceof Function){
				callback(apmCardData);
			};
		});	
	};

	this.updateApmModule = function ($scope, moduleCardContent, moduleType, callback) {
		$http({
			method: 'POST',
			url: 'apm/updateModule',	
			params: {	
				uid: moduleCardContent.uid,
				moduleName: moduleCardContent.moduleName,
				moduleDesription: moduleCardContent.description,
				moduleType: moduleType
			}				
		}).success(function(responseData) {
			if(callback) {
				callback(responseData);
			}
		});	
	};

	this.deleteModuleRow = function ($scope, moduleCardContent, moduleType, callback) {
		$http({
			method: 'POST',
			url: 'apm/deleteModule',	
			params: {	
				moduleId: moduleCardContent.uid,
				moduleType: moduleType
			}				
		}).success(function(responseData) {
			if(callback){
				callback(responseData);
			}
			console.log(responseData);
		});	
	};

	this.getConfiguredCategories = function($scope, appcardcontent, callback) {
		$http({
			method: 'POST',
			url: 'apm/getCategories',
			params: {	
				uid: appcardcontent.uid
			}			
		}).success(function(responseData) {
			$scope.configuredCategories = responseData;
			
			$scope.$watch('configCounter.Categories', function() {
		        $scope.counters = {};
		        if ($scope.configCounter.Categories != undefined) {
		            if ($scope.configCounter.Categories.category != undefined) {
		                $scope.counters = $scope.configCounter.Categories.counters;
		            }
		        }
		    });
		});	
	};

	this.saveConfiguredCategories = function($scope, appcardcontent, moduleType, selectedCounterIds, callback) {
		$http({
			method: 'POST',
			url: 'apm/updateCounters',
			params: {	
				uid: appcardcontent.uid,
				guid: appcardcontent.guid,
				moduleCounters: selectedCounterIds.join()
			}			
		}).success(function(responseData) {
			console.log(responseData);
			if(callback){
				callback(responseData);
			}
		});	
	};
	
	this.getModuleCounterDataAndAgentStatusService = function(jsonObj) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './apm/getModuleCounterData',
			headers: {'Content-Type': 'application/json'},
			params: {moduleCounter: JSON.stringify(jsonObj)}
		  }).success(deferredObject.resolve)
		   .error(deferredObject.resolve);

		return deferredObject.promise;
	};
	
	
	// gets Deep dive (Profiler) license
	this.getDDUserLicenseDetails = function(successCallBack) {
		$http({
		 	method: 'POST',
		 	url: './apm/getDDUserLicenseDetails'
	 	}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
}]);