appedoApp.controller( 'summaryController', ['$scope', 'apmModulesService', function( $scope, apmModulesService) {
	var resultAPMLicense = apmModulesService.getAPMLicense();
    resultAPMLicense.then(function(resp) {
     $scope.summarydata = resp;
    });
}]) ;

appedoApp.controller( 'dashSummaryController', ['$scope', 'apmModulesService', 'sessionServices', function( $scope, apmModulesService, sessionServices) {
	
	var resultDonutChartData;
	resultDonutChartData = apmModulesService.getDonutChartdata("APPLICATION");
    resultDonutChartData.then(function(resp) {
    	if(resp!=undefined){
 		   if(resp.success){
 		    	$scope.appDonutData=resp.message;
 		   }else{
 			    $scope.appDonutData=JSON.parse(sessionServices.get("noRecordForDonut"));
 		   }
 	   	}
    });
    
	resultDonutChartData="";
	resultDonutChartData = apmModulesService.getDonutChartdata("SERVER");
    resultDonutChartData.then(function(resp) {
    	if(resp!=undefined){
  		   if(resp.success){
  		    	$scope.svrDonutData=resp.message;
  		   }else{
			    $scope.svrDonutData=JSON.parse(sessionServices.get("noRecordForDonut"));
		   }
  	   	}
    });
    
    resultDonutChartData="";
	resultDonutChartData = apmModulesService.getDonutChartdata("DATABASE");
    resultDonutChartData.then(function(resp) {
    	if(resp!=undefined){
  		   if(resp.success){
  		    	$scope.dbDonutData=resp.message;
  		   }else{
			    $scope.dbDonutData=JSON.parse(sessionServices.get("noRecordForDonut"));
		   }
  	   	}
    });
    
}]) ;


appedoApp.controller( 'apmServerPrimaryController', ['$scope', '$attrs', 'ajaxCallService', 'getURLService', function( $scope, $attrs, ajaxCallService, getURLService) {
	var appURL;
	getURLService.getUrl($attrs.modtype,$attrs.acctype,$attrs.paneltype,function(responseData){
		appURL = responseData;
	}); 
	if(appURL!=""){
		ajaxCallService.getJsonData(appURL,function(responseData){
			$scope.apmserverprimarydata = responseData;
		}); 
	}
}]) ;


appedoApp.controller( 'apmServerSecondarySummaryController', ['$scope', '$attrs', 'ajaxCallService', 'getURLService', function( $scope, $attrs, ajaxCallService, getURLService) {
	var appURL;
	getURLService.getUrl($attrs.modtype,$attrs.acctype,$attrs.paneltype,function(responseData){
		appURL = responseData;
	}); 
	
	if(appURL!=""){
		ajaxCallService.getJsonData(appURL,function(responseData){
			$scope.apmserversecondarysummarydata = responseData;
		}); 
	}
}]) ;

/*  APM - Server End   */

/*  APM - DBs Start   */

appedoApp.controller( 'apmDBsPrimaryController', ['$scope', '$attrs', 'ajaxCallService', 'getURLService', function( $scope, $attrs, ajaxCallService, getURLService) {
	var appURL;
	getURLService.getUrl($attrs.modtype,$attrs.acctype,$attrs.paneltype,function(responseData){
		appURL = responseData;
	}); 
	if(appURL!=""){
		ajaxCallService.getJsonData(appURL,function(responseData){
			$scope.apmdbsprimarydata = responseData;
		}); 
	}
}]) ;


appedoApp.controller( 'apmDBsSecondarySummaryController', ['$scope', '$attrs', 'ajaxCallService', 'getURLService', function( $scope, $attrs, ajaxCallService, getURLService) {
	var appURL;
	getURLService.getUrl($attrs.modtype,$attrs.acctype,$attrs.paneltype,function(responseData){
		appURL = responseData;
	}); 
	if(appURL!=""){
		ajaxCallService.getJsonData(appURL,function(responseData){
			$scope.apmdbssecondarysummarydata = responseData;
		}); 
	}
}]) ;

/*  APM - DBs End   */
// tried, for single controller for Application/Server/Database in dashboard page, might use in future, TODO: in below controller to change based on slice/push
appedoApp.controller('apmDashPanel', ['$scope', '$attrs','$state', 'apmModulesService', 'apmModulesFactory', 'd3Service', 'sessionServices', '$timeout', function($scope, $attrs, $state, apmModulesService, apmModulesFactory, d3Service, sessionServices, $timeout) {

	
	console.info('$scope.moduleCode: '+$scope.moduleCode);
	
    var timerChartsLoading;
    
    $scope.userDatabaseCounterModules = [];
    $scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
    var resultUserDatabaseCounterModules = apmModulesService.getUserAddedCounterModules($scope.moduleCode);
    resultUserDatabaseCounterModules.then(function(resp) {
    	$scope.userDatabaseCounterModules = resp;
		
    	$scope.sectionSelectDb = $scope.userDatabaseCounterModules[0];
    	$scope.getModuleCountersData();
    });
    

    $scope.getModuleCountersData = function() {

    	var resultPrimaryCountersChartdata = apmModulesService.getPrimaryCountersChartdata($scope.sectionSelectDb.guid);
    	resultPrimaryCountersChartdata.then(function(resp) {
        	$scope.databasePrimaryCountersChartdata = resp.message;
        	

        	// last value for PrimaryCounter
        	for(var i = 0; i < $scope.databasePrimaryCountersChartdata.length; i = i + 1) {
        		var joCounter = $scope.databasePrimaryCountersChartdata[i];
        		
        		//var aryCounterData = joCounter.counterData;
        		//joCounter.counterLastValue = aryCounterData[aryCounterData.length - 1].value;

        		
        		// to set counter lastvalue as primary counter to display in UI
        		var aryCounterSet = joCounter.counterData[joCounter.counterData.length - 1];
        		joCounter.counterLastValue = aryCounterSet[aryCounterSet.length - 1].V;
        	}
        });

    	// get secondary data
    	var resultSecondaryCounters = apmModulesService.getSecondaryCountersData($scope.moduleCode, $scope.sectionSelectDb.guid);
    	resultSecondaryCounters.then(function(resp) {
    		$scope.apmDbSecSumData = resp;
        	$scope.getDbSecondaryData();
    	});
    	

    	// counter's new data are added into jo as `pushdata` per minute
		// loads for pushdata
		clearInterval(timerChartsLoading);
		timerChartsLoading = setInterval(getCountersNewData, sessionServices.get("graphRefresh"));
		//console.info('getCountersNewData:  graphRefresh: '+sessionServices.get("graphRefresh"));
    };

    var timerDbSecondaryData;
	$scope.getDbSecondaryData = function() {
    	clearTimeout(timerDbSecondaryData);
    	var strCounterIds='';
    	for (var i = 0; i < $scope.apmDbSecSumData.length; i = i + 1 ) {
			if ( i != 0 ) strCounterIds = strCounterIds + ',';
			var apmDbSecSumDataObj = $scope.apmDbSecSumData[i];
			strCounterIds = strCounterIds + apmDbSecSumDataObj.counter_id;
    	}
    	if(strCounterIds!=""){
        	var resultSecondaryCounters = apmModulesService.getSecondaryCountersValues($scope.moduleCode, $scope.sectionSelectDb.guid,strCounterIds);
        	resultSecondaryCounters.then(function(resp) {
        		if(resp!=undefined){
            		for (var i = 0; i < $scope.apmDbSecSumData.length; i = i + 1 ) {
    					var data = resp[i];
    					var apmDbSecSumDataObj = $scope.apmDbSecSumData[i];
    					if(data!=undefined){
    						apmDbSecSumDataObj.value = data.value;
    					}else{
    						apmDbSecSumDataObj.value = "NA";
    					}
    		 		}        			
        		}
        	});
    	}
    	timerDbSecondaryData = setTimeout($scope.getDbSecondaryData, sessionServices.get("textRefresh"));
    };

    // getsCountersNewData ToPush
    function getCountersNewData() {
    	for(var i = 0; i < $scope.databasePrimaryCountersChartdata.length; i = i + 1) {
    		var joCounterData = $scope.databasePrimaryCountersChartdata[i];
    		
    		getPushData($scope.sectionSelectDb.guid, joCounterData.counterId, joCounterData.maxTimeStamp);
    	}
    }
    

    // gets counterdata
    function getPushData(guid, counter_id, maxTimeStamp) {

		var resultCountersData =  apmModulesService.getModuleCountersChartdata(guid, counter_id, maxTimeStamp, null);
		resultCountersData.then(function(resp) {
			if( ! resp.success ) {
				// err
			} else {
	        	var joResp = resp.message;
	
				var joRespCountersData = resp.message;//.flotChartData;
				var joRespCountersChartData = joRespCountersData.chartdata;
				var joRespCountersException = joRespCountersData.countersException;
				var strRespAgentException = joRespCountersData.agentException || '';
	
				// To gets length of the JSON object
				var aryRespCounterIds = Object.keys(joRespCountersChartData);
				var nRespCounters = aryRespCounterIds.length;
				
				
				for(var i = 0; i < $scope.databasePrimaryCountersChartdata.length; i = i + 1) {
					var joCounterData = $scope.databasePrimaryCountersChartdata[i];
					
	
					// To set chart's maxTimeStamp and chartData for the response countername
					if( nRespCounters == 1 ) {
						// for single line chart 
						var respCounterId = aryRespCounterIds[0];
						if(joCounterData.counterId === respCounterId) {
							joCounterData.maxTimeStamp = joRespCountersData['max_recieved_on'];
							
							
							//$timeout(function() {
	
								var aryChartData = joCounterData.counterData || [];
								var aryRespCounterChartData = joRespCountersChartData[respCounterId];
								//
								var nRespCounterSetsLength = 0;
	
								if ( aryRespCounterChartData.length > 0 ) {
									
									//
									//aryChartData = aryChartData.slice( aryRespCounterChartData.length );
									
									
									// TODO: try to slice after data pushed, to avoid multiple time loop running for slice and push
									var aryCounterSet = [], j = 0;
									var aryPrevCounterSet = aryChartData[aryChartData.length - 1];
									var nPrevTime = aryPrevCounterSet[aryPrevCounterSet.length - 1].T, nCurrentFirstRespTime = aryRespCounterChartData[0][0].T;
									var nDiffInMin = Math.round( (nCurrentFirstRespTime - nPrevTime) / (1000 * 60) );
									// 1 refers to 1 minute
									if ( nDiffInMin < 1) {
										//
										j = 1;
										aryCounterSet = aryRespCounterChartData[0];
	
										// TODO: last data of prev ajax call and new ajax first resp are same, need to resolve
										nRespCounterSetsLength = nRespCounterSetsLength + aryCounterSet.length;
										aryChartData[aryChartData.length - 1] = aryPrevCounterSet.concat(aryCounterSet);
									}
									for (; j < aryRespCounterChartData.length; j = j + 1) {
										aryCounterSet = aryRespCounterChartData[j];
	
										nRespCounterSetsLength = nRespCounterSetsLength + aryCounterSet.length;
										aryChartData.push(aryCounterSet);
									}
									apmModulesFactory.sliceCounterSets(aryChartData, nRespCounterSetsLength);
	
	
							    	//console.info('bfr slice aryChartData');
							    	//console.info(aryChartData);
							    	
	/*// below working fine, commented to try after push/slice
									// slice
									for (j = 0; j < aryRespCounterChartData.length; j = j + 1) {
										nRespCounterSetsLength = nRespCounterSetsLength + aryRespCounterChartData[j].length;
									}
									//console.info('nRespCounterSetsLength: '+nRespCounterSetsLength);
									apmModulesFactory.sliceCounterSets(aryChartData, nRespCounterSetsLength);
									
	
									
									// push
									var aryCounterSet = [];
									for (j = 0; j < aryRespCounterChartData.length; j = j + 1) {
										aryCounterSet = aryRespCounterChartData[j];
										
										aryChartData.push(aryCounterSet);
									}
	*/								
									
									
									joCounterData.counterData = aryChartData;
	
							    	//console.info('after slice aryChartData');
							    	//console.info(joCounterData.counterData);
							    	
									//console.info('PUSH DATA: ');
									//console.info(joCounterData.counterData);
									
									// tried since last counterSets
									joCounterData.counterLastValue = aryCounterSet[aryCounterSet.length - 1].V;
								}
								
							//}, 0, false);
							
							break;
						}
					}
				}
			}
        });
    }
    
	$scope.openApmAllDetailGrpahs = function() {
		$state.transitionTo('/apm_all_details');
	};

	$scope.$on('$destroy', function() {
		clearInterval(timerChartsLoading);
		clearTimeout(timerDbSecondaryData);
    });
}]);


