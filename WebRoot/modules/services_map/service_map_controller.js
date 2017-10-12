appedoApp.controller('serviceMapController', ['$scope', 'serviceMapService','sessionServices', function( $scope, serviceMapService, sessionServices) {
    
	$scope.showServiceMapSum = false;
	$scope.showServiceMapRum = false;
	$scope.showServiceMapApp = false;
	$scope.showServiceMapSvr = false;
	$scope.showServiceMapDb = false;
	
	   
	var application;
	var server;
	var database;
	var sum;
	var rum;
	
	$scope.serviceMaps = [];
	$scope.selectedService;
	var resultSserviceMap;
    resultSserviceMap = serviceMapService.getServiceMapData();
    resultSserviceMap.then(function(resp) {
    	console.log(resp.message);
    	if(resp.success){
        	$scope.serviceMaps=resp.message;
        	$scope.selectedService=$scope.serviceMaps[0];

        	// 
        	loadModules();
    	}
    });
    
    $scope.selectedType = "dashboard";
    $scope.showDashboard =true;
    $scope.showPanel =false;
    $scope.loadServiceMap = function(){
    	if($scope.selectedType=='dashboard'){
    		 $scope.showDashboard =true;
    		    $scope.showPanel =false;
    	}else if($scope.selectedType=='panel'){
    		 $scope.showDashboard =false;
    		    $scope.showPanel =true;
    	}
    };
    
    function loadModules() {
    	//console.log(resp);
    	application=$scope.selectedService.mapped_service.APPLICATION || [];
    	server=$scope.selectedService.mapped_service.SERVER || [];
    	database=$scope.selectedService.mapped_service.DATABASE || [];
    	sum=$scope.selectedService.mapped_service.SUM || [];
    	rum=$scope.selectedService.mapped_service.RUM || [];
    	
    	/*
    	console.log(application.length);
    	console.log(server.length);
    	console.log(database.length);
    	console.log(sum.length);
    	console.log(rum.length);
    	*/
    	sessionServices.set("service_map_sum",JSON.stringify(sum));
    	sessionServices.set("service_map_rum",JSON.stringify(rum));
    	sessionServices.set("service_map_apm_app",JSON.stringify(application));
    	sessionServices.set("service_map_apm_svr",JSON.stringify(server));
    	sessionServices.set("service_map_apm_db",JSON.stringify(database));
    	
		var showAPMApp = sessionServices.get("showAPMApp");
		var showAPMSvr = sessionServices.get("showAPMSvr");
		var showAPMDb = sessionServices.get("showAPMDb");
		
//		console.log("showAPMApp : "+showAPMApp);
//		console.log("showAPMSvr : "+showAPMSvr);
//		console.log("showAPMDb : "+showAPMDb);
    	   
    	if(sum.length>0){
    		$scope.showServiceMapSum = true;
    	}

    	if(rum.length>0){
    		$scope.showServiceMapRum = true;
    	}

    	if( showAPMApp ){
        	if(application.length>0){
        		$scope.showServiceMapApp = true;
        	}
    	}

    	if( showAPMSvr ){
        	if(server.length>0){
        		$scope.showServiceMapSvr = true;
        	}
    	}

    	if( showAPMDb ){
    		if(database.length>0){
        		$scope.showServiceMapDb = true;
        	}
    	}
    }
    
//	var resultSserviceMap;
//    resultSserviceMap = serviceMapService.getServiceMapData();
//    resultSserviceMap.then(function(resp) {
//    	console.log(resp);
//    	application=resp.message.mapped_service.application;
//    	server=resp.message.mapped_service.server;
//    	database=resp.message.mapped_service.database;
//    	sum=resp.message.mapped_service.sum;
//    	rum=resp.message.mapped_service.rum;
//    	
//    	console.log(application.length);
//    	console.log(server.length);
//    	console.log(database.length);
//    	console.log(sum.length);
//    	console.log(rum.length);
//    	
//    	sessionServices.set("service_map_sum",JSON.stringify(sum));
//    	sessionServices.set("service_map_rum",JSON.stringify(rum));
//    	sessionServices.set("service_map_apm_app",JSON.stringify(application));
//    	sessionServices.set("service_map_apm_svr",JSON.stringify(server));
//    	sessionServices.set("service_map_apm_db",JSON.stringify(database));
//    	
//		var showAPMApp = sessionServices.get("showAPMApp");
//		var showAPMSvr = sessionServices.get("showAPMSvr");
//		var showAPMDb = sessionServices.get("showAPMDb");
//		
////		console.log("showAPMApp : "+showAPMApp);
////		console.log("showAPMSvr : "+showAPMSvr);
////		console.log("showAPMDb : "+showAPMDb);
//    	   
//    	if(sum.length>0){
//    		$scope.showServiceMapSum = true;
//    	}
//
//    	if(rum.length>0){
//    		$scope.showServiceMapRum = true;
//    	}
//
//    	if(showAPMApp==true){
//        	if(application.length>0){
//        		$scope.showServiceMapApp = true;
//        	}
//    	}
//
//    	if(showAPMSvr==true){
//        	if(server.length>0){
//        		$scope.showServiceMapSvr = true;
//        	}
//    	}
//
//    	if(showAPMDb==true){
//        	if(database.length>0){
//        		$scope.showServiceMapDb = true;
//        	}
//    	}
//    });
}]) ;


