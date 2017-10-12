appedoApp.controller('ltDashPanel', ['$scope', '$attrs', 'ltService', 'sessionServices', '$appedoUtils', function($scope, $attrs, ltService, sessionServices, $appedoUtils) {
	var d3ChartTimeFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"));
	$scope.d3XaixsFormat = d3ChartTimeFormat[0];
    $scope.lastRunReports = [];
    
    var resultLTLicense = ltService.getLTLicense();
    resultLTLicense.then(function(resp) {
    	$scope.summarydata = resp;
    });
    
    var resultScenarioReports;
    resultScenarioReports = ltService.getScenarioReportsForDropdown();
    resultScenarioReports.then(function(resp) {
    	$scope.errorDonutData=[];
    	$scope.svfDonutData=[];
    	$scope.licDonutData=[];
    	$scope.lastRunReports = resp.message;
    	$scope.selectedLastRunreport = $scope.lastRunReports[0];
    	$scope.uidForDonut = $scope.selectedLastRunreport.uid;
        $scope.getLTChartData();
    });
    
	$scope.getLTChartData = function(){
    	 $scope.getLTAreaChart();
    	 $scope.getLTSummary();
    };
    
    $scope.getLTAreaChart= function(){
    	if($scope.selectedLastRunreport!=undefined){
    		var resultDashResponseArea = ltService.getDashResponseArea($scope.selectedLastRunreport.reportId);
    		resultDashResponseArea.then(function(resp) {
    			$scope.pageResponseTimeChartData = $appedoUtils.changeFormatToArrayInJSON(resp);
    		});
    		var resultDashVUsersArea = ltService.getDashVUsersArea($scope.selectedLastRunreport.reportId,$scope.selectedLastRunreport.scenarioName);
    		resultDashVUsersArea.then(function(resp) {
    			$scope.vUsersChartData = $appedoUtils.changeFormatToArrayInJSON(resp);
    		});
    	}
    };
    
    $scope.getLTSummary = function(){
    	if($scope.selectedLastRunreport!=undefined){
        	var resultDonutChartData;
        	resultDonutChartData = ltService.getDonutChartdata('Error',$scope.selectedLastRunreport.reportId);
            resultDonutChartData.then(function(resp) {
    			if(resp.success){
                	$scope.errorDonutData=resp.message;
    			}else{
                	$scope.errorDonutData=[];
    			}
            });
            
        	resultDonutChartData="";
        	resultDonutChartData = ltService.getDonutChartdata('Status',$scope.selectedLastRunreport.reportId);
            resultDonutChartData.then(function(resp) {
    			if(resp.success){
                	$scope.svfDonutData=resp.message;
    			}else{
                	$scope.svfDonutData=[];
    			}
            });
            
            resultDonutChartData="";
        	resultDonutChartData = ltService.getDonutChartdata('Run',$scope.selectedLastRunreport.reportId);
            resultDonutChartData.then(function(resp) {
    			if(resp.success){
                	$scope.licDonutData=resp.message;
    			}else{
                	$scope.licDonutData=[];
    			}
            });
    	}else{
    		$scope.errorDonutData=[];
    		$scope.svfDonutData=[];
    		$scope.licDonutData=[];
    	}
        
    };
}]);



