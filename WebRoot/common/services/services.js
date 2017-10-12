/* Ramkumar: Login is now do =ne thr Services
appedoApp.service('loginServices', ['$http', '$state',
  function($http, $state){	
	this.validateLoginUser = function (loginData, callback) {
		var appedoUsersData = {};		
			$http({
				method: 'GET',
				url: 'common/data/appedoRegdUsers.json',	
				/*params: {
					emailId: loginData.email,
					password: loginData.pwd,
				}*
			}).success(function(users) {
				var loginStatus = false;
					angular.forEach(users, function(user) {
						if(user.emailId == loginData.email && user.password == loginData.pwd){						  
						  loginStatus =true;						 
						}
					});
					
					if(loginStatus == true) {
					  $state.transitionTo('/dashboard');
					  if(callback) {
						  callback("success");
					  } 
					} else {
						  if(callback) {
							  callback("fail");
						  }
					    }									
			});
	};
}]);*/

/*Ameen: Signup is now done thr services 
appedoApp.service('signupServices', ['$http',
    function($http) { 
		this.saveUserData = function(regdata, callback) {	
//			alert("service");
			var userData = {};
			userData.emailId = regdata.email;
			userData.password = regdata.pwd;
			userData.firstName = regdata.firstName;
			userData.lastName = regdata.lastName;
			if(callback) {
				callback("success");
			}
		};
    }
]);*/

// tried, for handling generic error in $http ajax call 
var HEADER_NAME = 'MyApp-Handle-Errors-Generically';
var specificallyHandleInProgress = false;

appedoApp.service('ajaxCallService', ['$http', 
    function($http) {
        this.getJsonData = function(url, callback) {
            $http.get(url).
				success(function(data) {
					if (callback) {
						callback(data);
					}
				}).
				error(function(data) {
				  console.log("Error in Ajax Call");
				});
        };
    }
]);

appedoApp.service('getURLService', ['$http', 
    function($http) {
        this.getUrl = function(modtype, acctype, paneltype, callback) {
			var appURL;
			if (modtype=="apm")
			{
				if(paneltype=="application")
				{
					switch  (acctype){
						case "Apps":
							appURL="common/data/sample.json";
							break;
						case "apm_application_counters":
							appURL="common/data/application_counter.json";
							break;						
						case "apm_application_primary":
							appURL="common/data/apm_application_primary.json";
							break;
						case "Response Time":
							appURL="common/data/sample-area.json";	
							break;	
						case "Load":
							appURL="common/data/sample-area1.json";	
							break;	
						case "Errors":
							appURL="common/data/sample-area2.json";
							break;	
						case "apm_application_secondary_summary_details":
							appURL="common/data/apm_application_secondary_summary.json";
							break;	
						default:
							console.log("No Case Available");	
					}
				}else if(paneltype=="server"){
					switch  (acctype){
						case "Servers":
							appURL="common/data/sample1.json";
							break;
						case "apm_server_primary":
							appURL="common/data/apm_server_primary.json";
							break;							
						case "CPU Usage":
							appURL="common/data/sample-area1.json";
							break;
						case "Load":
							appURL="common/data/sample-area2.json";
							break;
						case "apm_server_secondary_summary_details":
							appURL="common/data/apm_server_secondary_summary.json";
							break;	
						default:
							console.log("No Case Available");
						}
				}else if(paneltype=="db"){
					switch  (acctype){
						case "DBs":
							appURL="common/data/sample2.json";
							break;
						case "apm_dbs_primary":
							appURL="common/data/apm_dbs_primary.json";
							break;								
						case "Throughtput":
							appURL="common/data/sample-area1.json";
							break;
						case "Responses":
							appURL="common/data/sample-area.json";
							break;
						case "apm_dbs_secondary_summary_details":
							appURL="common/data/apm_dbs_secondary_summary.json";
							break;
					default:
						console.log("No Case Available");
					}	
				}else if(paneltype=="general"){
					switch  (acctype){
						case "summary_details":
							appURL="common/data/sample_summary.json";
							break;
						default:
							console.log("No Case Available");
					}
				}
			}
			if (callback) {
				callback(appURL);
			}
        };
    }
]);


