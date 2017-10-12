
appedoApp.controller('slaActionCardController', ['$scope', 'slaActionsService', '$location', '$state', 'sessionServices', '$modal', 'ngToast', 'successMsgService', '$rootScope', function ($scope, slaActionsService, $location, $state, sessionServices, $modal, ngToast, successMsgService, $rootScope) {
	//card layout
	$scope.slaactions = [];
	slaActionsService.getSLAActions($scope, function(slaActionCardData) {
		$scope.slaactions = slaActionCardData;
	});
	var slaActionCard = $rootScope.$on('close_sla_action_parent_popup', function(event) {
		slaActionsService.getSLAActions($scope, function(slaActionCardData) {
			$scope.slaactions = slaActionCardData;
		});
	});
	$scope.$on('$destroy', slaActionCard);
	//edit action
	$scope.editAction = function(){
		$scope.action = this.slaaction;
		var modalInstance = $modal.open({
			templateUrl: 'modules/sla/view/add_sla_action.html',
			controller: 'addSlaActionController',
			size: 'lg',
			resolve: {
				isFrom: function() {
					return 'fromEdit';
				},
				slaActionFormData: function() {
					return $scope.action;
				},					
				moduleCardContent: function() {
					return $scope.moduleCardContent;
				}							
			}
		});
	};
	$scope.displayMessage = function() {
		$scope.response ={};
		$scope.response.success = false;
		$scope.response.errorMessage = "Action is mapped to rule. Edit and Delete are disabled";
		successMsgService.showSuccessOrErrorMsg($scope.response);
	};
	
	//delete action
	$scope.deleteAction = function() {
		var result = confirm("You will lose records permanently!\nAre you sure you want to delete?");
		if(result == true) {
			$scope.action = this.slaaction;
			slaActionsService.deleteAction($scope, this.slaaction.action_id, function(data) {
				if(data.success){
					for(var i=0; i<$scope.slaactions.length; i++){
						if($scope.slaactions[i].action_id==$scope.action.action_id){
							$scope.slaactions.splice(i, 1);
						}
					}
				}else{
					successMsgService.showSuccessOrErrorMsg(data);
				}
			});
		}
	};
	
}]);


appedoApp.controller('slaRuleCardController', ['$scope', 'slaRuleService', '$location', '$state', 'sessionServices', '$modal', 'ngToast', '$rootScope', 'successMsgService', function ($scope, slaRuleService, $location, $state, sessionServices, $modal, ngToast, $rootScope, successMsgService) {

	//card layout
	$scope.slarules = [];
	slaRuleService.getSLARules($scope, function(slaRuleCardData) {
		$scope.slarules = slaRuleCardData;
	});
	var slaRuleCard = $rootScope.$on('close_sla_rule_parent_popup', function(event) {
		slaRuleService.getSLARules($scope, function(slaRuleCardData) {
			$scope.slarules = slaRuleCardData;
		});
	});
	$scope.$on('$destroy', slaRuleCard);
	//edit rule
	$scope.editRule = function() {
		$scope.rule = this.slarule;
		var modalInstance = $modal.open({
			templateUrl: 'modules/sla/view/add_sla_rule.html',
			controller: 'addSlaRuleController',
			size: 'lg',
			resolve: {
				isFrom: function() {
					return 'fromEdit';
				},
				slaRuleFormData: function() {
					return $scope.rule;
				},						
				moduleCardContent: function() {
					return $scope.moduleCardContent;
				}							
			}
		});
	};
	
	$scope.displayMessage = function() {
		$scope.response ={};
		$scope.response.success = false;
		$scope.response.errorMessage = "Rule is mapped to Policy. Edit and Delete are disabled";
		successMsgService.showSuccessOrErrorMsg($scope.response);
	};
	
	//delete Rule
	$scope.deleteRule = function() {
		var result = confirm("You will lose records permanently!\nAre you sure you want to delete?");
		if(result == true) {
			$scope.rule = this.slarule;
			slaRuleService.deleteRule($scope, this.slarule.rule_id, function(data) {
				if(data.success){
					for(var i=0; i<$scope.slarules.length; i++){
						if($scope.slarules[i].rule_id==$scope.rule.rule_id){
							$scope.slarules.splice(i, 1);
						}
					}
				}
			});
		}
	};
}]);

appedoApp.controller('slaCardController', ['$scope', 'slacardService', '$location', '$state', 'sessionServices', '$modal', 'ngToast', '$rootScope', function ($scope, slacardService, $location, $state, sessionServices, $modal, ngToast, $rootScope) {

	$scope.slaMsg ='SLA Policy';
	$scope.showSLAGrid = true;
	$scope.showAlertLog = false;
	$scope.showHealLog = false;
	
	slacardService.getSLAGrid($scope, function(slaCardData) {
		$scope.slas = slaCardData;
	});
	var slaPolicyCard = $rootScope.$on('close_sla_policy_parent_popup', function(event) {
		slacardService.getSLAGrid($scope, function(slaCardData) {
			$scope.slas = slaCardData;
		});
	});
	$scope.$on('$destroy', slaPolicyCard);
	
	$scope.openAlertLog = function() {
		$scope.slaMsg ='Alert Log - '+this.sla.sla_name;
		$scope.showSLAGrid = false;
		$scope.showAlertLog = true;
		$scope.showHealLog = false;
		slacardService.getSLAAlerLog($scope, this.sla.sla_id, function(slaALerLogCardData) {
			$scope.slaAlerts = slaALerLogCardData;
		});
	};
	
	$scope.openHealLog = function() {
		$scope.slaMsg ='Heal Log - '+this.sla.sla_name;
		$scope.showSLAGrid = false;
		$scope.showAlertLog = false;
		$scope.showHealLog = true;
		slacardService.getSLAHealLog($scope, this.sla.sla_id, function(slaHealLogCardData) {
			$scope.slaHeals = slaHealLogCardData;
		});
	};
	
	$scope.showLogFile = function() {
		var logFileName = this.heal.Exec_log;
		var modalInstance = $modal.open({
			templateUrl: 'modules/sla/view/show_exec_log.html',
			controller: 'showExecLogController',
			size: 'lg',
			resolve: {
				item: function () {
					return logFileName;
				}							
			}
		});
	};
	
	$scope.goBack = function() {
		$scope.slaMsg ='SLA Policy';
		$scope.showSLAGrid = true;
		$scope.showAlertLog = false;
		$scope.showHealLog = false;
	};
	
	$scope.editSLAPolicy = function() {
		$scope.sla = this.sla;
		var modalInstance = $modal.open({
			templateUrl: 'modules/sla/view/add_sla_policy.html',
			controller: 'addSlaPolicyController',
			size: 'lg',
			resolve: {
				isFrom: function() {
					return 'fromEdit';
				},
				slaPolicyFormData: function() {
					return $scope.sla;
				},							
				moduleCardContent: function() {
					return $scope.moduleCardContent;
				}							
			}
		});
	};
	
	$scope.deleteSLAPolicy = function() {
		var result = confirm("You will lose records permanently!\nAre you sure you want to delete?");
		if(result == true) {
			$scope.sla = this.sla;
			
			slacardService.deleteSLAPolicy($scope, this.sla.sla_id, function(data) {
				if(true){
					for(var i=0; i<$scope.slas.length; i++){
						if($scope.slas[i].sla_id==$scope.sla.sla_id){
							$scope.slas.splice(i, 1);
						}
					}
				}
			});
		}
	};
}]);

