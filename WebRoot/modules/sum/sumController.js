appedoApp.controller( 'sumSummaryController', ['$scope', 'sumModuleServices', 'sessionServices', function( $scope, sumModuleServices, sessionServices) {
	
	var resultSUMLicense = sumModuleServices.getSUMLicense();
    resultSUMLicense.then(function(resp) {
     $scope.summarydata = resp;
    });

    var resultDonutChartData;
	resultDonutChartData = sumModuleServices.getDonutChartdata("TestStatus");
    resultDonutChartData.then(function(resp) {
    	if(resp!=undefined){
  		   if(resp.success){
  			   $scope.cTextCompletedDonutData = findAndRemove(resp.message,'label','Total');
  			   $scope.completedDonutData=resp.message;
		   }else{
			    $scope.completedDonutData=JSON.parse(sessionServices.get("noRecordForDonut"));
		   }
  	   	}
    });
    
	resultDonutChartData="";
	resultDonutChartData = sumModuleServices.getDonutChartdata("Mst");
    resultDonutChartData.then(function(resp) {
    	if(resp!=undefined){
   		   if(resp.success){
  			   $scope.cTextAvailableDonutData = findAndRemove(resp.message,'label','Total');
   			   $scope.availableDonutData=resp.message;
		   }else{
			    $scope.availableDonutData=JSON.parse(sessionServices.get("noRecordForDonut"));
		   }
   	   	}
    });
    
    resultDonutChartData="";
	resultDonutChartData = sumModuleServices.getDonutChartdata("TestType");
    resultDonutChartData.then(function(resp) {
    	if(resp!=undefined){
   		   if(resp.success){
			   $scope.cTextUrlDonutData = findAndRemove(resp.message,'label','Total');
			   $scope.urlDonutData=resp.message;
		   }else{
			    $scope.urlDonutData=JSON.parse(sessionServices.get("noRecordForDonut"));
		   }
   	   	}
    });
}]) ;

function findAndRemove(array, property, value) {
	var cTextInfiStatus=0;
	$.each(array, function(index, result) {
		if(result[property] == value) {
			//Remove from array
			array.splice(index, 1);
			cTextInfiStatus=-1;
		}    
	});
	return cTextInfiStatus;
}

appedoApp.controller('sumHomeController', ['$scope', '$modal', 'sumModuleServices', 'ngToast', 'sessionServices', '$state', '$rootScope', function($scope, $modal, sumModuleServices, ngToast, sessionServices, $state, $rootScope) {
	
	$scope.sumTests = [];
	
	$scope.openAddModuleType = function() {
		var modalInstance = $modal.open({
			templateUrl: 'common/views/select_module.html',
			controller: 'form_instance_controller',
			size: 'lg',
			backdrop : 'static'
		});
	};
	$scope.getSUMTests = function() {
		sumModuleServices.getSUMUserTests(function(data) {
			$scope.sumTests = data.message;
			$scope.showCard = false;
			$scope.showCardEmptyMsg = false;
			if(data.success == true && $scope.sumTests.length >0){
				$scope.showCard = true;
			}else {
				$scope.showCardEmptyMsg = true;
			}
		});
	};
	$scope.getSUMTests();
	//for refresh the card layout after Add/Update
	var sumCard = $rootScope.$on("close_sum_parent_popup", $scope.getSUMTests);
    $scope.$on('$destroy', sumCard);
	/*var reload = $rootScope.$on("close_sum_parent_popup", function(event){
		sumModuleServices.getSUMUserTests(function(data) {
			$scope.sumTests = data.message;
		});
		event.preventDefault();
		reload();
	});*/

	// tried for modal dont commit
	$scope.sumModal = function() {
		var modalInstance = $modal.open({
				templateUrl: 'common/views/sumForm.html',
				//controller: 'add_module_controller',
				size: 'lg',
				resolve: {				
				}
		});
	};
	
	$scope.deleteSelectedSum = function(index) {
			var result = confirm("You will lose sum records permanently!\nAre you sure you want to delete?");
			if(result == true) {
				sumModuleServices.deleteSumRecord($scope, this.test.testid, function (response) {
					if(response.success == true){
						ngToast.create({
						className: 'success',
						content: response.message,
						timeout: 3000,
						dismissOnTimeout: true,
						dismissButton: true,
						animation: 'fade'
						});
						$scope.sumTests.splice(index,1);
					} else {
						ngToast.create({
						className: 'warning',
						content: response.errorMessage,
						timeout: 3000,
						dismissOnTimeout: true,
						dismissButton: true,
						animation: 'fade'
						});
					}
				});
			}
	};
	
	$scope.editSum = function() {
		var testData = this.test;
		var modalInstance = $modal.open({
			templateUrl: 'modules/sum/view/add_sum_test.html',
			controller: 'addSumController',
			size: 'lg',
			resolve: {
				isFrom: function() {
					return 'fromEdit';
				},
				sumTestData: function() {
					return testData;
				}, moduleCardContent: function() {
					return null;
				}
			}
		});
	};
	
	$scope.openModuleDetailGrpahs = function(index) {
		sessionServices.set("selectedSumCardContent", JSON.stringify(this.test));
		$state.transitionTo('/sum_details');
	};

}]);