appedoApp.service('moduleSelectorService', ['$http',
    function($http) { 
		this.populateModuleData = function($scope, callback) {	
		//	alert("service..");
			$scope.moduleCardsContent={};
			$http({
				method: 'POST',
				url: 'common/data/module_content.json'	
				//params: {	}				
			}).success(function(moduleCardData) {
				$scope.moduleCardsContent = moduleCardData;
			});	

		};
		
		this.getModuleTypes = function($scope, moduleCardContent) {
		    $scope.moduleTypes = {};
		    var url = "";
		    var moduleParams = {};

		    $http({
		        method: 'POST',
		        url: 'apm/getModuleVersions',
		        params:{
		        	moduleName: moduleCardContent.module_name,
		        }
		    }).success(function(moduleSelectData) {
		        $scope.moduleTypes = moduleSelectData;

		        $scope.$watch('moduledata.selectModuleType', function() {
		            $scope.versions = {};
		            if ($scope.moduledata.selectModuleType != undefined) {
		                if ($scope.moduledata.selectModuleType.module_type != undefined) {
		                    $scope.versions = $scope.moduledata.selectModuleType.versions;
		                    $scope.moduledata.version = $scope.versions[0];
		                    
		                    if($scope.moduledata.selectModuleType.module_type=="MSIIS") {
			                    $http({
			        		        method: 'POST',
			        		        url: 'common/data/application_module_clrVersions.json',
			        		        params: moduleParams
			        		    }).success(function(moduleClrVersions) {
			        		    	$scope.clrVersions = moduleClrVersions;
			        		    	//$scope.moduledata.clrVersion = $scope.clrVersions[0];
			        		    });
		                    }
		                }
		            }
		        });

		    });
		};
		
		
		this.saveModule = function($scope, moduleCardContent, callback) {
		    $http({
		        method: 'POST',
		        url: 'apm/addModule',
		        params: {
		        	moduleName: $scope.moduledata.moduleName,
		        	moduleDescription: $scope.moduledata.moduleDescription,
		        	moduleType: moduleCardContent.module_name,
		        	moduleVersion: $scope.moduledata.versionType.ctv_id,
		        	type: $scope.moduledata.selectModuleType.module_type,
		        	clrVersion: ($scope.moduledata.selectModuleType.module_type === 'MSIIS')?$scope.moduledata.clrVersion.clrVersionType:null
		        }
		    }).success(function(resultData) {
		    	if(callback) {
		    		callback(resultData);
		    	}
		    });
		};
    }
]);

appedoApp.factory('sessionServices', ['$http',function($http){
	return{
		set:function(key,value){
			return sessionStorage.setItem(key,value);
		},
		get:function(key){
			return sessionStorage.getItem(key);
		},		
		destroy:function(key){
			return sessionStorage.removeItem(key);
		}
	};
}]);

appedoApp.service('userServices', ['$http', '$q', function($http, $q){

	this.getMyProfileDetails = function($scope, callbackFn) {
	    $http({
	        method: 'POST',
	        url: './getMyProfileDetails'
	    }).success(function(response) {
	    	if(callbackFn instanceof Function) {
	    		callbackFn(response);
	    	}
	    });
	};
	
	this.updateProfile = function(userProfileData, callbackFn) {
		$http({
	        method: 'POST',
	        url: './updateMyProfile',
	        params: {
	        	emailId: userProfileData.emailId,
	        	firstName: userProfileData.firstName,
	        	lastName: userProfileData.lastName,
	        	phoneNo: userProfileData.mobile
	        }
	    }).success(function(response) {
	    	if(callbackFn instanceof Function) {
	    		callbackFn(response);
	    	}
	    });
	};
	
	this.changePassword = function(userPasswordDetails, callbackFn) {
		$http({
	        method: 'POST',
	        url: './changePassword',
	        params: {
	        	oldPassword: userPasswordDetails.oldPassword,
	        	newPassword: userPasswordDetails.newPassword,
	        	retypePassword: userPasswordDetails.retypePassword
	        }
	    }).success(function(response) {
	    	if(callbackFn instanceof Function) {
	    		callbackFn(response);
	    	}
	    });
	};
	
	this.getIsAdmin = function(){
		var deferredObject = $q.defer();
		$http({
	        method: 'POST',
	        url: './isAdmin',
	    }).success(deferredObject.resolve)
		   .error(deferredObject.resolve);

			return deferredObject.promise;
	};
			
	this.signOut = function() {
		window.location.href = './logoutSession';
	};
	
	this.getLoginUserDetails = function(callbackFn) {

		$http({
	        method: 'POST',
	        url: './getLoginUserDetails'
	    }).success(function(response) {
	    	if(callbackFn instanceof Function) {
	    		callbackFn(response);
	    	}
	    });
	};
}]);

