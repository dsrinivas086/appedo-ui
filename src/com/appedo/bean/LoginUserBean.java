package com.appedo.bean;

import java.util.Date;

import net.sf.json.JSONObject;


/**
 * SignedIn user details were stored in this bean
 * @author navin
 *
 */
public class LoginUserBean {
	
	private long lUserId = -1;
	private Long lEnterpriseId = null;
	private String strUserCode = "", strEmailId = "", strFirstName = "", strMiddleName = "", strLastName = "", strMobile = "";
	private String enterprisecode = "", enterpriseName = "";
	private boolean bActiveFlag = false, bAdmin = false, isAdminUser = false, manageLicense = false, viewUsageReports = false, enableAccessRights = false, viewAllUsers = false;
	private String strLtLicense = "", strSUMLicense, strAPMLicense, strRUMLicense, strDDLicense;
	private Date sumLicStartDate, sumLicEndDate, apmLicStartDate, apmLicEndDate;
//	private Date sumLicRenewalDate;
	private long lLoginHistoryId = -1;
	private String strEncryptedUserId = "";
	
	
	public String getEncryptedUserId() {
		return strEncryptedUserId;
	}
	public void setEncryptedUserId(String strEncryptedUserId) {
		this.strEncryptedUserId = strEncryptedUserId;
	}
	public Date getApmLicStartDate() {
		return apmLicStartDate;
	}
	public void setApmLicStartDate(Date apmLicStartDate) {
		this.apmLicStartDate = apmLicStartDate;
	}
	public Date getApmLicEndDate() {
		return apmLicEndDate;
	}
	public void setApmLicEndDate(Date apmLicEndDate) {
		this.apmLicEndDate = apmLicEndDate;
	}
	public String getLtLicense() {
		return strLtLicense;
	}
	public void setLtLicense(String strLtLicense) {
		this.strLtLicense = strLtLicense;
	}
	
	public long getUserId() {
		return lUserId;
	}
	public void setUserId(long userId) {
		lUserId = userId;
	}
	
	public long getEnterpriseId() {
		return lEnterpriseId;
	}
	public void setEnterpriseId(long enterpriseId) {
		lEnterpriseId = enterpriseId;
	}
	
	public String getUserCode() {
		return strUserCode;
	}
	public void setUserCode(String strUserCode) {
		this.strUserCode = strUserCode;
	}
	
	public String getEnterprisecode() {
		return enterprisecode;
	}
	public void setEnterprisecode(String enterprisecode) {
		this.enterprisecode = enterprisecode;
	}
	
	public String getEnterpriseName() {
		return enterpriseName;
	}
	public void setEnterpriseName(String enterpriseName) {
		this.enterpriseName = enterpriseName;
	}

	public String getEmailId() {
		return strEmailId;
	}
	public void setEmailId(String strEmailId) {
		this.strEmailId = strEmailId;
	}
	
	public boolean isActiveFlag() {
		return bActiveFlag;
	}
	public void setActiveFlag(boolean activeFlag) {
		bActiveFlag = activeFlag;
	}
	
	public String getFirstName() {
		return strFirstName;
	}
	public void setFirstName(String strFirstName) {
		this.strFirstName = strFirstName;
	}
	
	public String getMiddleName() {
		return strMiddleName;
	}
	public void setMiddleName(String strMiddleName) {
		this.strMiddleName = strMiddleName;
	}

	public String getLastName() {
		return strLastName;
	}
	public void setLastName(String strLastName) {
		this.strLastName = strLastName;
	}
	
	public String getMobile() {
		return strMobile;
	}
	public void setMobile(String strMobile) {
		this.strMobile = strMobile;
	}
	
	public boolean isAdmin() {
		return bAdmin;
	}
	public void setAdmin(boolean admin) {
		bAdmin = admin;
	}
	
	public Date getSumLicStartDate() {
		return sumLicStartDate;
	}
	public void setSumLicStartDate(Date sumLicStartDate) {
		this.sumLicStartDate = sumLicStartDate;
	}
	
	public String getSUMLicense() {
		return strSUMLicense;
	}
	public void setSUMLicense(String strSUMLicense) {
		this.strSUMLicense = strSUMLicense;
	}
	
//	public Date getSumLicRenewalDate() {
//		return sumLicRenewalDate;
//	}
//	public void setSumLicRenewalDate(Date sumLicRenewalDate) {
//		this.sumLicRenewalDate = sumLicRenewalDate;
//	}
	
	public Date getSumLicEndDate() {
		return sumLicEndDate;
	}
	public void setSumLicEndDate(Date sumLicEndDate) {
		this.sumLicEndDate = sumLicEndDate;
	}
	
	public String getAPMLicense() {
		return strAPMLicense;
	}
	public void setAPMLicense(String strAPMLicense) {
		this.strAPMLicense = strAPMLicense;
	}

	public String getRUMLicense() {
		return strRUMLicense;
	}
	public void setRUMLicense(String strRUMLicense) {
		this.strRUMLicense = strRUMLicense;
	}

	public String getDDLicense() {
		return strDDLicense;
	}
	public void setDDLicense(String strDDLicense) {
		this.strDDLicense = strDDLicense;
	}
	