appedoApp.controller('apmDashPanel01', ['$scope', '$attrs', '$state', 'apmModulesService', 'apmModulesFactory', 'd3Service', 'sessionServices', function($scope, $attrs, $state, apmModulesService, apmModulesFactory, d3Service, sessionServices) {

    var timerChartsLoading;
    
    //$scope.divisor;
    
    $scope.userApplicationCounterModules = [];
    $scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
	//apmModulesService.getUserAddedCounterModules($scope, 'APPLICATION');
    // TODO: try based passing callBack fn. success 
    var resultUserApplicationCounterModules = apmModulesService.getUserAddedCounterModules('APPLICATION');
    resultUserApplicationCounterModules.then(function(resp) {
    	$scope.userApplicationCounterModules = resp;
		
    	$scope.sectionSelectApp = $scope.userApplicationCounterModules[0];
    	$scope.getModuleCountersData();
    });
    
    $scope.getModuleCountersData = function() {
    	
        // getsPrimaryCounters data 
    	var resultPrimaryCountersChartdata = apmModulesService.getPrimaryCountersChartdata($scope.sectionSelectApp.guid);
    	resultPrimaryCountersChartdata.then(function(resp) {
        	$scope.applicationPrimaryCountersChartdata = resp.message;
        	
        	// last value for PrimaryCounter
        	for(var i = 0; i < $scope.applicationPrimaryCountersChartdata.length; i = i + 1) {
        		var joCounter = $scope.applicationPrimaryCountersChartdata[i];

        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
        		joCounter.counterData = apmModulesFactory.appendZeroAtFirst(joCounter.counterData);

        		
        		// to set counter lastvalue as primary counter to display in UI
        		var aryCounterSet = joCounter.counterData[joCounter.counterData.length - 1];
        		joCounter.counterLastValue = aryCounterSet[aryCounterSet.length - 1].V;

/* future use
                var minData = d3.min(joCounter.counterData, function(d) { return d.value; });
                var maxData = d3.max(joCounter.counterData, function(d) { return d.value; });
                
                //var divisor; // This is to have the y axis value within 3 to 4 digits if above 100,000 dividing by 1000
                var yaxislabel, divisor; //y axis label modified after division

                if (Number(maxData)>=100000) {
                	divisor = 1000;
                	yaxislabel = "x 1000";

                } else {
                	divisor = 1;
                	yaxislabel = "";
                }

                
            	joCounter.counterData.forEach(function(d) {
                    d.time = new Date(d.time);
                    //d.value= Math.round(Number(d.value)/Number(divisor));
                    d.value= Math.round(Number(d.value)/Number(divisor));
                });
        		
                // 
        		joCounter.yaxislabel = yaxislabel;
        		joCounter.divisor = divisor;
*/
        	}
        });

    	
    	// get secondary data
    	var resultSecondaryCounters = apmModulesService.getSecondaryCountersData('APPLICATION', $scope.sectionSelectApp.guid);
    	resultSecondaryCounters.then(function(resp) {
    		$scope.apmAppSecSumData = resp;
    		$scope.getAppSecondaryData();
    	});
    	
    	// counter's new data are added into jo as `pushdata` per minute
		// loads for pushdata
		clearInterval(timerChartsLoading);
		timerChartsLoading = setInterval(getCountersNewData, sessionServices.get("graphRefresh"));
    };
    
    var timerAppSecondaryData;
	$scope.getAppSecondaryData = function() {
    	clearTimeout(timerAppSecondaryData);
    	var strCounterIds='';
    	for (var i = 0; i < $scope.apmAppSecSumData.length; i = i + 1 ) {
			if ( i != 0 ) strCounterIds = strCounterIds + ',';
			var apmAppSecSumDataObj = $scope.apmAppSecSumData[i];
			strCounterIds = strCounterIds + apmAppSecSumDataObj.counter_id;
    	}
    	if(strCounterIds!=""){
        	var resultSecondaryCounters = apmModulesService.getSecondaryCountersValues('APPLICATION', $scope.sectionSelectApp.guid, strCounterIds);
        	resultSecondaryCounters.then(function(resp) {
        		if(resp!=undefined){
            		for (var i = 0; i < $scope.apmAppSecSumData.length; i = i + 1 ) {
    					var data = resp[i];
    					var apmAppSecSumDataObj = $scope.apmAppSecSumData[i];
    					if(data!=undefined){
    						apmAppSecSumDataObj.value = data.value;
    					}else{
    						apmAppSecSumDataObj.value = "NA";
    					}
    		 		}        			
        		}
        	});
    	}
    	timerAppSecondaryData = setTimeout($scope.getAppSecondaryData, sessionServices.get("textRefresh"));
    };
    
    // getsCountersNewData ToPush
    function getCountersNewData() {
    	for(var i = 0; i < $scope.applicationPrimaryCountersChartdata.length; i = i + 1) {
    		var joCounterData = $scope.applicationPrimaryCountersChartdata[i];
    		
    		getPushData($scope.sectionSelectApp.guid, joCounterData.counterId, joCounterData.maxTimeStamp);
    	}
    }
    
    // gets counterdata
    function getPushData(guid, counter_id, maxTimeStamp) {

		var resultCountersData =  apmModulesService.getModuleCountersChartdata(guid, counter_id, maxTimeStamp, null);
		resultCountersData.then(function(resp) {
        	var joResp = resp.message;

			var joRespCountersData = resp.message;//.flotChartData;
			var joRespCountersChartData = joRespCountersData.chartdata;
			var joRespCountersException = joRespCountersData.countersException;
			var strRespAgentException = joRespCountersData.agentException || '';

			// To gets length of the JSON object
			var aryRespCounterIds = Object.keys(joRespCountersChartData);
			var nRespCounters = aryRespCounterIds.length;


			for(var i = 0; i < $scope.applicationPrimaryCountersChartdata.length; i = i + 1) {
				var joCounterData = $scope.applicationPrimaryCountersChartdata[i];


				// To set chart's maxTimeStamp and chartData for the response countername
				if( nRespCounters == 1 ) {
					// for single line chart 
					var respCounterId = aryRespCounterIds[0];
					if(joCounterData.counterId === respCounterId) {
						joCounterData.maxTimeStamp = joRespCountersData['max_recieved_on'];
						var aryChartData = joCounterData.counterData || [];
						var aryRespChartDataArrayInArray = joRespCountersChartData[respCounterId];
						var aryRespCounterChartData = joRespCountersChartData[respCounterId];

						var nRespCounterSetsLength = 0;

						if ( aryRespCounterChartData.length > 0 ) {

			        		
							// slice
							nRespCounterSetsLength = apmModulesFactory.getCounterSetsLength(aryRespCounterChartData);
							//console.info('nRespCounterSetsLength: '+nRespCounterSetsLength);
							aryChartData = apmModulesFactory.sliceCounterSets(aryChartData, nRespCounterSetsLength);

							// push
							aryChartData = apmModulesFactory.pushCounterSets(aryChartData, aryRespCounterChartData);

			        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
							aryChartData = apmModulesFactory.appendZeroAtFirst(aryChartData);


							joCounterData.counterData = aryChartData;
							
							var aryLastCounterSet = aryChartData[aryChartData.length - 1];
							joCounterData.counterLastValue = aryLastCounterSet[aryLastCounterSet.length - 1].V;

						}

/* future use
		                var minData = d3.min(aryNewChartData, function(d) { return d.value; });
		                var maxData = d3.max(aryNewChartData, function(d) { return d.value; });
		                
		                
		                aryNewChartData.forEach(function(d) {
		                    d.time = new Date(d.time);
		                    //d.value= Math.round(Number(d.value)/Number(divisor));
		                    d.value= Math.round(Number(d.value)/Number(joCounterData.divisor));
		                });
		        		
*/
						break;
					}
				}
			}

        });
    }
    
	$scope.openApmAllDetailGrpahs = function() {
		$state.transitionTo('/apm_all_details');
	};


	$scope.$on('$destroy', function() {
		clearInterval(timerChartsLoading);
		clearTimeout(timerAppSecondaryData);
    });
}]);