//rum services

appedoApp.service('rumCardService', ['$http','$q', function($http, $q) { 
 		this.populateRumCardData = function($scope, moduleType, callback) {	
 		//	alert("service..");
 			$scope.appcardscontent={};
 			$http({
 				method: 'POST',
 				url: 'rum/getRUMSiteDetails',	
 				params: {	
 					moduleType: moduleType,
 					pageLimit: 10,
 					pageOffset: 0,
 					
 				}				
 			}).success(function(rumCardData) {
// 				$scope.appcardscontent = rumCardData.moduleData;
 				if(callback instanceof Function){
 					callback(rumCardData);
 				};
 			});	
 			
 		};
 		
 		this.getTransactionDataService = function() {
 			var deferredObject = $q.defer();
 			$http({
 				method: 'POST',
 				url: 'rum/getRUMSiteTransDetails',
// 				url: 'common/data/rum_transaction_data.json'
// 				params: {moduleCounter: JSON.stringify(jsonObj)}
 			  }).success(deferredObject.resolve)
 			   .error(deferredObject.resolve);

 			return deferredObject.promise;
 		};
 		
 		this.getAgentStatus = function() {
 			var deferredObject = $q.defer();
 			$http({
 				method: 'POST',
 				url: 'rum/getRUMAgentStatus',
// 				url: 'common/data/rum_agent_status_data.json'
// 				params: {moduleCounter: JSON.stringify(jsonObj)}
 			  }).success(deferredObject.resolve)
 			   .error(deferredObject.resolve);

 			return deferredObject.promise;
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
 		
 		this.getDefaultAgentTypes = function(successCallBack) {
 			$http({
 				method : 'POST',
 				url : './common/data/ci_default_agent_types.json'
 			}).success(function(data) {
 				if (successCallBack instanceof Function) {
 					successCallBack(data);
 				}
 			}).error(function(data) {
 				console.log("Error in Ajax Call");
 			});
 		};

 		this.getUserEventsVisitorsCount = function(agentType, environment, successCallBack) {

 			$http({
 				method : 'POST',
 				url : './ci/getUserEventsVisitorsCount',
 				params : {
 					agentType: agentType,
 					environment: environment
 				}
 			}).success(function(data) {
 				if (successCallBack instanceof Function) {
 					successCallBack(data);
 				}
 			}).error(function(data) {
 				console.log("Error in Ajax Call");
 			});
 		};
 		

 		this.getUserEventsDistinctEnvironments = function(successCallBack) {

 			$http({
 				method : 'POST',
 				url : './ci/getUserEventsDistinctEnvironments'
 			}).success(function(data) {
 				if (successCallBack instanceof Function) {
 					successCallBack(data);
 				}
 			}).error(function(data) {
 				console.log("Error in Ajax Call");
 			});
 		};
     }
 ]);

//load_test services

appedoApp.service('ltCardService', ['$http', '$q',
  function($http, $q) { 
	this.populateLTScriptData = function($scope, testType, callback) {	
			$scope.ltscriptscontent={};
			$http({
				method: 'POST',
				url: 'lt/getVUScripts',	
				params: {	
					testTypeScript: testType,
				}				
			}).success(function(data) {
				$scope.ltscriptscontent = data;
			});	

		};
		
		this.populateLTScenarioData = function($scope, testType, callback) {	
				$scope.ltscriptscontent={};
				$http({
					method: 'POST',
					url: 'lt/getVUScenarios',	
					params: {	
						testTypeScript: testType,
					}				
				}).success(function(data) {
					$scope.ltscenarioscontent = data;
				});
			};
			
		this.uploadJmeterScript = function($scope, elem, callback) {//elem
			var files = elem.files;
			var formData = new FormData();
			
			for(var i = 0; i < files.length; i = i + 1) {
				formData.append('file_'+i, files[i]);
			}
			formData.append('upload_file_count', files.length);
			$http.post('./lt/uploadJmeterScript', formData, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined },
	        }).success(function(data, status){

 				if(callback instanceof Function){
 					callback(data);
 				}
	        	
	        }).error(function(data, status){
	        });
		};
  }
]);
// put appedoUtils

