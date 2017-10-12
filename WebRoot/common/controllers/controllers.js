appedoApp.controller( 'dashBoard-controller', ['$scope', function( $scope ) {

		$scope.app_health="good";
        $scope.server_health="good";
        $scope.database_health="good";
}]) ;

appedoApp.controller( 'header_controller', ['$scope', '$location', 'apmModulesService', 'SlaMenuBadgeService', 'userServices', 'sessionServices', function( $scope, $location, apmModulesService, SlaMenuBadgeService, userServices, sessionServices) {
/*
	$scope.showAdmin = false;
	var isadmin;
		isadmin = userServices.getIsAdmin();
		isadmin.then(function(resp) {
		if(resp.success){
			$scope.showAdmin = resp.isAdmin;
		}else{
			$scope.showAdmin = false;
		}
    });
*/
    $scope.loginUser = JSON.parse(sessionServices.get('loginUser'));
    
	$scope.getClass = function(path) {
		if ($location.path().substr(0, path.length) == path) {
			return "active";
		} else {
			return "";
		}
	};
	
	SlaMenuBadgeService.getSlaMenuBadge($scope);
	
   var resultDonutChartData = apmModulesService.getDonutChartdata("APPLICATION");
   resultDonutChartData.then(function(resp) {
	   $scope.AppSum = 0;
	   $scope.applicationInactive = 0;
	   $scope.applicationActive = 0;
	   if(resp!=undefined){
		   if(resp.success){
			   angular.forEach(resp.message, function(applications){
				   if(applications.label == 'Inactive') {
					   $scope.applicationInactive = applications.value;
				   } 
				   if(applications.label == 'Active') {
					   $scope.applicationActive = applications.value;
				   }
				   $scope.AppSum += parseInt(applications.value);
				   $scope.AppSum = isNaN(parseInt($scope.AppSum)) ? 0 : parseInt($scope.AppSum);
				});
		   }
	   }
   });
   
   var resultDonutChartData = apmModulesService.getDonutChartdata("SERVER");
   resultDonutChartData.then(function(resp) {
	   $scope.serverSum = 0;
	   $scope.serverInactive = 0;
	   $scope.serverActive = 0;
	   if(resp!=undefined){
		   if(resp.success){
			   angular.forEach(resp.message, function(servers){
				   if(servers.label == 'Inactive') {
					   $scope.serverInactive = servers.value;
				   } 
				   if(servers.label == 'Active') {
					   $scope.serverActive = servers.value;
				   }
				   $scope.serverSum += parseInt(servers.value);
				   $scope.serverSum = isNaN(parseInt($scope.serverSum)) ? 0 : parseInt($scope.serverSum);
				});
		   }
	   }
   });
   
   var resultDonutChartData = apmModulesService.getDonutChartdata("DATABASE");
   resultDonutChartData.then(function(resp) {
	   $scope.dbSum = 0;
	   $scope.dbInactive = 0;
	   $scope.dbActive = 0;
	   if(resp!=undefined){
		   if(resp.success){
			   angular.forEach(resp.message, function(dbs){
				   if(dbs.label == 'Inactive') {
					   $scope.dbInactive = dbs.value;
				   } 
				   if(dbs.label == 'Active') {
					   $scope.dbActive = dbs.value;
				   }
				   $scope.dbSum += parseInt(dbs.value);
				   $scope.dbSum = isNaN(parseInt($scope.dbSum)) ? 0 : parseInt($scope.dbSum);
				});
		   }
	   }
   });
}]);