appedoApp.controller('apmDashPanel02', ['$scope', '$attrs', '$state', 'apmModulesService', 'apmModulesFactory', 'd3Service', 'sessionServices', function($scope, $attrs, $state, apmModulesService, apmModulesFactory, d3Service, sessionServices) {

    var timerChartsLoading;
    
	$scope.userServerCounterModules = [];
    $scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
    var resultUserServerCounterModules = apmModulesService.getUserAddedCounterModules('SERVER');
    resultUserServerCounterModules.then(function(resp) {
    	$scope.userServerCounterModules = resp;
		
    	$scope.sectionSelectSvr = $scope.userServerCounterModules[0];
    	$scope.getModuleCountersData();
    });
    
    $scope.getModuleCountersData = function() {
    	
    	var resultPrimaryCountersChartdata = apmModulesService.getPrimaryCountersChartdata($scope.sectionSelectSvr.guid);
    	resultPrimaryCountersChartdata.then(function(resp) {
        	$scope.serverPrimaryCountersChartdata = resp.message;
        	
        	// last value for PrimaryCounter
        	for(var i = 0; i < $scope.serverPrimaryCountersChartdata.length; i = i + 1) {
        		var joCounter = $scope.serverPrimaryCountersChartdata[i];

        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
        		joCounter.counterData = apmModulesFactory.appendZeroAtFirst(joCounter.counterData);

        		
        		// to set counter lastvalue as primary counter to display in UI
        		var aryCounterSet = joCounter.counterData[joCounter.counterData.length - 1];
        		joCounter.counterLastValue = aryCounterSet[aryCounterSet.length - 1].V;
        	}
        });
        
//    	 get secondary data
    	var resultSecondaryCounters = apmModulesService.getSecondaryCountersData('SERVER', $scope.sectionSelectSvr.guid);
    	resultSecondaryCounters.then(function(resp) {
    		$scope.apmSvrSecSumData = resp;
        	$scope.getSvrSecondaryData();
    	});
    	
    	
    	// counter's new data are added into jo as `pushdata` per minute
		// loads for pushdata
		clearInterval(timerChartsLoading);
		timerChartsLoading = setInterval(getCountersNewData, sessionServices.get("graphRefresh"));
    };
    
    var timerSvrSecondaryData;
	$scope.getSvrSecondaryData = function() {
    	clearTimeout(timerSvrSecondaryData);
    	var strCounterIds='';
    	for (var i = 0; i < $scope.apmSvrSecSumData.length; i = i + 1 ) {
			if ( i != 0 ) strCounterIds = strCounterIds + ',';
			var apmSvrSecSumDataObj = $scope.apmSvrSecSumData[i];
			strCounterIds = strCounterIds + apmSvrSecSumDataObj.counter_id;
    	}
    	if(strCounterIds!=""){
        	var resultSecondaryCounters = apmModulesService.getSecondaryCountersValues('SERVER', $scope.sectionSelectSvr.guid,strCounterIds);
        	resultSecondaryCounters.then(function(resp) {
        		if(resp!=undefined){
            		for (var i = 0; i < $scope.apmSvrSecSumData.length; i = i + 1 ) {
    					var data = resp[i];
    					var apmSvrSecSumDataObj = $scope.apmSvrSecSumData[i];
    					if(data!=undefined){
    						apmSvrSecSumDataObj.value = data.value;
    					}else{
    						apmSvrSecSumDataObj.value = "NA";
    					}
    		 		}        			
        		}
        	});
    	}
    	timerSvrSecondaryData = setTimeout($scope.getSvrSecondaryData, sessionServices.get("textRefresh"));
    };


    // getsCountersNewData ToPush
    function getCountersNewData() {
    	for(var i = 0; i < $scope.serverPrimaryCountersChartdata.length; i = i + 1) {
    		var joCounterData = $scope.serverPrimaryCountersChartdata[i];
    		
    		//console.info(joCounterData);
    		getPushData($scope.sectionSelectSvr.guid, joCounterData.counterId, joCounterData.maxTimeStamp);
    	}
    }
    

    // gets counterdata
    function getPushData(guid, counter_id, maxTimeStamp) {

		var resultCountersData =  apmModulesService.getModuleCountersChartdata(guid, counter_id, maxTimeStamp, null);
		resultCountersData.then(function(resp) {
        	var joResp = resp.message;

			var joRespCountersData = resp.message;//.flotChartData;
			var joRespCountersChartData = joRespCountersData.chartdata;
			var joRespCountersException = joRespCountersData.countersException;
			var strRespAgentException = joRespCountersData.agentException || '';

			// To gets length of the JSON object
			var aryRespCounterIds = Object.keys(joRespCountersChartData);
			var nRespCounters = aryRespCounterIds.length;
			

			
			for(var i = 0; i < $scope.serverPrimaryCountersChartdata.length; i = i + 1) {
				var joCounterData = $scope.serverPrimaryCountersChartdata[i];
				

				// To set chart's maxTimeStamp and chartData for the response countername
				if( nRespCounters == 1 ) {
					// for single line chart 
					var respCounterId = aryRespCounterIds[0];
					if(joCounterData.counterId === respCounterId) {
						joCounterData.maxTimeStamp = joRespCountersData['max_recieved_on'];
						var aryChartData = joCounterData.counterData || [];
						var aryRespCounterChartData = joRespCountersChartData[respCounterId];

						var nRespCounterSetsLength = 0;

						if ( aryRespCounterChartData.length > 0 ) {

			        		
							// slice
							nRespCounterSetsLength = apmModulesFactory.getCounterSetsLength(aryRespCounterChartData);
							//console.info('nRespCounterSetsLength: '+nRespCounterSetsLength);
							aryChartData = apmModulesFactory.sliceCounterSets(aryChartData, nRespCounterSetsLength);

							// push
							aryChartData = apmModulesFactory.pushCounterSets(aryChartData, aryRespCounterChartData);

			        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
							aryChartData = apmModulesFactory.appendZeroAtFirst(aryChartData);


							joCounterData.counterData = aryChartData;
							
							var aryLastCounterSet = aryChartData[aryChartData.length - 1];
							joCounterData.counterLastValue = aryLastCounterSet[aryLastCounterSet.length - 1].V;

						}
						
						break;
					}
				}
			}

        });
    }
    
	$scope.openApmAllDetailGrpahs = function() {
		$state.transitionTo('/apm_all_details');
	};

	$scope.$on('$destroy', function() {
		clearInterval(timerChartsLoading);
		clearTimeout(timerSvrSecondaryData);
    });
	

}]);