appedoApp.controller('load_test_controller', ['$scope', 'ltCardService', '$location', '$state', 'sessionServices', '$modal', 'ltService', 'successMsgService', 'ngToast', '$rootScope', function ($scope, ltCardService, $location, $state, sessionServices, $modal, ltService, successMsgService, ngToast, $rootScope) {
	
	$scope.appedo = {};

	$scope.appedo.loadtestValue = 'APPEDO_LT';
	$scope.appedo.scripts_scenarios = 'Scenarios';
	$scope.loadtestType = function() {
		if( $scope.appedo.loadtestValue=='JMETER' ){
			$scope.appedo.jmeter = true;
			$scope.appedo.appedo_lt = false;
		} else {
			$scope.appedo.jmeter = false;
			$scope.appedo.appedo_lt = true;
		}
		

		$scope.modeType();
	};
	//$scope.loadtestType();
	
	var timer;
	
	$scope.scenariosCardLayout = function(){
		clearTimeout(timer);
		ltCardService.populateLTScenarioData($scope, $scope.appedo.loadtestValue, function(rumCardData) {
		});
		timer = setTimeout($scope.scenariosCardLayout, sessionServices.get("textRefresh"));
	};
	
	$scope.modeType = function() {
		if($scope.appedo.scripts_scenarios == 'Scripts'){
			$scope.appedo.scripts = true;
			$scope.appedo.scenarios = false;
			ltCardService.populateLTScriptData($scope, $scope.appedo.loadtestValue, function(rumCardData) {
				
			});
		}else{
			$scope.appedo.scripts = false;
			$scope.appedo.scenarios = true;
			$scope.scenariosCardLayout();
			var ltCard = $rootScope.$on("lt_card_layout", $scope.scenariosCardLayout);
    		$scope.$on('$destroy', ltCard);
		}
	};
	$scope.modeType();
	//$scope.modeType();
	
	// 
	$scope.loadtestType();
	
	$scope.uploadJmeterScript = function(elem) {
		ltCardService.uploadJmeterScript($scope, elem, function(data){

			if(data.success){
				$scope.scenariosCardLayout();
				successMsgService.showSuccessOrErrorMsg(data);
			}else{
				successMsgService.showSuccessOrErrorMsg(data);
			}
		});
	};
	
	$scope.openMonitorPage = function() {
		$scope.selectedScenario = this.ltscenario;
		if( $scope.selectedScenario.run_status == true && $scope.selectedScenario.mappedo_scripts > 0 ) {
			
			if ( $scope.appedo.loadtestValue == 'APPEDO_LT' ) {
				// for dynamic params in state 
				$state.transitionTo('/ltRunningScenarioStauts/:loadTestType/:scenarioName', {'loadTestType': $scope.appedo.loadtestValue, 'scenarioName': $scope.selectedScenario.scenarioName});
				$scope.saveTransitionHiddenParams($scope.selectedScenario);
			} else {
				// avoided transaistion to other page its jmeter
			}
		} else if ( $scope.selectedScenario.mappedo_scripts > 0  ) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/load_test/view/lt_select_monitors.html',
				controller: 'loadTestMonitorController',
				size: 'lg',
				resolve: {
					selectedScenario: function() {
						return $scope.selectedScenario;
					},
					testTypeScript: function() {
						return $scope.appedo.loadtestValue;
					}
				}
			});
		} else {
			// for no mapped scripts (0 - Mapped script)
			toastErrNoMapscipts();
		}
	};
	
	// id details stored in sessionStorage for transistion to next screen
	$scope.saveTransitionHiddenParams = function(scenario) {
		//$scope.selectedScenario = this.ltscenario;
		
		sessionServices.set("runId", scenario.run_id);
		//sessionServices.set("runId", 1356);
		sessionServices.set("scenarioId", scenario.scenario_id);
	};
	
	$scope.editMapScript = function() {
		$scope.mapScript = this.ltscenario;
		var modalInstance = $modal.open({
				templateUrl: 'modules/load_test/view/add_edit_lt.html',
				controller: 'addLTController',
				size: 'lg',
				resolve: {
					moduleCardContent: function() {
						return $scope.moduleCardContent;
					}, isFrom: function() {
						return "fromEdit";
					}, ltScenarioData: function() {
						return $scope.mapScript;
					}
				}
			});
	};

	$scope.openLtRunSetting = function() {
		$scope.mapScript = this.ltscenario;
		
		if($scope.mapScript.mappedo_scripts > 0) {
			var modalInstance = $modal.open({
					templateUrl: 'modules/load_test/view/ltrun_configure_script.html',
					controller: 'ltRunConfigureScript',
					size: 'lg',
					resolve: {
						moduleCardContent: function() {
							return $scope.moduleCardContent;
						}, isFrom: function() {
							return "fromEdit";
						}, ltScenarioData: function() {
							return $scope.mapScript;
						}, testTypeScript: function() {
							return $scope.appedo.loadtestValue;
						}
					}
				});
		} else {
			toastErrNoMapscipts();
		}
	};
	
	// for no mapped scripts (0 - Mapped script)
	function toastErrNoMapscipts() {
		ngToast.create({
			className: 'danger',
			content: 'Map atleast one script.',
			timeout: 3000,
			dismissOnTimeout: true,
			dismissButton: true,
			animation: 'fade'
		});
	}
	
	$scope.deleteSelectedScenario = function(index) {
		var joSelectedScenario = this.ltscenario;
		
		var result = confirm("You will lose some records permanently!\nAre you sure you want to delete?");
		if(result == true) {
			if($scope.appedo.loadtestValue == 'APPEDO_LT'){
				ltService.deleteScenarioRecord($scope, joSelectedScenario.scenario_id, function (response) {
					successMsgService.showSuccessOrErrorMsg(response);
				  	if(response.success == true){
				  		$scope.ltscenarioscontent.splice(index,1);
				  	}
				});
			}else{
				ltService.deleteJmeterScenarioRecord($scope, joSelectedScenario.scenario_id, joSelectedScenario.scenarioName, joSelectedScenario.type, function (response) {
					successMsgService.showSuccessOrErrorMsg(response);
				  	if(response.success == true){
				  		$scope.ltscenarioscontent.splice(index,1);
				  	}
				});
			}
		}
	};
	
	$scope.deleteSelectedScript = function(index) {
		$scope.ltScriptData = this.ltscript;
		var result = confirm("You will lose some records permanently!\nAre you sure you want to delete?");
			if(result == true) {
				ltService.deleteScriptRecord($scope, $scope.ltScriptData, $scope.appedo.loadtestValue, function (response) {
					successMsgService.showSuccessOrErrorMsg(response);
				  	if(response.success == true){
				  		$scope.ltscriptscontent.splice(index,1);
				  	}
				});
			}
	};
	
//	
//	$scope.apmCardEdit = false;
//	$scope.moduleOriginalData = {};
//	$scope.moduleCardEdit = function (index) {
//		$scope.moduleOriginalData = JSON.parse(JSON.stringify(this.appcardcontent));
//		$scope.module = this.appcardcontent;
//		
//		for(var i=0; i<$scope.appcardscontent.length; i++) {
//			var moduleContent = $scope.appcardscontent[i];
//			moduleContent.isEditEnabled = false;
//		}
//		$scope.module.isEditEnabled = true;
//	};
//	
//	$scope.doNotUpdate = function() {
//		$scope.module.isEditEnabled = false;
//		this.appcardcontent = $scope.moduleOriginalData;
//	};
//	
//	$scope.updateApmModule = function() {
//	$scope.module.isEditEnabled = false;		
//	rumCardService.updateApmModule($scope, this.appcardcontent, moduleType, function () {
//		});
//	};
//	
//	$scope.deleteSelectedRow = function(index) {
//		var result = confirm("You will lose agent records permanently!\nAre you sure to delete?");
//		if(result == true) {
//			rumCardService.deleteModuleRow($scope, this.appcardcontent, moduleType, function (response) {
//				if(response.success == true){
//					alert("Agent deleted successfully");
//					$scope.appcardscontent.splice(index,1);
//				} else {
//					alert("Unable to delete");
//				}
//			});
//		}
//	};
	$scope.$on('$destroy', function() {
		clearTimeout(timer);
    });
}]);