appedoApp.controller('addSumController', ['$scope', '$modal', 'sumModuleServices', '$modalInstance', 'isFrom', 'sumTestData', 'moduleCardContent', 'ngToast', '$rootScope', 'successMsgService',
  function($scope, $modal, sumModuleServices, $modalInstance, isFrom, sumTestData, moduleCardContent, ngToast, $rootScope, successMsgService) {
    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.moduleCardContent = moduleCardContent;
    $scope.curdate;
    $scope.today = function() {
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        currentDate = new Date();
        $scope.curdate = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear();
       };
    $scope.today();

    sumModuleServices.getPackages($scope);
    function formateDate(date){
        	months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	        currentDate = date;
	        var formatedDate = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear();
	        return formatedDate;
    };
    
    $scope.showProceed = true;
    
    $scope.validateSUMTestName = function () {
    	if($scope.sumTestAddData.testName != undefined && $scope.sumTestAddData.testName != ""){
	    	sumModuleServices.validateSUMTestName($scope, $scope.sumTestAddData.testName, $scope.sumTestAddData.testid, function(data) {
	    		if(data.success){
	    			$scope.showProceed = data.isvalid;
	    			if(data.isvalid){
	    				$scope.response ={};
	            		$scope.response.success = false;
	            		$scope.response.errorMessage = $scope.sumTestAddData.testName+" is already exists.";
	            		successMsgService.showSuccessOrErrorMsg($scope.response);
	    			}
	    		}else{
	    			$scope.showProceed = true;
	    		}
	    	});
    	}
    };
    
    $scope.sumTestAddData = {};
    if(isFrom == 'fromEdit') {
    	$scope.userSelectedCities = {};
    	$scope.sumTestAddData.testid = sumTestData.testid;
    	$scope.sumTestAddData.testName = sumTestData.testname;
    	$scope.sumTestAddData.tranasctionImports = sumTestData.trasnactionImports;
    	$scope.sumTestAddData.transaction = sumTestData.testtransaction;
    	$scope.sumTestAddData.url = sumTestData.testurl;
    	$scope.sumTestAddData.runEveryMinutes = sumTestData.runevery;
    	$scope.sumTestAddData.testType = sumTestData.testtype;
    	$scope.sumTestAddData.status = sumTestData.originalstatus;
        $scope.sumTestAddData.startdate = formateDate(new Date(sumTestData.startdate));
        $scope.sumTestAddData.enddate = formateDate(new Date(sumTestData.enddate));
        var editDta = $scope.sumTestAddData;
        var citiesData = sumTestData.cities;
        $scope.formName = "Edit";
        $scope.saveBtn = "Update";
        $scope.validateSUMTestName();
    } else {
    	$scope.formName = "Add";
    	$scope.sumTestAddData.testName= "";
	    $scope.sumTestAddData.testType = "URL";
	    $scope.sumTestAddData.startdate = $scope.curdate;  //new Date();
	    $scope.sumTestAddData.enddate = $scope.curdate;   //new Date();
	    $scope.sumTestAddData.runEveryMinutes = "60";
	    $scope.sumTestAddData.url = 'http://';
	    $scope.sumTestAddData.status = true;
	    $scope.saveBtn = "Save";
    }
    $scope.sumFormSubmitted = false;
//    console.log('$scope.sumTestAddData.testName'+$scope.sumTestAddData.testName);
	$scope.appendHttpPrefix = function() {
		if( !/^(http):\/\//i.test($scope.sumTestAddData.url) && !/^(https):\/\//i.test($scope.sumTestAddData.url) ) {
			$scope.sumTestAddData.url = 'http://'+$scope.sumTestAddData.url;
			$scope.showInfoHttpAppended = true;
		} else {
			$scope.showInfoHttpAppended = false;
		}
	};
	
	$scope.setEndDateAsStartDate = function() {
		stDate=$scope.sumTestAddData.startdate;
		enDate=$scope.sumTestAddData.enddate;
		if (isdate(stDate)==1){stDate=convertDate(stDate);}
		else {
			stDate = new Date(stDate.toString());
		}
		if (isdate(enDate)==1){enDate=convertDate(enDate);} 
		else {
			enDate = new Date(enDate.toString());
		}
		if (enDate < stDate){enDate=stDate; $scope.sumTestAddData.enddate=stDate;}
		$scope.sumTestAddData.enddate = enDate.getDate() + "-" + (months[enDate.getMonth()]) + "-" + enDate.getFullYear();
		
		if ($scope.formName=="Add")
		{
		    var todayDateTime=new Date();
		    var todayDate =  todayDateTime.getDate()+ "-" +(months[todayDateTime.getMonth()]) + "-" + todayDateTime.getFullYear();
		    if (stDate<todayDate){$scope.sumTestAddData.startdate=todayDate;}
		}
	};
	
	function isdate(val)
	{
		var date = Date.parse(val);
		if(isNaN(date))
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}

	function convertDate(date)
	{
	    var monthInNumber={'Jan':'1','Feb':'2','Mar':'3','Apr':'4','May':'5','Jun':'6','Jul':'7','Aug':'8','Sep':'9','Oct':'10','Nov':'11','Dec':'12'};
	    var splitDate = date.split("-");
	    var convertedDate=new Date(monthInNumber[splitDate[1]]+"/"+splitDate[0]+"/"+splitDate[2]);
	    return convertedDate;
	}

	$scope.addCities = function() {
    	$scope.sumFormSubmitted = true;
    	// TODO: thinks, below URL validation to occur manually when user submitted the form, instead of `$scope.$broadcast`
		// calls function in directive
		if ( $scope.sumTestAddData.testType === 'URL') {
			$scope.$broadcast('triggerURLValidation');
			
		}
		sdateToCompare = $scope.sumTestAddData.startdate;
		edateToCompare = $scope.sumTestAddData.enddate;
		var sDate = Date.parse($scope.sumTestAddData.startdate);
		var eDate = Date.parse($scope.sumTestAddData.enddate);
		if (isdate(sdateToCompare)==1){sdateToCompare=convertDate(sdateToCompare);}
		if (isdate(edateToCompare)==1){edateToCompare=convertDate(edateToCompare);}

/*
	    var splitStDate = StartDate.split("-");
	    var splitEnDate = EndDate.split("-");
	    var sdateToCompare=new Date(monthInNumber[splitStDate[1]]+"/"+splitStDate[0]+"/"+splitStDate[2]);
	    var edateToCompare=new Date(monthInNumber[splitEnDate[1]]+"/"+splitEnDate[0]+"/"+splitStDate[2]);
 	    var currentTime = new Date();
	    var hours = currentTime.getHours();
	    var minutes = currentTime.getMinutes();
	    var seconds = currentTime.getSeconds();
	    var milliseconds = currentTime.getMilliseconds();
	    if (minutes < 10) minutes = "0" + minutes;

	    var sdate = StartDate.getDate();
	    var smonth = StartDate.getMonth();
	    var syear = StartDate.getFullYear();

	    var edate = EndDate.getDate();
	    var emonth = EndDate.getMonth();
	    var eyear = EndDate.getFullYear();

	    var sdateToCompare = new Date(syear, smonth, sdate, hours, minutes, seconds, milliseconds);
	    var edateToCompare = new Date(eyear, emonth, edate, 23, 59, 59, 00);
*/	    
		var msgContent = "";
		if (sDate > eDate)
		{
			msgContent ='End Date must be greater than Start Date';
		}
		if (!$scope.sumAddForm.$valid) {
			if($scope.sumTestAddData.testType == 'URL') {
				msgContent=msgContent+'Invalid URL';
			} else if($scope.sumTestAddData.testType == 'TRANSACTION'){
//				console.log($scope.sumTestAddData.tranasctionImports);
				if($scope.sumTestAddData.tranasctionImports == undefined || $scope.sumTestAddData.tranasctionImports == '') {
					msgContent=msgContent+'Must enter packages.';
				}
				if($scope.sumTestAddData.transaction == undefined || $scope.sumTestAddData.transaction == '') {
					msgContent=msgContent+'Must enter transaction.';
				}
			}
		}
		if ($scope.sumTestAddData.testName.length==0)
		{
			msgContent=msgContent+'Test Name is mandatory.';
		}
		if (sDate > eDate || ($scope.sumAddForm.$valid==false && $scope.sumTestAddData.testType == 'URL')
			|| ($scope.sumAddForm.$valid==false && ($scope.sumTestAddData.tranasctionImports == undefined || $scope.sumTestAddData.tranasctionImports == ''))
			|| ($scope.sumAddForm.$valid==false && ($scope.sumTestAddData.transaction == undefined || $scope.sumTestAddData.transaction == ''))
			|| $scope.sumTestAddData.testName.length==0)
		{
			ngToast.create({
			className: 'warning',
			content: msgContent,
			timeout: 5000,
			dismissOnTimeout: true,
			dismissButton: true,
			animation: 'fade'
				
			});
		} 
		else 
		{
			$rootScope.$on("close_sum_parent_popup", function(event){
			  	$modalInstance.dismiss('cancel');
			});
			
			if($scope.sumTestAddData.testType == "URL"){
				$scope.sumTestAddData.transaction = '';
			} else {
				$scope.sumTestAddData.url = '';
			}
	        var modalInstance = $modal.open({
	            templateUrl: 'modules/sum/view/add_sum_cities.html',
	            controller: 'addSumCitiesController',
	            size: 'lg',
	            resolve: {
	                sumPackages: function() {
	                    return sumModuleServices.getPackagesData();
	                },
	                sumTestAddData: function() {
	                    return $scope.sumTestAddData;
	                },
	            	citiesData: function() {
	            		return citiesData;
	            	}, saveBtn: function() {
	            		return $scope.saveBtn;
	            	}
	            }
	        });
		}
    };
}]);

