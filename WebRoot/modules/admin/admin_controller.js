/* commented since conflicted */
//appedoApp.controller('adminController', ['$scope', 'sessionServices', 'userMetrics', 'licenseServices', 'successMsgService', 'ngToast', function($scope, sessionServices, userMetrics, licenseServices, successMsgService, ngToast) {

appedoApp.controller('adminController', ['$scope', 'sessionServices', 'userMetrics', 'licenseServices', 'sessionServices', 'successMsgService', 'ngToast', function($scope, sessionServices, userMetrics, licenseServices, sessionServices, successMsgService, ngToast) {
	
	$scope.userAccessPrivilege = {};
    $scope.admin = {};
    $scope.manage = {};
    $scope.userAccessPrivilege.selectedAdmintask = "license";
    $scope.admin.selectedLicenseType = "manage";
    $scope.manage.licenseCategory = "newLicense";
    $scope.showLicensedetails = true;
    $scope.manage.selectedPlanType = "level0";
    $scope.showAccRightsdetails = false;
    $scope.showReportsdetails = false;
    $scope.showSettingsdetails = false;
    $scope.manage.selectedPeriod = "Monthly";
    $scope.noLicense = true;
    
    $scope.curdate;
    $scope.today = function() {
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        currentDate = new Date();
        $scope.curdate = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear();
       };
    $scope.today();
    $scope.manage.startdate = $scope.curdate;
    $scope.manage.enddate = $scope.curdate;

    $scope.loginUser = JSON.parse(sessionServices.get('loginUser'));
    
    $scope.licensingEmail = [];

    var emails;
    emails = licenseServices.getLicesingEmails();
    emails.then(function(data) {
        $scope.licensingEmail = data.message;
    });

    $scope.pricingDetails = function(selectedPeriod) {
    	$scope.showEnterprseEdit = false;
        var commonData = {};
        $scope.pricingData = [];
        $scope.dupPricingData = [];
        licenseServices.getPricingDetails($scope, selectedPeriod, function(data) {
            for (var i = 0; i < data.message.length; i++) {
                $scope.pricings = data.message[i].pricings;
                if ($scope.pricings && $scope.pricings.length > 0) {
                    angular.forEach($scope.pricings, function(pricings) {
                        $scope.pricingData.push(pricings);
                    });
                }
                $scope.durations = data.message[i].licesePreiodDuration;
            }
            commonData = licenseServices.getPricingCommonDetails($scope);
            commonData.then(function(data) {
                angular.forEach(data.data, function(commonData) {
                    $scope.pricingData.push(commonData);
                });
                angular.forEach($scope.durations, function(duration) {
                    $scope.pricingData.push(duration);
                });
            });
        });
        $scope.dupPricingData = $scope.pricingData;
    };
    $scope.pricingDetails($scope.manage.selectedPeriod);

    $scope.loadPeriodTypeDetails = function() {
        $scope.pricingDetails($scope.manage.selectedPeriod);
        if($scope.noLicense == false) {
        	validateEndDate();
        }
    };

    $scope.showEnterprseEdit = false;
    $scope.editEnterpriseData = function() {
        $scope.showEnterprseEdit = true;
        $scope.originalPricingData = JSON.parse(JSON.stringify($scope.pricingData));
    };

    $scope.doNotUpdateEnterprise = function() {
        $scope.showEnterprseEdit = false;
        $scope.pricingData = $scope.originalPricingData;
    };

    var timer;
    $scope.getUserMetrics = function() {
        clearTimeout(timer);

        $scope.signup = {};
        var signUps;
        signUps = userMetrics.getUsageMetrics('signup');
        signUps.then(function(resp) {
            if (resp.success) {
            	$scope.signup.lable1 = resp.message.label_name1;
                $scope.signup.value1 = resp.message.label_value1;
            	$scope.signup.lable2 = resp.message.label_name2;
                $scope.signup.value2 = resp.message.label_value2;
                $scope.signup.lable3 = resp.message.label_name3;
                $scope.signup.value3 = resp.message.label_value3;
                $scope.signup.lable4 = resp.message.label_name4;
                $scope.signup.value4 = resp.message.label_value4;
            }
        });
        
        $scope.loggedin = {};
        var lid;
        lid = userMetrics.getUsageMetrics('loggedin');
        lid.then(function(resp) {
            if (resp.success) {
            	$scope.loggedin.lable1 = resp.message.label_name1;
                $scope.loggedin.value1 = resp.message.label_value1;
            	$scope.loggedin.lable2 = resp.message.label_name2;
                $scope.loggedin.value2 = resp.message.label_value2;
                $scope.loggedin.lable3 = resp.message.label_name3;
                $scope.loggedin.value3 = resp.message.label_value3;
                $scope.loggedin.lable4 = resp.message.label_name4;
                $scope.loggedin.value4 = resp.message.label_value4;
            }
        });
        
        $scope.lt = {};
        var lid;
        lid = userMetrics.getUsageMetrics('lt');
        lid.then(function(resp) {
            if (resp.success) {
            	$scope.lt.lable1 = resp.message.label_name1;
                $scope.lt.value1 = resp.message.label_value1;
            	$scope.lt.lable2 = resp.message.label_name2;
                $scope.lt.value2 = resp.message.label_value2;
                $scope.lt.lable3 = resp.message.label_name3;
                $scope.lt.value3 = resp.message.label_value3;
                $scope.lt.lable4 = resp.message.label_name4;
                $scope.lt.value4 = resp.message.label_value4;
            }
        });
        
        $scope.sla = {};
        var slaBreaches;
        slaBreaches = userMetrics.getUsageMetrics('sla');
        slaBreaches.then(function(resp) {
            if (resp.success) {
            	$scope.sla.lable1 = resp.message.label_name1;
                $scope.sla.value1 = resp.message.label_value1;
            	$scope.sla.lable2 = resp.message.label_name2;
                $scope.sla.value2 = resp.message.label_value2;
                $scope.sla.lable3 = resp.message.label_name3;
                $scope.sla.value3 = resp.message.label_value3;
                $scope.sla.lable4 = resp.message.label_name4;
                $scope.sla.value4 = resp.message.label_value4;
            }
        });
        
        $scope.agents = {};
        var maa;
        maa = userMetrics.getUsageMetrics('agents');
        maa.then(function(resp) {
            if (resp.success) {
            	$scope.agents.lable1 = resp.message.label_name1;
                $scope.agents.value1 = resp.message.label_value1;
            	$scope.agents.lable2 = resp.message.label_name2;
                $scope.agents.value2 = resp.message.label_value2;
                $scope.agents.lable3 = resp.message.label_name3;
                $scope.agents.value3 = resp.message.label_value3;
                $scope.agents.lable4 = resp.message.label_name4;
                $scope.agents.value4 = resp.message.label_value4;
            }
        });
        
        $scope.application = {};
        var app;
        app = userMetrics.getUsageMetrics('app');
        app.then(function(resp) {
            if (resp.success) {
            	$scope.application.lable1 = resp.message.label_name1;
                $scope.application.value1 = resp.message.label_value1;
            	$scope.application.lable2 = resp.message.label_name2;
                $scope.application.value2 = resp.message.label_value2;
                $scope.application.lable3 = resp.message.label_name3;
                $scope.application.value3 = resp.message.label_value3;
                $scope.application.lable4 = resp.message.label_name4;
                $scope.application.value4 = resp.message.label_value4;
            }
        });
        
        $scope.server = {};
        var svr;
        svr = userMetrics.getUsageMetrics('svr');
        svr.then(function(resp) {
            if (resp.success) {
            	$scope.server.lable1 = resp.message.label_name1;
                $scope.server.value1 = resp.message.label_value1;
            	$scope.server.lable2 = resp.message.label_name2;
                $scope.server.value2 = resp.message.label_value2;
                $scope.server.lable3 = resp.message.label_name3;
                $scope.server.value3 = resp.message.label_value3;
                $scope.server.lable4 = resp.message.label_name4;
                $scope.server.value4 = resp.message.label_value4;
            }
        });
        
        $scope.database = {};
        var db;
        db = userMetrics.getUsageMetrics('db');
        db.then(function(resp) {
            if (resp.success) {
            	$scope.database.lable1 = resp.message.label_name1;
                $scope.database.value1 = resp.message.label_value1;
            	$scope.database.lable2 = resp.message.label_name2;
                $scope.database.value2 = resp.message.label_value2;
                $scope.database.lable3 = resp.message.label_name3;
                $scope.database.value3 = resp.message.label_value3;
                $scope.database.lable4 = resp.message.label_name4;
                $scope.database.value4 = resp.message.label_value4;
            }
        });
        
        $scope.sum = {};
        var sumTest;
        sumTest = userMetrics.getUsageMetrics('sumtest');
        sumTest.then(function(resp) {
            if (resp.success) {
            	$scope.sum.lable2 = resp.message.label_name2;
                $scope.sum.value2 = resp.message.label_value2;
                $scope.sum.lable3 = resp.message.label_name3;
                $scope.sum.value3 = resp.message.label_value3;
                $scope.sum.lable4 = resp.message.label_name4;
                $scope.sum.value4 = resp.message.label_value4;
            }
        });
        
        $scope.sumnode = {};
        var sumNode;
        sumNode = userMetrics.getUsageMetrics('sumnode');
        sumNode.then(function(resp) {
            if (resp.success) {
            	$scope.sumnode.lable1 = resp.message.label_name1;
                $scope.sumnode.value1 = resp.message.label_value1;
            	$scope.sumnode.lable2 = resp.message.label_name2;
                $scope.sumnode.value2 = resp.message.label_value2;
                $scope.sumnode.lable3 = resp.message.label_name3;
                $scope.sumnode.value3 = resp.message.label_value3;
                $scope.sumnode.lable4 = resp.message.label_name4;
                $scope.sumnode.value4 = resp.message.label_value4;
            }
        });
        
        $scope.summst = {};
        var sumMeasurement;
        sumMeasurement = userMetrics.getUsageMetrics('summst');
        sumMeasurement.then(function(resp) {
            if (resp.success) {
            	$scope.summst.lable1 = resp.message.label_name1;
                $scope.summst.value1 = resp.message.label_value1;
            	$scope.summst.lable2 = resp.message.label_name2;
                $scope.summst.value2 = resp.message.label_value2;
                $scope.summst.lable3 = resp.message.label_name3;
                $scope.summst.value3 = resp.message.label_value3;
                $scope.summst.lable4 = resp.message.label_name4;
                $scope.summst.value4 = resp.message.label_value4;
            }
        });
        
		$scope.rummst = {};
		var rumMeasurement;
		rumMeasurement = userMetrics.getUsageMetrics('rummst');
		rumMeasurement.then(function(resp) {
		    if (resp.success) {
		    	$scope.rummst.lable1 = resp.message.label_name1;
		        $scope.rummst.value1 = resp.message.label_value1;
		    	$scope.rummst.lable2 = resp.message.label_name2;
		        $scope.rummst.value2 = resp.message.label_value2;
		        $scope.rummst.lable3 = resp.message.label_name3;
		        $scope.rummst.value3 = resp.message.label_value3;
		        $scope.rummst.lable4 = resp.message.label_name4;
		        $scope.rummst.value4 = resp.message.label_value4;
		    }
		});
        timer = setTimeout($scope.getUserMetrics, sessionServices.get("textRefresh"));
    };

    $scope.loadAdminDetails = function() {
        if ($scope.userAccessPrivilege.selectedAdmintask == "license") {
            $scope.showLicensedetails = true;
            $scope.showUsagemetricsDetails = false;
            $scope.admin.selectedLicenseType = "manage";
        } else {
            $scope.showUsagemetricsDetails = true;
            $scope.showLicensedetails = false;
            $scope.showAccRightsdetails = false;
            $scope.showReportsdetails = false;
            $scope.showSettingsdetails = false;
            $scope.getUserMetrics();
        }
    };
    
    function formateDate(date){
    	console.log("formater......." +date);
    	months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        currentDate = date;
        var formatedDate = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear();
        return formatedDate;
    };
    
    $scope.selectedUserDetails = function() {
    	$scope.showEnterprseEdit = false;
    	licenseServices.getLicesenseDetails($scope, $scope.manage.email.email_id, function(data){
    		if(data.message.licence == 'No licence'){
    			$scope.noLicense = true;
    			$scope.manage.selectedPlanType = "level0";
	    		$scope.manage.selectedPeriod = "Monthly";
	    		$scope.manage.licenseCategory = "newLicense";
	    		$scope.pricingDetails($scope.manage.selectedPeriod);
	    		//$scope.manage.startdate = formateDate(new Date());
	    		//$scope.manage.enddate = formateDate(new Date());
	    		$scope.manage.startdate = '';
	    		$scope.manage.enddate = '';
	    		ngToast.create({
					className: 'warning',
					content: "No license available",
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
				});
    		} else {
    			$scope.noLicense = false;
    			$scope.manage.selectedPlanType = data.message.lic_type;
	    		$scope.manage.selectedPeriod = data.message.lic_period==undefined?"Monthly":data.message.lic_period;
	    		$scope.manage.licenseCategory = "renewal";
	    		$scope.manage.startdate = formateDate(new Date(data.message.start_date));
	    		$scope.manage.enddate = formateDate(new Date(data.message.end_date));
	    		$scope.dupPricingData = $scope.pricingData;
//	    		if($scope.manage.selectedPlanType != 'level0'){
	    			for(var j=0; j<data.message.pricings.length; j++){
	    				for(var i=0; i<$scope.pricingData.length; i++){
		    				if($scope.pricingData[i].lic_id==data.message.pricings[j].lic_id){
		    					$scope.pricingData[i].enterprise = data.message.pricings[j].enterprise;
		    					$scope.pricingData[i].essentials = data.message.pricings[j].essentials;
		    					$scope.pricingData[i].pro = data.message.pricings[j].pro;
		    					$scope.pricingData[i].lite = data.message.pricings[j].lite;
		    				}
		    			}
	    			}
//	    		}else{
//	    			$scope.pricingDetails($scope.manage.selectedPeriod);
//	    		}
    		}
    	});
    };
    
	$scope.setLiceseEndDate = function() {
		validateEndDate();
/*		var stDate = $scope.manage.startdate;
        var enDate = $scope.manage.enddate;
		if (isdate(stDate)==1){
			stDate=convertDate(stDate);
		}
		else {
			stDate = new Date(stDate.toString());
		}
		if (isdate(enDate)==1){
			enDate=convertDate(enDate);
		} 
		else {
			enDate = new Date(enDate.toString());
		}
		if (enDate < stDate){
			enDate=stDate; 
			$scope.manage.enddate=stDate;
		}
		var endDate = new Date();
		endDate = stDate;
		if($scope.manage.selectedPeriod == 'Daily') {
			endDate = endDate.setDate(endDate.getDate()+1);
			var date = new Date(endDate)
			$scope.manage.enddate = formateDate(date);
		} else if ($scope.manage.selectedPeriod == 'Monthly') {
			endDate = endDate.setMonth(endDate.getMonth()+1);
			endDate = new Date(endDate);
			endDate = endDate.setDate(endDate.getDate()-1);
			var date = new Date(endDate)
			$scope.manage.enddate = formateDate(date);
			//$scope.manage.enddate = stDate.getDate()-1 + "-" + (months[stDate.getMonth()+1]) + "-" + stDate.getFullYear();
		} else if ($scope.manage.selectedPeriod == 'Annual'){
			endDate = endDate.setYear(endDate.getFullYear()+1);
			endDate = new Date(endDate);
			endDate = endDate.setDate(endDate.getDate()-1);
			var date = new Date(endDate)
			$scope.manage.enddate = formateDate(date);
			//$scope.manage.enddate = stDate.getDate()-1 + "-" + (months[stDate.getMonth()]) + "-" + (stDate.getFullYear()+1);
		}
	    var todayDateTime=new Date();
	    var todayDate =  todayDateTime.getDate()+ "-" +(months[todayDateTime.getMonth()]) + "-" + todayDateTime.getFullYear();
	    if (stDate<todayDate){
	    	$scope.manage.startdate=todayDate;
	    }*/
	};
	
	function validateEndDate(){
			var stDate = $scope.manage.startdate;
        var enDate = $scope.manage.enddate;
		if (isdate(stDate)==1){
			stDate=convertDate(stDate);
		}
		else {
			stDate = new Date(stDate.toString());
		}
		if (isdate(enDate)==1){
			enDate=convertDate(enDate);
		} 
		else {
			enDate = new Date(enDate.toString());
		}
		if (enDate < stDate){
			enDate=stDate; 
			$scope.manage.enddate=stDate;
		}
		var endDate = new Date();
		endDate = stDate;
		if($scope.manage.selectedPeriod == 'Daily') {
			endDate = endDate.setDate(endDate.getDate()+1);
			var date = new Date(endDate)
			$scope.manage.enddate = formateDate(date);
		} else if ($scope.manage.selectedPeriod == 'Monthly') {
			endDate = endDate.setMonth(endDate.getMonth()+1);
			endDate = new Date(endDate);
			endDate = endDate.setDate(endDate.getDate()-1);
			var date = new Date(endDate)
			$scope.manage.enddate = formateDate(date);
			//$scope.manage.enddate = stDate.getDate()-1 + "-" + (months[stDate.getMonth()+1]) + "-" + stDate.getFullYear();
		} else if ($scope.manage.selectedPeriod == 'Annual'){
			endDate = endDate.setYear(endDate.getFullYear()+1);
			endDate = new Date(endDate);
			endDate = endDate.setDate(endDate.getDate()-1);
			var date = new Date(endDate)
			$scope.manage.enddate = formateDate(date);
			//$scope.manage.enddate = stDate.getDate()-1 + "-" + (months[stDate.getMonth()]) + "-" + (stDate.getFullYear()+1);
		}
	    var todayDateTime=new Date();
	    var todayDate =  todayDateTime.getDate()+ "-" +(months[todayDateTime.getMonth()]) + "-" + todayDateTime.getFullYear();
	    if (stDate<todayDate){
	    	$scope.manage.startdate=todayDate;
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
    
    $scope.updateLicense = function() {
        var startDate = $scope.manage.startdate;
        var endDate = $scope.manage.enddate;
        //$scope.manage.startdate = startDate.getDate() + "-" + (months[startDate.getMonth()]) + "-" + startDate.getFullYear();
    	//$scope.manage.enddate = endDate.getDate() + "-" + (months[endDate.getMonth()]) + "-" + endDate.getFullYear();
        
        licenseServices.getformatedDate($scope.manage.startdate, $scope.manage.enddate, function() {
        });
        var pricing_data = [];
        
        var is_valid = true;
        var msg = '';
        if($scope.manage.email == '' || $scope.manage.email==undefined){
        	is_valid = false;
        	msg = "Please select emailId.";
        } else if($scope.manage.startdate == '' || $scope.manage.startdate==undefined) {
        	is_valid = false;
        	msg = "Please select start date.";
        }
        
        if(is_valid) {
        	var params = {};
        	if($scope.manage.selectedPlanType == 'level3'){
        		angular.forEach($scope.pricingData, function(data){
		        	if(data.lic_id){
		        		pricingValues = {};
			        	pricingValues.enterprise = data.enterprise;
			        	pricingValues.feature = data.feature;
			        	pricingValues.module_name = data.module_name;
			        	pricingValues.lic_id = data.lic_id;
			        	pricing_data.push(pricingValues);
		        	}
        		});
        		
        		params = {
		        	email_id: $scope.manage.email.email_id,
		        	lic_category: $scope.manage.licenseCategory,
		        	lic_type: $scope.manage.selectedPlanType,
		        	lic_period: $scope.manage.selectedPeriod,
		        	lic_start_date: licenseServices.getFormattedStartDate(),
		        	lic_end_date: licenseServices.getFormattedEndDate(),
		        	pricing_data: JSON.stringify(pricing_data),
	        	};
        	} else {
		        params = {
		        	email_id: $scope.manage.email.email_id,
		        	lic_category: $scope.manage.licenseCategory,
		        	lic_type: $scope.manage.selectedPlanType,
		        	lic_period: $scope.manage.selectedPeriod,
		        	lic_start_date: licenseServices.getFormattedStartDate(),
		        	lic_end_date: licenseServices.getFormattedEndDate()
		        };
        	}
	        licenseServices.updateUserLicese($scope, params, function(data) {
	        	if(data.success==true) {
	        		$scope.showEnterprseEdit = false;
	        	}
	        	successMsgService.showSuccessOrErrorMsg(data);
	        });
        } else {
        	ngToast.create({
					className: 'warning',
					content: msg,
					timeout: 3000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
			});
        }
    };
    
    $scope.loadLiceseDetails = function() {
        if ($scope.admin.selectedLicenseType == 'manage') {
            $scope.showLicensedetails = true;
            $scope.showAccRightsdetails = false;
            $scope.showReportsdetails = false;
            $scope.showSettingsdetails = false;
        } else if ($scope.admin.selectedLicenseType == 'accRights') {
            $scope.showAccRightsdetails = true;
            $scope.showLicensedetails = false;
            $scope.showReportsdetails = false;
            $scope.showSettingsdetails = false;
        } else if ($scope.admin.selectedLicenseType == 'reports') {
            $scope.showReportsdetails = true;
            $scope.showLicensedetails = false;
            $scope.showAccRightsdetails = false;
            $scope.showSettingsdetails = false;
        } else if ($scope.admin.selectedLicenseType == 'settings') {
            $scope.showSettingsdetails = true;
            $scope.showLicensedetails = false;
            $scope.showAccRightsdetails = false;
            $scope.showReportsdetails = false;
        }
    };

    $scope.$on('$destroy', function() {
        clearTimeout(timer);
    });
}]);

appedoApp.controller('adminAccessRightsController', ['$scope', '$rootScope', '$modal', 'sessionServices', 'userMetrics', 'licenseServices', 'sessionServices', 'successMsgService', function($scope, $rootScope, $modal, sessionServices, userMetrics, licenseServices, sessionServices, successMsgService) {

	//$scope.formAccessRights = {};
	
	

	// get User all email ids, based on logged in user's privilage 
	$scope.getUserEmailds = function() {
		var resultEmails = licenseServices.getLicesingEmails();
		resultEmails.then(function(data) {
			$scope.licensingEmailIds = data.message;
		});
	};
	$scope.getUserEmailds();
	/*
	// update access rights for a user
	$scope.updateUserAccessRights = function() {

		var resultAccessLicensePrevilage = licenseServices.updateUserAccessRights($scope.formAccessRights.email.email_id, ($scope.formAccessRights.useLiceseManagement != undefined ? $scope.formAccessRights.useLiceseManagement : false), ( $scope.formAccessRights.useUsageMetric != undefined ? $scope.formAccessRights.useUsageMetric : false));
		resultAccessLicensePrevilage.then(function(data) {
			successMsgService.showSuccessOrErrorMsg(data);
			if ( data.success ) {
				$scope.getUsersAdminPrivilege();
			}
		});
	};
	*/
	
	// gets user has either can manage license or view usage reports
	$scope.getUsersAdminPrivilege = function() {

		var resultUsersAdminPrivilages = licenseServices.getUsersAdminPrivilege();
		resultUsersAdminPrivilages.then(function(data) {
			if ( ! data.success ) {
				// err
				successMsgService.showSuccessOrErrorMsg(data);
			} else {
				$scope.usersAdminPrivilege = data.message;
			}
			//successMsgService.showSuccessOrErrorMsg(data);
		});
	};
	$scope.getUsersAdminPrivilege();
	//for refresh the card layout after updated
	var loadUsersAdminPrivilege = $rootScope.$on("loadUsersAdminPrivilege", $scope.getUsersAdminPrivilege);
	$rootScope.$on('$destroy', loadUsersAdminPrivilege);
	
	
	// 
	$scope.openUpdateUserAccessRights = function(joUserPrivilage) {

		var modalInstance = $modal.open({
			templateUrl: 'modules/admin/view/updateUserAccessRights.html',
			controller: 'updateUserAccessRightsController',
			size: 'lg',
			resolve: {
				licensingEmailIds: function() {
					return $scope.licensingEmailIds;
				},
				userPrivilage: function() {
					return joUserPrivilage;
				}
			}
		});
	};
}]);

appedoApp.controller('updateUserAccessRightsController', function($scope, $rootScope, $modalInstance, licenseServices, licensingEmailIds, userPrivilage, successMsgService) {	
	$scope.licensingEmailIds = licensingEmailIds;

	$scope.formAccessRights = {};
	
	// since to make readonly of emailId dropdown while edit clicked
	$scope.isEdit = false;
	
	// sets grid value in form while edit from grid
	if ( userPrivilage != undefined ) {
		$scope.isEdit = true;
		
		// sets email id
		for(var i = 0; i < $scope.licensingEmailIds.length; i = i +1) {
			var joEmail = $scope.licensingEmailIds[i];
			
			if( joEmail.email_id === userPrivilage.emailId ) {
				$scope.formAccessRights.email = $scope.licensingEmailIds[i];
			}
		}
		
		$scope.formAccessRights.useLiceseManagement = userPrivilage.canManageLicense;
		$scope.formAccessRights.useUsageMetric = userPrivilage.canViewUsageReports;
	}
	
	
	// update access rights for a user
	$scope.updateUserAccessRights = function() {

		var resultAccessLicensePrevilage = licenseServices.updateUserAccessRights($scope.formAccessRights.email.email_id, ($scope.formAccessRights.useLiceseManagement != undefined ? $scope.formAccessRights.useLiceseManagement : false), ( $scope.formAccessRights.useUsageMetric != undefined ? $scope.formAccessRights.useUsageMetric : false));
		resultAccessLicensePrevilage.then(function(data) {
			successMsgService.showSuccessOrErrorMsg(data);
			if ( data.success ) {
				$rootScope.$emit('loadUsersAdminPrivilege');
				$scope.close();
			}
		});
	};
	

	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};	
});