appedoApp.controller('serviceMapSumController', ['$scope', '$attrs', 'sumModuleServices', 'sessionServices',function($scope, $attrs, sumModuleServices, sessionServices) {
	var d3ChartTimeFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"));
    $scope.sumDurations = JSON.parse(sessionServices.get("sliderServerSideScale"));
    $scope.selectedSUMDuration = $scope.sumDurations[0];
	$scope.d3XaixsFormat = d3ChartTimeFormat[$scope.sumDurations.indexOf($scope.selectedSUMDuration)];
	
	$scope.userWebsiteCounterModules;
	$scope.selectedRUMDuration;
	$scope.selectedLocation;
	$scope.responseTimeChartData;
	
    $scope.userWebsiteCounterModules = [];
    var resultSUMDropdown = JSON.parse(sessionServices.get("service_map_sum"));
    if(resultSUMDropdown.length>0){
    	$scope.userWebsiteCounterModules = resultSUMDropdown;
    	$scope.selectedWebSite = $scope.userWebsiteCounterModules[0];
    	getSUMChartDataCall();
    };
    
	$scope.getSUMChartData = function(){
		getSUMChartDataCall();
    };
    function getSUMChartDataCall(){
    	$scope.selectedLocation = "All Locations";
        $scope.sumLocations = [];
    	$scope.d3XaixsFormat = d3ChartTimeFormat[$scope.sumDurations.indexOf($scope.selectedSUMDuration)];
    	getSUMMultiLineChartCall();
    }
    
    $scope.getSUMMultiLineChart = function(){
    	getSUMMultiLineChartCall();
    };
    
    function getSUMMultiLineChartCall(){
    	if($scope.selectedWebSite!=undefined){
        	var resultSUMMultiLine = sumModuleServices.getSUMMultiLine($scope.selectedWebSite.testid,'',$scope.selectedSUMDuration);
        	resultSUMMultiLine.then(function(resp) {
        		if(resp.success){
        			$scope.sumLocations = resp.message;
        			$scope.responseTimeChartData = resp.message;
        			$scope.responseTimeOriChartData = resp.message;
        		}
            });
    	}
    }
    
    $scope.getSelectedLocation = function(selectedLoc)
    {
    	if(selectedLoc=="All Locations"){
    		$scope.responseTimeChartData = $scope.responseTimeOriChartData;
    	}else{
    		var selectedResponseTimeCount = [];
    		for(var i=0; i< $scope.responseTimeOriChartData.length; i++) {
    			var moduleContent = $scope.responseTimeOriChartData[i];
    			if(moduleContent.City==selectedLoc){
    				selectedResponseTimeCount.push(moduleContent);
    				break;
    			}
    		}
    		$scope.responseTimeChartData = selectedResponseTimeCount;
    	}
    };
}]);