appedoApp.controller('addSumCitiesController', ['$scope', '$modal', 'sumModuleServices', '$modalInstance', 'sumPackages', 'sumTestAddData', 'citiesData', 'ngToast', 'saveBtn', '$rootScope', 
    function($scope, $modal, sumModuleServices, $modalInstance, sumPackages, sumTestAddData, citiesData, ngToast, saveBtn, $rootScope) {

        sumModuleServices.getUserNodes($scope, sumTestAddData);
        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.saveButton = saveBtn;
        $scope.sumLocation = {};
        $scope.userNodes = sumModuleServices.getUserNodesData();
        $scope.saveSumData = function() {

            var selectedCities = [];
            for(var i = 0; i < $scope.userNodes.length; i = i + 1) {
				var userNodesData = $scope.userNodes[i];
				for(var j=0; j < userNodesData.cities.length; j=j+1){
					if(userNodesData.cities[j].isSelected) {
						selectedCitiesData = {};
	                    selectedCitiesData.city = $scope.userNodes[i].country + " - " + userNodesData.cities[j].city;
	                    selectedCitiesData.location = $scope.userNodes[i].country + "--" + userNodesData.cities[j].city;
						selectedCities.push(selectedCitiesData);
					}
				}
			}
			
            sumModuleServices.saveSumData($scope, sumTestAddData, selectedCities, function(responseData) {
            	if(responseData.success == true){
            		$rootScope.$emit('close_sum_parent_popup');
            		$modalInstance.dismiss();
            	}
				if(responseData.success == true){
					ngToast.create({
					className: 'success',
					content: responseData.message,
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
					});
				} else {
					ngToast.create({
					className: 'warning',
					content: responseData.errorMessage,
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
					});
				}
            });
      };
    }
]);