appedoApp.controller('apmDashPanel03', ['$scope', '$attrs','$state', 'apmModulesService', 'apmModulesFactory', 'd3Service', 'sessionServices', '$timeout', function($scope, $attrs, $state, apmModulesService, apmModulesFactory, d3Service, sessionServices, $timeout) {

    var timerChartsLoading;
    
    $scope.userDatabaseCounterModules = [];
    $scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
    var resultUserDatabaseCounterModules = apmModulesService.getUserAddedCounterModules('DATABASE');
    resultUserDatabaseCounterModules.then(function(resp) {
    	$scope.userDatabaseCounterModules = resp;
		
    	$scope.sectionSelectDb = $scope.userDatabaseCounterModules[0];
    	$scope.getModuleCountersData();
    });
    

    $scope.getModuleCountersData = function() {

    	var resultPrimaryCountersChartdata = apmModulesService.getPrimaryCountersChartdata($scope.sectionSelectDb.guid);
    	resultPrimaryCountersChartdata.then(function(resp) {
        	$scope.databasePrimaryCountersChartdata = resp.message;
        	

        	// last value for PrimaryCounter
        	for(var i = 0; i < $scope.databasePrimaryCountersChartdata.length; i = i + 1) {
        		var joCounter = $scope.databasePrimaryCountersChartdata[i];
        		
        		
        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
        		joCounter.counterData = apmModulesFactory.appendZeroAtFirst(joCounter.counterData);

        		
        		// to set counter lastvalue as primary counter to display in UI
        		var aryCounterSet = joCounter.counterData[joCounter.counterData.length - 1];
        		joCounter.counterLastValue = aryCounterSet[aryCounterSet.length - 1].V;
        	}
        });

    	// get secondary data
    	var resultSecondaryCounters = apmModulesService.getSecondaryCountersData('DATABASE', $scope.sectionSelectDb.guid);
    	resultSecondaryCounters.then(function(resp) {
    		$scope.apmDbSecSumData = resp;
        	$scope.getDbSecondaryData();
    	});
    	

    	// counter's new data are added into jo as `pushdata` per minute
		// loads for pushdata
		clearInterval(timerChartsLoading);
		timerChartsLoading = setInterval(getCountersNewData, sessionServices.get("graphRefresh"));
		//console.info('getCountersNewData:  graphRefresh: '+sessionServices.get("graphRefresh"));
    };

    var timerDbSecondaryData;
	$scope.getDbSecondaryData = function() {
    	clearTimeout(timerDbSecondaryData);
    	var strCounterIds='';
    	for (var i = 0; i < $scope.apmDbSecSumData.length; i = i + 1 ) {
			if ( i != 0 ) strCounterIds = strCounterIds + ',';
			var apmDbSecSumDataObj = $scope.apmDbSecSumData[i];
			strCounterIds = strCounterIds + apmDbSecSumDataObj.counter_id;
    	}
    	if(strCounterIds!=""){
        	var resultSecondaryCounters = apmModulesService.getSecondaryCountersValues('DATABASE', $scope.sectionSelectDb.guid,strCounterIds);
        	resultSecondaryCounters.then(function(resp) {
        		if(resp!=undefined){
            		for (var i = 0; i < $scope.apmDbSecSumData.length; i = i + 1 ) {
    					var data = resp[i];
    					var apmDbSecSumDataObj = $scope.apmDbSecSumData[i];
    					if(data!=undefined){
    						apmDbSecSumDataObj.value = data.value;
    					}else{
    						apmDbSecSumDataObj.value = "NA";
    					}
    		 		}        			
        		}
        	});
    	}
    	timerDbSecondaryData = setTimeout($scope.getDbSecondaryData, sessionServices.get("textRefresh"));
    };

    // getsCountersNewData ToPush
    function getCountersNewData() {
    	for(var i = 0; i < $scope.databasePrimaryCountersChartdata.length; i = i + 1) {
    		var joCounterData = $scope.databasePrimaryCountersChartdata[i];
    		
    		getPushData($scope.sectionSelectDb.guid, joCounterData.counterId, joCounterData.maxTimeStamp);
    	}
    }
    

    // gets counterdata
    function getPushData(guid, counter_id, maxTimeStamp) {

		var resultCountersData =  apmModulesService.getModuleCountersChartdata(guid, counter_id, maxTimeStamp, null);
		resultCountersData.then(function(resp) {
			if( ! resp.success ) {
				// err
			} else {
	        	var joResp = resp.message;
	
				var joRespCountersData = resp.message;//.flotChartData;
				var joRespCountersChartData = joRespCountersData.chartdata;
				var joRespCountersException = joRespCountersData.countersException;
				var strRespAgentException = joRespCountersData.agentException || '';
	
				// To gets length of the JSON object
				var aryRespCounterIds = Object.keys(joRespCountersChartData);
				var nRespCounters = aryRespCounterIds.length;
				
				
				for(var i = 0; i < $scope.databasePrimaryCountersChartdata.length; i = i + 1) {
					var joCounterData = $scope.databasePrimaryCountersChartdata[i];
					
	
					// To set chart's maxTimeStamp and chartData for the response countername
					if( nRespCounters == 1 ) {
						// for single line chart 
						var respCounterId = aryRespCounterIds[0];
						if(joCounterData.counterId === respCounterId) {
							joCounterData.maxTimeStamp = joRespCountersData['max_recieved_on'];
							
							
							//$timeout(function() {
	
								var aryChartData = joCounterData.counterData || [];
								var aryRespCounterChartData = joRespCountersChartData[respCounterId];
								//
								var nRespCounterSetsLength = 0;
	
								if ( aryRespCounterChartData.length > 0 ) {
									
									//
									//aryChartData = aryChartData.slice( aryRespCounterChartData.length );
									
									
									// TODO: try to slice after data pushed, to avoid multiple time loop running for slice and push
									
/* tried to slice after push, thinks in a conidtion in slice method `aryCounterSet.length < nRespCounterSetsLength` since pushed new pushed data might lost
 * 									var aryCounterSet = [], j = 0;
									var aryPrevCounterSet = aryChartData[aryChartData.length - 1];
									var nPrevTime = aryPrevCounterSet[aryPrevCounterSet.length - 1].T, nCurrentFirstRespTime = aryRespCounterChartData[0][0].T;
									var nDiffInMin = Math.round( (nCurrentFirstRespTime - nPrevTime) / (1000 * 60) );
									// 1 refers to 1 minute
									if ( nDiffInMin < 1) {
										//
										j = 1;
										aryCounterSet = aryRespCounterChartData[0];
	
										// TODO: last data of prev ajax call and new ajax first resp are same, need to resolve
										nRespCounterSetsLength = nRespCounterSetsLength + aryCounterSet.length;
										aryChartData[aryChartData.length - 1] = aryPrevCounterSet.concat(aryCounterSet);
									}
									for (; j < aryRespCounterChartData.length; j = j + 1) {
										aryCounterSet = aryRespCounterChartData[j];
	
										nRespCounterSetsLength = nRespCounterSetsLength + aryCounterSet.length;
										aryChartData.push(aryCounterSet);
									}
							    	//console.info('Database respCounterId : '+ respCounterId);
									apmModulesFactory.sliceCounterSets(aryChartData, nRespCounterSetsLength);
*/	
	
							    	//console.info('bfr slice aryChartData');
							    	//console.info(aryChartData);

									// slice
									/*for (var j = 0; j < aryRespCounterChartData.length; j = j + 1) {
										nRespCounterSetsLength = nRespCounterSetsLength + aryRespCounterChartData[j].length;
									}*/


					        		
									// slice
									nRespCounterSetsLength = apmModulesFactory.getCounterSetsLength(aryRespCounterChartData);
									//console.info('nRespCounterSetsLength: '+nRespCounterSetsLength);
									aryChartData = apmModulesFactory.sliceCounterSets(aryChartData, nRespCounterSetsLength);

									// push
									aryChartData = apmModulesFactory.pushCounterSets(aryChartData, aryRespCounterChartData);

					        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
									//joCounterData.counterData = apmModulesFactory.appendZeroAtFirst(joCounterData.counterData);
									aryChartData = apmModulesFactory.appendZeroAtFirst(aryChartData);


									joCounterData.counterData = aryChartData;
									
									var aryLastCounterSet = aryChartData[aryChartData.length - 1];
									joCounterData.counterLastValue = aryLastCounterSet[aryLastCounterSet.length - 1].V;

/* below commentted part added to function
									// push 
									var aryCounterSet = [], j = 0;
									// to push into last counter set, if diff between prev set's last datum time & current set first datum time is less than 1 min, `1` refers to 1 minute,
									if ( aryChartData.length > 0 ) {
										var aryPrevCounterSet = aryChartData[aryChartData.length - 1];
										var nPrevTime = aryPrevCounterSet[aryPrevCounterSet.length - 1].T, nCurrentFirstRespTime = aryRespCounterChartData[0][0].T;
										var nDiffInMin = Math.round( (nCurrentFirstRespTime - nPrevTime) / (1000 * 60) );
										
										if ( nDiffInMin < 1 ) {
											//
											j = 1;
											aryCounterSet = aryRespCounterChartData[0];
											aryChartData[aryChartData.length - 1] = aryPrevCounterSet.concat(aryCounterSet);
										}
									}
									for (; j < aryRespCounterChartData.length; j = j + 1) {
										aryCounterSet = aryRespCounterChartData[j];
										aryChartData.push(aryCounterSet);
									}

									joCounterData.counterData = aryChartData;
									
									// tried since last counterSets
									//joCounterData.counterLastValue = aryCounterSet[aryCounterSet.length - 1].V;
									
									var aryLastCounterSet = aryChartData[aryChartData.length - 1];
									joCounterData.counterLastValue = aryLastCounterSet[aryLastCounterSet.length - 1].V;
*/									
								}
								
							//}, 0, false);
							
							break;
						}
					}
				}
			}
        });
    }
    
	$scope.openApmAllDetailGrpahs = function() {
		$state.transitionTo('/apm_all_details');
	};

	$scope.$on('$destroy', function() {
		clearInterval(timerChartsLoading);
		clearTimeout(timerDbSecondaryData);
    });
}]);