appedoApp.controller( 'dashboard_navigation_controller', ['$scope','$rootScope','apmModulesService','sessionServices',
                                                          function( $scope, $rootScope, apmModulesService, sessionServices ) {
    $scope.message = "This is dashboard sub navigation controller" ;
    
    // for default APM page 
    //$scope.dbtype = "apm";
    
    // for default ServiceMap page
    $scope.dbtype = "servicesmap";
    
    $scope.displayflag_apm = "false";
    $scope.displayflag_rum = "false";
    $scope.displayflag_sum = "false";
    $scope.displayflag_loadtest = "false";
    $scope.displayflag_servicemap = "true";
    $scope.dashBoardTitle = "APP DEEP DIVE METRICS";
    $scope.setDashboardType = function (dbType) {
       $scope.resetDashboardflags();
       $scope.dbtype = dbType;

       switch(dbType){
           case "sum":
              $scope.displayflag_sum = "true";
              $scope.dashBoardTitle = "SUM METRICS";
              break;
           case "rum":
              $scope.displayflag_rum = "true";
              $scope.dashBoardTitle = "RUM METRICS";
              break;
            case "apm":
              $scope.displayflag_apm = "true";
              $scope.dashBoardTitle = "APP DEEP DIVE METRICS";
              break;
            case "loadtest":
              $scope.displayflag_loadtest = "true";
              $scope.dashBoardTitle = "LOAD TEST METRICS";
              break;
            case "servicesmap":
                $scope.displayflag_servicemap = "true";
                $scope.dashBoardTitle = "SERVICE MAP";
                break;
        };
    };

    $scope.resetDashboardflags = function () {
        $scope.displayflag_sum = "false";
        $scope.displayflag_rum = "false";
        $scope.displayflag_apm = "false";
        $scope.displayflag_loadtest = "false";
        $scope.displayflag_servicemap = "false";
   };

   $scope.showApmDashPanel01 = false;
   $scope.showApmDashPanel02 = false;
   $scope.showApmDashPanel03 = false;

   var resultDonutChartData = apmModulesService.getDonutChartdata("APPLICATION");
   resultDonutChartData.then(function(resp) {
	   if(resp!=undefined){
		   if(resp.success){
			   $scope.showApmDashPanel01 = checkValue(resp.message);
			   sessionServices.set("showAPMApp",$scope.showApmDashPanel01);
		   }
	   }
   });
   
   var resultDonutChartData = apmModulesService.getDonutChartdata("SERVER");
   resultDonutChartData.then(function(resp) {
	   if(resp!=undefined){
		   if(resp.success){
			   $scope.showApmDashPanel02 = checkValue(resp.message);
			   sessionServices.set("showAPMSvr",$scope.showApmDashPanel02);
		   }
	   }
   });

   var resultDonutChartData = apmModulesService.getDonutChartdata("DATABASE");
   resultDonutChartData.then(function(resp) {
	   if(resp!=undefined){
		   if(resp.success){
			   $scope.showApmDashPanel03 = checkValue(resp.message);
			   sessionServices.set("showAPMDb",$scope.showApmDashPanel03);
		   }
	   }
   });
   
   /*
   sessionServices.set("showAPMApp",$scope.showApmDashPanel01);
   sessionServices.set("showAPMSvr",$scope.showApmDashPanel02);
   sessionServices.set("showAPMDb",$scope.showApmDashPanel03);
   */
   
   function checkValue(data){
       	var result = false;
       	var total="0";
       	var activeTotal="0";
       	data.forEach(function(d) {
               total = Number(total)+d.value;
               if(d.label=="Active"){
               	activeTotal = Number(activeTotal)+d.value;
               }
           });	
       	
       	if(Number(total)>0){
           	if(Number(activeTotal)>0){
           		result=true;
           	}else{
           		result=false;
           	}
       	}
       	return result;
       }

   $scope.setType = function(data){
	   $rootScope.navData = data;
   };

}]);

appedoApp.controller('login_controller', ['$scope','sessionServices',function($scope, sessionServices) {
        
     $scope.loginData = {};
     $scope.showErrorMsg = false;
     $scope.showSuccessMsg = false;
     
	 if (sessionServices.get("errorMsg") != "" && sessionServices.get("errorMsg") != undefined){
		 $scope.showErrorMsg = true;
		 $scope.errorMsg = sessionServices.get("errorMsg");
		 $scope.loginData.email = sessionServices.get("emailId") || "";
		 sessionServices.destroy("errorMsg");
		 sessionServices.destroy("emailId");
	 }
     
	 if (sessionServices.get("successMsg") != "" && sessionServices.get("successMsg") != undefined){
		 $scope.showSuccessMsg = true;
		 $scope.successMsg = sessionServices.get("successMsg");
		 sessionServices.destroy("successMsg");
	 }
	 var d3ChartTimeFormat = ["%H : %M", "%H : %M", "%d %b", "%d %b", "%d %b", "%d %b", "%d %b"];
	 var sliderServerSideScale = ["1 hour", "1 day", "7 days", "15 days", "30 days", "60 days", "120 days"];
	 var noRecordForDonut = [{"label":"NA","value":0}];
	 
	 var d3ChartTimeFormatForLT = ["%d %b %H:%M", "%H : %M", "%H : %M : %S"];
	 var d3ChartTypeForLT = [ "Hours", "Mins", "Secs"];

	 sessionServices.set("d3ChartTimeFormat",JSON.stringify(d3ChartTimeFormat));
	 sessionServices.set("sliderServerSideScale",JSON.stringify(sliderServerSideScale));
	 sessionServices.set("noRecordForDonut",JSON.stringify(noRecordForDonut));
	 sessionServices.set("textRefresh",1000*120);
	 sessionServices.set("graphRefresh", 1000*60);
	 sessionServices.set("d3ChartTimeFormatForLT",JSON.stringify(d3ChartTimeFormatForLT));
	 sessionServices.set("d3ChartTypeForLT",JSON.stringify(d3ChartTypeForLT));

}]);

appedoApp.controller('login_response_controller', ['$scope', '$state', '$location', 'sessionServices', 'userServices', function($scope, $state, $location, sessionServices, userServices) {
	
	var errorMesages = ["Invalid Email Id and Password", "Email Id and password do not match", "Please verify your inbox/spam/junk for the verification mail.\nClick on the link given in the email before you login.", "Email doesn't exists", "Your account is inactive. Please contact sales@appedo.com for further clarifications.", "E-mail Verification failed", "Password mismatch.", "Link is expired."];
   	var arySuccessMessages = ["Email is sent with reset link. Check your inbox/spam/junk.", "Check your inbox/spam/junk for the verification mail.\nClick on the link given in the email.", "Your mail has been verified. Check your inbox/spam/junk, to download SUM agent.", "Your mail has been verified.", "Logged out Successfully", "Password Changed Successfully"]; 
   	
   	if(Object.keys($location.search()).length>0){
   		if($location.search()._err != undefined){
   	   		$state.transitionTo('/login');
   	   		sessionServices.set("errorMsg",errorMesages[$location.search()._err-1]);
   	   	    sessionServices.set("emailId",$location.search().emailId || "");
   	   	}else {
   	   		$state.transitionTo('/login');
   	   		sessionServices.set("successMsg",arySuccessMessages[$location.search()._smsg-1]);
   	   	}
   	} else {
   		userServices.getLoginUserDetails(function(data) {
   			if ( ! data.success ) {
   				// err
   			} else {
   				// sets loginuser details in sessionStorage
   				sessionServices.set('loginUser', JSON.stringify(data.message));
   			}
   		});
   		$state.transitionTo('/dashboard');
   	}
}]);