appedoApp.factory('RequestsErrorHandler', ['$q', '$injector', function($q, $injector) {
	//var $http = $injector.get('$http');
	
	return {
		// --- The user's API for claiming responsiblity for requests --- 
		specificallyHandled: function(specificallyHandledBlock) {
			specificallyHandleInProgress = true;
			try {
				return specificallyHandledBlock();
			} finally {
				specificallyHandleInProgress = false;
			}
		},
		 
		// --- Response interceptor for handling errors generically --- 
		responseError: function(rejection) {
			var shouldHandle = (rejection && rejection.config && rejection.config.headers
			&& rejection.config.headers[HEADER_NAME]);
			 
			if (shouldHandle) {
				// --- Your generic error handling goes here ---
				
				// checks response error is SESSION_EXIPRED, if true then redirects to signin page
				if(rejection.status >= 500) {
					$injector.invoke(function($http, $appedoUtils) {
						// $http is already constructed at the time and you may
						// use it, just as any other service registered in your
						// app module and modules on which app depends on.
						$appedoUtils.checkServerSession();
					});
				}
			}
			 
			return $q.reject(rejection);
		}
	};
}]);

appedoApp.config(['$provide', '$httpProvider', function($provide, $httpProvider) {
	
	//$provide.factory
	$httpProvider.interceptors.push('RequestsErrorHandler');
	 
	// --- Decorate $http to add a special header by default ---
	function addHeaderToConfig(config) {
		config = config || {};
		config.headers = config.headers || {};
		 
		// Add the header unless user asked to handle errors himself
		if (!specificallyHandleInProgress) {
			config.headers[HEADER_NAME] = true;
		}
		 
		return config;
	}
	 
	// The rest here is mostly boilerplate needed to decorate $http safely
	$provide.decorator('$http', ['$delegate', function($delegate) {
		function decorateRegularCall(method) {
			return function(url, config) {
				return $delegate[method](url, addHeaderToConfig(config));
			};
		}
		 
		function decorateDataCall(method) {
			return function(url, data, config) {
				return $delegate[method](url, data, addHeaderToConfig(config));
			};
		}
		 
		function copyNotOverriddenAttributes(newHttp) {
			for (var attr in $delegate) {
				if (!newHttp.hasOwnProperty(attr)) {
					if (typeof($delegate[attr]) === 'function') {
						newHttp[attr] = function() {
							return $delegate.apply($delegate, arguments);
						};
					} else {
						newHttp[attr] = $delegate[attr];
					}
				}
			}
		}
		 
		var newHttp = function(config) {
			return $delegate(addHeaderToConfig(config));
		};
		 
		newHttp.get = decorateRegularCall('get');
		newHttp.delete = decorateRegularCall('delete');
		newHttp.head = decorateRegularCall('head');
		newHttp.jsonp = decorateRegularCall('jsonp');
		newHttp.post = decorateDataCall('post');
		newHttp.put = decorateDataCall('put');
		 
		copyNotOverriddenAttributes(newHttp);
		 
		return newHttp;
	}]);
}]);