appedoApp.controller('showExecLogController', ['$scope', '$modal',  '$modalInstance', 'item', 'slacardService',
  	function($scope, $modal, $modalInstance, execFileName, slacardService) {
		
		
		$scope.cardLayout = function() {
	  	      $modalInstance.dismiss('cancel');
	  	};
	  	
	  	var log;
		log = slacardService.getExecLogFile(execFileName);
		log.then(function(data) {
			$scope.logdata = data.message;
		});
}]);

appedoApp.controller('slaSlaveCardController', ['$scope', 'slaSlaveService', '$location', '$state', 'sessionServices', '$modal', 'ngToast', function ($scope, slaSlaveService, $location, $state, sessionServices, $modal, ngToast) {

	var timerSlaveStatus;
	$scope.getAgentStatus = function() {
		clearTimeout(timerSlaveStatus);
		
		slaSlaveService.getSlaveStatus($scope, function(slaSlaveCardData) {
			$scope.slaves = slaSlaveCardData;
		});
		
		timerSlaveStatus = setTimeout($scope.getAgentStatus, sessionServices.get("textRefresh"));
	};
	
	$scope.getAgentStatus();
	
	$scope.$on('$destroy', function() {
		clearTimeout(timerSlaveStatus);
    });
	
}]);

appedoApp.controller('addSlaActionController', ['$scope', '$modal',  '$modalInstance', 'isFrom', 'slaActionFormData', 'moduleCardContent', 'successMsgService', 'slaActionsService', '$rootScope',
  function($scope, $modal, $modalInstance, isFrom, slaActionFormData, moduleCardContent, successMsgService, slaActionsService, $rootScope) {
    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.moduleCardContent=moduleCardContent;
    
    $scope.slaActionForm = {};
    $scope.submitted = false;
    $scope.showProceed = true;
    
    $scope.validateActionName = function () {
    	if($scope.slaActionForm.actionName != undefined && $scope.slaActionForm.actionName != ''){
	    	slaActionsService.isValidActionName($scope, $scope.slaActionForm.actionName, $scope.slaActionForm.actionId, function(data) {
	    		if(data.success){
	    			$scope.showProceed = data.isvalid;
	    			if(data.isvalid){
	    				$scope.response ={};
	            		$scope.response.success = false;
	            		$scope.response.errorMessage = $scope.slaActionForm.actionName+" is already exists.";
	            		successMsgService.showSuccessOrErrorMsg($scope.response);
	    			}
	    		}else{
	    			$scope.showProceed = true;
	    		}
	    	});
    	}
    };
    
    if(isFrom == 'fromEdit') {
    	$scope.slaActionForm.actionId = slaActionFormData.action_id;
    	$scope.slaActionForm.actionName = slaActionFormData.action_name;
    	$scope.slaActionForm.radioPublicORPrivate = slaActionFormData.is_public == true?'public':'pvt';
    	$scope.slaActionForm.actionDescription = slaActionFormData.action_description;
    	$scope.slaActionForm.parameterType = slaActionFormData.parameter_format;
    	$scope.slaActionForm.scriptParameter = slaActionFormData.parameter_values;
    	if(slaActionFormData.is_public){
    		$scope.slaActionForm.radioPublicORPrivate = 'public';
    	}else{
    		$scope.slaActionForm.radioPublicORPrivate = 'pvt';
    	}
    	$scope.slaActionForm.type = slaActionFormData.type;
    	$scope.slaActionForm.actionScript = slaActionFormData.script;
    	$scope.validateActionName();
    } else {
	    $scope.slaActionForm.getPublicAction = false;
	    $scope.slaActionForm.radioPublicORPrivate="pvt";
	    $scope.slaActionForm.parameterType="json";
    }
    
    $scope.addActionScript = function() {
    	$rootScope.$on("close_sla_action_parent_popup", function(event){
    		$modalInstance.close();
    	});
    	var modalInstance = $modal.open({
			 templateUrl: 'modules/sla/view/add_sla_action_script.html',
			 controller: 'addSlaActionScriptController',
			 size: 'lg',
			 resolve: {
				 isFrom: function() {
					 return isFrom;
				 },
				 slaActionForm: function() {
					 return $scope.slaActionForm;
				 },
				 moduleCardContent: function() {
					 return $scope.moduleCardContent;
				 }
			 }
		 });
    };
}]);