// for running scenario
appedoApp.controller('loadTestRunningScenarioController', ['$scope', '$stateParams', 'sessionServices', 'ltService', '$appedoUtils', 'ngToast', function($scope, $stateParams, sessionServices, ltService, $appedoUtils, ngToast) {
	//$scope.runId = $stateParams.runId;
	
	// selected secenario
	$scope.scenarioName = $stateParams.scenarioName;
	$scope.loadTestType = $stateParams.loadTestType;
	
	$scope.runId = sessionServices.get("runId");
	$scope.scenarioId = sessionServices.get("scenarioId");
	
	//$scope.ltRunningScenarios = [];
	$scope.ltRunningScenario = {};
	$scope.scenarioReports = [];
	$scope.ltScenarioReport = [];	
	
	var timerRunningScenario, timerCountdown;
	
	// timer for elapsed time
	//$appedoUtils.startTimer();
	/*
	$scope.timerElapsedTime = function() {
		$scope.elapsedTime = $appedoUtils.stopwatch();
	};
	timerCountdown = setInterval($scope.timerElapsedTime, 1000);
	*/
	
	// TODO: pass params might be scenarioId, Running scenario screen
	$scope.getRunningScenario = function() {
		clearTimeout(timerRunningScenario);
		
		ltService.getRunningScenario($scope.runId, $scope.loadTestType, function(data) {
			//$scope.ltRunningScenarios = data;
			
			if ( data.success ) {
				$scope.ltRunningScenario = data.message;
				
//				$scope.ltRunningScenario.elapsedTime = (new Date()).getTime() - $scope.ltRunningScenario.runStartTime;
				

				// to calculate total http of others count 
				$scope.ltRunningScenario.total_oth = 0;
				for(var i = 0; i < $scope.ltRunningScenario.scripts.length; i = i + 1) {
					var joScript = $scope.ltRunningScenario.scripts[i];
					
					$scope.ltRunningScenario.total_oth += joScript.httpOthStatus; 
				}
				
				// tried, timer to run only when scenario running, handled  
				if ( $scope.ltRunningScenario.runendtime == 0 ) {
					// running
					timerRunningScenario = setTimeout($scope.getRunningScenario, 1000 * 2);
				} else {
					// completed
					clearTimeout(timerRunningScenario);
					//clearInterval(timerCountdown);
					//$appedoUtils.stopTimer();
				}
			} else {
				// TODO: for err msg
			}
		});
		
		//timerRunningScenario = setTimeout($scope.getRunningScenario, 1000 * 2);
	};
	$scope.getRunningScenario();
	
	

	$scope.stopRunningScenario = function(){
		

		ltService.stopRunningScenario($scope.runId, function(data) {
			//$scope.ltRunningScenarios = data;

	 		if(data.success){
				ngToast.create({
					className: 'warning',
					content: data.message,
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
				});
	 			//showMessage.setMessage({level:'bg-message', text: data.message});
	 		}else{
	 			//showMessage.setMessage({level:'bg-error-message', text: data.message});
	 		}
		});
		
		
	};

	$scope.$on('$destroy', function() {
		clearTimeout(timerRunningScenario);
		
		//console.info('check referesh');
		sessionServices.destroy("runId");
		sessionServices.destroy("scenarioId");
		//console.info('after sestroy $scope.runId: '+$scope.runId);
    });
}]);