appedoApp.controller('serviceMapRumController', ['$scope', '$attrs', 'apmCardService', 'rumService', 'sessionServices', '$appedoUtils', function($scope, $attrs, apmCardService, rumService, sessionServices, $appedoUtils) {
	var d3ChartTimeFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"));
    $scope.rumDurations = JSON.parse(sessionServices.get("sliderServerSideScale"));
    $scope.selectedRUMDuration = $scope.rumDurations[0];
	$scope.d3XaixsFormat = d3ChartTimeFormat[$scope.rumDurations.indexOf($scope.selectedRUMDuration)];
	$scope.durationForDonut = $scope.rumDurations[0];

    $scope.userWebsiteCounterModules = [];
    var resultRUMDropdown = JSON.parse(sessionServices.get("service_map_rum"));
    if(resultRUMDropdown.length>0){
    	$scope.browserDonutData=[];
		$scope.deviceTypeDonutData=[];
		$scope.osDonutData=[];
    	$scope.userWebsiteCounterModules = resultRUMDropdown;
    	$scope.selectedWebSite = $scope.userWebsiteCounterModules[0];
    	$scope.uidForDonut = $scope.selectedWebSite.uid;
    	$scope.totalVisitor = 0;
        getRUMChartDataCall();
    };
 
	$scope.getRUMChartData = function(){
		getRUMChartDataCall();
    };
    
    function getRUMChartDataCall(){
    	getRUMAreaChartCall();
   	 	getRUMSummaryCall();
    }
    
    $scope.getRUMAreaChart= function(){
    	getRUMAreaChartCall();
    };
    
    function getRUMAreaChartCall(){
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
    }
    
    $scope.getRUMSummary = function(){
    	getRUMSummaryCall();
    };
    
    function getRUMSummaryCall(){
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
    }
}]);

appedoApp.controller('serviceMapAPMAppController', ['$scope', '$attrs', '$state', 'apmModulesService', 'apmModulesFactory', 'd3Service', 'sessionServices', function($scope, $attrs, $state, apmModulesService, apmModulesFactory, d3Service, sessionServices) {

    var timerChartsLoading;
    $scope.userApplicationCounterModules = [];
    $scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];

    var resultUserApplicationCounterModules = JSON.parse(sessionServices.get("service_map_apm_app"));
    if(resultUserApplicationCounterModules.length>0){
    	$scope.userApplicationCounterModules = resultUserApplicationCounterModules;
    	$scope.sectionSelectApp = $scope.userApplicationCounterModules[0];
    	getModuleCountersDataCall();
    };
   
    $scope.getModuleCountersData = function() {
    	getModuleCountersDataCall();
    };
    
    function getModuleCountersDataCall(){
    	var resultPrimaryCountersChartdata = apmModulesService.getPrimaryCountersChartdata($scope.sectionSelectApp.guid);
    	resultPrimaryCountersChartdata.then(function(resp) {
        	$scope.applicationPrimaryCountersChartdata = resp.message;
        	
        	for(var i = 0; i < $scope.applicationPrimaryCountersChartdata.length; i = i + 1) {
        		var joCounter = $scope.applicationPrimaryCountersChartdata[i];

        		joCounter.counterData = apmModulesFactory.appendZeroAtFirst(joCounter.counterData);

        		var aryCounterSet = joCounter.counterData[joCounter.counterData.length - 1];
        		joCounter.counterLastValue = aryCounterSet[aryCounterSet.length - 1].V;

        	}
        });
    	
    	var resultSecondaryCounters = apmModulesService.getSecondaryCountersData('APPLICATION', $scope.sectionSelectApp.guid);
    	resultSecondaryCounters.then(function(resp) {
    		$scope.apmAppSecSumData = resp;
    		$scope.getAppSecondaryData();
    	});
    	
		clearInterval(timerChartsLoading);
		timerChartsLoading = setInterval(getCountersNewData, sessionServices.get("graphRefresh"));
    }
    
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

						break;
					}
				}
			}

        });
    }
    
	$scope.$on('$destroy', function() {
		clearInterval(timerChartsLoading);
		clearTimeout(timerAppSecondaryData);
    });
}]);