appedoApp.controller('addSlaActionScriptController', ['$scope', 'slaActionsService', '$modal', '$modalInstance',  'slaActionForm', 'ngToast', 'isFrom','moduleCardContent', 'successMsgService', '$rootScope',
    function($scope, slaActionsService, $modal, $modalInstance,  slaActionForm,  ngToast, isFrom, moduleCardContent, successMsgService, $rootScope) {

        $scope.close = function() {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.slaActionForm = slaActionForm;
        $scope.moduleCardContent=moduleCardContent;
        $scope.submitted = false;
        
        if(isFrom == 'fromEdit') {
        	$scope.slaActionForm.scriptType = slaActionForm.type;
        	$scope.slaActionForm.actionScript = slaActionForm.actionScript;
        } else {
    	    $scope.slaActionForm.scriptType="shell";
        }
        
        $scope.addActionSave = function() {
//        	$scope.submitted = true;
        	var isvalidated = true;
        	var msgContent = "";
        	if($scope.slaActionForm.actionScript==undefined || $scope.slaActionForm.actionScript == '' || $scope.slaActionForm.actionScript.length<0){
        		isvalidated = false;
        		msgContent = "Script Content ";
        	}
        	
        	if( isvalidated ) {
        		//service for add action
            	if(isFrom == 'fromEdit') {
            		slaActionsService.updateSLAAction($scope, $scope.slaActionForm, $scope.moduleCardContent, function(data) {
            			if(data.success){
            				$rootScope.$emit('close_sla_action_parent_popup');
            				$modalInstance.dismiss('cancel');
            				var modalInstance = $modal.open({
                                templateUrl: 'modules/sla/view/sla_action_success.html',
                                controller: 'addSlaActionSaveController',
                                size: 'lg',
                                resolve: {
                    				isFrom: function() {
                    					return isFrom;
                    				},
                                    slaActionForm: function() {
                                        return $scope.slaActionForm;
                                    },
                					moduleCardContent: function() {
                						return $scope.moduleCardContent;
                					}
                                }
                            });
            			}else{
            				successMsgService.showSuccessOrErrorMsg(data);
            			}
            		});
                }else{
                	slaActionsService.addSLAAction($scope, $scope.slaActionForm, $scope.moduleCardContent, function(data) {
                		if(data.success){
                			$rootScope.$emit('close_sla_action_parent_popup');
                			$modalInstance.dismiss('cancel');
                			var modalInstance = $modal.open({
                                templateUrl: 'modules/sla/view/sla_action_success.html',
                                controller: 'addSlaActionSaveController',
                                size: 'lg',
                                resolve: {
                    				isFrom: function() {
                    					return isFrom;
                    				},
                                    slaActionForm: function() {
                                        return $scope.slaActionForm;
                                    },
                					moduleCardContent: function() {
                						return $scope.moduleCardContent;
                					}
                                }
                            });
                		}else{
            				successMsgService.showSuccessOrErrorMsg(data);
            			}
                	});
                }
        	}else{
        		$scope.response ={};
        		$scope.response.success = false;
        		$scope.response.errorMessage = msgContent+" is mandatory.";
        		successMsgService.showSuccessOrErrorMsg($scope.response);
        	}
        };
    }
]);

appedoApp.controller('addSlaActionSaveController', ['$scope', '$modal', '$modalInstance',  'slaActionForm', 'ngToast', 'isFrom','moduleCardContent',
  function($scope, $modal, $modalInstance,  slaActionForm,  ngToast, isFrom, moduleCardContent) {

      $scope.cardLayout = function() {
    	  	$modalInstance.dismiss('cancel');
      };
      if(isFrom == 'fromEdit') {
    	  $scope.isEditEnabled = true;
      }
      $scope.slaActionForm = slaActionForm;
      $scope.moduleCardContent=moduleCardContent;
}]);

appedoApp.controller('addSlaRuleController', ['$scope', '$modal',  '$modalInstance', 'isFrom', 'slaRuleFormData', 'moduleCardContent', 'slaRuleService', '$rootScope', 'successMsgService',
      function($scope, $modal, $modalInstance, isFrom, slaRuleFormData, moduleCardContent, slaRuleService, $rootScope, successMsgService) {
		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};
		
		$scope.moduleCardContent=moduleCardContent;
//		$scope.submitted = false;
		$scope.showProceed = true;
		$scope.slaRuleForm = {};
		
		var getactions;
		getactions = slaRuleService.getActionsForMapping();
		getactions.then(function(data) {
			$scope.slaRuleForm.actions = data.message;
		});
		
		var getactions;
		getactions = slaRuleService.getActionsForMapping();
		getactions.then(function(data) {
			$scope.slaRuleForm.actions = data.message;
		});
		
		$scope.validateRuleName = function () {
			if($scope.slaRuleForm.ruleName != undefined && $scope.slaRuleForm.ruleName != ''){
				slaRuleService.isValidRuleName($scope, $scope.slaRuleForm.ruleName, $scope.slaRuleForm.ruleId,function(data) {
					if(data.success){
						$scope.showProceed = data.isvalid;
		    			if(data.isvalid){
		    				$scope.response ={};
		            		$scope.response.success = false;
		            		$scope.response.errorMessage = $scope.slaRuleForm.ruleName+" is already exists.";
		            		successMsgService.showSuccessOrErrorMsg($scope.response);
		    			}
		    		}else{
		    			$scope.showProceed = true;
		    		}
		    	});
			}
	    };
	    
		if(isFrom == 'fromEdit') {
		  	$scope.slaRuleForm.ruleId = slaRuleFormData.rule_id;
		  	$scope.slaRuleForm.ruleName = slaRuleFormData.rule_name;
		  	$scope.slaRuleForm.ruleDescription = slaRuleFormData.ruleDescription;
		  	$scope.validateRuleName();
		  	
		  	var rules;
			rules = slaRuleService.getMappedRules($scope.slaRuleForm.ruleId);
			rules.then(function(data) {
				$scope.slaRuleForm.ruleactions = data;
			});
		} else {
			slaRuleService.getActionsForMapping($scope, function(data) {
				$scope.slaRuleForm.actions = data.message;
			});
		}
		
		$scope.saveRuleAndMapAction = function() {
			$rootScope.$on("close_sla_rule_parent_popup", function(event){
				$modalInstance.close();
			});
		  $scope.submitted = true;
		  if( this.ruleForm.$valid ) {
			  var modalInstance = $modal.open({
				  templateUrl: 'modules/sla/view/sla_map_rule_action.html',
				  controller: 'mapSlaRuleAction',
				  size: 'lg',
				  resolve: {
					  isFrom: function() {
						  return isFrom;
					  },
					  slaRuleForm: function() {
						  return $scope.slaRuleForm;
					  },
					  moduleCardContent: function() {
						  return $scope.moduleCardContent;
					  }
				  }
			  });
		  }
	  };
}]);

