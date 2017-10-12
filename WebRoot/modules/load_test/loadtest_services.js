appedoApp.service('ltService', ['$http', '$q',
    function($http, $q) { 		

	this.getScenarioReportsForDropdown = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './lt/getScenarioReports',
			params: {
				dropdown : true
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getDonutChartdata = function(type,runid) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './lt/getLTDashDonut',
			params: {
				type: type,
				runid: runid
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getDashResponseArea = function(runid) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './lt/getDashResponseArea',
			params: {
				runid: runid
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};

	this.getDashVUsersArea = function(runid,scenarioName) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './lt/getDashVUsersArea',
			params: {
				runid: runid,
				scenarioName: scenarioName
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};

	this.getLTLicense = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './lt/getLTLicense'
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getRunningScenario = function(runId, loadTestType, successCallBack) {
		
		$http({
			method: 'POST',
			url: './lt/getScriptwiseData',
			//url: 'common/data/ltRunningScenarios.json',
			params: {
				runid: runId,
				testTypeScript: loadTestType
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getLtScripts = function($scope, isFrom, ltScenarioData) {
		$scope.mapScript = {};
		if(isFrom == "fromEdit") {
			$http({
		        method: 'POST',
		        url: './lt/editScenarios',
		        params: {
		        	testTypeScript: 'APPEDO_LT',
		        	scenarioId: ltScenarioData.scenario_id
		        }
		    }).success(function(data) {
		        $scope.availableScripts = data.message.script;
		        $scope.selectedScripts = $scope.availableScripts;
		        $scope.mapScript.scenarioName = data.message.scenario_name;
		        $scope.mapScript.scenarioId = data.message.scenario_id
		    });
		} else {
			$http({
		        method: 'POST',
		        url: './lt/getVUScripts',
		        params: {
		        	testTypeScript: 'APPEDO_LT'
		        }
		    }).success(function(data) {
		        $scope.availableScripts = data;
		        $scope.selectedScripts = $scope.availableScripts;
		    });
		}
	};
	
	this.deleteScenarioRecord = function ($scope, scenario_id, callback) {
		$http({
	        method: 'POST',
	        url: './lt/deleteScenarios',
	        params: {
	        	testTypeScript: 'APPEDO_LT',
				scenarioId: scenario_id
	        }
	    }).success(function(data) {
	        if(callback) {
	        	callback(data);
	        }
	    });
	};
	
	this.deleteJmeterScenarioRecord = function ($scope, scenarioId, scenarioName, testTypeScript, callback) {
		$http({
	        method: 'POST',
	        url: './ltScheduler/deleteJMeterScript',
	        params: {
	        	scenarioId: scenarioId,
	        	scenarioName: scenarioName,
	        	testTypeScript: testTypeScript
	        }
	    }).success(function(data) {
	        if(callback) {
	        	callback(data);
	        }
	    });
	};
	
	this.saveLtScripts = function ($scope, isFrom, selectedScriptsId, selectedScriptnames, callback) {
		  
		if(isFrom == "fromEdit") {
			$http({
			    method: 'POST',
			    url: './lt/updateScenarios',
			    params: {
			    	testTypeScript: 'APPEDO_LT',
			    	scenarioName: $scope.mapScript.scenarioName,
			    	//scriptIds: selectedScriptsId.length>0 ? selectedScriptsId.join(): 0,
			    	scriptIds: selectedScriptsId.length>0 ? selectedScriptsId.join(): null,
			    	scenarioId: $scope.mapScript.scenarioId,
			    	scriptNames: selectedScriptnames.length>0 ? selectedScriptnames.join(): ''
			    }
			}).success(function(data) {
				if(callback){
					callback(data);
				}
			});
		} else {
			$http({
			    method: 'POST',
			    url: './lt/mappingScripts',
			    params: {
			    	testTypeScript: 'APPEDO_LT',
			    	scenarioName: $scope.mapScript.scenarioName,
			    	//scriptIds: selectedScriptsId.length>0 ? selectedScriptsId.join(): 0,
			    	scriptIds: selectedScriptsId.length>0 ? selectedScriptsId.join(): null,
			    	scriptNames: selectedScriptnames.length>0 ? selectedScriptnames.join(): ''
			    }
			}).success(function(data) {
				if(callback){
					callback(data);
				}
			});
		}
	};
	
	this.getRunAgentMapping = function ($scope, selectedScenario, testTypeScript) {
	$scope.ltMonitorData = {};
		$http({
        method: 'POST',
        url:"./lt/getRunAgentMapping",
        params: {
        			testTypeScript: testTypeScript,
					apmGroup: 'APPLICATION,SERVER,DATABASE',
					scenarioId: selectedScenario.scenario_id
        		}
	    }).success(function(data) {
	        $scope.ltMonitors = data.message;
	        $scope.$watch('ltMonitorData.ltMonitor', function() {
	            $scope.userCities = {};
		        $scope.counters = {};
		        if ($scope.ltMonitorData.ltMonitor != undefined) {
		            if ($scope.ltMonitorData.ltMonitor.apm != undefined) {
		                $scope.agentsData = $scope.ltMonitorData.ltMonitor.agents;
		            }
		        }
	        });
	    });
	};
	
	this.getScenarioSettings = function ($scope, ltScenarioData, testTypeScript, callback) {
		$http({
        method: 'POST',
        url:"./lt/getScenarioSettings",
        params: {
        			testTypeScript: testTypeScript,
					scenarioId: ltScenarioData.scenario_id
        		}
	    }).success(function(data) {
	        if(callback) {
	        	callback(data);
	        }
	    });
	};
	
	this.updateScenarioSettings = function($scope, scriptIds, ltScenarioData, scriptNames, scriptConfigData, testTypeScript, callback) {
		console.log($scope.ltRunSettingForm);
		var dh = $scope.ltRunSettingForm.durationHrs > 0 ? $scope.ltRunSettingForm.durationHrs : 0;
		var dm = $scope.ltRunSettingForm.durationMins > 0 ? $scope.ltRunSettingForm.durationMins : 0;
		var ds = $scope.ltRunSettingForm.durationSecs > 0 ? $scope.ltRunSettingForm.durationSecs : 0;
		var ih = $scope.ltRunSettingForm.forEveryHrs > 0 ? $scope.ltRunSettingForm.forEveryHrs : 0;
		var im = $scope.ltRunSettingForm.forEveryMins > 0 ? $scope.ltRunSettingForm.forEveryMins : 0;
		var is = $scope.ltRunSettingForm.forEverySecs > 0 ? $scope.ltRunSettingForm.forEverySecs : 0;
		var scenario_settings = {};
    	scenario_settings.browsercache = $scope.ltRunSettingForm.clearBrowserCache;
    	scenario_settings.durationtime = dh +";"+ dm +";"+ ds;
    	scenario_settings.incrementtime = ih +";"+ im +";"+ is;
    	scenario_settings.incrementuser = $scope.ltRunSettingForm.increamnetUser;
    	scenario_settings.iterations = $scope.ltRunSettingForm.iterationCount > 0 ? $scope.ltRunSettingForm.iterationCount : 0;
    	scenario_settings.maxuser = $scope.ltRunSettingForm.maxUserCount;
    	scenario_settings.startuser = $scope.ltRunSettingForm.startUserCount;
    	scenario_settings.currentloadgenid = scriptConfigData.currentloadgenid;
    	scenario_settings.durationmode = scriptConfigData.durationmode;
    	scenario_settings.startuserid = scriptConfigData.startuserid;
    	scenario_settings.totalloadgen = scriptConfigData.totalloadgen;
    	if($scope.ltRunSettingForm.iterationDuration == "iteration") {
    		scenario_settings.type = "1";
    	} else {
    		scenario_settings.type = "2";
    	}
    	
		$http({
        method: 'POST',
        url:"./lt/updateScenarioSettings",
        params: {
        			testTypeScript: testTypeScript,
					scenarioId: ltScenarioData.scenario_id,
					scriptIds: scriptIds.join(),
					scenarioSettings: scenario_settings,
					scriptNames: scriptNames.join(),
					scenarioName: ltScenarioData.scenarioName
        		}
	    }).success(function(data) {
	        if(callback) {
	        	callback(data);
	        }
	    });
	};
	
	this.runScenario = function ($scope, params, callback) {
		$http({
        method: 'POST',
        url:"./ltScheduler/runScenario",
        params: params
	    }).success(function(data) {
	        if(callback) {
	        	callback(data);
	        }
	    });
	};
	
	this.agentLoadGenerator =function($scope, testTypeScript, callback) {
			$http({
			    method: 'POST',
			    url: './lt/readRegions',
			    params: {
			    	testTypeScript: testTypeScript
			    }
			}).success(function(data) {
				if(callback){
					callback(data);
				}
			});
	};

	this.getScenarios = function(successCallBack) {
		
		$http({
			method: 'POST',
			url: 'common/data/ltScenarios.json',
			params: {
				
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getScenarioReports = function(scenarioId, loadTestType, successCallBack) {

		$http({
			method: 'POST',
			url: './lt/getScenarioReports',
			//url: 'common/data/ltScenarioReports.json',
			params: {
				scenarioid: scenarioId,
				testTypeScript: loadTestType,
				dropdown: false
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	
	
	// gets summary report for selected scenario & report
	this.getSummaryReport = function(runId, loadTestType, successCallBack) {

		$http({
			method: 'POST',
			url: './lt/getScriptwiseData',
//			url: 'common/data/ltRunningScenarios.json',
			params: {
				runid: runId,
				testTypeScript: loadTestType
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getLogReport = function(runId, loadTestType, successCallBack) {

		$http({
			method: 'POST',
			url: './lt/logReport',
			params: {
				runid: runId,
				testTypeScript: loadTestType
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	
	this.getErrorReport = function(runId, loadTestType, successCallBack) {

		$http({
			method: 'POST',
			url: './lt/errorReport',
			params: {
				runid: runId,
				testTypeScript: loadTestType
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	

	this.getChartReport = function(runId, loadTestType, startTime, successCallBack) {

		$http({
			method: 'POST',
			url: './lt/chartReport',
			params: {
				runid: runId,
				testTypeScript: loadTestType,
				startTime : startTime
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getNewChartReport = function(runId, loadTestType, startTime, queryDuration, selectedTime, status, runTime, chartType, successCallBack) {

		$http({
			method: 'POST',
			url: './lt/chartReport',
			params: {
				runid: runId,
				testTypeScript: loadTestType,
				startTime : startTime,
				queryDuration : queryDuration,
				selectedTime : selectedTime,
				status : status,
				runTime : runTime,
				chartType : chartType
			}
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.deleteScriptRecord = function ($scope, ltScriptData, loadTestType, callback) {
		$http({
	        method: 'POST',
	        url: './ltScheduler/deleteScript',
	        params: {
				scriptId: ltScriptData.script_id,
				scriptName: ltScriptData.scriptName,
				testTypeScript: loadTestType
	        }
	    }).success(function(data) {
	        if(callback) {
	        	callback(data);
	        }
	    });
	};


	//
	this.stopRunningScenario = function(runId, callback){
		$http({
		 	method: 'POST',
		 	url: './ltScheduler/stopRunningScenario',
		 	params:{
		 		runId: runId,
		 	}
	 	}).success(function(data, status){
	        if(callback) {
	        	callback(data);
	        }
	 	});
	};
	
	this.getModuleCountersChartdataForLoadTest = function(guid,counter_id,startTime,endTime,runTime) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './lt/getModuleCountersChartdataForLoadTest',
			params: {
				guid: guid,
				counterNames: counter_id,
				startTime: startTime,
				endTime: endTime,
				runTime : runTime
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
}]);
