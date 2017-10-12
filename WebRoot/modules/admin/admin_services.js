appedoApp.service('userMetrics', ['$http', '$q', function($http, $q) {

    this.getUsageMetrics = function(code) {
        var deferredObject = $q.defer();
        $http({
			method: 'POST',
			url: 'credentials/getUsageMetrics',
			params: {
				code: code,
			}
		}).success(deferredObject.resolve)
            .error(deferredObject.resolve);

        return deferredObject.promise;
    };

}]);

appedoApp.service('licenseServices', ['$http', '$q', function($http, $q) {
    this.getPricingDetails = function($scope, selectedPeriod, callback) {
        $http({
            method: 'POST',
            url: 'credentials/getAppedoPricing',
            params: {
                selectedPeriod: selectedPeriod
            }
        }).success(function(data) {
            if (callback) {
                callback(data);
            }
        });
    };

    this.getPricingCommonDetails = function($scope) {
        //var deferredObject = $q.defer();
        var promise = $http({
            method: 'POST',
            url: 'common/data/admin_pricing_common_data.json'
        }).success(function(data) {
            return data;
        });
        return promise;
    };

    this.getLicesingEmails = function($scope, callback) {
        var deferredObject = $q.defer();
        $http({
                method: 'POST',
                url: 'credentials/getLicesingEmails'
            }).success(deferredObject.resolve)
            .error(deferredObject.resolve);

        return deferredObject.promise;
    };
    

    this.updateUserLicese = function($scope, params, callback) {
    	$http({
            method: 'POST',
            url: 'credentials/updateLicesense',
            params: params
        }).success(function(data) {
            if (callback) {
                callback(data);
            }
        });
    };
    var formattedStartDate = '';
	var formattedEndDate = '';
	this.getFormattedStartDate = function() {
		return formattedStartDate;
    };
    this.getFormattedEndDate = function() {
		return formattedEndDate;
    };
    this.getformatedDate = function (startDate, endDate) {
    	var stDate = startDate;
	    var enDate = endDate+' 23:59:59';
	    if (isdate(stDate)==1){
	    	formattedStartDate=formatDate(stDate, 'st');
	    }
		else {
			formattedStartDate = new Date(stDate.toString());
			var ctDate = new Date();
	    	if(formattedStartDate < ctDate) {
	    		formattedStartDate = ctDate;
	    	}
		}
		if (isdate(enDate)==1){
			formattedEndDate=formatDate(enDate, 'ed');}
		else {
			formattedEndDate = new Date(enDate.toString());
		}

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
    };
    
    this.getLicesenseDetails = function($scope, emailId, callback) {
    	$http({
            method: 'POST',
            url: 'credentials/getLicesenseDetails',
            params: {
            	email_id: emailId
            }
        }).success(function(data) {
            if (callback) {
                callback(data);
            }
        });
    };

    
    // 
    this.updateUserAccessRights = function(emailId, useLiceseManagement, useUsageMetric) {
        var deferredObject = $q.defer();

        $http({
            method: 'POST',
            url: './updateUserAccessRights',
            params: {
            	emailId: emailId,
            	useLiceseManagement: useLiceseManagement,
            	useUsageMetric: useUsageMetric
            }
        }).success(deferredObject.resolve)
        .error(deferredObject.resolve);

        return deferredObject.promise;
	};
	

    this.getUsersAdminPrivilege = function() {
        var deferredObject = $q.defer();

        $http({
            method: 'POST',
            url: './getUsersAdminPrivilege'
        }).success(deferredObject.resolve)
        .error(deferredObject.resolve);

        return deferredObject.promise;
	};

}]);