appedoApp.controller('mapSlaRuleAction', ['$scope', '$modal',  '$modalInstance', 'isFrom', 'slaRuleForm', 'moduleCardContent', 'slaRuleService', 'ngToast', '$rootScope',
	function($scope, $modal, $modalInstance, isFrom, slaRuleForm, moduleCardContent, slaRuleService, ngToast, $rootScope) {
		$scope.close = function() {
			$modalInstance.dismiss('cancel');
		};
		$scope.actions = [];
		$scope.selectedActions = [];
		$scope.moduleCardContent = moduleCardContent;
		$scope.slaRuleForm = slaRuleForm;
		$scope.submitted = false;
		
		$scope.tempactions = [];
//		var getactions;
//		getactions = slaRuleService.getActionsForMapping();
//		getactions.then(function(data) {
//			$scope.actions = data.message;
//			$scope.selectedActions = $scope.actions;
//		});
		
		$scope.actions = $scope.slaRuleForm.actions;
		$scope.selectedActions = $scope.slaRuleForm.actions;
		
		$scope.validateActions = function(){
			$scope.tempactions = [];
			for(var j=0; j<$scope.selectedActions.length; j++){
				if($scope.selectedActions[j].isSelected){
					$scope.submitted = true;
					$scope.tempactions.push($scope.selectedActions[j]);
				}
			}
			if($scope.tempactions.length>0){
				$scope.submitted = true;
			}else{
				$scope.submitted = false;
			}
		};
		
		
		if(isFrom == 'fromEdit') {
//			var rules;
//			rules = slaRuleService.getMappedRules($scope.slaRuleForm.ruleId);
//			rules.then(function(data) {
//				$scope.ruleactions = data;
//				for(var j=0; j<$scope.selectedActions.length; j++){
//					for(var i=0; i<$scope.ruleactions.length; i++){
//						if($scope.ruleactions[i].actionId==$scope.selectedActions[j].actionId){
//							$scope.selectedActions[j].isSelected = true;
//						}
//					}
//				}
//				$scope.validateActions();
//			});
			
			$scope.ruleactions = slaRuleForm.ruleactions;
			for(var i=0; i<$scope.ruleactions.length; i++){
				for(var j=0; j<$scope.selectedActions.length; j++){
					if($scope.ruleactions[i].actionId==$scope.selectedActions[j].actionId){
						$scope.selectedActions[j].isSelected = true;
					}
				}
			}
			$scope.validateActions();
		} else {
		}
		
		$scope.saveMappedActions = function() {
			
		  // save rule service
			$scope.slaRuleForm.actions = $scope.selectedActions;
//			for(var j=0; j<$scope.selectedActions.length; j++){
//				if($scope.selectedActions[j].isSelected){
//					$scope.submitted = true;
//				}
//			}
			if($scope.submitted){
				if(isFrom == 'fromEdit'){
					slaRuleService.updateSLARule($scope, $scope.slaRuleForm, $scope.moduleCardContent, function(data) {
			      		if(data.success){
			      			$rootScope.$emit('close_sla_rule_parent_popup');
			      			$modalInstance.close();
			      			var modalInstance = $modal.open({
			      	          templateUrl: 'modules/sla/view/sla_rule_success.html',
			      	          controller: 'slaRuleSuccess',
			      	          size: 'lg',
			      	          resolve: {
			      				isFrom: function() {
			      					return 'fromEdit';
			      	  	  			},
			      	  	            slaRuleForm: function() {
			      	  	            	return $scope.slaRuleForm;
			      	  	            },
			      	  	  			moduleCardContent: function() {
			      	  	  				return $scope.moduleCardContent;
			      	  	  			}
			      	  	     	}
			      	  	   });
			      		}
			      	});
				}else{
					slaRuleService.addSLARule($scope, $scope.slaRuleForm, $scope.moduleCardContent, function(data) {
			      		if(data.success){
			      			$rootScope.$emit('close_sla_rule_parent_popup');
			      			$modalInstance.close();
			      			var modalInstance = $modal.open({
			      	          templateUrl: 'modules/sla/view/sla_rule_success.html',
			      	          controller: 'slaRuleSuccess',
			      	          size: 'lg',
			      	          resolve: {
			      				isFrom: function() {
			      					return 'fromAdd';
			      	  	  			},
			      	  	            slaRuleForm: function() {
			      	  	            	return $scope.slaRuleForm;
			      	  	            },
			      	  	  			moduleCardContent: function() {
			      	  	  				return $scope.moduleCardContent;
			      	  	  			}
			      	  	     	}
			      	  	   });
			      		}
			      	});
				};
			}else{
				ngToast.create({
					className: 'warning',
					content: 'Select atleast one action',
					timeout: 5000,
					dismissOnTimeout: true,
					dismissButton: true,
					animation: 'fade'
					});
			}
	   };
}]);