	public long getLoginHistoryId() {
		return lLoginHistoryId;
	}
	public void setLoginHistoryId(long lLoginHistoryId) {
		this.lLoginHistoryId = lLoginHistoryId;
	}
	
	public boolean isAPMLicenseExpired(LoginUserBean loginUserBean){
		Date dt = new Date();
		if( loginUserBean.getApmLicEndDate() == null || loginUserBean.getApmLicEndDate().getTime() <= dt.getTime()){
			return true;
		}else{
			return false;
		}
	}
	
	public boolean isAdminUser() {
		return isAdminUser;
	}
	
	public void setAdminUser(boolean isAdminUser) {
		this.isAdminUser = isAdminUser;
	}
	
	public boolean isManageLicense() {
		return manageLicense;
	}
	
	public void setManageLicense(boolean manageLicense) {
		this.manageLicense = manageLicense;
	}
	
	public boolean isViewUsageReports() {
		return viewUsageReports;
	}
	
	public void setViewUsageReports(boolean viewUsageReports) {
		this.viewUsageReports = viewUsageReports;
	}
	
	public boolean isEnableAccessRights() {
		return enableAccessRights;
	}
	
	public void setEnableAccessRights(boolean enableAccessRights) {
		this.enableAccessRights = enableAccessRights;
	}
	
	public boolean isViewAllUsers() {
		return viewAllUsers;
	}
	public void setViewAllUsers(boolean viewAllUsers) {
		this.viewAllUsers = viewAllUsers;
	}
	
	public String toJSON() {
		JSONObject joUser = new JSONObject();
		
		joUser.put("userId", lUserId);
		joUser.put("encryptedUserId", strEncryptedUserId);
		joUser.put("enterpriseId", lEnterpriseId);
		joUser.put("userCode", strUserCode);
		joUser.put("emailId", strEmailId);
		joUser.put("firstName", strFirstName);
		joUser.put("middleName", strMiddleName);
		joUser.put("lastName", strLastName);
		joUser.put("mobile", strMobile);
		joUser.put("enterpriseCode", enterprisecode);
		joUser.put("enterpriseName", enterpriseName);
		joUser.put("activeFlag", bActiveFlag);
		joUser.put("admin", bAdmin);
		joUser.put("LTLicense", strLtLicense);
		joUser.put("SUMLicense", strSUMLicense);
		joUser.put("APMLicense", strAPMLicense);
		joUser.put("RUMLicense", strRUMLicense);
		joUser.put("DDLicense", strDDLicense);
		joUser.put("SUMLicStartDate", sumLicStartDate.getTime());
		joUser.put("SUMLicEndDate", sumLicEndDate.getTime());
		joUser.put("APMLicStartDate", apmLicStartDate.getTime());
		joUser.put("APMLicEndDate", apmLicEndDate.getTime());
		joUser.put("loginHistoryId", lLoginHistoryId);
		joUser.put("viewAllUsers", viewAllUsers);
		joUser.put("enableAccessRights", enableAccessRights);
		joUser.put("viewUsageReports", viewUsageReports);
		joUser.put("manageLicense", manageLicense);
		joUser.put("isAdminUser", isAdminUser);
		
		return joUser.toString();
	}
	
	public void fromJSONObject(JSONObject joLoginUserBean) {
		lUserId = joLoginUserBean.getLong("userId");
		strEncryptedUserId = joLoginUserBean.getString("encryptedUserId");
		lEnterpriseId = joLoginUserBean.getLong("enterpriseId");
		strUserCode = joLoginUserBean.getString("userCode");
		strEmailId = joLoginUserBean.getString("emailId");
		strFirstName = joLoginUserBean.getString("firstName");
		strMiddleName = joLoginUserBean.getString("middleName");
		strLastName = joLoginUserBean.getString("lastName");
		strMobile = joLoginUserBean.getString("mobile");
		enterprisecode = joLoginUserBean.getString("enterpriseCode");
		enterpriseName = joLoginUserBean.getString("enterpriseName");
		bActiveFlag = joLoginUserBean.getBoolean("activeFlag");
		bAdmin = joLoginUserBean.getBoolean("admin");
		strLtLicense = joLoginUserBean.getString("LTLicense");
		strSUMLicense = joLoginUserBean.getString("SUMLicense");
		strAPMLicense = joLoginUserBean.getString("APMLicense");
		strRUMLicense = joLoginUserBean.getString("RUMLicense");
		strDDLicense = joLoginUserBean.getString("DDLicense");
		sumLicStartDate = new Date( joLoginUserBean.getLong("SUMLicStartDate") );
		sumLicEndDate = new Date( joLoginUserBean.getLong("SUMLicEndDate") );
		apmLicStartDate = new Date( joLoginUserBean.getLong("APMLicStartDate") );
		apmLicEndDate = new Date( joLoginUserBean.getLong("APMLicEndDate") );
		lLoginHistoryId = joLoginUserBean.getLong("loginHistoryId");
		isAdminUser = joLoginUserBean.getBoolean("isAdminUser");
		manageLicense = joLoginUserBean.getBoolean("manageLicense");
		viewUsageReports = joLoginUserBean.getBoolean("viewUsageReports");
		enableAccessRights = joLoginUserBean.getBoolean("enableAccessRights");
		viewAllUsers = joLoginUserBean.getBoolean("viewAllUsers");
	}
}