appedoApp.controller('signup_controller', ['$scope', '$state', '$location', 'sessionServices', function($scope, $state, $location, sessionServices) {        
	$scope.signupData = {};
	$scope.showSignupErrorMsg = false;
	$scope.signupErrorMsg = "";
	var errorMesages = ["Invalid Email Id and Password", "Email Id and password do not match", "Please verify your inbox/spam/junk for the verification mail. Click the link given in the email before you login.", "Email doesn't exists", "Your account is inactive. Please contact sales@appedo.com for further clarifications.","Password should be same.","Email Id already exists.","Password mismatch.", "Captcha Code does not match."];
	
	if(Object.keys($location.search()).length>0){
   		if($location.search()._err != undefined){
   			$scope.showSignupErrorMsg = true;
   			$scope.signupErrorMsg = errorMesages[$location.search()._err-1];
   	   	}else {
   	   		$scope.showSignupErrorMsg = false;
   	   	}
   	}
}]);

appedoApp.controller('resetPassword_controller', ['$scope', '$state', '$location', 'sessionServices', function($scope, $state, $location, sessionServices) {        
	
	$scope.uid="";
	if(Object.keys($location.search()).length>0){
   		if($location.search().userId != undefined){
   			$scope.uid = $location.search().userId;
   	   	}
   	}
	
	$scope.pwdSubmit = false;
	$scope.checkPassword = function(){
		if($scope.password != $scope.retype_password)
		{
			$scope.userAlert = "Password and re-entered password not matching.";
			$scope.pwdSubmit = true;
		}else{
			$scope.pwdSubmit = false;
		}	
	};
}]);

appedoApp.controller( 'form_controller', ['$scope', '$modal', 'ajaxCallService', 
                                          function( $scope, $modal, ajaxCallService) {
	$scope.openAddModuleType = function () {
		var modalInstance = $modal.open({
			templateUrl: 'common/views/select_module.html',
			controller: 'form_instance_controller',
			size: 'lg',
			backdrop : 'static'
		});
	};

	$scope.openNotificationsModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'common/views/notifications_module.html',
			controller: 'form_instance_controller',
			size: 'lg',
			backdrop : 'static'
		});
	};
	
	$scope.changePasswordModal = function() {
		console.debug('change password');
		var modalInstance = $modal.open({
			templateUrl: 'common/views/changePassword.html',
			controller: 'changePasswordController',
			size: 'lg'
		});
	};
}]);