// for Reports
appedoApp.controller('loadTestScenarioReportsController', ['$scope', '$stateParams', 'sessionServices', 'ltService', 'apmModulesService', '$state', '$appedoUtils', function($scope, $stateParams, sessionServices, ltService, apmModulesService, $state, $appedoUtils) {

	$scope.backToLTCardPage = function() {
		$state.transitionTo('/load_test');
	};
	// selected secenario
	$scope.scenarioName = $stateParams.scenarioName;
	$scope.loadTestType = $stateParams.loadTestType;
	
	$scope.runId = sessionServices.get("runId");
	$scope.scenarioId = sessionServices.get("scenarioId");
	$scope.scenarios = [];
	
	// default value for report 
	$scope.ltReportType = 'SUMMARY';
	
	$scope.summaryReports = [];
	$scope.logReports = [];
	$scope.errorReports = [];
	
	var timerRunningScenario;
	
	// to show consalidated report for
	//$scope.isReportPage = true;
	
	
	/* tried radio btns using ng-repeat
	// 
	$scope.reportTypes = [
		{
			reportTypeName: 'Summary',
			reportTypeValue: 'SUMMARY',
			templateURL: 'modules/load_test/loadTestSummaryReport.html',
		}, {
			reportTypeName: 'Chart',
			reportTypeValue: 'CHART',
			templateURL: 'modules/load_test/loadTestChartReport.html',
		}, {
			reportTypeName: 'Log',
			reportTypeValue: 'LOG',
			templateURL: 'modules/load_test/loadTestLogReport.html',
		}, {
			reportTypeName: 'Error',
			reportTypeValue: 'ERROR',
			templateURL: 'modules/load_test/loadTestErrorReport.html',
		},
	];
	// default select Summary report
	$scope.ltSelectedReportType = $scope.reportTypes[0];
	*/
	/*
	$scope.reportTypes = {
		SUMMARY: {
			templateURL: 'modules/load_test/loadTestSummaryReport.html_1',
			loadReport: $scope.getSummaryReport
		}, 
		CHART: {
			templateURL: 'modules/load_test/loadTestChartReport.html',
			// TODO: charts to load
			loadReport: $scope.getLogReport
		},
		LOG: {
			templateURL: 'modules/load_test/loadTestLogReport.html',
			loadReport: $scope.getLogReport
		},
		ERROR: {
			templateURL: 'modules/load_test/loadTestErrorReport.html',
			loadReport: $scope.getErrorReport
		},
	};
	*/
	
	$scope.scenarioReports = [];
	
	// gets reports
	$scope.getScenarioReports = function() {

		ltService.getScenarioReports($scope.scenarioId, $scope.loadTestType, function(data) {
			
			if ( data.success ) {
				$scope.scenarioReports = data.message;
				$scope.selectedReport = $scope.scenarioReports[0];
				$scope.getSelectedReportDetails();
			} else {
				// TODO: for err msg
			}
		});
	};
	$scope.getScenarioReports();
	
	$scope.loadSelectedTypeReport = function() {
		if ( $scope.ltReportType == 'STATUS' ) {
			//$scope.getSummaryReport();
			$scope.getRunningScenario();
		} else if ( $scope.ltReportType == 'SUMMARY' ) {
			$scope.getSummaryReport();
		} else if ( $scope.ltReportType == 'CHART' ) {
			$scope.chartDurationType = undefined;
			$scope.selectedTime = undefined;
			if($scope.selectedReport.status=="RUNNING"){
				$scope.getChartReport();
			}else{
				if(checkRunTimeLessThanGivenHour(3,$scope.selectedReport.runTime)){
					if(checkRunTimeLessThanGivenMinute(1,$scope.selectedReport.runTime)){
						$scope.getDrillDownLTChart(1,0);
					}else{
						$scope.getDrillDownLTChart(0,0);
					}
				}else{
					$scope.getChartReport();
				}
			}
		} else if ( $scope.ltReportType == 'LOG' ) {
			$scope.getLogReport();
		} else if ( $scope.ltReportType == 'ERROR' ) {
			$scope.getErrorReport();
		}
		
		// tried 
		//$scope.reportTypes[$scope.ltReportType].loadReport();
	};
	
	function checkRunTimeLessThanGivenHour(hour,runTime){
		return (1000 * 60 * 60 * Number(hour)) > Number(runTime) ? true : false;
	}

	function checkRunTimeLessThanGivenMinute(minute,runTime){
		return (1000 * 60 * Number(minute)) > Number(runTime) ? true : false;
	}

	/*	
	// get scenarios
	$scope.getScenarios = function() {
		ltService.getScenarios(function(data) {
			$scope.scenarios = data;
		});
	};
	$scope.getScenarios();
*/	
	$scope.getDrillDownLTChart = function(chartDurationType,selectedTime) {
		$scope.chartDurationType = chartDurationType;
		$scope.selectedTime = selectedTime;
		$scope.getChartReport();
	};
	
	
	// gets scenario Reports 
	$scope.getChartReport = function() {
//For New LT Chart 
//This Needs to be UN comment for Major Release June Major release		

		var d3ChartTimeFormatForLT = JSON.parse(sessionServices.get("d3ChartTimeFormatForLT"));
		var d3ChartTypeForLT = JSON.parse(sessionServices.get("d3ChartTypeForLT"));

		$scope.ltAreaChartData = [];
		$scope.loadgensAvgReqResps = [];
		$scope.loadgensAvgPageResps = [];
		
		if($scope.loadTestType == "APPEDO_LT"){
			if($scope.selectedReport.status=="RUNNING"){
				if($scope.chartDurationType==undefined){
					$scope.d3XaixsFormat = d3ChartTimeFormatForLT[1];
					$scope.queryDurationType = d3ChartTypeForLT[1];
					$scope.chartDurationType = 1;
				}else{
					$scope.d3XaixsFormat = d3ChartTimeFormatForLT[Number($scope.chartDurationType)+1];
					$scope.queryDurationType = d3ChartTypeForLT[Number($scope.chartDurationType)+1];
					$scope.chartDurationType = Number($scope.chartDurationType)+1;
				}
			}else{
				if($scope.chartDurationType==undefined){
					$scope.d3XaixsFormat = d3ChartTimeFormatForLT[0];
					$scope.queryDurationType = d3ChartTypeForLT[0];
					$scope.chartDurationType = 0;
				}else{
					$scope.d3XaixsFormat = d3ChartTimeFormatForLT[Number($scope.chartDurationType)+1];
					$scope.queryDurationType = d3ChartTypeForLT[Number($scope.chartDurationType)+1];
					$scope.chartDurationType = Number($scope.chartDurationType)+1;
				}
			}
			
			ltService.getNewChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime,$scope.queryDurationType,$scope.selectedTime,$scope.selectedReport.status,$scope.selectedReport.runTime,'userCountChartData', function(data) {
				if ( data.success ) {
					$scope.userCountChartData = data.message.userCountChartData;
				} else {
					$scope.userCountChartData = [];
				}
			});

			ltService.getNewChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime,$scope.queryDurationType,$scope.selectedTime,$scope.selectedReport.status,$scope.selectedReport.runTime,'requestResponseChartData', function(data) {
				if ( data.success ) {
					$scope.requestResponseChartData = data.message.requestResponseChartData;
				} else {
					$scope.requestResponseChartData = [];
				}
			});

			ltService.getNewChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime,$scope.queryDurationType,$scope.selectedTime,$scope.selectedReport.status,$scope.selectedReport.runTime,'hitCountChartData', function(data) {
				if ( data.success ) {
					$scope.hitCountChartData = data.message.hitCountChartData;
				} else {
					$scope.hitCountChartData = [];
				}
			});

			ltService.getNewChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime,$scope.queryDurationType,$scope.selectedTime,$scope.selectedReport.status,$scope.selectedReport.runTime,'throughputChartData', function(data) {
				if ( data.success ) {
					$scope.throughputChartData = data.message.throughputChartData;
				} else {
					$scope.throughputChartData = [];
				}
			});

			ltService.getNewChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime,$scope.queryDurationType,$scope.selectedTime,$scope.selectedReport.status,$scope.selectedReport.runTime,'errorCountChartData', function(data) {
				if ( data.success ) {
					$scope.errorCountChartData = data.message.errorCountChartData;
				} else {
					$scope.errorCountChartData = [];
				}
			});
			
			ltService.getNewChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime,$scope.queryDurationType,$scope.selectedTime,$scope.selectedReport.status,$scope.selectedReport.runTime,'pageResponseChartData', function(data) {
				if ( data.success ) {
					$scope.pageResponseChartData = data.message.pageResponseChartData;
				} else {
					$scope.pageResponseChartData = [];
				}
			});

			ltService.getNewChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime,$scope.queryDurationType,$scope.selectedTime,$scope.selectedReport.status,$scope.selectedReport.runTime,'loadgensAvgReqResps', function(data) {
				if ( data.success ) {
					$scope.loadgensAvgReqResps = data.message.loadgensAvgReqResps;
				} else {
					$scope.loadgensAvgReqResps = [];
				}
			});

			ltService.getNewChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime,$scope.queryDurationType,$scope.selectedTime,$scope.selectedReport.status,$scope.selectedReport.runTime,'loadgensAvgPageResps', function(data) {
				if ( data.success ) {
					$scope.loadgensAvgPageResps = data.message.loadgensAvgPageResps;
				} else {
					$scope.loadgensAvgPageResps = [];
				}
			});
		}else if($scope.loadTestType == "JMETER"){
			$scope.d3XaixsFormat = "%d %b %H:%M";
			ltService.getChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime, function(data) {
				if ( data.success ) {
					for(var i = 0; i < data.message.emptyLoadgenValue.length; i = i + 1) {
		        		var graphContent = data.message.emptyLoadgenValue[i];
		        		if(graphContent.chartName == "User Counts"){
		        			$scope.userCountChartData = graphContent.chartData;
		        		}else if(graphContent.chartName == "Hit Counts"){
		        			$scope.hitCountChartData = graphContent.chartData;
		        		}else if(graphContent.chartName == "Avg. Request Response"){
		        			$scope.requestResponseChartData = graphContent.chartData;
		        		}else if(graphContent.chartName == "Avg. ThroughPut"){
		        			$scope.throughputChartData = graphContent.chartData;
		        		}else if(graphContent.chartName == "Error Counts"){
		        			$scope.errorCountChartData = graphContent.chartData;
		        		}else if(graphContent.chartName == "Avg. Page Response"){
		        			$scope.pageResponseChartData = graphContent.chartData;
		        		}
		        	}
					//$scope.ltAreaChartData = data.message.emptyLoadgenValue;
					$scope.loadgensAvgReqResps = data.message.loadgensAvgReqResps;
					$scope.loadgensAvgPageResps = data.message.loadgensAvgPageResps;
				} else {
					// TODO: for err msg
				}
			});	
		}
		
		//This Needs to be comment or removed for Major Release June Major release		
		