appedoApp.controller('datePickerCtrls', function($scope) {
    $scope.today = function() {
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        currentDate = new Date();
        $scope.dt = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear();
        
       // $scope.sumTestAddData.startdate = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear();
	    //$scope.sumTestAddData.enddate = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    // Disable weekend selection
    /*$scope.disabled = function(date, mode) {
	    return ( mode === 'day' && ( date.getDay() === 1 || date.getDay() === 6 ) );
	  };*/

    $scope.disabledTillYesterday = function(date, mode) {
        //return date <= $appedoUtils.yesterday;
        var today = new Date();
        var yesterday = new Date(today.setDate(today.getDate() - 1));
        return date < yesterday;
    };

    $scope.resetMaxMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
        $scope.maxDate = null;

    };
    $scope.resetMaxMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    /*	  $scope.openEndDate = function($event) {
    		    $event.preventDefault();
    		    $event.stopPropagation();

    		    $scope.opened = true;
    		  };*/

    /*	  $scope.dateOptions = {
    	    formatYear: 'yy',
    	    startingDay: 1,
    	    showWeeks: 'false',
    	    startingDay: 0,
    	    formatDay:'d'
    	  };*/

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    }

    // $scope.format = 'd-MMM-yyyy' ;
    $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
});

appedoApp.controller('sumDashPanel', ['$scope', '$attrs', 'sumModuleServices','ajaxCallService', 'sessionServices', '$appedoUtils', function($scope, $attrs, sumModuleServices, ajaxCallService,  sessionServices, $appedoUtils) {
	var d3ChartTimeFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"));
	
	$scope.userWebsiteCounterModules;
	$scope.selectedRUMDuration;
	$scope.selectedLocation;
	$scope.responseTimeChartData;
	
    $scope.userWebsiteCounterModules = [];
    var resultSUMDropdown = sumModuleServices.getSUMDropdown();
    resultSUMDropdown.then(function(resp) {
    	$scope.userWebsiteCounterModules = resp;
    	$scope.selectedWebSite = $scope.userWebsiteCounterModules[0];
        $scope.getSUMChartData();
    });
    
    $scope.sumDurations = JSON.parse(sessionServices.get("sliderServerSideScale"));
    $scope.selectedSUMDuration = $scope.sumDurations[0];
//    console.log($scope.selectedSUMDuration);
	$scope.d3XaixsFormat = d3ChartTimeFormat[$scope.sumDurations.indexOf($scope.selectedSUMDuration)];
    
	$scope.getSUMChartData = function(){
		$scope.selectedLocation = "All Locations";
        $scope.sumLocations = [];
    	$scope.d3XaixsFormat = d3ChartTimeFormat[$scope.sumDurations.indexOf($scope.selectedSUMDuration)];
        $scope.getSUMMultiLineChart();
    };

    $scope.getSUMMultiLineChart= function(){
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
    };
    
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

appedoApp.controller('sumDetailsController', ['$scope', 'sumModuleServices', 'sliderFactory', '$appedoUtils', 'sessionServices', '$state', function($scope, sumModuleServices, sliderFactory, $appedoUtils, sessionServices, $state) {

	$scope.backToSlaCardPage = function() {
		$state.transitionTo('/sum_metrics');
	};
	$scope.selectedSumCardContent = JSON.parse(sessionServices.get("selectedSumCardContent"));

	$scope.sliderValue = "1";
	$scope.sliderOptions = sliderFactory.sliderOptions;

	$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[0];
	$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
	
	$scope.userWebsiteCounterModules;
	$scope.selectedLocation;
	$scope.responseTimeChartData;
	$scope.showScannedPageDropdown=false;
    $scope.userWebsiteCounterModules = [];
    $scope.getModules = function(){
    	var resultSUMDropdown = sumModuleServices.getSUMDetailsDropDown();
        resultSUMDropdown.then(function(resp) {
        	$scope.userWebsiteCounterModules = resp.message;
        	selectModuleByTestId();
//        	$scope.selectedWebSite = $scope.userWebsiteCounterModules[0];
//        	if($scope.selectedWebSite.testtype=="TRANSACTION"){
//        		$scope.showScannedPageDropdown=true;
//        		$scope.scannedPages = $scope.selectedWebSite.pageDetails;
//            	$scope.scannedPage = $scope.scannedPages[0];
//            	if($scope.scannedPage!=undefined){
//            		$scope.getSUMChartData();
//            	}
//        	}else if($scope.selectedWebSite.testtype=="URL"){
//        		$scope.scannedPages = [];
//            	$scope.scannedPage = "";
//        		$scope.showScannedPageDropdown=false;
//        		$scope.getSUMChartData();
//        	}
        });
	};
	$scope.getModules();
	
	function selectModuleByTestId() {
		for(var i = 0; i < $scope.userWebsiteCounterModules.length; i = i + 1) {
			var joModule = $scope.userWebsiteCounterModules[i];
			
			if ( joModule.testid == $scope.selectedSumCardContent.testid ) {
				$scope.selectedWebSite = joModule;
				showScannedPagesDropdown();
				break;
			}
		}
	}
	
	function showScannedPagesDropdown() {
		if($scope.selectedWebSite.testtype=="TRANSACTION"){
    		$scope.showScannedPageDropdown=true;
    		$scope.scannedPages = $scope.selectedWebSite.pageDetails;
        	$scope.scannedPage = $scope.scannedPages[0];
        	if($scope.scannedPage!=undefined){
        		$scope.getSUMChartData();
        	}
    	}else if($scope.selectedWebSite.testtype=="URL"){
    		$scope.scannedPages = [];
        	$scope.scannedPage = "";
    		$scope.showScannedPageDropdown=false;
    		$scope.getSUMChartData();
    	}
	}

	$scope.$watch('sliderValue',function(newVal){
    	if(newVal){
    		if(newVal=="1"){
    			$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[0];
    			$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
    		}else{
    			$scope.sliderSelectedValue = JSON.parse(sessionServices.get("sliderServerSideScale"))[(newVal/$scope.sliderOptions.step)];
    			$scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[(newVal/$scope.sliderOptions.step)];
    		}
    		$scope.getSUMChartData();
    	}	
	});
    
	$scope.getSUMChartData = function(){
		$scope.selectedLocation = "All Locations";
        $scope.sumLocations = [];
		$scope.responseTimeChartData=[];
		$scope.responseTimeOriChartData=[];
		$scope.scannedPages = [];
		$scope.scannedPage = "";
        if($scope.selectedWebSite!=undefined){
        	if($scope.selectedWebSite.testtype!="TRANSACTION"){
        		$scope.scannedPages = [];
            	$scope.scannedPage;
        		$scope.showScannedPageDropdown=false;
        		$scope.getSUMMultiLineChart();
        	}else{
        		$scope.showScannedPageDropdown=true;
        		$scope.scannedPages = $scope.selectedWebSite.pageDetails;
            	$scope.scannedPage = $scope.scannedPages[0];
            	if($scope.scannedPage!=undefined){
            		$scope.getSUMMultiLineChart();
            	}
        	}
        }
    };
    
    $scope.getSUMSearchPageChangeChartData = function(){
    	$scope.scannedPage =this.scannedPage;
    	$scope.sumLocations = [];
		$scope.responseTimeChartData=[];
		$scope.responseTimeOriChartData=[];
        if($scope.scannedPage!=undefined){
			$scope.selectedLocation = "All Locations";
            $scope.getSUMMultiLineChart();
        }
    };

    $scope.getSUMMultiLineChart= function(){
    	$scope.sumLocations = [];
		$scope.responseTimeChartData=[];
		$scope.responseTimeOriChartData=[];
    	if($scope.selectedWebSite!=undefined){
        	var resultSUMMultiLine;
    		if($scope.selectedWebSite.testtype=="TRANSACTION"){
            	resultSUMMultiLine = sumModuleServices.getSUMMultiLine($scope.selectedWebSite.testid,$scope.scannedPage.page_id,$scope.sliderSelectedValue);
        	}else if($scope.selectedWebSite.testtype=="URL"){
            	resultSUMMultiLine = sumModuleServices.getSUMMultiLine($scope.selectedWebSite.testid,'',$scope.sliderSelectedValue);
        	}
        	resultSUMMultiLine.then(function(resp) {
        		if(resp.success){
        			$scope.sumLocations = resp.message;
        			$scope.responseTimeChartData = resp.message;
        			$scope.responseTimeOriChartData = resp.message;
        		}
            });
    	}
    };
    
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
    
    $scope.showHAR = false;
    $scope.populateHarFile = function(filePath){
    	$scope.showHAR = true;
    	$scope.harFilePath=filePath;
    	$scope.$apply();
    };
}]);

appedoApp.controller('sumMapController', ['$scope', 'sumModuleServices', function($scope , sumModuleServices){
	
	var resultSUMWorldMap = sumModuleServices.getSUMWorldMap();
	resultSUMWorldMap.then(function(resp) {
    	if(resp.success){
    		var responseData = resp.message;
            $scope.mapData = responseData;
            var runningCount = 0, completedCount = 0, locationCount = 0;
            for (var key in responseData) {
            	runningCount += responseData[key].running;
            	completedCount += responseData[key].completed;
            	if(responseData[key].id) {
            		locationCount = responseData[key].id++;
            	}
            }
            $scope.runningCount = runningCount;
            $scope.completedCount = completedCount;
            $scope.locationCount = locationCount;
    	}
    });
}]);