appedoApp.controller( 'form_instance_controller', ['$scope', '$rootScope', '$modalInstance', '$location', 'ajaxCallService', '$modal', 
                                                   function( $scope, $rootScope, $modalInstance, $location, ajaxCallService, $modal) {

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.itr = 0;
    var locPath = $location.path().split("/")[1];
    var navData = $rootScope.navData;
    // list of options available
    $scope.options = [
                      {id: 0, name: "APM", path: "dashboard"}, 
                      {id: 1, name: "SUM", path: "sum_metrics"}, 
                      {id: 2, name: "RUM", path: "rum_metrics"}, 
                      {id: 3, name: "LT", path: "load_test"}, 
                      {id: 4, name: "SLA", path: "sla_home"},
                      {id: 5, name: "Service Map", path: "service_map"}
                      ];

    for(var i=0; i < $scope.options.length; i++){
     if(navData == $scope.options[i].name){
      $scope.itr = $scope.options[i].id;
      $rootScope.navData = "";
     }
     if(locPath == $scope.options[i].path){
      $scope.itr = $scope.options[i].id;
     }
    }

    $scope.$watch('selectType', function () {
        var appURL = "";

        if ($scope.selectType != undefined){
         if ($scope.selectType.path == 'dashboard') {
          appURL="common/data/module_content_apm.json";
         }
         else if ($scope.selectType.path == 'sum_metrics') {
          appURL="common/data/module_content_sum.json";
         }
         else if ($scope.selectType.path == 'rum_metrics') {
          appURL="common/data/module_content_rum.json";
         }
         else if ($scope.selectType.path == 'load_test') {
          appURL="common/data/module_content_lt.json";
         }
         else if ($scope.selectType.path == 'sla_home') {
          appURL="common/data/module_content_sla.json";
         }
         else if ($scope.selectType.path == 'service_map') {
          appURL="common/data/module_content_service_map.json";
         }
        }

        if(appURL!=""){
            ajaxCallService.getJsonData(appURL, function(responseData){
                $scope.moduleCardsContent = responseData;
            });
        } 
    });
    
    $scope.notifications = [
                            {id:1, message: 'Server 4 is down', time: '2015-03-28T17:57:28.556094Z'},
                            {id:2, message: 'App 4 is not responding', time: '2015-03-31T09:23:28.556094Z'},
                            {id:3, message: 'The response time is bad for demo app', time: '2015-04-01T09:34:28.556094Z'}
                            ];
	
	$scope.openAddModule = function (moduleCardContent) {			
		$scope.moduleCardData = moduleCardContent;
		$scope.moduleCardContent = moduleCardContent;
		var templateUrl = "";
		var controllerName = "";
		if(moduleCardContent.selection == "APM") {
			var modalInstance = $modal.open({
				templateUrl: 'common/views/add_module.html',
				controller: 'add_module_controller',
				size: 'lg',
				backdrop : 'static',
				resolve: {
					moduleCardContent: function() {
						return $scope.moduleCardContent;
					}							
				}
			});
		} else if (moduleCardContent.selection == "RUM") {
			var modalInstance = $modal.open({
				templateUrl: 'modules/rum/view/add_rum_module.html',
				controller: 'addRumController',
				size: 'lg',
				backdrop : 'static',
				resolve: {
					moduleCardContent: function() {
						return $scope.moduleCardContent;
					}							
				}
			});
		} else if (moduleCardContent.selection == "SUM") {
			var modalInstance = $modal.open({
				templateUrl: 'modules/sum/view/add_sum_test.html',
				controller: 'addSumController',
				size: 'lg',
				backdrop : 'static',
				resolve: {
					isFrom: function() {
						return 'fromAdd';
					},
					sumTestData: function() {
						return null;
					},							
					 moduleCardContent: function() {
						return $scope.moduleCardContent;
					}							
				}
		});
		} else if (moduleCardContent.selection == "SLA") {
			if(moduleCardContent.module_name=="SLA Setting"){
				var modalInstance = $modal.open({
					templateUrl: 'modules/sla/view/sla_setting.html',
					controller: 'slaSettingController',
					size: 'lg',
					resolve: {
						isFrom: function() {
							return 'fromAdd';
						},
						slaActionFormData: function() {
							return null;
						},					
						moduleCardContent: function() {
							return $scope.moduleCardContent;
						}							
					}
				});
			}
			if(moduleCardContent.module_name=="Manage Actions"){
				var modalInstance = $modal.open({
					templateUrl: 'modules/sla/view/add_sla_action.html',
					controller: 'addSlaActionController',
					size: 'lg',
					resolve: {
						isFrom: function() {
							return 'fromAdd';
						},
						slaActionFormData: function() {
							return null;
						},					
						moduleCardContent: function() {
							return $scope.moduleCardContent;
						}							
					}
				});
			}
			if(moduleCardContent.module_name=="Manage Rule"){
				var modalInstance = $modal.open({
					templateUrl: 'modules/sla/view/add_sla_rule.html',
					controller: 'addSlaRuleController',
					size: 'lg',
					resolve: {
						isFrom: function() {
							return 'fromAdd';
						},
						slaRuleFormData: function() {
							return null;
						},						
						moduleCardContent: function() {
							return $scope.moduleCardContent;
						}							
					}
				});
			}
			if(moduleCardContent.module_name=="SLA Policy"){
				var modalInstance = $modal.open({
					templateUrl: 'modules/sla/view/add_sla_policy.html',
					controller: 'addSlaPolicyController',
					size: 'lg',
					resolve: {
						isFrom: function() {
							return 'fromAdd';
						},
						slaPolicyFormData: function() {
							return null;
						},							
						moduleCardContent: function() {
							return $scope.moduleCardContent;
						}							
					}
				});
			}
			if(moduleCardContent.module_name=="Manage Setting"){
				var modalInstance = $modal.open({
					templateUrl: 'modules/sla/view/sla_setting.html',
					controller: 'SlaSettingController',
					size: 'lg',
					resolve: {
						isFrom: function() {
							return 'fromAdd';
						},
						slaSettingFormData: function() {
							return null;
						},							
						moduleCardContent: function() {
							return $scope.moduleCardContent;
						}					
					}
				});
			}
		} else if (moduleCardContent.selection == "Load Testing") {
			var modalInstance = $modal.open({
				templateUrl: 'modules/load_test/view/add_edit_lt.html',
				controller: 'addLTController',
				size: 'lg',
				resolve: {
					moduleCardContent: function() {
						return $scope.moduleCardContent;
					}, isFrom: function() {
						return "fromAdd";
					}, ltScenarioData: function() {
						return null;
					}							
				}
			});
		} else if (moduleCardContent.selection == "ServiceMap") {
			var modalInstance = $modal.open({
				templateUrl: 'modules/services_map/dashboard/add_servicemap.html',
				controller: 'addServiceMapController',
				size: 'lg',
				resolve: {
					isFrom: function() {
						return 'fromAdd';
					},
					serviceMapEditData: function() {
						return null;
					},							
					 moduleCardContent: function() {
						return $scope.moduleCardContent;
					}							
				}
			});
		}
			$modalInstance.dismiss('cancel');
	};
}]) ;

