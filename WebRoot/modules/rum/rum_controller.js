appedoApp.controller('addRumController', function($scope, moduleCardContent, $modalInstance, $modal, rumService, $rootScope, successMsgService) {	
	$scope.moduleCardContent = moduleCardContent;
	rumService.getModuleTypes($scope, $scope.moduleCardContent);
	
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};	
	
	$scope.moduledata = {};
	$scope.saveRUM = function () {
    	if($scope.rumAddForm.$valid) { 
    		rumService.saveRUM($scope, $scope.moduleCardContent, rumService.getModuleTypes(), function (data) {
    			if(data.success){
    				$rootScope.$emit('load_rum_card_layout');
    				var modalInstance = $modal.open({
        	    		templateUrl: 'modules/rum/view/download_rum_module.html',
        	    		controller: 'downloadRumController',
        	    		size: 'lg',
        	    		resolve: {
        					moduleAddData: function() {
        						return $scope.moduledata;
        					},
        					moduleDownloadData: function() {
        						return data;
        					},
        					moduleCardContent: function() {
        						return $scope.moduleCardContent;
        					}
        				}
        	    	});
    				$modalInstance.dismiss('cancel');
    			} else {
    				successMsgService.showSuccessOrErrorMsg(data);
    			}
    		}); 
    	}
    };
});

appedoApp.controller('downloadRumController', function($scope, moduleAddData, moduleDownloadData, $modalInstance,  moduleCardContent) {	
	$scope.moduleAddData = moduleAddData;
	
	$scope.currentModule = moduleCardContent.module_name;
	$scope.moduleDownloadData = moduleDownloadData;
	console.log($scope.moduleDownloadData);
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};
});

appedoApp.controller('rumDashPanel', ['$scope', '$attrs', 'apmCardService', 'rumService', 'sessionServices', '$appedoUtils', function($scope, $attrs, apmCardService, rumService, sessionServices, $appedoUtils) {
	var d3ChartTimeFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"));
	
    $scope.userWebsiteCounterModules = [];
    apmCardService.populateApmCardData($scope,'RUM',function(resp){
		$scope.browserDonutData=[];
		$scope.deviceTypeDonutData=[];
		$scope.osDonutData=[];
    	$scope.userWebsiteCounterModules = resp.moduleData;
    	$scope.selectedWebSite = $scope.userWebsiteCounterModules[0];
    	$scope.uidForDonut = $scope.selectedWebSite.uid;
    	$scope.totalVisitor = 0;
        $scope.getRUMChartData();
    });

    $scope.rumDurations = JSON.parse(sessionServices.get("sliderServerSideScale"));
    $scope.selectedRUMDuration = $scope.rumDurations[0];
	$scope.d3XaixsFormat = d3ChartTimeFormat[$scope.rumDurations.indexOf($scope.selectedRUMDuration)];
	$scope.durationForDonut = $scope.rumDurations[0];
	
	$scope.getRUMChartData = function(){
    	 $scope.getRUMAreaChart();
    	 $scope.getRUMSummary();
    };
    
    $scope.getRUMAreaChart= function(){
    	$scope.d3XaixsFormat = d3ChartTimeFormat[$scope.rumDurations.indexOf($scope.selectedRUMDuration)];
		var resultRUMAreaChart = rumService.getRUMDashArea($scope.selectedWebSite.uid,$scope.selectedRUMDuration);
		resultRUMAreaChart.then(function(resp) {
			$scope.visitorsCountChartData = $appedoUtils.changeFormatToArrayInJSON(resp.message);
			var data = resp.message;
			var totalVis=0;
    		data.forEach(function(d1) {
    			totalVis=Number(totalVis)+d1[1];
            });
    		$scope.totalVisitor =totalVis;
		});
    };
    
    $scope.getRUMSummary = function(){
    	var resultDonutChartData;
    	resultDonutChartData = rumService.getDonutChartdata('Browser',$scope.selectedWebSite.uid,$scope.selectedRUMDuration);
        resultDonutChartData.then(function(resp) {
        	$scope.browserDonutData=resp;
        });
        
    	resultDonutChartData="";
    	resultDonutChartData = rumService.getDonutChartdata('DeviceType',$scope.selectedWebSite.uid,$scope.selectedRUMDuration);
        resultDonutChartData.then(function(resp) {
        	$scope.deviceTypeDonutData=resp;
        });
        
        resultDonutChartData="";
    	resultDonutChartData = rumService.getDonutChartdata('OS',$scope.selectedWebSite.uid,$scope.selectedRUMDuration);
        resultDonutChartData.then(function(resp) {
        	$scope.osDonutData=resp;
        });
    };
}]);


