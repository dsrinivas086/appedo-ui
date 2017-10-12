appedoApp.service('sumModuleServices', ['$http', '$q', 'ngToast', function($http , $q, ngToast) {

	this.getSUMUserTests = function(successCallBack) {
		//var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './sum/getUserTests'
		}).success(function(data) {
			if (successCallBack instanceof Function) {
				successCallBack(data);
			}
		}).error(function(data) {
			console.log("Error in Ajax Call");
		});
	};
	
	this.getPackages = function($scope) {
	    this.getPackagesData = function() {
	        return $scope.sumPackages;
	    };
	    $http({
	        method: 'POST',
	        url: './sum/getPackages'
	    }).success(function(packageData) {
	        $scope.sumPackages = packageData;
	        $scope.sumTestAddData.tranasctionImports = $scope.sumPackages.packages;
	    }).error(function(packageData) {
	        console.log("Error in Ajax Call");
	    });
	};
	this.validateSUMTestName = function($scope, sumTestName, testId, callback) {
		$http({
			method: 'POST',
			url: 'sum/validateSUMTestName',
			params: {
				testName: sumTestName,
				testId: testId,
			}
		}).success(function(data) {
			if(callback instanceof Function){
				callback(data);
			};
		});	
	};
	
	this.getUserNodes = function($scope, sumTestAddData) {

	    this.getUserNodesData = function() {
	        return $scope.userNodes;
	    };
	    if(sumTestAddData && sumTestAddData.testid){
		    $http({
		        method: 'POST',
		        url:"./sum/getNodes",
		        params: {
		        	testid: sumTestAddData.testid
		        }
		    }).success(function(data) {
		        $scope.userNodes = data;
		        $scope.$watch('sumLocation.userNode', function() {
		            $scope.userCities = {};
			        $scope.counters = {};
			        if ($scope.sumLocation.userNode != undefined) {
			            if ($scope.sumLocation.userNode.country != undefined) {
			                $scope.citiesData = $scope.sumLocation.userNode.cities;
			            }
			        }
		        });
		    }).error(function(data) {
		        console.log("Error in Ajax Call");
		    });
	    } else {
		    $http({
		        method: 'POST',
		        url: './sum/getUserNodes'
		    }).success(function(data) {
		        $scope.userNodes = data;
		        $scope.$watch('sumLocation.userNode', function() {
		            $scope.userCities = {};
			        $scope.counters = {};
			        if ($scope.sumLocation.userNode != undefined) {
			            if ($scope.sumLocation.userNode.country != undefined) {
			                $scope.citiesData = $scope.sumLocation.userNode.cities;
			            }
			        }
		        });
		    }).error(function(data) {
		        console.log("Error in Ajax Call");
		    });
	    }

	};

	this.saveSumData = function($scope, sumTestAddData, selectedCities, callback) {
	    var stDate = sumTestAddData.startdate;
	    var enDate = sumTestAddData.enddate+' 23:59:59';
	    if (isdate(stDate)==1){stDate=formatDate(stDate, 'st');
	    }
		else {
			stDate = new Date(stDate.toString());
			var ctDate = new Date();
		    	if(stDate < ctDate) {
		    		stDate = ctDate;
		    	}
		}
		if (isdate(enDate)==1){enDate=formatDate(enDate, 'ed');}
		else {
			enDate = new Date(enDate.toString());
		}

	  /*  var currentTime = new Date();
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
	    var edateToCompare = new Date(eyear, emonth, edate, 23, 59, 59, 00);*/
	    function formatDate(date, ct)
		{
		    var monthInNumber={'Jan':'1','Feb':'2','Mar':'3','Apr':'4','May':'5','Jun':'6','Jul':'7','Aug':'8','Sep':'9','Oct':'10','Nov':'11','Dec':'12'};
		    var splitDate = date.split("-");
		    var convertedDate=new Date(monthInNumber[splitDate[1]]+"/"+splitDate[0]+"/"+splitDate[2]);
		    if(ct == "st"){
		    	var ctDate = new Date();
		    	if(convertedDate < ctDate) {
		    		convertedDate = ctDate;
		    	}
		    }
		    
		    return convertedDate;
		}
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
	    if(sumTestAddData && sumTestAddData.testid){
	    	var paramData = {
	            testName: sumTestAddData.testName,
	            url: sumTestAddData.url,
	            runEveryMinutes: sumTestAddData.runEveryMinutes,
	            //startDate: formatDate(sumTestAddData.startdate, 'edit'),
	           // endDate: formatDate(sumTestAddData.enddate+' 23:59:59', 'edit'),
	            startDate: stDate,
	            endDate: enDate,
	            seleniumScriptPackages: sumTestAddData.tranasctionImports,
	            transaction: sumTestAddData.transaction || '',
	            testtype: sumTestAddData.testType,
	            status: sumTestAddData.status,
	            selectedCities: JSON.stringify(selectedCities),
	            testid: sumTestAddData.testid
	        }
	        url = './sum/updateSUMTest';
	    } else {
	    	var paramData = {
	            testName: sumTestAddData.testName,
	            url: sumTestAddData.url,
	            runEveryMinutes: sumTestAddData.runEveryMinutes,
	            //startDate: formatDate(sumTestAddData.startdate, 'st'),
	            //endDate: formatDate(sumTestAddData.enddate +' 23:59:59', 'ed'),
	            startDate: stDate,
	            endDate: enDate,
	            seleniumScriptPackages: sumTestAddData.tranasctionImports,
	            transaction: sumTestAddData.transaction || '',
	            testtype: sumTestAddData.testType,
	            status: sumTestAddData.status,
	            selectedCities: JSON.stringify(selectedCities)
	        }
	        url = './sum/addSUMTest'
	    }
	    if(selectedCities && selectedCities.length > 0) {
		    $http({
		        method: 'POST',
		        url: url,
		        params: paramData
		    }).success(function(responseData) {
		        if (callback) {
		            callback(responseData);
		        }
		    });
	    } else {
	    	ngToast.create({
			className: 'warning',
			content:'Please select Region/Location',
			timeout: 3000,
			dismissOnTimeout: true,
			dismissButton: true,
			animation: 'fade'
			});
	    }

	};

	this.deleteSumRecord = function($scope, testid, callback) {
	    $http({
	        method: 'POST',
	        url: './sum/deleteSUMTest',
	        params: {
	            testid: testid
	        }
	    }).success(function(responseData) {
	        if (callback) {
	            callback(responseData);
	        }
	    });
	};
	
	this.getSUMLicense = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './sum/getSUMLicense'
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getDonutChartdata = function(moduleCode) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './sum/getSUMSummary',
			params: {
				moduleCode: moduleCode
			}
		}).success(deferredObject.resolve)
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getSUMDropdown = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './sum/getSUMMultiDropDown'
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getSUMWorldMap = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './sum/getSUMWorldMap'
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getSUMDetailsDropDown = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './sum/getSUMDetailsDropDown'
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
	this.getSUMMultiLine = function(testId,pageId,interval) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './sum/getSUMMultiLine',
			params: {
				testId: testId,
				interval: interval,
				pageId: pageId
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
	
/*	this.getSUMPageMultiLine = function(testId,pageId,interval) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: './sum/getSUMPageMultiLine',
			params: {
				testId: testId,
				pageId:pageId,
				interval:interval
			}
		}).success(deferredObject.resolve)
	 	.error(deferredObject.resolve);
		
        return deferredObject.promise;
	};
*/	
}]);