appedoApp.controller('add_module_controller', function($scope, moduleCardContent, $modalInstance, moduleSelectorService, $modal, $rootScope, successMsgService) {	
	$scope.moduleCardContent = moduleCardContent;
	moduleSelectorService.getModuleTypes($scope, $scope.moduleCardContent);
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};	
	
	$scope.moduledata = {};
	$scope.openDownloadForm = function () {
    	if($scope.moduleAddForm.$valid) { 
    		moduleSelectorService.saveModule($scope, $scope.moduleCardContent, function (data) {
    			if(data.success){
    				$rootScope.$emit('load_apm_card_layout');
    				$modalInstance.dismiss('cancel');
    				var modalInstance = $modal.open({
        	    		templateUrl: 'common/views/download_module.html',
        	    		controller: 'download_form_controller',
        	    		size: 'lg',
        	    		backdrop : 'static',
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
    			} else {
    				successMsgService.showSuccessOrErrorMsg(data);
    			}
    		});
    	}
    	//$modalInstance.dismiss('cancel');
    };
});

appedoApp.controller('download_form_controller', function($scope, moduleAddData, moduleDownloadData, $modalInstance, moduleSelectorService, $state, $location, moduleCardContent) {	
	$scope.moduleAddData = moduleAddData;
	
	$scope.currentModule = moduleCardContent.module_name;
	console.log($scope.currentModule);
	$scope.moduleCardContent = moduleCardContent;
	$scope.moduleDownloadData = moduleDownloadData;
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};
	
	//var currentUrl = $location.url();
	$scope.redirectCardLayout = function (data) {
		if($scope.currentModule=="Application") {
			$state.transitionTo('/apm_home/application');
			$scope.currentModuleName = 'application';
		} else if($scope.currentModule=="Server") {
			$scope.currentModuleName = 'server';
			$state.transitionTo('/apm_home/servers');
		} else if($scope.currentModule=="Database") {
			$scope.currentModuleName = 'database';
			$state.transitionTo('/apm_home/db');
		}
	};
});


appedoApp.controller('DatepickerCtrl', function ($scope) {
  $scope.today = function() {
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    currentDate = new Date() ;
    $scope.dt = currentDate.getDate() + "-" + (months[currentDate.getMonth()]) + "-" + currentDate.getFullYear() ;
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

//  // Disable weekend selection
//  $scope.disabled = function(date, mode) {
//    return ( mode === 'day' && ( date.getDay() === 1 || date.getDay() === 6 ) );
//  };

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

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1,
    showWeeks: 'false',
    startingDay: 0,
    formatDay:'d'
  };

  $scope.format = 'd-MMM-yyyy' ;
});

appedoApp.controller('PaginationCtrl', function ($scope, $log) {
	$scope.totalItems = 64;
	$scope.currentPage = 5;
});


appedoApp.controller('changePasswordController', ['$scope', '$modalInstance', 'sessionServices', 'userServices', function($scope, $modalInstance, sessionServices, userServices) {
	//$scope.loginData = {};
	$scope.showErrorMsg = false;
	$scope.showSuccessMsg = false;
	
   	var arySuccessMessages = ["Password changed Successfully"];
	var aryErrorMesages = ["Old Password doesn't match.", "New & Retype Password doesn't match.", "Problem with Services."];

	// used in ng-model
	$scope.userPasswordDetails = {};
	
	
	$scope.changePassword = function() {
		userServices.changePassword($scope.userPasswordDetails, function(data){
			if ( data.success ) {
				// password changed successfully 

				if ( ! isNaN( data.message )) {
					$scope.showSuccessMsg = true;
					$scope.successMsg = arySuccessMessages[parseInt(data.message) - 1];
				}
				
				// signout
				userServices.signOut();
			} else {
				// err

				// is Not a Number
				if ( ! isNaN( data.errorMessage )) {
					$scope.showErrorMsg = true;
					$scope.errorMsg = aryErrorMesages[parseInt(data.errorMessage) - 1];
				}
			}
		});
	};


    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    
	/*
	// avoided `changePasswordResponseController` since changePassword page changed to modal window instead of page.
	if (sessionServices.get("errorMsg") != "" && sessionServices.get("errorMsg") != undefined){
		$scope.showErrorMsg = true;
		$scope.errorMsg = sessionServices.get("errorMsg");
		//$scope.loginData.email = sessionServices.get("emailId");
		sessionServices.destroy("errorMsg");
	} else if (sessionServices.get("successMsg") != "" && sessionServices.get("successMsg") != undefined){
		$scope.showSuccessMsg = true;
		$scope.successMsg = sessionServices.get("successMsg");
		sessionServices.destroy("successMsg");
	}
	*/
}]);
// avoided `changePasswordResponseController` since changePassword page changed to modal window instead of page.
appedoApp.controller('changePasswordResponseController', ['$scope', '$state', '$location', 'userServices', 'sessionServices', function ($scope, $state, $location, userServices, sessionServices) {
   	var arySuccessMessages = ["Password changed Successfully"];
	var aryErrorMesages = ["Old Password doesn't match.", "New & Retype Password doesn't match.", "Problem with Services."];

   	if(Object.keys($location.search()).length>0){
   		$state.transitionTo('/changePassword');
   		
   		if( $location.search()._err != undefined ){
   			sessionServices.set("errorMsg", aryErrorMesages[$location.search()._err-1]);
   	   	} else {
   	   		sessionServices.set("successMsg", arySuccessMessages[$location.search()._smsg-1]);
   	   	}
	}/* else{
   		$state.transitionTo('/dashboard');
   	}*/
}]);