appedoApp.controller('rumCardController', ['$scope', 'rumCardService', '$location', '$state', 'sessionServices', '$modal', 'ngToast', '$rootScope', 'successMsgService', function ($scope, rumCardService, $location, $state, sessionServices, $modal, ngToast, $rootScope, successMsgService) {
	var moduleType = 'RUM';
	var url = $location.url();
	
	// default value
	$scope.selectedRUMRadioValue = 'RUM';
	
	$scope.openAddModuleType = function() {
		var modalInstance = $modal.open({
			templateUrl: 'common/views/select_module.html',
			controller: 'form_instance_controller',
			size: 'lg',
			backdrop : 'static'
		});
	};
	$scope.getRumCardData = function() {
		rumCardService.populateRumCardData($scope, moduleType, function(rumCardData) {
			$scope.appcardscontent = rumCardData;
			$scope.showCard = false;
			$scope.showCardEmptyMsg = false;
			if($scope.appcardscontent.length >0){
				$scope.showCard = true;
			}else {
				$scope.showCardEmptyMsg = true;
			}
			$scope.getTransactionDataAndAgentStatus();
		});
	};
	$scope.getRumCardData();
	//for refresh the card layout after Add
	var rumCard = $rootScope.$on("load_rum_card_layout", $scope.getRumCardData);
    $scope.$on('$destroy', rumCard);
    
	/*var reloadRumCardLayout = $rootScope.$on("load_rum_card_layout", function(event){
		rumCardService.populateRumCardData($scope, moduleType, function(rumCardData) {
			$scope.appcardscontent = rumCardData;
			$scope.getTransactionDataAndAgentStatus();
		});
	});*/
	
	var timerAgentStatus;
	$scope.getTransactionDataAndAgentStatus = function() {
		clearTimeout(timerAgentStatus);
		
		if($scope.appcardscontent.length>0){
			var resultTransactionData = rumCardService.getTransactionDataService();
			resultTransactionData.then(function(rumTransactionData) {
				$scope.rumTransactions = rumTransactionData;
				for(var i=0; i<$scope.appcardscontent.length; i++){
					for(var j=0; j<$scope.rumTransactions.length; j++){
						if($scope.appcardscontent[i].uid == $scope.rumTransactions[j].uid){
							$scope.appcardscontent[i].visitor_count = $scope.rumTransactions[j].visitor_count;
							$scope.appcardscontent[i].max_resp = $scope.rumTransactions[j].max_resp;
						}
					}
				}
				var resultAgentStatus = rumCardService.getAgentStatus();
				resultAgentStatus.then(function(rumAgentStatus) {
					$scope.agentStatus = rumAgentStatus;
					for(var i=0; i<$scope.appcardscontent.length; i++){
						for(var j=0; j<$scope.agentStatus.length; j++){
							if($scope.appcardscontent[i].uid == $scope.agentStatus[j].uid){
//								$scope.appcardscontent[i].csharp_status = $scope.agentStatus[j].csharp_status;
//								$scope.appcardscontent[i].java_status = $scope.agentStatus[j].java_status;
//								$scope.appcardscontent[i].js_status = $scope.agentStatus[j].js_status;
//								$scope.appcardscontent[i].php_status = $scope.agentStatus[j].php_status;
//								$scope.appcardscontent[i].python_status = $scope.agentStatus[j].python_status;
								$scope.appcardscontent[i].rum_status = $scope.agentStatus[j].rum_status;
							};
						}
					};
				});
			});
		}
		
		timerAgentStatus = setTimeout($scope.getTransactionDataAndAgentStatus, sessionServices.get("textRefresh"));
	};
	
	$scope.apmCardEdit = false;
	$scope.moduleOriginalData = {};
	$scope.moduleCardEdit = function (index) {
		$scope.moduleOriginalData = JSON.parse(JSON.stringify(this.appcardcontent));
		$scope.module = this.appcardcontent;
		
		for(var i=0; i<$scope.appcardscontent.length; i++) {
			var moduleContent = $scope.appcardscontent[i];
			moduleContent.isEditEnabled = false;
		}
		$scope.module.isEditEnabled = true;
	};
	
	$scope.doNotUpdate = function() {
		$scope.module.isEditEnabled = false;
		this.appcardcontent = $scope.moduleOriginalData;
	};
	
	$scope.updateApmModule = function() {
	//$scope.module.isEditEnabled = false;		
	rumCardService.updateApmModule($scope, this.appcardcontent, moduleType, function (data) {
			if(data.success == true) {
				$scope.module.isEditEnabled = false;
			} else {
				$scope.module.isEditEnabled = true;
			}
			successMsgService.showSuccessOrErrorMsg(data);
		});
	};
	
	$scope.deleteSelectedRow = function(index) {
		var result = confirm("You will lose agent records permanently!\nAre you sure you want to delete?");
		if(result == true) {
			$scope.moduleName = this.appcardcontent.moduleName
			rumCardService.deleteModuleRow($scope, this.appcardcontent, moduleType, function (response) {
				if(response.success == true){
					ngToast.create({
						className: 'success',
						content: "RUM "+$scope.moduleName +" has been deleted successfully.",
						timeout: 3000,
						dismissOnTimeout: true,
						dismissButton: true,
						animation: 'fade'
					});
					$scope.appcardscontent.splice(index,1);
				} else {
					ngToast.create({
						className: 'warning',
						content: "Unable to delete RUM.",
						timeout: 3000,
						dismissOnTimeout: true,
						dismissButton: true,
						animation: 'fade'
					});
				}
			});
		}
	};
	
	// gets CI default agent types
	$scope.getDefaultAgentTypes = function() {
		
		rumCardService.getDefaultAgentTypes(function(data) {
			$scope.defaultAgentTypes = data;
		});
	};
	$scope.getDefaultAgentTypes();
	
	
	
	$scope.getUserEventsVisitorsCount = function() {
		rumCardService.getUserEventsVisitorsCount($scope.selectedAgentType != undefined ? $scope.selectedAgentType.value : null, $scope.selectedEnvironment != undefined ? $scope.selectedEnvironment.env : null, function(data) {

			if( data.success ){
				$scope.eventsVisitorsCount = data.message;
				
				for (var keyUid in $scope.eventsVisitorsCount) {
					for(var i = 0; i < $scope.appcardscontent.length; i = i + 1) {
						var joCardContent = $scope.appcardscontent[i];
						
						if( joCardContent.uid == keyUid ) {
							joCardContent.eventsVisitorsCount = $scope.eventsVisitorsCount[keyUid];
							break;
						}
					}
				}
			} else {
				// err
			}
		});
	};
	
	$scope.getUserEventsDistinctEnvironments = function() {
		rumCardService.getUserEventsDistinctEnvironments(function(data) {
			//
			if( data.success ){
				$scope.eventsDistinctEnvironments = data.message;
			} else {
				// err
			}
		});
	};
	$scope.getUserEventsDistinctEnvironments();
	
	// to go for RUM/CI details page
	$scope.goModuleDetailGrpahs = function() {
		$scope.selectedRumCardContent = this.appcardcontent;
		
		// to store for hidden params
		sessionServices.set("uid", $scope.selectedRumCardContent.uid);
		
		// for dynamic params in state 
		$state.transitionTo('/rum_details/:type/:moduleName', {'type': $scope.selectedRUMRadioValue, 'moduleName': $scope.selectedRumCardContent.moduleName});
	};
	
	$scope.$on('$destroy', function() {
		clearTimeout(timerAgentStatus);
    });
}]);