//		$scope.ltAreaChartData = [];
//		$scope.loadgensAvgReqResps = [];
//		$scope.loadgensAvgPageResps = [];
//		$scope.d3XaixsFormat = "%d %b %H:%M";
//		ltService.getChartReport($scope.selectedReport.reportId, $scope.loadTestType,$scope.selectedReport.runStartTime, function(data) {
//			if ( data.success ) {
//				$scope.ltAreaChartData = data.message.emptyLoadgenValue;
//				$scope.loadgensAvgReqResps = data.message.loadgensAvgReqResps;
//				$scope.loadgensAvgPageResps = data.message.loadgensAvgPageResps;
//			} else {
//				// TODO: for err msg
//			}
//		});

		
		
		
		if($scope.selectedReport.guid!=undefined){
			if($scope.selectedReport.guid!="0")
			{
				$scope.d3XaixsFormatForAPM = "%d %b %H:%M";
				$scope.primaryCountersChartdata=[];
				var primaryCountersChartdataJSONObj={};
				var primaryCountersChartdataJSONArray=[];

				var allGuid = $scope.selectedReport.guid.split(",");
				for(var i = 0; i < allGuid.length; i = i + 1) {
					var guid = allGuid[i];
					var resultPrimaryCountersdata = apmModulesService.getPrimaryCountersForAllDetailsPage(guid);
					resultPrimaryCountersdata.then(function(resp) {
						if(resp.success){
							if(resp.message.length>0){
								resp.message.forEach(function(counter) {
									resultPrimaryCountersChartdata = ltService.getModuleCountersChartdataForLoadTest($scope.selectedReport.guid,counter.counter_id,$scope.selectedReport.runStartTimeString,$scope.selectedReport.runEndTimeString,$scope.selectedReport.runTime);
				    				resultPrimaryCountersChartdata.then(function(respGraph) {
				    					if(respGraph.success) {
					    					//var jsonGraphObj = [];
											//var data = $appedoUtils.changeFormatToArrayInJSON( respGraph.message.chartdata[counter.counter_id] );
				    						var data = respGraph.message.chartdata[counter.counter_id];
											/*console.log(data.length);
							    			data.forEach(function(d1) {
							    				graphItem = {};
							    				graphItem ["time"] = d1[0];
							    				graphItem ["value"] = d1[1];
							    	        	jsonGraphObj.push(graphItem);
							            	});*/
							    			primaryCountersChartdataJSONObj={};
					    					primaryCountersChartdataJSONObj["guid"]=$scope.selectedReport.guid;
					    					primaryCountersChartdataJSONObj["category"]=counter.category;
					    					primaryCountersChartdataJSONObj["display_name"]=counter.display_name;
					    					primaryCountersChartdataJSONObj["show_in_dashboard"]=counter.show_in_dashboard;
					    					primaryCountersChartdataJSONObj["counter_id"]=counter.counter_id;
					    					//primaryCountersChartdataJSONObj["graphData"]=jsonGraphObj;
					    					primaryCountersChartdataJSONObj["graphData"]=data;
					    					primaryCountersChartdataJSONArray.push(primaryCountersChartdataJSONObj);
					    					$scope.primaryCountersChartdata = primaryCountersChartdataJSONArray;
				    					}
				    				});
								});
							}
						}
					});
				}
				$scope.primaryCountersChartdata = primaryCountersChartdataJSONArray;
			}
		}
	};



	// TODO: pass params might be scenarioId, Running scenario screen
	$scope.getRunningScenario = function() {
		clearTimeout(timerRunningScenario);
		
		ltService.getRunningScenario($scope.selectedReport.reportId, $scope.loadTestType, function(data) {
			//$scope.ltRunningScenarios = data;
			
			if ( data.success ) {
				$scope.ltRunningScenario = data.message;

				$scope.ltRunningScenario.elapsedTime = (new Date()).getTime() - $scope.ltRunningScenario.runStartTime;
				
				// to calculate total http of others count 
				$scope.ltRunningScenario.total_oth = 0;
				for(var i = 0; i < $scope.ltRunningScenario.scripts.length; i = i + 1) {
					var joScript = $scope.ltRunningScenario.scripts[i];
					
					$scope.ltRunningScenario.total_oth += joScript.httpOthStatus; 
				}
				
				// tried, timer to run only when scenario running, handled  
				if ( $scope.ltRunningScenario.runendtime == 0 ) {
					// running
					timerRunningScenario = setTimeout($scope.getRunningScenario, 1000 * 2);
				} else {
					// completed
					clearTimeout(timerRunningScenario);
				}
			} else {
				// TODO: for err msg
			}
		});
	};
	//$scope.getRunningScenario();
	
	
	
	$scope.getSummaryReport = function() {
		$scope.summaryReports = [];
		
//		ltService.getSummaryReport($scope.runId, $scope.loadTestType, function(data) {
		ltService.getSummaryReport($scope.selectedReport.reportId, $scope.loadTestType, function(data) {
			$scope.summaryReports = data;
			$scope.runId = $scope.selectedReport.reportId;
			/*if ( data.success ) {
				//$scope.ltScenarioReport = data.message;	
			} else {
				// TODO: for err msg
			}*/
		});
	};
	
	$scope.getLogReport = function() {
		$scope.logReports = [];

//		ltService.getLogReport($scope.runId, $scope.loadTestType, function(data) {
		ltService.getLogReport($scope.selectedReport.reportId, $scope.loadTestType, function(data) {
			//$scope.logReports = data;
			if ( data.success ) {
				$scope.logReports = data.message;
			} else {
				// TODO: for err msg
			}
		});
	};

	$scope.getErrorReport = function() {
		$scope.errorReports = [];

//		ltService.getErrorReport($scope.runId, $scope.loadTestType, function(data) {
		ltService.getErrorReport($scope.selectedReport.reportId, $scope.loadTestType, function(data) {
			//$scope.logReports = data;
			if ( data.success ) {
				$scope.errorReports = data.message;
			} else {
				// TODO: for err msg
			}
		});
	};

	// gets report details, ng-change of report
	$scope.getSelectedReportDetails = function() {
		$scope.loadSelectedTypeReport();
	};

	
	
	$scope.$on('$destroy', function() {
		clearTimeout(timerRunningScenario);
		
		// destroy's session saved values, when page gets refreshed also sessionStorage doesn't destroy & controller destroy also not 
		sessionServices.destroy("runId");
		sessionServices.destroy("scenarioId");
    });
}]);
appedoApp.controller('addLTController', ['$scope', '$modal', '$modalInstance', 'moduleCardContent', 'ltService', 'successMsgService', 'isFrom', 'ltScenarioData', '$rootScope',
	  function($scope, $modal, $modalInstance,  moduleCardContent, ltService, successMsgService, isFrom, ltScenarioData, $rootScope) {
      $scope.close = function() {
          $modalInstance.dismiss('cancel');
      };
      
      $scope.showProceed = true;
	  $scope.moduleCardContent = moduleCardContent;
	  if(isFrom == "fromEdit") {
	  	$scope.saveButton = "Update";
	  } else {
	  	$scope.saveButton = "Save";
	  }
	  $scope.checkSelectedScripts = function() {
		  for(var i = 0; i<$scope.selectedScripts.length; i++) {
			  	if($scope.selectedScripts[i].isSelected) {
			  		$scope.showProceed = false;
			  		break;
			  	}else{
			  		$scope.showProceed = true;
			  	}
		  }
	  };
	  
	  ltService.getLtScripts($scope, isFrom, ltScenarioData);
	  
	  $scope.saveLtMapScripts = function () {
	  	var selectedScriptsId = [];
	  	var selectedScriptnames = [];
	  	for(var i = 0; i<$scope.selectedScripts.length; i++) {
		  	if($scope.selectedScripts[i].isSelected) {
		  		selectedScriptsId.push($scope.selectedScripts[i].script_id);
		  		selectedScriptnames.push($scope.selectedScripts[i].scriptName);
		  	}
	  	}
		  if($scope.addLtScenario.$valid) {
			  ltService.saveLtScripts($scope, isFrom, selectedScriptsId, selectedScriptnames, function(data) {
			  	successMsgService.showSuccessOrErrorMsg(data);
				  	if(data.success == true){
				  		$rootScope.$emit('lt_card_layout');
				  		$modalInstance.dismiss('cancel');
				  	}
			  });
		  }
	  };
	          

}]);