appedoApp.controller('serviceMapAPMSvrController', ['$scope', '$attrs', '$state', 'apmModulesService', 'apmModulesFactory', 'd3Service', 'sessionServices', function($scope, $attrs, $state, apmModulesService, apmModulesFactory, d3Service, sessionServices) {

    var timerChartsLoading;
    
	$scope.userServerCounterModules = [];
    $scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
    
    var resultUserServerCounterModules = JSON.parse(sessionServices.get("service_map_apm_svr"));
    if(resultUserServerCounterModules.length>0){
    	$scope.userServerCounterModules = resultUserServerCounterModules;
    	$scope.sectionSelectSvr = $scope.userServerCounterModules[0];
    	getModuleCountersDataCall();
    };
   
    $scope.getModuleCountersData = function() {
    	getModuleCountersDataCall();
    };
    
    function getModuleCountersDataCall(){
    	
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
    
	$scope.$on('$destroy', function() {
		clearInterval(timerChartsLoading);
		clearTimeout(timerSvrSecondaryData);
    });
	

}]);

appedoApp.controller('serviceMapAPMDbController', ['$scope', '$attrs','$state', 'apmModulesService', 'apmModulesFactory', 'd3Service', 'sessionServices', '$timeout', function($scope, $attrs, $state, apmModulesService, apmModulesFactory, d3Service, sessionServices, $timeout) {

    var timerChartsLoading;
    
    $scope.userDatabaseCounterModules = [];
    $scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
    var resultUserDatabaseCounterModules = JSON.parse(sessionServices.get("service_map_apm_db"));
    if(resultUserDatabaseCounterModules.length>0){
    	$scope.userDatabaseCounterModules = resultUserDatabaseCounterModules;
    	$scope.sectionSelectDb = $scope.userDatabaseCounterModules[0];
    	getModuleCountersDataCall();
    };
   
    $scope.getModuleCountersData = function() {
    	getModuleCountersDataCall();
    };
    
    function getModuleCountersDataCall(){
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

appedoApp.controller("addServiceMapController", function($scope, moduleCardContent, $modalInstance, $modal, serviceMapService, 
serviceMapEditData, isFrom, successMsgService, $rootScope){
	$scope.moduleCardContent = moduleCardContent;
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.serviceMapData = {};
	if(isFrom == 'fromEdit') {
		$scope.serviceMapData.serviceMapName = serviceMapEditData.name;
		$scope.serviceMapData.serviceMapDescription = serviceMapEditData.description;
		$scope.serviceMapData.service_map_id = serviceMapEditData.serviceMapId;
		
		$scope.formName = "Edit";
        $scope.saveBtn = "Update";
        $scope.showProceed = false;
	} else {
		$scope.saveBtn = "Save";
		$scope.showProceed = true;
	}
	
	$scope.validateServiceMapName = function() {
		if($scope.serviceMapData.serviceMapName != '' && $scope.serviceMapData.serviceMapName != undefined) {
			serviceMapService.validateServiceMapName($scope, $scope.serviceMapData.serviceMapName, $scope.serviceMapData.service_map_id, function(data) {
	    		if(data.success){
	    			$scope.showProceed = data.message=="true"?true:false;
	    			if(data.message=='true'){
	    				$scope.response ={};
	            		$scope.response.success = false;
	            		$scope.response.errorMessage = $scope.serviceMapData.serviceMapName+" is already exists.";
	            		successMsgService.showSuccessOrErrorMsg($scope.response);
	    			}
	    		}else{
	    			$scope.showProceed = true;
	    		}
	    	});
		}
	};
	
	$scope.openServiceMapForm = function(){
		$rootScope.$on("close_servicemap_parent_popup", function(event){
			$modalInstance.dismiss('cancel');
		});
		var modalInstance = $modal.open({
	        templateUrl: 'modules/services_map/dashboard/service_mapping.html',
	        controller: 'serviceMapSelectionController',
	        size: 'lg',
	        resolve: {
	        	serviceAddData: function() {
	        		return $scope.serviceMapData
	        	}, 
	        	saveBtn: function() {
	            	return $scope.saveBtn;
	            }
	        }
		});
	};
});

appedoApp.controller("serviceMapSelectionController", function($scope, $modalInstance, $modal, serviceAddData, serviceMapService, ngToast, saveBtn, successMsgService, $rootScope){
	$scope.serviceMapData = {};
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.saveBtn = saveBtn;
	serviceMapService.getServicesData($scope, serviceAddData, function(){
	});
	
	
	$scope.saveServiceMap = function() {
		/*
		var joSelectedServiceMaps = {};
		var selectedmaps = [];
		for(var i = 0; i < $scope.servicesMap.length; i = i + 1) {
			var joMap = $scope.servicesMap[i];
			var arySelectedModules = []; 
			for(var j=0; j < joMap.modules.length; j = j + 1) {
				var joModule = joMap.modules[j];
				var joModules = {};
				if(joModule.isSelected) {
					//delete joModule.isSelected;
					joModules.module_code = joModule.module_code;
					if(joModule.uid){
						joModules.uid = joModule.uid;
					} else {
						joModules.test_id = joModule.test_id;
					}
					/*for(var key in joModule) {
						if ( key != 'isSelected' && key != '$$hashKey' ) {
							joModules[key] = joModule[key];
						}
					}* /
					selectedmaps.push(joModules);
					arySelectedModules.push(joModules);
				}
			}
			joSelectedServiceMaps[joMap.serviceType] = arySelectedModules;
		}
		*/
		
		var arySelectedMaps = [], joSelectedServiceMaps = {}, joSelectedModule = {};
		var moduleCode = '';
		for (var i = 0; i < $scope.servicesMap.length; i = i + 1) {
			var joMap = $scope.servicesMap[i];
			moduleCode = joMap.serviceType;
			
			//joSelectedMap = {};
			for(var j=0; j < joMap.modules.length; j = j + 1) {
				var joModule = joMap.modules[j];
				joSelectedModule = {}, joSelectedMap = {};
				
				if(joModule.isSelected) {
					joSelectedModule.module_code = moduleCode;
					if(joModule.uid){
						joSelectedModule.uid = joModule.uid;
					} else {
						joSelectedModule.test_id = joModule.test_id;
					}					
					
					joSelectedMap['module_master'] = joSelectedModule;
					
					// 
					arySelectedMaps.push(joSelectedMap);
				}
			}
		}
		
		var url = '', params = {};
		if(serviceAddData && serviceAddData.service_map_id){
			params = {
				serviceMapId: serviceAddData.service_map_id,
				serviceName: serviceAddData.serviceMapName,
				serviceDescription: serviceAddData.serviceMapDescription,
				//selectedServiceMaps: JSON.stringify(joSelectedServiceMaps),
				selectedServiceMaps: JSON.stringify( arySelectedMaps )
			};
			url = './service/updateServiceMap';
		} else {
			params = {
				serviceName: serviceAddData.serviceMapName,
				serviceDescription: serviceAddData.serviceMapDescription,
				//selectedServiceMaps: JSON.stringify(joSelectedServiceMaps)
				selectedServiceMaps: JSON.stringify( arySelectedMaps )
			};
			url = './service/addServiceMap';
		}
			
		if( arySelectedMaps && arySelectedMaps.length>0 ){
			serviceMapService.saveOrUpdateServiceMap($scope, params, url, function(data){
				successMsgService.showSuccessOrErrorMsg(data);
				if(data.success == true){
            		$rootScope.$emit('close_servicemap_parent_popup');
            		$modalInstance.dismiss();
            	}
			});
		} else {
			ngToast.create({
			className: 'warning',
			content:'Please select application',
			timeout: 3000,
			dismissOnTimeout: true,
			dismissButton: true,
			animation: 'fade'
			});
		}
	};
});

appedoApp.controller("ServiceMapCardController", function($scope, serviceMapService, $modal, successMsgService, $rootScope){
	$scope.getserviceMapCard = function() {
		serviceMapService.getServiceMapCardData($scope, function(resp){
			$scope.serviceMapCardData = resp;
			$scope.showCardEmptyMsg = false;
			if(resp && resp.length>0){
				$scope.showCardEmptyMsg = false;
			}else{
				$scope.showCardEmptyMsg = true;
			}
		});
	}
	$scope.openAddModuleType = function() {
		var modalInstance = $modal.open({
			templateUrl: 'common/views/select_module.html',
			controller: 'form_instance_controller',
			size: 'lg',
			backdrop : 'static'
		});
	};
	$scope.getserviceMapCard();
	var serviceMapcard = $rootScope.$on("close_servicemap_parent_popup", $scope.getserviceMapCard);
    $scope.$on('$destroy', serviceMapcard);
	
	$scope.serviceMapCardEdit = function() {
		var serviceMapEditData = this.serviceMap;
		var modalInstance = $modal.open({
			templateUrl: 'modules/services_map/dashboard/add_servicemap.html',
			controller: 'addServiceMapController',
			size: 'lg',
			resolve: {
				isFrom: function() {
					return 'fromEdit';
				},
				serviceMapEditData: function() {
					return serviceMapEditData;
				}, moduleCardContent: function() {
					return null;
				}
			}
		});
	};
	
	$scope.deleteSelecteServiceMap = function(index) {
		var result = confirm("Are you sure you want to delete?");
		if(result == true) {
			serviceMapService.deleteServiceMapRecord($scope, this.serviceMap.serviceMapId, function (response) {
				if(response.success == true){
					$scope.serviceMapCardData.splice(index,1);
				}
				successMsgService.showSuccessOrErrorMsg(response);
			});
		}
	};
});