appedoApp.controller('slaRuleSuccess', ['$scope', '$modal',  '$modalInstance', 'isFrom', 'moduleCardContent', 'slaRuleForm',
  	function($scope, $modal, $modalInstance, isFrom, moduleCardContent, slaRuleForm) {

		$scope.cardLayout = function() {
	  	      $modalInstance.dismiss('cancel');
	  	};
	  	
	  	if(isFrom == 'fromEdit') {
	  		$scope.isEditEnabled = true;
	  	}
	  	$scope.moduleCardContent=moduleCardContent;
	  	$scope.slaRuleForm = slaRuleForm;
}]);

appedoApp.controller('addSlaPolicyController', ['$scope', '$modal', '$modalInstance', 'ngToast', 'isFrom','moduleCardContent', 'slaPolicyFormData', 'slacardService', '$rootScope', 'successMsgService',
  function($scope, $modal, $modalInstance, ngToast, isFrom, moduleCardContent, slaPolicyFormData, slacardService, $rootScope, successMsgService) {

      $scope.close = function() {
          $modalInstance.dismiss('cancel');
      };
      
//      $scope.submitted = false;
      $scope.showProceed = true;
      $scope.slaPolicyForm = {};
      $scope.rules = [];
      $scope.slas = [];
      
      $scope.moduleCardContent=moduleCardContent;
      
      $scope.validatePolicyName = function () {
    	  var isvalid = true;
    	  if($scope.slaPolicyForm.policyName != undefined && $scope.slaPolicyForm.policyName != ''){
	    	  slacardService.isValidPolicyName($scope, $scope.slaPolicyForm.policyName, $scope.slaPolicyForm.slaId, function(data) {
					if(data.success){
						$scope.showProceed = data.isvalid;
		    			if(data.isvalid){
		    				$scope.response ={};
		            		$scope.response.success = false;
		            		$scope.response.errorMessage = $scope.slaPolicyForm.policyName+" is already exists.";
		            		successMsgService.showSuccessOrErrorMsg($scope.response);
		    			}
		    		}else{
		    			$scope.showProceed = true;
		    		}
		    	});
    	  }
      };
	    
      if(isFrom == 'fromEdit') {
    	  var rules;
          rules = slacardService.getRulesForMapping();
          rules.then(function(data) {
        	  $scope.rules = data.message;
        	  $scope.slaPolicyForm.slaId = slaPolicyFormData.sla_id;
        	  $scope.slaPolicyForm.policyName = slaPolicyFormData.sla_name;
        	  $scope.slaPolicyForm.policyDescription = slaPolicyFormData.description;
        	  $scope.slaPolicyForm.type = slaPolicyFormData.type;
        	  $scope.slaPolicyForm.policySvr = slaPolicyFormData.policySvr;
        	  $scope.slaPolicyForm.policySvrType = slaPolicyFormData.policySvrType;
        	  for(var i=0; i<$scope.rules.length; i++){
        		  if($scope.rules[i].ruleId==slaPolicyFormData.ruleId){
        			  $scope.slaPolicyForm.mappedRule = $scope.rules[i];
        		  }
        	  }
        	  $scope.validatePolicyName();
          });
          $scope.validatePolicyName();
      } else {
    	  var rules;
          rules = slacardService.getRulesForMapping();
          rules.then(function(data) {
        	  $scope.rules = data.message;
          });
      }
      $scope.addPolicySaveAndMapSvr = function() {
    	  
    	  $rootScope.$on("close_sla_policy_parent_popup", function(event){
    		  $modalInstance.close();
    	  });
    	  
    	  $scope.submitted = true;
    	  if( this.policyForm.$valid ){
    		  if($scope.slaPolicyForm.type=='Alert&Heal'){
    			  var modalInstance = $modal.open({
        			  templateUrl: 'modules/sla/view/sla_policy_map_svr.html',
        			  controller: 'slaPolicyMapSvrController',
        			  size: 'lg',
        			  resolve: {
        				  isFrom: function() {
        					  return isFrom;
        				  },
        				  slaPolicyForm: function() {
        					  return $scope.slaPolicyForm;
        				  },
        				  moduleCardContent: function() {
        					  return $scope.moduleCardContent;
        				  }
        			  }
        		  });
    		  }else if(isFrom == 'fromEdit') {
    			  slacardService.updateSLAPolicy($scope, $scope.slaPolicyForm, function(data) {
    				  $rootScope.$emit('close_sla_policy_parent_popup');
    				  $modalInstance.close();
        			  if(data.success){
            			  var modalInstance = $modal.open({
                              templateUrl: 'modules/sla/view/sla_policy_success.html',
                              controller: 'slaPolicySuccess',
                              size: 'lg',
                              resolve: {
                  				isFrom: function() {
                  					return isFrom;
                  				},
                  				slaPolicyForm: function() {
          							return $scope.slaPolicyForm;
                                },
                                slaId: function() {
                                	return $scope.slaPolicyForm.slaId;
                                }
                              }
                          });
            		  }
        		  });
    		  } else{
    			  //sava redirect to grid
    			  slacardService.addSLAPolicy($scope, $scope.slaPolicyForm, function(data) {
            		  if(data.success){
            			  $rootScope.$emit('close_sla_policy_parent_popup');
        				  $modalInstance.close();
            			  var modalInstance = $modal.open({
                              templateUrl: 'modules/sla/view/sla_policy_success.html',
                              controller: 'slaPolicySuccess',
                              size: 'lg',
                              resolve: {
                  				isFrom: function() {
                  					return isFrom;
                  				},
                  				slaPolicyForm: function() {
          							return $scope.slaPolicyForm;
                                },
                                slaId: function() {
                                	return data.slaId;
                                }
                              }
                          });
            		  }
            	  });
    		  }
    	  }
      };
	}
]);