appedoApp.controller('rumDetailsController', ['$scope', '$stateParams', 'apmCardService', 'rumCardService', 'rumService', 'sliderFactory', '$appedoUtils', 'sessionServices', '$state', function($scope, $stateParams, apmCardService, rumCardService, rumService, sliderFactory, $appedoUtils, sessionServices, $state) {
	
	//$scope.selectedRumCardContent = JSON.parse(sessionServices.get("selectedRumCardContent"));
	
	$scope.backToRumCardPage = function() {
		$state.transitionTo('/rum_metrics');
	};

	// params when transistion from `rum_home` page
	$scope.moduleNameParam = $stateParams.moduleName;
	
	$scope.uidParam = sessionServices.get("uid");
	
	//$scope.selectedRUMRadioValue = "RUM";
	$scope.selectedRUMRadioValue = $stateParams.type;
	$scope.sliderValue = "1";
	$scope.sliderOptions = sliderFactory.sliderOptions;

	var d3ChartTimeFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"));
	$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[0];
	$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
	
	
	// for RUM
	$scope.rumChartData = {};
	
	$scope.rumModules = [];
	//$scope.pagesLoadTime = [];
	//$scope.pageLoadTimeChartData = [];
	
	
	// for CI, Events 
	$scope.ciChartData = {};
	$scope.moduleAgentTypes = [];
	$scope.moduleEnvironments = [];
	
	
	//$scope.showMonitor = true;
	//$scope.showEvent = false;
	//getRUMData();
	
	$scope.handleRadioClick = function(selectedValue){
		console.log(selectedValue);
		console.log("Before : "+$scope.selectedRUMRadioValue);
//		$scope.selectedRUMRadioValue = selectedValue;
		if(selectedValue!=$scope.selectedRUMRadioValue){
			$scope.selectedRUMRadioValue = selectedValue;
			if(selectedValue=="EVENTS"){
				//$scope.showMonitor = false;
				//$scope.showEvent = true;
				getCIData();
			}else if(selectedValue=="RUM"){
				//$scope.showMonitor = true;
				//$scope.showEvent = false;
				//getRUMData();
				$scope.getModules();
				
			}
		}
		console.log("After : "+$scope.selectedRUMRadioValue);
    };
    
    
    // slider change
    $scope.$watch('sliderValue',function(newVal){
    	if(newVal){
    		if(newVal=="1"){
    			$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[0];
    			$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
    		}else{
    			$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[(newVal/$scope.sliderOptions.step)];
    			$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[(newVal/$scope.sliderOptions.step)];
    		}
    		
    		$scope.loadSelectedTypeDetails();
    	}
	});
    
    /*
    function getRUMData() {
    	
	};
	*/
	

	// for RUM Modules dropdown
	$scope.getModules = function(){
/*		
		apmCardService.populateApmCardData($scope, 'RUM', function(data) {
			$scope.rumModules = data.moduleData;
			// TODO LastReceived On
			
			// reomve for testing purpose
			//$scope.selectedModule = $scope.rumModules[0];
			selectModuleFromUID();
			$scope.loadRUMDetails();
		});
*/

		rumCardService.populateRumCardData($scope, 'RUM', function(data) {
			$scope.rumModules = data;
			
			selectModuleFromUID();
			//$scope.loadRUMDetails();
		});
	};
	$scope.getModules();
	
	
	// to selecte comobo
	function selectModuleFromUID() {
		for(var i = 0; i < $scope.rumModules.length; i = i + 1) {
			var joModule = $scope.rumModules[i];
			
			if ( joModule.uid == $scope.uidParam ) {
				$scope.selectedModule = $scope.rumModules[i];
			}
		}
	}
	
	// tried, handle to load initially when page refresh, sessionUId param is passed for other `uidParam` is not given
	$scope.loadSelectedTypeDetails = function(uidParam) {
		//console.info('loadSelectedTypeDetails uidParam: '+uidParam);
		//$scope.selectedModuleUId = $scope.selectedModule.uid;
		//$scope.selectedModuleUId = 265;
		$scope.selectedModuleUId = uidParam || $scope.selectedModule.uid ;
		
		$scope.clearRUMChartValues();
		$scope.clearCIValues();
		
		if($scope.selectedRUMRadioValue == 'EVENTS') {
			//getCIData();
			$scope.loadCIDetails();
		}else if($scope.selectedRUMRadioValue == 'RUM'){
			//getRUMData();
			$scope.loadRUMDetails();
		}
	};
	// load initially when page refresh uidParam passed 
	//$scope.loadSelectedTypeDetails($scope.uidParam);
	
	
	// for RUM details to load
	$scope.loadRUMDetails = function() {
		//$scope.selectedModuleUId = $scope.selectedModule.uid;
		//$scope.selectedModuleUId = 265;
		
		$scope.getPagesLoadTime();
		$scope.getRUMSummary();
		$scope.getVisitorsCount();
		$scope.getRUMLastReceivedOn();
	};

	
	// RUM, to get pagesLoadtime, page analysis
	$scope.getPagesLoadTime = function() {
		$scope.rumChartData.pagesLoadTime = [];
		
		rumService.getPagesLoadTime($scope.selectedModuleUId, $scope.sliderSelectedValue, function(data) {
			//$scope.pagesLoadTime = data;
			
			if (data.success) {
				$scope.rumChartData.pagesLoadTime = data.message;  
			} else {
				// TODO: err msg
			}
		});
	};

	// calls  from directive, page load time area graph 
	$scope.loadSelectedPageLoadTime = function(url) {
		//$scope.selectedPage = url;
		$scope.selectedPage = this.page;
		$scope.selectedPageURL = $scope.selectedPage.page;
		//$scope.selectedPageURL = url;
		
		// getschart data
		$scope.getPageLoadTimeChartData();
		/*rumService.getSelectedPageLoadTime(159, '', '1 day', function(data) {//uid, url, fromstartinterval, 
			var chartdata = data.message;
			$scope.pageLoadTimeChartData = $appedoUtils.changeFormatToArrayInJSON(chartdata);

	    	//$scope.$apply();
		});*/
	};
	
	// get Page load time chart data for 
	$scope.getPageLoadTimeChartData = function() {
		rumService.getSelectedPageLoadTime($scope.selectedModuleUId, $scope.selectedPageURL, $scope.sliderSelectedValue, function(data) {//uid, url, fromstartinterval, 
			//var chartdata = data.message.message;
			//$scope.rumChartData.pageLoadTimeChartData = $appedoUtils.changeFormatToArrayInJSON(chartdata);
			var chartdata = data.message;
			$scope.rumChartData.pageLoadTimeChartData = chartdata;
			//$scope.rumChartData.rumIdMapping = data.message.ids;
			
	    	//$scope.$apply();
		});
	};
	
	//
	$scope.getPageBreakDownDetails = function(time, value, rumId) {
		//$scope.selectedRUMIdTimeForPageBreakDownDetails = $scope.rumChartData.rumIdMapping[time+'_'+value];
		$scope.selectedRUMIdTimeForPageBreakDownDetails = rumId;
		
		rumService.getPageBreakDownDetails($scope.selectedModuleUId, $scope.selectedRUMIdTimeForPageBreakDownDetails, $scope.sliderSelectedValue, function(data) {//uid, url, fromstartinterval, 

			$scope.rumChartData.pageBreakDownData = data.message;

	    	//$scope.$apply();
		});
	};
	
	
	
	// RUM, donut chart details, for site analysis, 
	$scope.getRUMSummary = function(){
		clearDonutChartsData();
		
    	var resultDonutChartData;
    	resultDonutChartData = rumService.getDonutChartdata('Browser', $scope.selectedModuleUId, $scope.sliderSelectedValue);
        resultDonutChartData.then(function(resp) {
        	$scope.rumChartData.browserDonutData=resp;
        });
        
        
    	resultDonutChartData="";
    	resultDonutChartData = rumService.getDonutChartdata('DeviceType', $scope.selectedModuleUId, $scope.sliderSelectedValue);
        resultDonutChartData.then(function(resp) {
        	$scope.rumChartData.deviceTypeDonutData=resp;
        });
        
        
        resultDonutChartData="";
    	resultDonutChartData = rumService.getDonutChartdata('OS', $scope.selectedModuleUId, $scope.sliderSelectedValue);
        resultDonutChartData.then(function(resp) {
        	$scope.rumChartData.osDonutData=resp;
        });

        
        resultDonutChartData="";
    	resultDonutChartData = rumService.getDonutChartdata('DEVICE_NAME', $scope.selectedModuleUId, $scope.sliderSelectedValue);
        resultDonutChartData.then(function(resp) {
        	$scope.rumChartData.deviceNameDonutData=resp;
        });
    };
    
    function clearDonutChartsData() {
		$scope.rumChartData.browserDonutData = [];
    	$scope.rumChartData.deviceTypeDonutData = [];
    	$scope.rumChartData.osDonutData = [];
    	$scope.rumChartData.deviceNameDonutData = [];
    }
    
    // TODO: thinks, Visitors count graph is new logic
    // RUM, Visitors count
	$scope.getVisitorsCount = function() {
		$scope.visitorsCountChartData = [];
    	$scope.d3XaixsFormat = d3ChartTimeFormat[3];
    	var totalVis = 0;
		var resultRUMAreaChart = rumService.getVisitorsCount($scope.selectedModuleUId, $scope.sliderSelectedValue);
		resultRUMAreaChart.then(function(resp) {
			totalVis = 0;
			if(resp.success){
				var data = resp.message;
				if(data.dailyVisitorsCount.length>0){
					$scope.rumChartData.visitorsCountChartData = $appedoUtils.changeFormatToArrayInJSON(data.dailyVisitorsCount);
					
					$scope.rumChartData.visitorsCountChartData.forEach(function(d) {
		    			totalVis =  totalVis + d.V;
		            });
				}
			}
			$scope.rumChartData.totalVisitor = totalVis;
		});
    };
	
    //
    $scope.getRUMLastReceivedOn = function() {
    	$scope.rumChartData.lastReceivedOn = '';
    	
    	rumService.getRUMLastReceivedOn($scope.selectedModuleUId, function(data){
    		 
			if( data.success ) {
				$scope.rumChartData.lastReceivedOn = data.message; 
			} else {
				// err
			}
    	});
    };
	
    $scope.clearRUMChartValues = function() {
    	$scope.rumChartData.pagesLoadTime = [];
    	$scope.rumChartData.visitorsCountChartData = [];
    	$scope.rumChartData.lastReceivedOn = '';
    	$scope.rumChartData.pageBreakDownData = [];
    	
    	clearDonutChartsData() ;
    };
	
	/*
	// CI 
    function getCIData(){
    	console.log("CIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIi");
    };*/
    
    $scope.loadCIDetails = function() {
    	$scope.getModuleAgentTypes();
    	$scope.getModuleEnvironments();
    	// commented due to load Events after selected agent_type
    	//$scope.getEventsSummary();
    };
    
    
    // 
    $scope.getModuleAgentTypes = function() {
    	$scope.moduleAgentTypes = [];
    	
    	rumService.getModuleAgentTypes($scope.selectedModuleUId, function(data) {
    		
			if(data.success) {
				$scope.moduleAgentTypes = data.message;
			} else {
				// TODO: err
			}
    	});
	};
    
	$scope.getModuleEnvironments = function() {
		$scope.moduleEnvironments = [];
		
    	rumService.getModuleEnvironments($scope.selectedModuleUId, function(data) {
    		
			if(data.success) {
				$scope.moduleEnvironments = data.message;
			} else {
				// TODO: err
			}
    	});
	};
	
	
	$scope.getSelectedAgentTypeEvents = function() {
    	$scope.getEventsSummary();
	};
    
    // gets Events Summary, bar chart
    $scope.getEventsSummary = function() {
    	var environmentValue = $scope.selectedModuleEnvironment == undefined ? null : $scope.selectedModuleEnvironment.envValue;
    	
    	rumService.getEventsSummary($scope.selectedModuleUId, $scope.sliderSelectedValue, $scope.selectedModuleAgentType.agentTypeValue, environmentValue, function(data) {
    		
			if(data.success) {
				$scope.ciChartData.eventsSummary = data.message;
			} else {
				// TODO: err
			}
    	});
    };
    
    
    
    $scope.loadSelectedEventDetails = function() {

		//$scope.selectedPage = url;
		$scope.selectedEvent = this.event;
		//$scope.selectedEventId = $scope.selectedPage.page;
		//$scope.selectedPageURL = url;
		
		// 
		$scope.getEventLoadTime();
		$scope.getCIDailyVisitorsCount();
		$scope.getBrowserWiseDonutData();
		$scope.getDeviceTypeWiseDonutData();
		$scope.getOSWiseDonutData();
		$scope.getDeviceNameWiseDonutData();
		$scope.getEventLastReceivedOn();
    };
    
    $scope.getEventLoadTime = function() {
    	rumService.getsEventLoadTime($scope.selectedModuleUId, $scope.selectedEvent.eventId, $scope.sliderSelectedValue, function(data) {

			if(data.success) {
				var chartdata = data.message.eventLoadTimeData;
				$scope.ciChartData.eventLoadTimeChartData = $appedoUtils.changeFormatToArrayInJSON(chartdata);
			} else {
				// TODO: err
			}
    	});
    };
    

	$scope.getCIDailyVisitorsCount = function() {
		
		rumService.getCIDailyVisitorsCount($scope.selectedModuleUId, $scope.selectedEvent.eventId, $scope.sliderSelectedValue, function(data) {

			if(data.success) {
				var chartdata = data.message.dailyVisitorsCount;
				$scope.ciChartData.dailyVisitorsCount = $appedoUtils.changeFormatToArrayInJSON(chartdata);
				
				var nTotalEventVisitors =0;
				chartdata.forEach(function(d) {
	    			nTotalEventVisitors = nTotalEventVisitors + d[1];
	            });
	    		$scope.totalEventVisitors =nTotalEventVisitors;
			} else {
				// TODO: err
			}
    	});
	};

	$scope.getBrowserWiseDonutData = function() {
		
		rumService.getBrowserWiseDonutData($scope.selectedModuleUId, $scope.selectedEvent.eventId, $scope.sliderSelectedValue, function(data) {

			if(data.success) {
				$scope.ciChartData.browserWiseDonutData = data.message;
			} else {
				// TODO: err
			}
    	});
	};

	$scope.getDeviceTypeWiseDonutData = function() {
		
		rumService.getDeviceTypeWiseDonutData($scope.selectedModuleUId, $scope.selectedEvent.eventId, $scope.sliderSelectedValue, function(data) {

			if(data.success) {
				$scope.ciChartData.deviceTypeWiseDonutData = data.message;
			} else {
				// TODO: err
			}
    	});
	};

	$scope.getOSWiseDonutData = function() {
		
		rumService.getOSWiseDonutData($scope.selectedModuleUId, $scope.selectedEvent.eventId, $scope.sliderSelectedValue, function(data) {

			if(data.success) {
				$scope.ciChartData.osWiseDonutData = data.message;
			} else {
				// TODO: err
			}
    	});
	};

	$scope.getDeviceNameWiseDonutData = function() {
		
		rumService.getDeviceNameWiseDonutData($scope.selectedModuleUId, $scope.selectedEvent.eventId, $scope.sliderSelectedValue, function(data) {
			if(data.success) {
				$scope.ciChartData.deviceNameWiseDonutData = data.message;
			} else {
				// TODO: err
			}
    	});
	};

	$scope.getEventLastReceivedOn = function() {

		rumService.getEventLastReceivedOn($scope.selectedModuleUId, $scope.selectedEvent.eventId, function(data) {
			if(data.success) {
				$scope.ciChartData.eventLastReceivedOn = data.message;
			} else {
				// TODO: err
			}
    	});
	};
	
	
    // clear values when moved to RUM
	$scope.clearCIValues = function() {

    	$scope.moduleAgentTypes = [];
		$scope.moduleEnvironments = [];
		
		$scope.ciChartData.eventsSummary = [];
		$scope.ciChartData.eventLoadTimeChartData = [];
		$scope.ciChartData.dailyVisitorsCount = [];
		$scope.ciChartData.browserWiseDonutData = [];
		$scope.ciChartData.deviceTypeWiseDonutData = [];
		$scope.ciChartData.osWiseDonutData = [];
		$scope.ciChartData.deviceNameWiseDonutData = [];
		$scope.ciChartData.eventLastReceivedOn = '';
    };
	
    
    

	// load initially when page refresh uidParam passed, since other scope functions not loaded, added 
	$scope.loadSelectedTypeDetails($scope.uidParam);
    
    
    // to destroy stored hidden params when transistion from `/#/rum_home` page
	$scope.$on('$destroy', function() {
		sessionServices.destroy("uid");
    });
}]);