appedoApp.controller('apmDetailsController', ['$scope','sessionServices', 'apmModulesService', 'ajaxCallService', 'sliderFactory', '$appedoUtils', 'successMsgService', '$state', 'apmModulesFactory', function ($scope, sessionServices, apmModulesService, ajaxCallService, sliderFactory, $appedoUtils, successMsgService, $state, apmModulesFactory) {

	var timerChartsLoading;
	
	$scope.addChartToDashboard = function(){
		var counterDatas = this.counterData;
		var resultAddChartToDashboard;
		resultAddChartToDashboard = apmModulesService.addChartToDashboard($scope.selectedAppCardContent.guid,counterDatas.counter_id);
		resultAddChartToDashboard.then(function(resp) {
	    	if(resp.success){
	    		counterDatas.show_in_dashboard = true;
	    	}
	    	successMsgService.showSuccessOrErrorMsg(resp);
	    });
	};

	$scope.removeChartToDashboard = function(){
		var counterDatas = this.counterData;
		var resultRemoveChartToDashboard;
		resultRemoveChartToDashboard = apmModulesService.removeChartToDashboard($scope.selectedAppCardContent.guid,counterDatas.counter_id);
		resultRemoveChartToDashboard.then(function(resp) {
	    	if(resp.success){
	    		counterDatas.show_in_dashboard = false;
	    	}
	    	successMsgService.showSuccessOrErrorMsg(resp);
	    });
	};
	
	$scope.selectedDetailsModule = sessionServices.get("selectedModule");
	$scope.selectedAppCardContent = JSON.parse(sessionServices.get("selectedAppCardContent"));
	
	$scope.backToApmCardPage = function() {
		if($scope.selectedDetailsModule == 'Applications'){
			$state.transitionTo('/apm_home/application');
		} else if($scope.selectedDetailsModule == 'Servers'){
			$state.transitionTo('/apm_home/servers');
		} else if($scope.selectedDetailsModule == 'Databases'){
			$state.transitionTo('/apm_home/db');
		} 
	};
	
	$scope.sliderValue = "1";
	$scope.sliderOptions = sliderFactory.sliderOptions;

	$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[0];
	$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
	
	var radioURL="";
	
	//
	$scope.profilerPanel = {};
	$scope.profilerData = {};
	
	
	if($scope.selectedDetailsModule=="Applications") {
		radioURL = "common/data/apm_app_monitor_radio_value.json";
	} else if ($scope.selectedDetailsModule=="Servers") {
		radioURL = "common/data/apm_svr_monitor_radio_value.json";
	} else if ($scope.selectedDetailsModule=="Databases") {
		radioURL = "common/data/apm_db_monitor_radio_value.json";
	}
	
	$scope.apmMonitorRadio = 'MONITOR';
	if(radioURL!=""){
		ajaxCallService.getJsonData(radioURL,function(responseData){
			if($scope.selectedDetailsModule=="Databases"){
				if($scope.selectedAppCardContent.type=="Postgres"){
					$scope.apmRadioButtonValues = responseData;
				}else {
					for (var i = 0; i < responseData.length; i++) {
				        var curVal = responseData[i];
				        if (curVal.value == "SLOW_QUERY") {
				            responseData.splice(i, 1);
				            break;
				        }
				    }
					$scope.apmRadioButtonValues = responseData;
				}
			} else {
				$scope.apmRadioButtonValues = responseData;
			}
			//$scope.selectedAPMRadioValue = responseData[0].value;
		}); 
	}
	
	$scope.showMonitor = true;
	$scope.showSlowQuery = false;
	$scope.showTransaction = false;
	getGraphData();
	
	$scope.handleRadioClick = function(selectedValue){
//		if(selectedValue.value=="TRANSACTION"){
//			$scope.showMonitor = false;
//			$scope.showSlowQuery = false;
//			$scope.showTransaction = true;
//		}else if(selectedValue.value=="SLOW_QUERY"){
//			$scope.showMonitor = false;
//			$scope.showSlowQuery = true;
//			$scope.showTransaction = false;
//			getSlowQueryData();
//		}else if(selectedValue.value=="MONITOR"){
//			$scope.showMonitor = true;
//			$scope.showSlowQuery = false;
//			$scope.showTransaction = false;
//			getGraphData();
//		}
		
/*
		if(selectedValue!=$scope.selectedAPMRadioValue){
			$scope.selectedAPMRadioValue = selectedValue.value;
			if(selectedValue.value=="TRANSACTION"){
				$scope.showMonitor = false;
				$scope.showSlowQuery = false;
				$scope.showTransaction = true;
			}else if(selectedValue.value=="SLOW_QUERY"){
				$scope.showMonitor = false;
				$scope.showSlowQuery = true;
				$scope.showTransaction = false;
				getSlowQueryData();
			}else if(selectedValue.value=="MONITOR"){
				$scope.showMonitor = true;
				$scope.showSlowQuery = false;
				$scope.showTransaction = false;
				getGraphData();
			}
		}
*/

		if( $scope.apmMonitorRadio == "TRANSACTION" ){
			$scope.showMonitor = false;
			$scope.showSlowQuery = false;
			$scope.showTransaction = true;
			
			$scope.loadProfilerDetails();
		} else if( $scope.apmMonitorRadio == "SLOW_QUERY" ){
			$scope.showMonitor = false;
			$scope.showSlowQuery = true;
			$scope.showTransaction = false;
			
			getSlowQueryData();
		} else if( $scope.apmMonitorRadio =="MONITOR" ){
			$scope.showMonitor = true;
			$scope.showSlowQuery = false;
			$scope.showTransaction = false;
			
			getGraphData();
		}
		// 
		//$scope.loadSelectedDetails();
    };
    
	$scope.$watch('sliderValue',function(newVal){
		if(newVal){
			if(newVal=="1"){
				$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[0];
				$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
			}else{
				$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[(newVal/$scope.sliderOptions.step)];
				$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[(newVal/$scope.sliderOptions.step)];
			}
			
			/*
			if($scope.selectedAPMRadioValue=="TRANSACTION") {
				$scope.loadProfilerDetails();
			} else if($scope.selectedAPMRadioValue=="SLOW_QUERY") {
				getSlowQueryData();
			} else if($scope.selectedAPMRadioValue=="MONITOR") {
				getGraphData();
			}
			*/
			$scope.loadSelectedDetails();
        }
     });
    
	
	$scope.loadSelectedDetails = function() { 
		if($scope.apmMonitorRadio=="MONITOR") {
			getGraphData();
		} else if($scope.apmMonitorRadio=="TRANSACTION") {
			$scope.loadProfilerDetails();
		} else if($scope.apmMonitorRadio=="SLOW_QUERY") {
			getSlowQueryData();
		}
	};
	
    function getGraphData(){
    	// gets selected counters, after resp gets respective counter's chart data
    	var resultSelectedCounterSummary = apmModulesService.getSelectedCounterSummary($scope.selectedAppCardContent.guid);
    	resultSelectedCounterSummary.then(function(resp) {
    		var aryCounterSummary = resp.message;
    		
    		/*
    		aryCounterSummary.forEach(function(joCounterSummary) {
    			// gets counter's chartdata
    			$scope.getModuleCountersChartdata($scope.selectedAppCardContent.guid, joCounterSummary);
    		});
 			*/
    		
    		// TODO: Thinks instead of sorting manually, order by query 
        	$scope.applicationPrimaryCountersdata = sortData(aryCounterSummary);
        	function sortData(data) {
        	    var sorted = [];
        	    Object.keys(data).sort(function(a,b){
        	        return data[a].category < data[b].category ? -1 : 1;
        	    }).forEach(function(key){
        	        sorted.push(data[key]);
        	    });
        	    return sorted;
        	}

    		// get counters chart data
    		$scope.loadCountersChartdata();
        });
	}

	// get counters chart data
    $scope.loadCountersChartdata = function() {
		clearTimeout(timerChartsLoading);

		// get counters chart data
		for(var i = 0; i < $scope.applicationPrimaryCountersdata.length; i = i + 1) {
    		var joCounterSummary = $scope.applicationPrimaryCountersdata[i];
    		
    		// get counter chart data
    		$scope.getModuleCountersChartdata($scope.selectedAppCardContent.guid, joCounterSummary.counter_id, joCounterSummary.maxTimeStamp != undefined ? joCounterSummary.maxTimeStamp : null);
    	}

		
		// timer chart refresh for last `1 hour`
		if ( $scope.sliderSelectedValue == '1 hour') {
			timerChartsLoading = setTimeout($scope.loadCountersChartdata, sessionServices.get("graphRefresh"));
		}
    };
    
    // gets counter chartdata
    $scope.getModuleCountersChartdata = function(guid, counter_id, maxTimeStamp) {
    	// TODO: thinks, to check for respective `joCounterSummary`'s chart response data is updated in respective jo

		var resultModuleCountersChartdata = apmModulesService.getModuleCountersChartdata(guid, counter_id, maxTimeStamp, $scope.sliderSelectedValue);
		resultModuleCountersChartdata.then(function(respGraph) {
			if( ! respGraph.success ) {
				// error msg
			} else {
				
				
				var joResp = respGraph.message;
				var joRespCountersChartData = joResp.chartdata;
				var joRespCountersException = joResp.countersException;
				var strRespAgentException = joResp.agentException || '';

				// To gets length of the JSON object
				var aryRespCounterIds = Object.keys(joRespCountersChartData);
				var nRespCounters = aryRespCounterIds.length;
				
				// sets 
	    		//joCounterSummary.maxTimeStamp = joResp.max_recieved_on;
	    		//joCounterSummary.graphData = joRespCountersChartData[joCounterSummary.counter_id];

				
	    		// TODO: push

				for (var i = 0; i < $scope.applicationPrimaryCountersdata.length; i = i + 1) {
					var joCounterData = $scope.applicationPrimaryCountersdata[i];
					
					joCounterData.maxTimeStamp = joResp['max_recieved_on'];
					
					if( nRespCounters == 1 ) {

						// 
						var respCounterId = aryRespCounterIds[0];
						

						var nRespCounterSetsLength = 0;
						if ( joCounterData['counter_id'] == respCounterId) {
							var aryRespCounterChartData = joRespCountersChartData[respCounterId];
							
							//
							var aryChartData = joCounterData['graphData'] || [];
							
							if ( aryChartData.length > 0 ) {

								if ( aryRespCounterChartData.length > 0 ) {
					        		
									// slice
									nRespCounterSetsLength = apmModulesFactory.getCounterSetsLength(aryRespCounterChartData);
									//console.info('nRespCounterSetsLength: '+nRespCounterSetsLength);
									aryChartData = apmModulesFactory.sliceCounterSets(aryChartData, nRespCounterSetsLength);

									// push
									aryChartData = apmModulesFactory.pushCounterSets(aryChartData, aryRespCounterChartData);

					        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
									aryChartData = apmModulesFactory.appendZeroAtFirst(aryChartData);
								}
							} else {
								aryChartData = aryRespCounterChartData;
							}

							joCounterData['graphData'] = aryChartData;
							
							break;
						}
					} else {
						// TODO: for multi counters response
						break;
					}
				}
	    		
	    		//console.info('joCounterSummary.graphData: '+JSON.stringify(joCounterSummary.graphData));
	    		
				/*
				var jsonGraphObj = [];
				var data = respGraph.message.chartdata[joCounterSummary.counter_id];
	    		data.forEach(function(d1) {
	    			graphItem = {};
	    			graphItem ["time"] = d1[0];
	    			graphItem ["value"] = d1[1];
	    	        jsonGraphObj.push(graphItem);
	            });*/
			}
	    });
    };
    
    // gets expensive queries
	function getSlowQueryData(){
    	var resultSlowQuerydata = apmModulesService.getSlowQueryData($scope.selectedAppCardContent.guid, $scope.sliderSelectedValue, $scope.selectedAppCardContent.type);
    	resultSlowQuerydata.then(function(resp) {
        	$scope.slowSQLQueryData = resp.message;
        });
    }
	
	
	// Profiler
	$scope.loadProfilerDetails = function() {
		$scope.clearProfilerValue();
		
		//
		$scope.getProfilerTransactions();
	};
	
	// 
	$scope.getProfilerTransactions = function() {
		
		apmModulesService.getProfilerTransactions($scope.selectedAppCardContent.guid, $scope.selectedAppCardContent.type, $scope.sliderSelectedValue, function(data){
			
			if ( data.success ) {
				$scope.profilerData.transactionsData = data.message;
			} else {
				// err 
			}
		});
	};
	
	$scope.getProfilerTransactionTimeTaken = function() {
		$scope.selectedTransaction = this.transaction;

		// clear methodes trace
		$scope.profilerPanel.showMethodTrace = false;
		$scope.profilerData.methodsTrace = [];
		
		$scope.profilerPanel.showTransactionTimeTaken = true;
		$scope.profilerData.transactionTimeTakenData = [];
		
		apmModulesService.getProfilerTransactionTimeTaken($scope.selectedAppCardContent.guid, $scope.selectedAppCardContent.type, $scope.selectedTransaction.localhost_name_ip, $scope.selectedTransaction.transactionName, $scope.sliderSelectedValue, function(data){
			
			if ( data.success ) {
				var chartData = data.message;
				$scope.profilerData.transactionTimeTakenData = $appedoUtils.changeFormatToArrayInJSON(chartData);
			} else {
				// err 
			}
		});
	};
	
	$scope.getProfilerMethodTrace = function(time, duration) {

		$scope.profilerPanel.showMethodTrace = true; 
		
		apmModulesService.getProfilerMethodTrace($scope.selectedAppCardContent.guid, $scope.selectedAppCardContent.type, $scope.selectedTransaction.localhost_name_ip, $scope.selectedTransaction.transactionName, time, duration, function(data){
			//$scope.profilerData.methodsTrace = data;
			//$scope.profilerData.methodsTrace = [{"id":1,"title":"Item 1","items":[]},{"id":2,"title":"Item 2","items":[{"id":21,"title":"Item 2.1","items":[{"id":211,"title":"Item 2.1.1","items":[]},{"id":212,"title":"Item 2.1.2","items":[]}]},{"id":22,"title":"Item 2.2","items":[{"id":221,"title":"Item 2.2.1","items":[]},{"id":222,"title":"Item 2.2.2","items":[]}]}]},{"id":3,"title":"Item 3","items":[]},{"id":4,"title":"Item 4","items":[{"id":41,"title":"Item 4.1","items":[]}]},{"id":5,"title":"Item 5","items":[]},{"id":6,"title":"Item 6","items":[]},{"id":7,"title":"Item 7","items":[]}];
			
			if ( data.success ) {
				$scope.profilerData.methodsTrace = data.message;
				
				// sample format
				/*$scope.profilerData.methodsTrace = [
		        {
		            "id": 710518,
		            "type": "SERVLET",
		            "query": "",
		            "showText": "com.appedo.controller.ModuleCountersController.doGet",
		            "duration": 6518,
		            "time_trace": 46529493,
		            "exception_type": "",
		            "exception_message": "",
		            "exception_stacktrace": "",
		            "items": [
		                {
		                    "id": 710515,
		                    "type": "METHOD",
		                    "query": "",
		                    "showText": "com.appedo.controller.ModuleCountersController.doAction",
		                    "duration": 6517,
		                    "time_trace": 46529494,
		                    "exception_type": "",
		                    "exception_message": "",
		                    "exception_stacktrace": "",
		                    "items": [
		                        {
		                            "id": 710499,
		                            "type": "METHOD",
		                            "query": "",
		                            "showText": "com.appedo.bean.LoginUserBean.toJSON",
		                            "duration": 0,
		                            "time_trace": 46529494,
		                            "exception_type": "",
		                            "exception_message": "",
		                            "exception_stacktrace": "",
		                            "items": []
		                        },
		                        {
		                            "id": 710500,
		                            "type": "METHOD",
		                            "query": "",
		                            "showText": "com.appedo.utils.UtilsFactory.clearCollectionHieracy",
		                            "duration": 0,
		                            "time_trace": 46529494,
		                            "exception_type": "",
		                            "exception_message": "",
		                            "exception_stacktrace": "",
		                            "items": []
		                        },
		                        {
		                            "id": 710516,
		                            "type": "METHOD",
		                            "query": "",
		                            "showText": "com.appedo.utils.UtilsFactory.clearCollectionHieracy",
		                            "duration": 0,
		                            "time_trace": 46536011,
		                            "exception_type": "",
		                            "exception_message": "",
		                            "exception_stacktrace": "",
		                            "items": []
		                        },
		                        {
		                            "id": 710517,
		                            "type": "METHOD",
		                            "query": "",
		                            "showText": "com.appedo.utils.UtilsFactory.clearCollectionHieracy",
		                            "duration": 0,
		                            "time_trace": 46536011,
		                            "exception_type": "",
		                            "exception_message": "",
		                            "exception_stacktrace": "",
		                            "items": []
		                        }
		                    ]
		                }
		            ]
		        }
		    ];*/
			} else {
				// err 
			}
		});
	};
	
	$scope.clearProfilerValue = function() {
		$scope.profilerData.transactionsData = [];
		
		$scope.profilerPanel.showTransactionTimeTaken = false;
		$scope.profilerData.transactionTimeTakenData = [];
		
		// clear methodes trace
		$scope.profilerPanel.showMethodTrace = false;
		$scope.profilerData.methodsTrace = [];
	};

	
	$scope.$on('$destroy', function() {
		clearTimeout(timerChartsLoading);
    });
}]);