appedoApp.controller('loadTestMonitorController', ['$scope', '$modal', '$modalInstance', 'ltService', 'successMsgService', 'selectedScenario', 'ngToast', '$rootScope', 'testTypeScript',
	  function($scope, $modal, $modalInstance,  ltService, successMsgService, selectedScenario, ngToast, $rootScope, testTypeScript) {
      $scope.close = function() {
          $modalInstance.dismiss('cancel');
      };
	  ltService.getRunAgentMapping($scope, selectedScenario, testTypeScript);
	  $scope.ltMonitors = {};
	  
	  $scope.agentLoadGenerator = function() {
		  var selectedMonitorIds = [];
		  for(var i = 0; i < $scope.ltMonitors.length; i = i + 1) {
				var monitorData = $scope.ltMonitors[i];
				for(var j=0; j < monitorData.agents.length; j=j+1){
					if(monitorData.agents[j].isSelected) {
						selectedMonitorIds.push(monitorData.agents[j].guid);
					}
				}
		  }
		  //if(selectedMonitorIds.length > 0) {
			  ltService.agentLoadGenerator($scope, testTypeScript, function(data) {
					$scope.agentLoadData = data.message;
					$scope.selectedMonitorIds = selectedMonitorIds;
					if(data.success==true){
						$rootScope.$on("close_lt_parent_popup", function(event){
						  	$modalInstance.dismiss('cancel');
						});
						var modalInstance = $modal.open({
							templateUrl: 'modules/load_test/view/lt_assign_load_generator.html',
							controller: 'assignLoadGeneratorController',
							size: 'lg',
							resolve: {
			                	selectedMonitorIds: function() {
			                    	return $scope.selectedMonitorIds;
			                	}, 
			                	agentLoadData: function() {
			                		return $scope.agentLoadData;
			                	}, 
			                	selectedScenario: function() {
			                		return selectedScenario;
			                	},
			                	testType: function() {
			                		return testTypeScript;
			                	}
							}
						});
						
					}
			  });
		  /*} else {
				ngToast.create({
					className: 'warning',
					content: 'Please select monitors.',
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
				});
		  }*/
	  };
}]);