appedoApp.controller('userProfileController', ['$scope', 'userServices', 'sessionServices', function ($scope, userServices, sessionServices) {
	$scope.userProfile = {};
	$scope.showErrorMsg = false;
	$scope.showSuccessMsg = false;
    
	
	function getMyProfileDetailsSuccessCallback(response) {
		if(response.success) {
			$scope.userProfile = response.message;
		} 
	}

	userServices.getMyProfileDetails($scope, getMyProfileDetailsSuccessCallback);
	
    
	if (sessionServices.get("errorMsg") != "" && sessionServices.get("errorMsg") != undefined){
		$scope.showErrorMsg = true;
		$scope.errorMsg = sessionServices.get("errorMsg");
		//$scope.loginData.email = sessionServices.get("emailId");
		sessionServices.destroy("errorMsg");
	} else if (sessionServices.get("successMsg") != "" && sessionServices.get("successMsg") != undefined){
		$scope.showSuccessMsg = true;
		$scope.successMsg = sessionServices.get("successMsg");
		sessionServices.destroy("successMsg");
	}
}]);

appedoApp.controller('userProfileResponseController', ['$scope', '$state', '$location', 'userServices', 'sessionServices', function ($scope, $state, $location, userServices, sessionServices) {
   	var arySuccessMessages = ["Profile updated."];
	var aryErrorMesages = ["Unable to Update Profile.", "Problem with Services."];

	if(Object.keys($location.search()).length>0){
   		$state.transitionTo('/profileSettings');
   		
   		if( $location.search()._err != undefined ){
   			sessionServices.set("errorMsg", aryErrorMesages[$location.search()._err-1]);
   	   	} else {
   	   		sessionServices.set("successMsg", arySuccessMessages[$location.search()._smsg-1]);
   	   	}
   	}
}]);