appedoApp.controller('slaPolicyMapSvrController', ['$scope', '$modal', '$modalInstance',  'slaPolicyForm', 'ngToast', 'isFrom','moduleCardContent', 'slacardService', '$rootScope',
   function($scope, $modal, $modalInstance,  slaPolicyForm,  ngToast, isFrom, moduleCardContent, slacardService, $rootScope) {

      $scope.close = function() {
          $modalInstance.dismiss('cancel');
      };
      
      $scope.submitted = false;
      $scope.moduleCardContent=moduleCardContent;
      $scope.slaPolicyForm = slaPolicyForm;
      if(isFrom == 'fromEdit') {
    	  $scope.slaPolicyForm.policySvrType = slaPolicyForm.policySvrType;
    	  $scope.slaPolicyForm.policySvr = JSON.stringify(slaPolicyForm.policySvr);
      } else {
  	    $scope.slaPolicyForm.policySvrType="json";
      }
      
      $scope.addPolicySave = function() {
    	  $scope.submitted = true;
    	  if( this.slaPolicyMapSvrForm.$valid ){
    		  if(isFrom == 'fromEdit'){
        		  slacardService.updateSLAPolicy($scope, $scope.slaPolicyForm, function(data) {
        			  if(data.success){
        				  $rootScope.$emit('close_sla_policy_parent_popup');
        				  $modalInstance.close();
            			  var modalInstance = $modal.open({
                              templateUrl: 'modules/sla/view/sla_policy_success.html',
                              controller: 'slaPolicySuccess',
                              size: 'lg',
                              resolve: {
                  				isFrom: function() {
                  					return isFrom;
                  				},
                  				slaPolicyForm: function() {
          							return $scope.slaPolicyForm;
                                },
                                slaId: function() {
                                	return $scope.slaPolicyForm.slaId;
                                }
                              }
                          });
            		  }
        		  });
              }else{
            	  slacardService.addSLAPolicy($scope, $scope.slaPolicyForm, function(data) {
            		  if(data.success){
            			  $rootScope.$emit('close_sla_policy_parent_popup');
        				  $modalInstance.close();
            			  var modalInstance = $modal.open({
                              templateUrl: 'modules/sla/view/sla_policy_success.html',
                              controller: 'slaPolicySuccess',
                              size: 'lg',
                              resolve: {
                  				isFrom: function() {
                  					return isFrom;
                  				},
                  				slaPolicyForm: function() {
          							return $scope.slaPolicyForm;
                                },
                                slaId: function() {
                                	return data.slaId;
                                }
                              }
                          });
            		  }
            	  });
              }
    	  }
      };
	}
]);

appedoApp.controller('slaPolicySuccess', ['$scope', '$modal',  '$modalInstance', 'isFrom', 'slaPolicyForm', 'slaId', '$rootScope',
  	function($scope, $modal, $modalInstance, isFrom, slaPolicyForm, slaId, $rootScope) {
		if(isFrom=='fromEdit'){
			$scope.isEditEnabled = true;
		}
		$scope.slaPolicyForm = slaPolicyForm;
		$scope.cardLayout = function() {
	  	      $modalInstance.dismiss('cancel');
	  	};
	  	
//	  	$scope.moduleCardContent=moduleCardContent;
	  $scope.mapCounter = function() {
		  
		  $rootScope.$on("close_sla_counter_parent_popup", function(event){
    		  $modalInstance.close();
    	  });
		  
	      var modalInstance = $modal.open({
//	          templateUrl: 'modules/sla/view/sla_policy_map_counter.html',
//		      controller: 'slaPolicyMapCounter',
	    	  templateUrl: 'modules/sla/view/sla_policy_view_map_counter.html',
	    	  controller: 'slaPolicyViewMapCounter',
		      size: 'lg',
		      resolve: {
				isFrom: function() {
						return isFrom;
					},
					slaActionForm: function() {
						return $scope.slaActionForm;
					},
					slaId: function() {
						return slaId;
					}
	          }
	      });
	  };
}]);

appedoApp.controller('slaPolicyViewMapCounter', ['$scope', '$modal',  '$modalInstance', 'isFrom', 'slaId', 'slacardService', '$rootScope',
 	function($scope, $modal, $modalInstance, isFrom, slaId, slacardService, $rootScope) {
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.mappedcounters = [];
	var counters;
	counters = slacardService.getMapCounters(slaId);
	counters.then(function(data) {
		if(data.success){
			$scope.mappedcounters = data.message;
		}
	});

	$scope.deleteMapCounter = function() {
		var result = confirm("You will lose records permanently!\nAre you sure you want to delete?");
		if(result == true) {
			var mapcounter;
			mapcounter = slacardService.deleteMapCounter(slaId, this.counter.mapCounterId, this.counter.guid);
			mapcounter.then(function(data) {
				if(data.success){
					var counters;
					counters = slacardService.getMapCounters(slaId);
					counters.then(function(data) {
						if(data.success){
							$scope.mappedcounters = data.message;
						}
					});
				}
			});
		}
	};
	
	$scope.editMapCounter = function() {
		$scope.counter = this.counter;
		$rootScope.$emit('close_sla_policy_parent_popup');
		$modalInstance.close();
		var modalInstance = $modal.open({
 			templateUrl: 'modules/sla/view/sla_policy_map_counter.html',
 			controller: 'slaPolicyMapCounter',
 			size: 'lg',
 			resolve: {
 				isFrom: function() {
 					return "fromEdit";
 				},
 				slaActionForm: function() {
 					return $scope.counter;
 				},
 				slaId: function() {
 					return slaId;
 				}
 			}
 		});
	};
	
 	$scope.cardLayout = function() {
 		$scope.counter = this.counter;
		$rootScope.$emit('close_sla_policy_parent_popup');
		$modalInstance.close();
 		var modalInstance = $modal.open({
 			templateUrl: 'modules/sla/view/sla_policy_map_counter.html',
 			controller: 'slaPolicyMapCounter',
 			size: 'lg',
 			resolve: {
 				isFrom: function() {
 					return "addForm";
 				},
 				slaActionForm: function() {
 					return $scope.slaActionForm;
 				},
 				slaId: function() {
 					return slaId;
 				}
 			}
 		});
   	};
   	
   	$scope.closemodal = function() {
   		$rootScope.$emit('close_sla_counter_parent_popup');
		$modalInstance.close();
   	};
}]);