appedoApp.controller('assignLoadGeneratorController', ['$scope', '$modal', '$modalInstance', 'ltService', 'successMsgService', 'selectedMonitorIds', 'agentLoadData', 'selectedScenario', 'ngToast', '$rootScope', 'testType',
	  function($scope, $modal, $modalInstance,  ltService, successMsgService, selectedMonitorIds, agentLoadData, selectedScenario, ngToast, $rootScope, testType) {
      $scope.close = function() {
          $modalInstance.dismiss('cancel');
      };
      $scope.regionData = agentLoadData;
      
      $scope.moduledata = {};
      
      $scope.runAgentLoadGenerator = function() {
      	var distributions = [];
      	var regions = [];
      	var distribution = 0;
      	angular.forEach($scope.regionData, function(region){
      		if(region.showRegion == true) {
      			distributions.push(parseInt(region.distribution));
      			distribution = distribution + parseInt(region.distribution);
  				var preIndex = region.region.indexOf("(")+1; 
				var postIndex = region.region.indexOf(")");
				var regionName = region.region.substring(preIndex, postIndex);
				if(regionName != ""){
					regions.push(regionName);
				}
      		}
      	});
		var params = {
			maxUserCount: selectedScenario.virtual_users,
			guids: selectedMonitorIds.join(),
			testType: testType,
			scenarioId: selectedScenario.scenario_id,
			scenarioName: selectedScenario.scenarioName,
			reportName: $scope.moduledata.moduleName,
			runType: testType=='APPEDO_LT'?0:1,
			regions: regions.join(),
			distributions: distributions.join()
		}
		
		if($scope.regionsForm.$valid) {
			if( regions.length == 0 ){
		    		ngToast.create({
					className: 'warning',
					content: 'Select atleast one Region.',
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
				});
				} else if(distribution<100 || distribution > 100){
					ngToast.create({
					className: 'warning',
					content: 'Sum of distribution is 100% only.',
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
				});
				} else {
					ltService.runScenario($scope, params, function(data) { 
						successMsgService.showSuccessOrErrorMsg(data);
						  	if(data.success == true){
						  		$rootScope.$emit('close_lt_parent_popup');
						  		$modalInstance.dismiss('cancel');
						}
					});
				}
		}
      };
}]);

