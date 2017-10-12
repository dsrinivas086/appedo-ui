appedoApp.service('slaActionsService', ['$http', function($http) {

	this.getSLAActions = function($scope, callback) {
		$http({
			method: 'POST',
			url: 'sla/getActionsCardLayout',	
		}).success(function(slaActionCardData) {
			if(callback instanceof Function){
				callback(slaActionCardData);
			};
		});	
	};
	
	this.isValidActionName = function($scope, actionName, actionId, callback) {
		$http({
			method: 'POST',
			url: 'sla/isValidActionName',
			params: {
				actionName: actionName,
				actionId: actionId,
			}
		}).success(function(slaActionCardData) {
			if(callback instanceof Function){
				callback(slaActionCardData);
			};
		});	
	};
	
	this.addSLAAction = function($scope, slaActionForm, moduleCardContent, callback){
		$scope.slaActionForm = slaActionForm;
        $scope.moduleCardContent=moduleCardContent;
        $http({
			method: 'POST',
			url: 'sla/addAction',	
			params: {	
				actionName: $scope.slaActionForm.actionName,
				actionDescription: $scope.slaActionForm.actionDescription,
				isPublic: ($scope.slaActionForm.radioPublicORPrivate == undefined || $scope.slaActionForm.radioPublicORPrivate == 'pvt')?false:true,
				parameterFormat: $scope.slaActionForm.parameterType != undefined?$scope.slaActionForm.parameterType:'json',
				parameterValues: $scope.slaActionForm.scriptParameter,
				executionType: $scope.slaActionForm.scriptType,
				script: $scope.slaActionForm.actionScript,
			}				
		}).success(function(slaActionCardData) {
			if(callback instanceof Function){
				callback(slaActionCardData);
			};
		});	
	};
	
	this.updateSLAAction = function($scope, slaActionForm, moduleCardContent, callback){
		$scope.slaActionForm = slaActionForm;
        $scope.moduleCardContent=moduleCardContent;
        $http({
			method: 'POST',
			url: 'sla/updateAction',	
			params: {	
				actionId: $scope.slaActionForm.actionId,
				actionName: $scope.slaActionForm.actionName,
				actionDescription: $scope.slaActionForm.actionDescription,
				isPublic: ($scope.slaActionForm.radioPublicORPrivate == undefined || $scope.slaActionForm.radioPublicORPrivate == 'pvt')?false:true,
				parameterFormat: $scope.slaActionForm.parameterType != undefined?$scope.slaActionForm.parameterType:'json',
				parameterValues: $scope.slaActionForm.scriptParameter,
				executionType: $scope.slaActionForm.scriptType,
				script: $scope.slaActionForm.actionScript,
			}				
		}).success(function(slaActionCardData) {
			if(callback instanceof Function){
				callback(slaActionCardData);
			};
		});	
	};
	
	this.deleteAction = function($scope, actionId, callback) {
		$http({
			method: 'POST',
			url: 'sla/deleteAction',	
			params: {	
				actionId: actionId,
			}				
		}).success(function(slaActionCardData) {
			if(callback instanceof Function){
				callback(slaActionCardData);
			};
		});	
	};
}]);