appedoApp.controller('slaPolicyMapCounter', ['$scope', '$modal',  '$modalInstance', 'isFrom', 'slaActionForm', 'slaId', 'slacardService', '$rootScope',
 	function($scope, $modal, $modalInstance, isFrom, slaActionForm, slaId, slacardService, $rootScope) {

	 	$scope.cardLayout = function() {
	   	      $modalInstance.dismiss('cancel');
	 	};
	 	$scope.close = function () {
			$modalInstance.dismiss('cancel');
		};	
	 	$scope.slaPolicyMapCounterForm = {};
	 	$scope.slaPolicyMapCounterForm.slaId = slaId;
	 	$scope.submitted = false;
	 	$scope.showmodules = false;
	 	$scope.showcounters = false;
	 	$scope.isEditEnabled = false;
 	
	 	if(isFrom == 'fromEdit'){
	 		$scope.showmodules = true;
		 	$scope.showcounters = true;
		 	$scope.isEditEnabled = true;
	 		$scope.counter = slaActionForm;
	 		$scope.slaPolicyMapCounterForm.moduleType = $scope.counter.moduleName;
	 		$scope.slaPolicyMapCounterForm.agentName = $scope.counter.moduleValue;
	 		$scope.slaPolicyMapCounterForm.counterName = $scope.counter.category +'-'+$scope.counter.countername;
	 		$scope.slaPolicyMapCounterForm.breachType = $scope.counter.breachType;
	 		$scope.slaPolicyMapCounterForm.thresholdabv = $scope.counter.isThresholdAbove==true?'gt':'lt';
		 	$scope.slaPolicyMapCounterForm.minBreachCount = $scope.counter.minBreachCount;
		 	$scope.slaPolicyMapCounterForm.thresholdValue = $scope.counter.thresholdValue;
		 	$scope.slaPolicyMapCounterForm.mapCounterId = $scope.counter.mapCounterId;
		 	$scope.slaPolicyMapCounterForm.guid = $scope.counter.guid;
	 	}else{
	 		$scope.slaPolicyMapCounterForm.thresholdabv = "gt";
		 	$scope.slaPolicyMapCounterForm.minBreachCount = 1;
	 	}
	 	
	 	var breachTypes;
	 	breachTypes = slacardService.getBreachTypes();
	 	breachTypes.then(function(data) {
	 		$scope.breachTypes = data;
	 	});
 	
	 	$scope.getModules = function(){
	 		var moduleTypes;
	 		moduleTypes = slacardService.getModuleTypeValues($scope.slaPolicyMapCounterForm.moduleType);
	 		moduleTypes.then(function(data) {
	 			$scope.showmodules = true;
	 			$scope.showcounters = false;
	 			$scope.modules = data;
	 		});
	 	};
 	
	 	$scope.getCounters = function() {
	 		var counterValue;
	 		counterValue = slacardService.getCounters($scope.slaPolicyMapCounterForm.agentName.uid);
	 		counterValue.then(function(data) {
	 			$scope.showcounters = true;
	 			$scope.counters = data;
	 		});
	 	};
 	
	 	$scope.getCounterValues = function() {
	 		$scope.slaPolicyMapCounterForm.thresholdValue = $scope.slaPolicyMapCounterForm.counterName.thresholdValue;
	 	};
 	
		$scope.saveAndFinish = function() {
	 		$scope.submitted = true;
	 		if( this.policyMapCounterForm.$valid ){
	 			var saveRule;
	 			saveRule = slacardService.addMapCounter($scope, $scope.slaPolicyMapCounterForm);
	 			saveRule.then(function(data) {
	 				if(data.success){
	 					$rootScope.$emit('close_sla_counter_parent_popup');
	 					$modalInstance.close();
	 					var modalInstance = $modal.open({
	 						templateUrl: 'modules/sla/view/sla_policy_view_map_counter.html',
	 						controller: 'slaPolicyViewMapCounter',
	 						size: 'lg',
	 						resolve: {
	 							isFrom: function() {
	 								return 'fromAdd';
	 							},
	 							slaId: function() {
	 								return slaId;
	 							}
	 						}
	 					});
	 				}
	 			});
	 		}
	 	};

 	$scope.saveAndAddCounter = function() {
 		$scope.submitted = true;
 		if( this.policyMapCounterForm.$valid ){
 			var saveRule;
 			saveRule = slacardService.addMapCounter($scope, $scope.slaPolicyMapCounterForm);
 			saveRule.then(function(data) {
 				if(data.success){
 					$scope.counters = [];
 					$scope.modules = [];
 					$scope.slaPolicyMapCounterForm.counterName = '';
 					$scope.slaPolicyMapCounterForm.agentName = '';
 					$scope.slaPolicyMapCounterForm.thresholdValue = '';
 					$scope.slaPolicyMapCounterForm.moduleType = '';
 					$scope.slaPolicyMapCounterForm.breachType = '';
 					$scope.slaPolicyMapCounterForm.minBreachCount = 1;
 					$scope.submitted = false;
 					$scope.showmodules = false;
 					$scope.showcounters = false;
 				}
 			});
 		}
 	};
 	
 	$scope.updateCounter = function() {
 		$scope.submitted = true;
 		if( this.policyMapCounterForm.$valid ){
 			var updateCounter;
 			updateCounter = slacardService.updateMapCounter($scope, $scope.slaPolicyMapCounterForm);
 			updateCounter.then(function(data) {
 				if(data.success){
 					$rootScope.$emit('close_sla_counter_parent_popup');
 					$modalInstance.close();
 					var modalInstance = $modal.open({
 						templateUrl: 'modules/sla/view/sla_policy_view_map_counter.html',
 						controller: 'slaPolicyViewMapCounter',
 						size: 'lg',
 						resolve: {
 							isFrom: function() {
 								return 'fromAdd';
 							},
 							slaId: function() {
 								return slaId;
 							}
 						}
 					});
 				}
 			});
 		}
 	};
 	  
}]);