appedoApp.controller('ltRunConfigureScript', ['$scope', '$modal', '$modalInstance', 'ltService', 'successMsgService', 'moduleCardContent', 'ltScenarioData', 'ngToast', 'testTypeScript', '$rootScope',
 	  function($scope, $modal, $modalInstance,  ltService, successMsgService, moduleCardContent, ltScenarioData, ngToast, testTypeScript, $rootScope) {
       $scope.close = function() {
           $modalInstance.dismiss('cancel');
       };
       $scope.moduleCardContent=moduleCardContent;
       $scope.ltRunSettingForm = {};

       ltService.getScenarioSettings($scope, ltScenarioData, testTypeScript, function(scriptData) {
	       	$scope.scriptData = scriptData.message;
	       	$scope.ltRunSettingForm.script = $scope.scriptData[0];	       	
	       	$scope.ltRunSettingForms = {};
	       	$scope.$watch('ltRunSettingForm.script', function() {
		        if ($scope.ltRunSettingForm.script != undefined) {
		            if ($scope.ltRunSettingForm.script.script_name != undefined) {
		                $scope.scriptConfigData = $scope.ltRunSettingForm.script.scenario_settings;
		                
		                $scope.ltRunSettingForm.clearBrowserCache = $scope.scriptConfigData.browsercache;
		                $scope.ltRunSettingForm.startUserCount = parseInt($scope.scriptConfigData.startuser);
		                $scope.ltRunSettingForm.maxUserCount = parseInt($scope.scriptConfigData.maxuser);
		                $scope.ltRunSettingForm.durationHrs = parseInt($scope.scriptConfigData.durationtime.split(";")[0]);
		                $scope.ltRunSettingForm.durationMins = parseInt($scope.scriptConfigData.durationtime.split(";")[1]);
		                $scope.ltRunSettingForm.durationSecs = parseInt($scope.scriptConfigData.durationtime.split(";")[2]);
		                $scope.ltRunSettingForm.iterationCount = parseInt($scope.scriptConfigData.iterations);
		                $scope.ltRunSettingForm.increamnetUser = parseInt($scope.scriptConfigData.incrementuser);
		                $scope.ltRunSettingForm.forEveryHrs = parseInt($scope.scriptConfigData.incrementtime.split(";")[0]);
		                $scope.ltRunSettingForm.forEveryMins = parseInt($scope.scriptConfigData.incrementtime.split(";")[1]);
		                $scope.ltRunSettingForm.forEverySecs = parseInt($scope.scriptConfigData.incrementtime.split(";")[2]);
		                $scope.ltRunSettingForm.iterationDuration = parseInt($scope.scriptConfigData.type);
		                if($scope.ltRunSettingForm.iterationDuration == '1') {
		                	$scope.ltRunSettingForm.iterationDuration="iteration";
		                } else {
		                	$scope.ltRunSettingForm.iterationDuration="duration";
		                }
		            }
		        }
	        });
	        $scope.applyToAll = function() {
	        	if($scope.ltRunSettingConfigForm.$valid) {
		        	var scriptIds = [];
		        	var scriptNames = [];
		        	script_id = $scope.scriptData.script_id;
					script_name = $scope.scriptData.script_name;
					angular.forEach($scope.scriptData, function(script){
						scriptIds.push(script.script_id);
						scriptNames.push(script.script_name);
					});
					
					ltService.updateScenarioSettings($scope, scriptIds, ltScenarioData, scriptNames, $scope.scriptConfigData, testTypeScript, function(data){
						successMsgService.showSuccessOrErrorMsg(data);
					  	if(data.success == true){
					  		$rootScope.$emit('lt_card_layout');
					  		$modalInstance.dismiss('cancel');
					  	}
					});
	        	}
	        };
	        
	        $scope.apply = function() {
	        	if($scope.ltRunSettingConfigForm.$valid) {
		        	var scriptIds = [];
		        	var scriptNames = [];
		        	scriptIds.push($scope.ltRunSettingForm.script.script_id);
		        	scriptNames.push($scope.ltRunSettingForm.script.script_name);
		        	ltService.updateScenarioSettings($scope, scriptIds, ltScenarioData, scriptNames, $scope.scriptConfigData, testTypeScript, function(data){
						successMsgService.showSuccessOrErrorMsg(data);
					  	if(data.success == true){
					  		$rootScope.$emit('lt_card_layout');
					  		$modalInstance.dismiss('cancel');
					  	}
					});
	        	}
	        };
       });
}]);