/*
 * for test page `testCardController` in `testCardLayout.html`,
 * Added by navin, used for sample tried pages
 *//*
appedoApp.controller('testCardController', ['$scope', '$http', 'sessionServices', function($scope, $http, sessionServices) {

    $scope.ciEvents = [
	        {
	            "eventId": 48,
	            "eventName": "SearchBook",
	            "eventMethod": "onClick",
	            "eventVisitorCount": "7",
	            "avgEventDuration": "0",
	            "percentageEventVisitorCount": 100,
	            "value": 100,
	            "label": 'SearchBook (onClick)'
	        },
	        {
	            "eventId": 50,
	            "eventName": "Add to Cart",
	            "eventMethod": "onSubmit",
	            "eventVisitorCount": "3",
	            "avgEventDuration": "79",
	            "percentageEventVisitorCount": 42,
	            "value": 42,
	            "label": 'Add to Cart (onSubmit)'
	        },
	        {
	            "eventId": 49,
	            "eventName": "SearchBook",
	            "eventMethod": "onClick",
	            "eventVisitorCount": "1",
	            "avgEventDuration": "0",
	            "percentageEventVisitorCount": 14,
	            "value": 14,
	            "label": 'SearchBook SearchBook SearchBook SearchBook (onClick)'
	        }
	    ];

    $scope.d3XaixsFormat = JSON.parse(sessionServices.get("d3ChartTimeFormat"))[0];
    
    //$scope.testDiscontinueschartData = [{"time":1430904720000,"value":0},{"time":1430904780000,"value":0},{"time":1430904840000,"value":0},{"time":1430904900000,"value":0},{"time":1430904960000,"value":0},{"time":1430905020000,"value":0},{"time":1430905080000,"value":0},{"time":1430905140000,"value":0},{"time":1430905200000,"value":0},{"time":1430905260000,"value":0},{"time":1430905320000,"value":0},{"time":1430905380000,"value":0},{"time":1430905440000,"value":0},{"time":1430905500000,"value":0},{"time":1430905560000,"value":0},{"time":1430905620000,"value":0},{"time":1430905680000,"value":0},{"time":1430905740000,"value":0},{"time":1430905800000,"value":0},{"time":1430905860000,"value":0},{"time":1430905920000,"value":0},{"time":1430905980000,"value":0},{"time":1430906040000,"value":0},{"time":1430906100000,"value":0},{"time":1430906160000,"value":0},{"time":1430906220000,"value":0},{"time":1430906280000,"value":0},{"time":1430906340000,"value":0},{"time":1430906400000,"value":0},{"time":1430906460000,"value":0},{"time":1430906520000,"value":0},{"time":1430906580000,"value":0},{"time":1430906640000,"value":0},{"time":1430906700000,"value":0},{"time":1430906760000,"value":0},{"time":1430906820000,"value":0},{"time":1430906880000,"value":0},{"time":1430906940000,"value":0},{"time":1430907000000,"value":0},{"time":1430907060000,"value":0},{"time":1430907120000,"value":0},{"time":1430907180000,"value":0},{"time":1430907240000,"value":0},{"time":1430907300000,"value":0},{"time":1430907360000,"value":0},{"time":1430907420000,"value":0},{"time":1430907480000,"value":0},{"time":1430907540000,"value":0},{"time":1430907600000,"value":0},{"time":1430907660000,"value":0},{"time":1430907720000,"value":0},{"time":1430907780000,"value":0},{"time":1430907840000,"value":0},{"time":1430907900000,"value":0},{"time":1430907960000,"value":0},{"time":1430908027840,"value":1982},{"time":1430908046791,"value":1982},{"time":1430908066774,"value":1982},{"time":1430908086771,"value":1982},{"time":1430908106770,"value":1982},{"time":1430908126771,"value":2080},{"time":1430908146774,"value":2097},{"time":1430908166786,"value":2097},{"time":1430908186771,"value":2191},{"time":1430908207758,"value":2191},{"time":1430908226788,"value":2191},{"time":1430908246783,"value":2191},{"time":1430908266787,"value":2191},{"time":1430908286798,"value":2191}];
    
    
    
    $scope.testContinueschartData = [{"time":1430906400000,"value":0},{"time":1430906460000,"value":0},{"time":1430906520000,"value":0},{"time":1430906580000,"value":0},{"time":1430906640000,"value":0},{"time":1430906700000,"value":0},{"time":1430906760000,"value":0},{"time":1430906820000,"value":0},{"time":1430906880000,"value":0},{"time":1430906940000,"value":0},{"time":1430907000000,"value":0},{"time":1430907060000,"value":0},{"time":1430907120000,"value":0},{"time":1430907180000,"value":0},{"time":1430907240000,"value":0},{"time":1430907300000,"value":0},{"time":1430907360000,"value":0},{"time":1430907420000,"value":0},{"time":1430907480000,"value":0},{"time":1430907540000,"value":0},{"time":1430907600000,"value":0},{"time":1430907660000,"value":0},{"time":1430907720000,"value":0},{"time":1430907780000,"value":0},{"time":1430907840000,"value":0},{"time":1430907900000,"value":0},{"time":1430907960000,"value":0},{"time":1430908027840,"value":1982},{"time":1430908046791,"value":1982},{"time":1430908066774,"value":1982},{"time":1430908086771,"value":1982},{"time":1430908106770,"value":1982},{"time":1430908126771,"value":2080},{"time":1430908146774,"value":2097},{"time":1430908166786,"value":2097},{"time":1430908186771,"value":2191},{"time":1430908207758,"value":2191},{"time":1430908226788,"value":2191},{"time":1430908246783,"value":2191},{"time":1430908266787,"value":2191},{"time":1430908286798,"value":2191},{"time":1430908306789,"value":2191},{"time":1430908327702,"value":2191},{"time":1430908346802,"value":2191},{"time":1430908366803,"value":2191},{"time":1430908386811,"value":2191},{"time":1430908406803,"value":2191},{"time":1430908426803,"value":2191},{"time":1430908446811,"value":2191},{"time":1430908466817,"value":2191},{"time":1430908486806,"value":2191},{"time":1430908506805,"value":2191},{"time":1430908526811,"value":2191},{"time":1430908546799,"value":2291},{"time":1430908566811,"value":2291},{"time":1430908586811,"value":2291},{"time":1430908606809,"value":2397},{"time":1430908626812,"value":2397},{"time":1430908646811,"value":2488},{"time":1430908666829,"value":2579},{"time":1430908686823,"value":2579},{"time":1430908706807,"value":2670},{"time":1430908726814,"value":2670},{"time":1430908746827,"value":2760},{"time":1430908766807,"value":2850},{"time":1430908786820,"value":2850},{"time":1430908806815,"value":2850},{"time":1430908826816,"value":2850},{"time":1430908846810,"value":2850},{"time":1430908866809,"value":2850},{"time":1430908886833,"value":2850},{"time":1430908906826,"value":2850},{"time":1430908926819,"value":2850},{"time":1430908946820,"value":2850},{"time":1430908966820,"value":2850},{"time":1430908987759,"value":2850},{"time":1430909006845,"value":2850},{"time":1430909026842,"value":2850},{"time":1430909046846,"value":2850},{"time":1430909066845,"value":2850},{"time":1430909086844,"value":2850},{"time":1430909106844,"value":2850},{"time":1430909126861,"value":2850},{"time":1430909146872,"value":2850},{"time":1430909166848,"value":2850},{"time":1430909186843,"value":2850},{"time":1430909207703,"value":2850},{"time":1430909226839,"value":2850},{"time":1430909246859,"value":2850},{"time":1430909266844,"value":2850},{"time":1430909286844,"value":2850},{"time":1430909306844,"value":2850},{"time":1430909326856,"value":2850},{"time":1430909346845,"value":2850},{"time":1430909366845,"value":2850},{"time":1430909386843,"value":2850},{"time":1430909407790,"value":2850},{"time":1430909426852,"value":2850},{"time":1430909446848,"value":2850},{"time":1430909466858,"value":2850},{"time":1430909486852,"value":2850},{"time":1430909506863,"value":2850},{"time":1430909526850,"value":2850},{"time":1430909546852,"value":2850},{"time":1430909566854,"value":2850},{"time":1430909586853,"value":2850},{"time":1430909606855,"value":2850},{"time":1430909626859,"value":2850},{"time":1430909646849,"value":2850},{"time":1430909667879,"value":2850},{"time":1430909686853,"value":2943},{"time":1430909706864,"value":3032},{"time":1430909726857,"value":3032},{"time":1430909746863,"value":3032},{"time":1430909766867,"value":3032},{"time":1430909786873,"value":3123},{"time":1430909806859,"value":3123},{"time":1430909826866,"value":3123},{"time":1430909846873,"value":3123},{"time":1430909866855,"value":3214},{"time":1430909886865,"value":3305},{"time":1430909906857,"value":3396},{"time":1430909926863,"value":3396},{"time":1430909940000,"value":0}];
    
    $scope.testDiscontinueschartData = [
                                        [{"time":1430906400000,"value":0},{"time":1430906460000,"value":0},{"time":1430906520000,"value":0},{"time":1430906580000,"value":0},{"time":1430906640000,"value":0},{"time":1430906700000,"value":0},{"time":1430906760000,"value":0},{"time":1430906820000,"value":0},{"time":1430906880000,"value":0}],
                                        [{"time":1430907300000,"value":0},{"time":1430907360000,"value":0},{"time":1430907420000,"value":0},{"time":1430907480000,"value":0},{"time":1430907540000,"value":0},{"time":1430907600000,"value":0},{"time":1430907660000,"value":0},{"time":1430907720000,"value":0},{"time":1430907780000,"value":0}],
                                        [{"time":1430908027840,"value":1982},{"time":1430908046791,"value":1982},{"time":1430908066774,"value":1982},{"time":1430908086771,"value":1982},{"time":1430908106770,"value":1982},{"time":1430908126771,"value":2080},{"time":1430908146774,"value":2097},{"time":1430908166786,"value":2097},{"time":1430908186771,"value":2191}], 
                                        [{"time":1430908286798,"value":2191},{"time":1430908306789,"value":2191},{"time":1430908327702,"value":2191},{"time":1430908346802,"value":2191},{"time":1430908366803,"value":2191},{"time":1430908386811,"value":2191},{"time":1430908406803,"value":2191},{"time":1430908426803,"value":2191},{"time":1430908446811,"value":2191}],
                                        [{"time":1430908726814,"value":2670},{"time":1430908746827,"value":2760},{"time":1430908766807,"value":2850},{"time":1430908786820,"value":2850},{"time":1430908806815,"value":2850},{"time":1430908826816,"value":2850},{"time":1430908846810,"value":2850},{"time":1430908866809,"value":2850},{"time":1430908886833,"value":2850},{"time":1430908906826,"value":2850},{"time":1430908926819,"value":2850},{"time":1430908946820,"value":2850},{"time":1430908966820,"value":2850},{"time":1430908987759,"value":2850}], 
                                        [{"time":1430909086844,"value":2850},{"time":1430909106844,"value":2850},{"time":1430909126861,"value":2850},{"time":1430909146872,"value":2850},{"time":1430909166848,"value":2850},{"time":1430909186843,"value":2850},{"time":1430909207703,"value":2850},{"time":1430909226839,"value":2850},{"time":1430909246859,"value":2850},{"time":1430909266844,"value":2850},{"time":1430909286844,"value":2850},{"time":1430909306844,"value":2850},{"time":1430909326856,"value":2850},{"time":1430909346845,"value":2850},{"time":1430909366845,"value":2850},{"time":1430909386843,"value":2850},{"time":1430909407790,"value":2850},{"time":1430909426852,"value":2850},{"time":1430909446848,"value":2850},{"time":1430909466858,"value":2850},{"time":1430909486852,"value":2850},{"time":1430909506863,"value":2850},{"time":1430909526850,"value":2850},{"time":1430909546852,"value":2850},{"time":1430909566854,"value":2850},{"time":1430909586853,"value":2850},{"time":1430909606855,"value":2850},{"time":1430909626859,"value":2850},{"time":1430909646849,"value":2850},{"time":1430909667879,"value":2850},{"time":1430909686853,"value":2943},{"time":1430909706864,"value":3032},{"time":1430909726857,"value":3032},{"time":1430909746863,"value":3032},{"time":1430909766867,"value":3032},{"time":1430909786873,"value":3123},{"time":1430909806859,"value":3123},{"time":1430909826866,"value":3123},{"time":1430909846873,"value":3123},{"time":1430909866855,"value":3214},{"time":1430909886865,"value":3305},{"time":1430909906857,"value":3396},{"time":1430909926863,"value":3396},{"time":1430909940000,"value":0}]
    								];
}]);
*/
appedoApp.controller('MapCtrl', ['$scope', 'ajaxCallService', function($scope, ajaxCallService){
	var mapDataURL = "common/data/map_data.json";
	ajaxCallService.getJsonData(mapDataURL, function(responseData){
        $scope.mapData = responseData;
        var runningCount = 0, completedCount = 0;
        for (var key in responseData) {
        	if(responseData[key].label == "Running") {
        		runningCount += responseData[key].count;
        	}
        	if(responseData[key].label == "Completed") {
        		completedCount += responseData[key].count;
        	}
        }
        $scope.runningCount = runningCount;
        $scope.completedCount = completedCount;
    });
}]);