appedoApp.service('slaRuleService', ['$http', '$q', function($http, $q) {

	this.getSLARules = function($scope, callback) {
		$http({
			method: 'POST',
			url: 'sla/getRulesCardLayout',	
		}).success(function(slaRuleCardData) {
			if(callback instanceof Function){
				callback(slaRuleCardData);
			};
		});	
	};
	
	this.isValidRuleName = function($scope, ruleName, ruleId, callback) {
		$http({
			method: 'POST',
			url: 'sla/isValidRuleName',
			params: {
				ruleName: ruleName,
				ruleId: ruleId,
			}
		}).success(function(slaActionCardData) {
			if(callback instanceof Function){
				callback(slaActionCardData);
			};
		});	
	};
	
	this.getActionsForMapping = function($scope, callback) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/getActionsForMapping',	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);

	    return deferredObject.promise;
	};
	
	this.addSLARule = function($scope, slaRuleForm, moduleCardContent, callback){
		
		$scope.slaRuleForm = slaRuleForm;
		$scope.actions = $scope.slaRuleForm.actions;
		$scope.selectedActions = [];
        $scope.moduleCardContent=moduleCardContent;
        for(var i=0; i<$scope.actions.length; i++){
        	if($scope.actions[i].isSelected == true){
        		$scope.selectedActions.push($scope.actions[i]);
			}
        }
        $http({
			method: 'POST',
			url: 'sla/addSlaRule',
			params: {	
				ruleName: $scope.slaRuleForm.ruleName,
				ruleDescription: $scope.slaRuleForm.ruleDescription,
				actionIds: JSON.stringify($scope.selectedActions),
			}
		}).success(function(slaRuleActions) {
			if(callback instanceof Function){
				callback(slaRuleActions);
			};
		});
	};
	
	this.updateSLARule = function($scope, slaRuleForm, moduleCardContent, callback){
		
		$scope.slaRuleForm = slaRuleForm;
		$scope.actions = $scope.slaRuleForm.actions;
		$scope.selectedActions = [];
        $scope.moduleCardContent=moduleCardContent;
        for(var i=0; i<$scope.actions.length; i++){
        	if($scope.actions[i].isSelected == true){
        		$scope.selectedActions.push($scope.actions[i]);
			}
        }
        $http({
			method: 'POST',
			url: 'sla/updateSlaRule',
			params: {	
				ruleName: $scope.slaRuleForm.ruleName,
				ruleId: $scope.slaRuleForm.ruleId,
				ruleDescription: $scope.slaRuleForm.ruleDescription,
				actionIds: JSON.stringify($scope.selectedActions),
			}
		}).success(function(slaRuleActions) {
			if(callback instanceof Function){
				callback(slaRuleActions);
			};
		});
	};
	this.getMappedRules = function(ruleId){
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/sla/getMappedRuleActions',
			params: {	
				ruleId: ruleId,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.deleteRule = function($scope, ruleId, callback) {
		$http({
			method: 'POST',
			url: 'sla/deleteRule',	
			params: {	
				ruleId: ruleId,
			}				
		}).success(function(data) {
			if(callback instanceof Function){
				callback(data);
			};
		});
	};
}]);

appedoApp.service('slacardService', ['$http', '$q', function($http, $q) {

	this.getSLAGrid = function($scope, callback) {
		$http({
			method: 'POST',
//			url: 'common/data/sla.json'
			url: 'sla/getSLAsCardLayout',	
//			params: {	
//				moduleType: moduleType,
//				pageLimit: 10,
//				pageOffset: 0,
//			}				
		}).success(function(slaCardData) {
			if(callback instanceof Function){
				callback(slaCardData);
			};
		});	
	};
	
	this.getSLAAlerLog = function($scope, slaId, callback) {	
		$http({
			method: 'POST',
			url: 'sla/getSlaAlertCardLayout',	
			params: {	
				slaid: slaId,
			}				
		}).success(function(slaSlaveCardData) {
			if(callback instanceof Function){
				callback(slaSlaveCardData);
			};
		});	
	};
	
	this.getSLAHealLog = function($scope, slaId, callback) {	
		$http({
			method: 'POST',
			url: 'sla/getSlaHealCardLayout',	
			params: {	
				slaid: slaId,
			}				
		}).success(function(slaSlaveCardData) {
			if(callback instanceof Function){
				callback(slaSlaveCardData);
			};
		});	
	};

	this.isValidPolicyName = function($scope, policyName, policyId, callback) {
		$http({
			method: 'POST',
			url: 'sla/isValidPolicyName',
			params: {
				policyName: policyName,
				policyId: policyId,
			}
		}).success(function(slaActionCardData) {
			if(callback instanceof Function){
				callback(slaActionCardData);
			};
		});	
	};
	
	this.getRulesForMapping = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/getRulesForMapping',	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.addSLAPolicy = function($scope, slaPolicyForm, callback) {	
		$scope.slaPolicyForm = slaPolicyForm;
		$http({
			method: 'POST',
			url: 'sla/addSLAPolicy',	
			params: {	
				policyName: $scope.slaPolicyForm.policyName,
				policyDesc: $scope.slaPolicyForm.policyDescription,
				alertType: $scope.slaPolicyForm.type,
				mapRuleId: $scope.slaPolicyForm.mappedRule,
				configServFormat: $scope.slaPolicyForm.policySvr,
				policySvrType: $scope.slaPolicyForm.policySvrType,
				
			}				
		}).success(function(data) {
			if(callback instanceof Function){
				callback(data);
			};
		});	
	};
	
	this.updateSLAPolicy = function($scope, slaPolicyForm, callback) {	
		$scope.slaPolicyForm = slaPolicyForm;
		$http({
			method: 'POST',
			url: 'sla/updateSLAPolicy',	
			params: {
				slaId: $scope.slaPolicyForm.slaId,
				policyName: $scope.slaPolicyForm.policyName,
				policyDesc: $scope.slaPolicyForm.policyDescription,
				alertType: $scope.slaPolicyForm.type,
				mapRuleId: $scope.slaPolicyForm.mappedRule,
				configServFormat: $scope.slaPolicyForm.policySvr,
				policySvrType: $scope.slaPolicyForm.policySvrType,
				
			}				
		}).success(function(data) {
			if(callback instanceof Function){
				callback(data);
			};
		});	
	};
	
	this.getModuleTypeValues = function(moduleType) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/getModuleTypeValues',
			params: {	
				type: moduleType,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getBreachTypes = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/getBreachType',
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getCounters = function(uid) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/getCounters',
			params: {	
				uid: uid,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.addMapCounter = function($scope, slaPolicyMapCounterForm){
		
		$scope.slaPolicyMapCounterForm = slaPolicyMapCounterForm;
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/addMapCounter',
			params: {	
				breachId: $scope.slaPolicyMapCounterForm.breachType.breachId,
				counterId: $scope.slaPolicyMapCounterForm.counterName.counterId,
				counterName: $scope.slaPolicyMapCounterForm.counterName.name,
				ctId: $scope.slaPolicyMapCounterForm.counterName.ctId,
				ctvId: $scope.slaPolicyMapCounterForm.agentName.ctvId,
				guid: $scope.slaPolicyMapCounterForm.agentName.guid,
				inPercentage: false,
				isThresholdAbove: ($scope.slaPolicyMapCounterForm.thresholdabv == undefined || $scope.slaPolicyMapCounterForm.thresholdabv == 'lt')?false:true,
				minBreachCount: $scope.slaPolicyMapCounterForm.minBreachCount,
				moduleName: $scope.slaPolicyMapCounterForm.moduleType,
				moduleValue: $scope.slaPolicyMapCounterForm.agentName.moduleName,
				thresholdValue: $scope.slaPolicyMapCounterForm.thresholdValue,
				uid: $scope.slaPolicyMapCounterForm.agentName.uid,
				category: $scope.slaPolicyMapCounterForm.counterName.category,
				slaId: $scope.slaPolicyMapCounterForm.slaId,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.updateMapCounter = function($scope, slaPolicyMapCounterForm){
		
		$scope.slaPolicyMapCounterForm = slaPolicyMapCounterForm;
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/updateMapCounter',
			params: {	
				isThresholdAbove: ($scope.slaPolicyMapCounterForm.thresholdabv == undefined || $scope.slaPolicyMapCounterForm.thresholdabv == 'lt')?false:true,
				minBreachCount: $scope.slaPolicyMapCounterForm.minBreachCount,
				thresholdValue: $scope.slaPolicyMapCounterForm.thresholdValue,
				mapCounterId: $scope.slaPolicyMapCounterForm.mapCounterId,
				guid: $scope.slaPolicyMapCounterForm.guid,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getMapCounters = function(slaId){
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/getMapCounters',
			params: {	
				slaId: slaId,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.deleteMapCounter = function(slaId, counterId, guid) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/deleteMapCounter',
			params: {	
				slaId: slaId,
				counterId: counterId,
				guid: guid,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getSLASettings = function() {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/getSLASettings',
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.setSlaSetting = function($scope, setSlaSetting){
		$scope.setSlaSetting = setSlaSetting;
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/setSlaSettings',
			params: {	
				maxTryDuration: $scope.setSlaSetting.maxTryDuration,
				maxTry: $scope.setSlaSetting.maxTry,
				alertTriggerFrequency: $scope.setSlaSetting.alertTriggerFrequency,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.saveAlerts = function($scope, slaPolicyViewAlertFrom){
		$scope.slaPolicyViewAlertFrom = slaPolicyViewAlertFrom;
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/saveAlerts',
			params: {	
				type: $scope.slaPolicyViewAlertFrom.alertType,
				emailornumber: $scope.slaPolicyViewAlertFrom.alertType=='Email'?$scope.slaPolicyViewAlertFrom.email:$scope.slaPolicyViewAlertFrom.sms,
			}	
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.getAlerts = function(){
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/getAlertsSettings',
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.deleteAlert = function(alertId) {
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/deleteSlaAlert',
			params: {	
				alertId: alertId,
			}
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
	
	this.deleteSLAPolicy = function($scope, slaId, callback){
		$http({
			method: 'POST',
			url: 'sla/deleteSLAPolicy',	
			params: {	
				slaId: slaId,
			}				
		}).success(function(data) {
			if(callback instanceof Function){
				callback(data);
			};
		});
	};
	
	this.getExecLogFile = function(logFileName){
		var deferredObject = $q.defer();
		$http({
			method: 'POST',
			url: 'sla/readLogData',
			params: {	
				logFile: logFileName,
			}
		}).success(deferredObject.resolve) 
		.error(deferredObject.resolve);
  
        return deferredObject.promise;
	};
}]);

appedoApp.service('slaSlaveService', ['$http', function($http) {

	this.getSlaveStatus = function($scope, callback) {	
		$http({
			method: 'POST',
			url: 'sla/getSlaveStatusCardLayout',	
		}).success(function(slaSlaveCardData) {
			if(callback instanceof Function){
				callback(slaSlaveCardData);
			};
		});	
	};
}]);

appedoApp.service('SlaMenuBadgeService', ['$http', function($http) {

	this.getSlaMenuBadge = function($scope) {	
		$http({
			method: 'POST',
			url: 'sla/getSlaMenuBadge',	
		}).success(function(slaMenuData) {
			$scope.slaBadgeValues = slaMenuData;
		});	
	};
}]);