appedoApp.factory('$appedoUtils', function($http, $modal, $state) {
	//var $http = $injector.get('$http');
	var sliderValue, sumSliderValue;
	var sumColors = ["#0b62a4", "#1F8C2A", "#BB1C24", "#B847F5", "#7C7287", "#F59547", "#ADB554", "#229197", "#581464", "#142364"];
	
	// for timer
	var sec = 0, min = 0, hour = 0;
	var timerCountdown;
	
	return {
		MB: 1048576,
		KB: 1024,
		checkServerSession: function() {
			var promise = $http({
				url: './checkSessionExists',
				method: 'POST',
			}).success(function(data, status){
				if(data.success) {
					if(data.message == 'SESSION_EXPIRED') {
						$state.transitionTo('/login');
					}
				} else {
				}
			});
			
			return promise;
		},
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
	    convertMilliSecToHoursMinSec: function(duration) {
	    	var seconds = parseInt((duration/1000)%60)
	        , minutes = parseInt((duration/(1000*60))%60)
	        , hours = parseInt((duration/(1000*60*60))%24)
	        , days = parseInt((duration/(1000*60*60*24))%24);

	        hours = (hours < 10) ? "0" + hours : hours;
		    minutes = (minutes < 10) ? "0" + minutes : minutes;
		    seconds = (seconds < 10) ? "0" + seconds : seconds;

		    var format = hours + ":" + minutes + ":" + seconds;
		    if(days > 0){
			    days = (days < 2) ? days +" day " : days +" days" ;
			    format = days +" "+ format;
		    }
		    
	    	return format;
	    },
	    timeDiffToHoursMinSec: function(nTime1, nTime2) {
	    	// calculates time diff to days:hours:minutes:seconds

	    	// thinks both `convertMilliSecToHoursMinSec` and `timeDiffToHoursMinSec` are same
	    	// Calculate the difference in milliseconds
	    	var nDiffMs = nTime2 - nTime1, joDiff = {};
	    	//take out milliseconds
	    	nDiffMs = nDiffMs/1000;
	    	
	    	joDiff.seconds = Math.floor(nDiffMs % 60);
	    	
	    	nDiffMs = nDiffMs/60;

	    	joDiff.minutes = Math.floor(nDiffMs % 60);
	    	nDiffMs = nDiffMs/60;

	    	joDiff.hours = Math.floor(nDiffMs % 24);  
	    	joDiff.days = Math.floor(nDiffMs/24);
	    	
	    	return joDiff;
	    },
	    timeDiffInMinutes: function(nTime1, nTime2) {
	    	// calculates time difference between two time in millseconds to minutes
	    	var nDiffMs = nTime2 - nTime1;
	    	var nMinutes = Math.round(nDiffMs / (1000 * 60));

	    	return nMinutes;
	    },
	    getLocalTimeInMills: function(date) {
	    	// date.getTime() returns epoch time in utc, converts utc epoch time   
	    	var nDateMillis = (date.getTime() + (date.getTimezoneOffset() * 60000));
	    	var nLocalMillis = nDateMillis - (date.getTimezoneOffset() * 60000);
	    	return nLocalMillis;
	    },
	    stopwatch: function () {
	    	sec++;
	    	
	    	if (sec == 60) {
				sec = 0;
				min = min + 1;
	    	} else {
	    		min = min; 
	    	}
	    	
	    	if (min == 60) {
				min = 0; 
				hour += 1;
	    	}

	    	if (sec<=9) {
	    		sec = "0" + sec;
	    	}
	    	
	    	return ((hour<=9)?"0"+hour:hour)+":"+((min<=9)?"0"+min:min)+":"+sec;
	    }/*,
	    
	    startTimer: function() {
	    	timerCountdown = setInterval(this.stopwatch, 1000)
	    },
	    
	    stopTimer: function() {
	    	clearInterval(timerCountdown);
	    	sec = 0, min = 0, hour = 0;
	    }*/
	};
});

appedoApp.factory('sliderFactory', function() {
	return {
		sliderOptions: {
			from:0.2,
			to: 120.2,
			step: 20,
			scale: ["Last 1 hr","Last 24 hrs", "Last 7 days", "Last 15 days", "Last 30 days", "Last 60 days", "Last 120 days"],
			css: {
				after: {"background-color": "#42A6DB"},
				pointer: {"background-color": "#42A6DB"}
			}
		}
	};
});

appedoApp.service('successMsgService', ['ngToast', 
 function(ngToast) { 
	this.showSuccessOrErrorMsg = function (response) {
		if(response.success == true){
			ngToast.create({
			className: 'success',
			content: response.message,
			timeout: 3000,
			dismissOnTimeout: true,
			dismissButton: true,
			animation: 'fade'
			});
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
	};
}]);