appedoApp.controller('apmCardController', ['$scope', 'apmCardService', '$location', '$state', 'sessionServices', '$modal', 'ngToast', '$rootScope', 'successMsgService', function ($scope, apmCardService, $location, $state, sessionServices, $modal, ngToast, $rootScope, successMsgService) {
	var moduleType = '';
	var url = $location.url();
	if(url=="/apm_home/application") {
		$scope.currentModule = "Applications";
		moduleType="APPLICATION";
	} else if (url=="/apm_home/servers") {
		$scope.currentModule = "Servers";
		moduleType="SERVER";
	} else if (url=="/apm_home/db") {
		$scope.currentModule = "Databases";
		moduleType="DATABASE";
	}
	
	$scope.openAddModuleType = function() {
		var modalInstance = $modal.open({
			templateUrl: 'common/views/select_module.html',
			controller: 'form_instance_controller',
			size: 'lg',
			backdrop : 'static'
		});
	};
	
	// grid details
	$scope.getModules = function () {
		apmCardService.populateApmCardData($scope, moduleType, function(apmCardData) {
			$scope.appcardscontent = apmCardData.moduleData;
			$scope.showCard = false;
			$scope.showCardEmptyMsg = false;
			if($scope.appcardscontent.length >0){
				$scope.showCard = true;
			}else {
				$scope.showCardEmptyMsg = true;
			}
			$scope.getModuleCounterDataAndAgentStatus();
			//$scope.enableModuleProfiler();
		});
	};
	$scope.getModules();
	//for refresh the card layout after Add
	var apmCard = $rootScope.$on("load_apm_card_layout", $scope.getModules);
    $scope.$on('$destroy', apmCard);
	
	
	// DD license
	$scope.getDDUserLicenseDetails = function() {
		apmCardService.getDDUserLicenseDetails(function(data) {

	 		if( ! data.success) {
    			//showMessage.setMessage({level:'bg-error-message', text: data.errorMessage});
	 			// err
	 		} else {
	 			// note: tried, license available to send joParam, if expired to send as empty string ""
	 			$scope.ddLicenseDetails = data.message;

	 			//
	 			$scope.isDDLicenseExpired = ($scope.ddLicenseDetails instanceof Object?false:true);
	 			
	 			// APM's slider is used for deep dive 
    		}
		});
	};
	//$scope.getDDUserLicenseDetails();
	
	
	// profiler is enabled from the first to user's license maxProfiler
	$scope.enableModuleProfiler = function() {
		
		for (var i = 0; i < $scope.appcardscontent.length; i = i + 1 ) {
			//if ( ! $scope.isDDLicenseExpired && ( ($scope.offset + i) < $scope.ddLicenseDetails.maxProfilers || $scope.ddLicenseDetails.maxProfilers === -1 ) ) {
			
			if ( ! $scope.isDDLicenseExpired && ( i < $scope.ddLicenseDetails.maxProfilers || $scope.ddLicenseDetails.maxProfilers === -1 ) ) {
				var joModule = $scope.appcardscontent[i];
				joModule.enableProfiler = true;
			} else {
				break;
			}
		}
		
		$scope.$apply();
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
		apmCardService.updateApmModule($scope, this.appcardcontent, moduleType, function (data) {
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
			$scope.moduleName = this.appcardcontent.moduleName;
			apmCardService.deleteModuleRow($scope, this.appcardcontent, moduleType, function (response) {
				var msg = "";
				if($scope.currentModule == "Applications") {
					msg = "Application "+ $scope.moduleName + " has been deleted successfully.";
				} else if($scope.currentModule == "Servers") {
					msg = "Server "+ $scope.moduleName + " has been deleted successfully.";
				} else if($scope.currentModule == "Databases") {
					msg = "Database "+ $scope.moduleName + " has been deleted successfully.";
				}
				if(response.success == true){
					ngToast.create({
					className: 'success',
					content: msg,
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
					});
					$scope.appcardscontent.splice(index,1);
				} else {
					ngToast.create({
					className: 'warning',
					content: "Unable to delete.",
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
					});
				}
			});
		}
	};
	
	$scope.getConfiguredCounters = function() {
		var currentAppCardContent = this.appcardcontent;
			var modalInstance = $modal.open({
				templateUrl: 'common/views/configure_counters.html',
				controller: 'configure_counters_controller',
				size: 'lg',
				resolve: {
					appcardcontent: function() {
						return currentAppCardContent;
					},
					moduleType: function() {
						return moduleType;
					}
				}
			});
	};
	var timerAgentStatus;
	$scope.getModuleCounterDataAndAgentStatus = function() {
		clearTimeout(timerAgentStatus);
		var jsonObj = [];
		
		for (var i = 0; i < $scope.appcardscontent.length; i = i + 1 ) {
			var joModule = $scope.appcardscontent[i];
			guids = {};
			guids ["guid"] = joModule.guid;
			guids ["counter_id"] = joModule.counter_id_1+','+joModule.counter_id_2;
			jsonObj.push(guids);
		}
		
		if($scope.appcardscontent.length>0){
			var resultModuleCounterDataAndAgentStatus = apmCardService.getModuleCounterDataAndAgentStatusService(jsonObj);
			resultModuleCounterDataAndAgentStatus.then(function(moduleCounterDataAndAgentStatus) {
				for (var i = 0; i < $scope.appcardscontent.length; i = i + 1 ) {
					var data = moduleCounterDataAndAgentStatus[i];
					var joModule = $scope.appcardscontent[i];
					if(data!=undefined){
			 			joModule.value_1 = data[joModule.guid].value_1;
			 			joModule.value_2 = data[joModule.guid].value_2;
			 			joModule.monitor_active = data[joModule.guid].monitor_active;
			 			joModule.profiler_active = data[joModule.guid].profiler_active;
					}else{
			 			joModule.value_1 = "NA";
			 			joModule.value_2 = "NA";
			 			joModule.monitor_active = false;
			 			joModule.profiler_active = false;
					}
		 		}
	        });
		}
		timerAgentStatus = setTimeout($scope.getModuleCounterDataAndAgentStatus, sessionServices.get("textRefresh"));
	};

	
	$scope.downloaProfiler = function() {
		var currentAppCardContent = this.appcardcontent;
		
		//ng-href="./apm/downloadAgent?downloadtype=profiler&type={{appcardcontent.type}}&guid={{appcardcontent.guid}}&modulename={{appcardcontent.moduleName}}{{appcardcontent.type === 'MSIIS'?'&clrVersion='+appcardcontent.clrVersion:''}}" 
		
		if ( currentAppCardContent.type == 'JBoss' ) {
			ngToast.create({
				className: 'warning',
				content: "JBoss profiler will be available soon.",
				timeout: 3000,
				dismissOnTimeout: true,
				dismissButton: true,
				animation: 'fade'
			});
			return false;
		} else {
			window.open('./apm/downloadAgent?downloadtype=profiler&type='+currentAppCardContent.type+'&guid='+currentAppCardContent.guid+'&modulename='+currentAppCardContent.moduleName+(currentAppCardContent.type === 'MSIIS' ?'&clrVersion='+currentAppCardContent.clrVersion:''));
		}
	};
	
	$scope.openModuleDetailGrpahs = function() {
		sessionServices.set("selectedModule",$scope.currentModule);
		sessionServices.set("selectedAppCardContent", JSON.stringify(this.appcardcontent));
		$state.transitionTo('/apm_details');
	};
	
	$scope.$on('$destroy', function() {
		clearTimeout(timerAgentStatus);
    });
	
}]);

appedoApp.controller('configure_counters_controller', ['$scope', 'apmCardService', '$modalInstance', 'appcardcontent', 'moduleType', 
function ($scope, apmCardService, $modalInstance, appcardcontent, moduleType) {
	$scope.configCounter = {};
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
	apmCardService.getConfiguredCategories($scope, appcardcontent, function() {
	});
	
	$scope.saveConfigureCounters = function() {
		// if($scope.configureCounters.$valid) {
			var selectedCounterIds = [];
			
			for(var i = 0; i < $scope.configuredCategories.length; i = i + 1) {
				var categoriesData = $scope.configuredCategories[i];
				for(var j=0; j < categoriesData.counters.length; j=j+1){
					if(categoriesData.counters[j].isSelected) {
						selectedCounterIds.push(categoriesData.counters[j].counter_id);
					}
				}
			}
			apmCardService.saveConfiguredCategories($scope, appcardcontent, moduleType, selectedCounterIds, function(updatedData) {
				$scope.configCountersErrorMsg = false;
				if(updatedData.success == true) {
					alert(updatedData.message);
					$modalInstance.dismiss('cancel');
				} else {
					$scope.showConfigCountersErrorMsg = true;
					$scope.ConfigCountersErrorMsg = updatedData.errorMessage;
				}
			});
		// }
	};
}]);

appedoApp.controller('apmAllDetailsController', ['$scope','sessionServices' ,'apmCardService','apmModulesService', 'successMsgService', 'apmModulesFactory', function ($scope, sessionServices, apmCardService, apmModulesService, successMsgService, apmModulesFactory) {
	
	$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
	
	apmCardService.populateApmCardData($scope, 'APPLICATION', function(apmAppData) {
		var appPrimaryCountersChartdataJSONArray=[];
		var appPrimaryCountersChartdataJSONObj;
		var resultPrimaryCountersdata;
		var resultPrimaryCountersChartdata;
		apmAppData.moduleData.forEach(function(apmAppContent) {
			resultPrimaryCountersdata = apmModulesService.getPrimaryCountersForAllDetailsPage(apmAppContent.guid);
			resultPrimaryCountersdata.then(function(resp) {
				if(resp.success){
					if(resp.message.length>0){
						resp.message.forEach(function(counter) {
							resultPrimaryCountersChartdata = apmModulesService.getModuleCountersChartdata(apmAppContent.guid, counter.counter_id, null, null);
			    			resultPrimaryCountersChartdata.then(function(respGraph) {
			    				if(respGraph.success)
			    				{
			    					/*
				    				var jsonGraphObj = [];
									var data = respGraph.message.chartdata[counter.counter_id];
						    		data.forEach(function(d1) {
						    			graphItem = {};
						    			graphItem ["time"] = d1[0];
						    			graphItem ["value"] = d1[1];
						    	        jsonGraphObj.push(graphItem);
						            });*/

			    	        		var data = respGraph.message.chartdata[counter.counter_id];

			    	        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
			    	        		data = apmModulesFactory.appendZeroAtFirst(data);

						    		appPrimaryCountersChartdataJSONObj={};
				    				appPrimaryCountersChartdataJSONObj["moduleType"]='APPLICATION';
				    				appPrimaryCountersChartdataJSONObj["title"]=apmAppContent.moduleName;
				    				appPrimaryCountersChartdataJSONObj["guid"]=apmAppContent.guid;
				    				appPrimaryCountersChartdataJSONObj["category"]=counter.category;
				    				appPrimaryCountersChartdataJSONObj["display_name"]=counter.display_name;
				    				appPrimaryCountersChartdataJSONObj["show_in_dashboard"]=counter.show_in_dashboard;
				    				appPrimaryCountersChartdataJSONObj["counter_id"]=counter.counter_id;
				    				appPrimaryCountersChartdataJSONObj["graphData"] = data;
				    				appPrimaryCountersChartdataJSONArray.push(appPrimaryCountersChartdataJSONObj);
				    				$scope.appPrimaryCountersChartdata = appPrimaryCountersChartdataJSONArray;
			    				}
			    			});
						});
					}
				}
			});
	    });
	});

	apmCardService.populateApmCardData($scope, 'SERVER', function(apmsvrData) {
		var svrPrimaryCountersChartdataJSONArray=[];
		var svrPrimaryCountersChartdataJSONObj;
		var resultPrimaryCountersdata;
		var resultPrimaryCountersChartdata;
		apmsvrData.moduleData.forEach(function(apmsvrContent) {
			resultPrimaryCountersdata = apmModulesService.getPrimaryCountersForAllDetailsPage(apmsvrContent.guid);
			resultPrimaryCountersdata.then(function(resp) {
				if(resp.success){
					if(resp.message.length>0){
						resp.message.forEach(function(counter) {
							resultPrimaryCountersChartdata = apmModulesService.getModuleCountersChartdata(apmsvrContent.guid, counter.counter_id, null, null);
			    			resultPrimaryCountersChartdata.then(function(respGraph) {
			    				if(respGraph.success)
			    				{
			    					/*
				    				var jsonGraphObj = [];
									var data = respGraph.message.chartdata[counter.counter_id];
						    		data.forEach(function(d1) {
						    			graphItem = {};
						    			graphItem ["time"] = d1[0];
						    			graphItem ["value"] = d1[1];
						    	        jsonGraphObj.push(graphItem);
						            });*/
			    	        		var data = respGraph.message.chartdata[counter.counter_id];

			    	        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
			    	        		data = apmModulesFactory.appendZeroAtFirst(data);
			    	        		
						    		svrPrimaryCountersChartdataJSONObj={};
						    		svrPrimaryCountersChartdataJSONObj["moduleType"]='SERVER';
				    				svrPrimaryCountersChartdataJSONObj["title"]=apmsvrContent.moduleName;
				    				svrPrimaryCountersChartdataJSONObj["guid"]=apmsvrContent.guid;
				    				svrPrimaryCountersChartdataJSONObj["category"]=counter.category;
				    				svrPrimaryCountersChartdataJSONObj["display_name"]=counter.display_name;
				    				svrPrimaryCountersChartdataJSONObj["show_in_dashboard"]=counter.show_in_dashboard;
				    				svrPrimaryCountersChartdataJSONObj["counter_id"]=counter.counter_id;
				    				svrPrimaryCountersChartdataJSONObj["graphData"] = data;
				    				svrPrimaryCountersChartdataJSONArray.push(svrPrimaryCountersChartdataJSONObj);
				    				$scope.svrPrimaryCountersChartdata = svrPrimaryCountersChartdataJSONArray;
			    				}
			    			});
						});
					}
				}
			});
	    });
	});
	
	apmCardService.populateApmCardData($scope, 'DATABASE', function(apmdbData) {
		var dbPrimaryCountersChartdataJSONArray=[];
		var dbPrimaryCountersChartdataJSONObj;
		var resultPrimaryCountersdata;
		var resultPrimaryCountersChartdata;
		apmdbData.moduleData.forEach(function(apmdbContent) {
			resultPrimaryCountersdata = apmModulesService.getPrimaryCountersForAllDetailsPage(apmdbContent.guid);
			resultPrimaryCountersdata.then(function(resp) {
				if(resp.success){
					if(resp.message.length>0){
						resp.message.forEach(function(counter) {
							resultPrimaryCountersChartdata = apmModulesService.getModuleCountersChartdata(apmdbContent.guid, counter.counter_id, null, null);
			    			resultPrimaryCountersChartdata.then(function(respGraph) {
			    				if(respGraph.success)
			    				{
			    					/*
				    				var jsonGraphObj = [];
									var data = respGraph.message.chartdata[counter.counter_id];
						    		data.forEach(function(d1) {
						    			graphItem = {};
						    			graphItem ["time"] = d1[0];
						    			graphItem ["value"] = d1[1];
						    	        jsonGraphObj.push(graphItem);
						            });*/
			    	        		var data = respGraph.message.chartdata[counter.counter_id];

			    	        		// to append zero at first, if diff between now() - first point in arraySet < 60 min, for last 1 hour
			    	        		data = apmModulesFactory.appendZeroAtFirst(data);
			    	        		
						    		dbPrimaryCountersChartdataJSONObj={};
						    		dbPrimaryCountersChartdataJSONObj["moduleType"]='DATABASE';
				    				dbPrimaryCountersChartdataJSONObj["title"]=apmdbContent.moduleName;
				    				dbPrimaryCountersChartdataJSONObj["guid"]=apmdbContent.guid;
				    				dbPrimaryCountersChartdataJSONObj["category"]=counter.category;
				    				dbPrimaryCountersChartdataJSONObj["display_name"]=counter.display_name;
				    				dbPrimaryCountersChartdataJSONObj["show_in_dashboard"]=counter.show_in_dashboard;
				    				dbPrimaryCountersChartdataJSONObj["counter_id"]=counter.counter_id;
				    				dbPrimaryCountersChartdataJSONObj["graphData"] = data;
				    				dbPrimaryCountersChartdataJSONArray.push(dbPrimaryCountersChartdataJSONObj);
				    				$scope.dbPrimaryCountersChartdata = dbPrimaryCountersChartdataJSONArray;
			    				}
			    			});
						});
					}
				}
			});
	    });
	});
	
	$scope.addChartToDashboard = function(){
		var counterDatas = this.counterData;
		var resultAddChartToDashboard;
		resultAddChartToDashboard = apmModulesService.addChartToDashboard(counterDatas.guid,counterDatas.counter_id);
		resultAddChartToDashboard.then(function(resp) {
	    	if(resp.success){
	    		counterDatas.show_in_dashboard = true;
	    	}
	    	successMsgService.showSuccessOrErrorMsg(resp);
	    });
	};

	$scope.removeChartToDashboard = function(){
		var counterDatas = this.counterData;
		var resultRemoveChartToDashboard;
		resultRemoveChartToDashboard = apmModulesService.removeChartToDashboard(counterDatas.guid,counterDatas.counter_id);
		resultRemoveChartToDashboard.then(function(resp) {
	    	if(resp.success){
	    		if(counterDatas.moduleType=="APPLICATION"){
	    			for(var i = 0; i < $scope.appPrimaryCountersChartdata.length; i = i + 1) {
		    			var primaryContent = $scope.appPrimaryCountersChartdata[i];
		    			if(primaryContent.counter_id==counterDatas.counter_id){
		    				$scope.appPrimaryCountersChartdata.splice(i,1);
		    			}
		        	}
	    		}else if(counterDatas.moduleType=="SERVER"){
	    			for(var i = 0; i < $scope.svrPrimaryCountersChartdata.length; i = i + 1) {
		    			var primaryContent = $scope.svrPrimaryCountersChartdata[i];
		    			if(primaryContent.counter_id==counterDatas.counter_id){
		    				$scope.svrPrimaryCountersChartdata.splice(i,1);
		    			}
		        	}
	    		}else if(counterDatas.moduleType=="DATABASE"){
	    			for(var i = 0; i < $scope.dbPrimaryCountersChartdata.length; i = i + 1) {
		    			var primaryContent = $scope.dbPrimaryCountersChartdata[i];
		    			if(primaryContent.counter_id==counterDatas.counter_id){
		    				$scope.dbPrimaryCountersChartdata.splice(i,1);
		    			}
		        	}
	    		}
	    		counterDatas.show_in_dashboard = false;
	    	}
	    	successMsgService.showSuccessOrErrorMsg(resp);
	    });
	};

}]);