appedoApp.controller('slaSettingController', ['$scope', '$modal',  '$modalInstance', 'isFrom', 'moduleCardContent', 'slacardService', 'ngToast', 'successMsgService', '$rootScope',
	function($scope, $modal, $modalInstance, isFrom, moduleCardContent, slacardService, ngToast, successMsgService, $rootScope) {

  $scope.cardLayout = function() {
  	      $modalInstance.dismiss('cancel');
    };
    $scope.close = function() {
	      $modalInstance.dismiss('cancel');
    };
  	
    $scope.moduleCardContent=moduleCardContent;
    $scope.slaSettingForm = {};
    
    var settings;
	settings = slacardService.getSLASettings();
	settings.then(function(data) {
		if(data){
			$scope.slaSettingForm.maxTryDuration = data.trycountduration;
			$scope.slaSettingForm.maxTry = data.maxtrycount;
			$scope.slaSettingForm.alertTriggerFrequency = data.triggeralert; 
		}else{
			
		}
	});
    $scope.setSlaSetting = function() {
    	var isvalidated = true;
    	var msgContent = "";
    	if($scope.slaSettingForm.maxTryDuration==undefined || $scope.slaSettingForm.maxTryDuration == '' || $scope.slaSettingForm.maxTryDuration.length<0){
    		isvalidated = false;
    		msgContent = "Max Try Duration";
    	}
    	
    	if($scope.slaSettingForm.maxTry==undefined || $scope.slaSettingForm.maxTry == '' || $scope.slaSettingForm.maxTry.length<0){
    		isvalidated = false;
    		msgContent = msgContent+"<br>Max Try";
    	}
    	
    	if($scope.slaSettingForm.alertTriggerFrequency==undefined || $scope.slaSettingForm.alertTriggerFrequency == '' || $scope.slaSettingForm.alertTriggerFrequency.length<0){
    		isvalidated = false;
    		msgContent = msgContent+"<br>Alert Trigger Frequency ";
    	}
    	
    	if(isvalidated){
    		$rootScope.$on("close_sla_setting_parent_popup", function(event){
    			$modalInstance.dismiss('cancel');
    		});
    		var settings;
        	settings = slacardService.setSlaSetting($scope, $scope.slaSettingForm);
        	settings.then(function(data) {
        		if(data.success){
        			var modalInstance = $modal.open({
    					templateUrl: 'modules/sla/view/sla_setting_view_alert.html',
    					controller: 'slaSettingViewAlert',
    					size: 'lg'
    				});
        		}
        	});
    	}else{
    		$scope.response ={};
    		$scope.response.success = false;
    		$scope.response.errorMessage = msgContent+"is mandatory.";
    		successMsgService.showSuccessOrErrorMsg($scope.response);
    	}
	};

}]);

appedoApp.controller('slaSettingViewAlert', ['$scope', '$modal',  '$modalInstance', 'slacardService', '$rootScope',
		function($scope, $modal, $modalInstance, slacardService, $rootScope) {
		
		$scope.close = function () {
			$modalInstance.dismiss('cancel');
		};
		$scope.cardLayout = function() {
			$rootScope.$on("close_sla_setting_parent_popup", function(event){
    			$modalInstance.dismiss('cancel');
    		});
			var modalInstance = $modal.open({
	    		templateUrl: 'modules/sla/view/sla_setting_alert.html',
	    		controller: 'slaSettingAlert',
	    		size: 'lg'
	    	});
		};
		$scope.closeAlertTypeListPage = function() {
			$rootScope.$emit('close_sla_setting_parent_popup');
			$modalInstance.dismiss('cancel');
		};
		
		$scope.slaAlerts = [];
		var alertGrid;
		alertGrid = slacardService.getAlerts();
		alertGrid.then(function(data) {
			$scope.slaAlerts = data;
    	}); 
		
		$scope.deleteAlert = function(){
			var result = confirm("You will lose records permanently!\nAre you sure you want to delete?");
			if(result == true) {
				var deleteAlert;
				deleteAlert = slacardService.deleteAlert(this.alert.alertId);
				deleteAlert.then(function(data) {
					var alertGrid;
					alertGrid = slacardService.getAlerts();
					alertGrid.then(function(data) {
						$scope.slaAlerts = data;
			    	}); 
		    	}); 
			}
		};
}]);

appedoApp.controller('slaSettingAlert', ['$scope', '$modal',  '$modalInstance', 'slacardService', '$rootScope', 'successMsgService',
	function($scope, $modal, $modalInstance, slacardService, $rootScope, successMsgService) {
	
	$scope.close = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.slaPolicyViewAlertFrom = {};
	
	$scope.slaPolicyViewAlertFrom.alertType="Email";
	$scope.SaveAndFinish = function() {
			// must save the record
		console.log(JSON.stringify($scope.slaPolicyViewAlertFrom));
		var alerts;
		alerts = slacardService.saveAlerts($scope, $scope.slaPolicyViewAlertFrom);
		alerts.then(function(data) {
			if(data.success){
				successMsgService.showSuccessOrErrorMsg(data);
				$rootScope.$on("close_sla_setting_parent_popup", function(event){
	    			$modalInstance.dismiss('cancel');
	    		});
				var modalInstance = $modal.open({
					templateUrl: 'modules/sla/view/sla_setting_view_alert.html',
					controller: 'slaSettingViewAlert',
					size: 'lg'
				})
    		}
    	});
	};
	$scope.SaveAndAdd = function() {
		// must save the record and be on the same screen
		var alerts;
		alerts = slacardService.saveAlerts($scope, $scope.slaPolicyViewAlertFrom);
		alerts.then(function(data) {
			$scope.slaPolicyViewAlertFrom = {};
		});      
	};
 		  	    	
}]);
