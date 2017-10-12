package com.appedo.bean;

import java.util.Date;

import net.sf.json.JSONObject;

/**
 * Userbean is for replica of usermaster table
 * @author navin
 *
 */
public class UserBean {

	private int nUserId;
	private String strEmailId;
	private String strPassword;
	private Long lEnterpriseId;
	private String strFirstName;
	private String strLastName;
	private String strMobileNo;
	private boolean bActiveFlag;
	
	public boolean isActiveFlag() {
		return bActiveFlag;
	}
	public void setActiveFlag(boolean activeFlag) {
		bActiveFlag = activeFlag;
	}
	public Long getEnterpriseId() {
		return lEnterpriseId;
	}
	public void setEnterpriseId(long enterpriseId) {
		lEnterpriseId = enterpriseId;
	}
	public String getEmailId() {
		return strEmailId;
	}
	public void setEmailId(String strEmailId) {
		this.strEmailId = strEmailId;
	}
	public String getFirstName() {
		return strFirstName;
	}
	public void setFirstName(String strFirstName) {
		this.strFirstName = strFirstName;
	}
	public String getLastName() {
		return strLastName;
	}
	public void setLastName(String strLastName) {
		this.strLastName = strLastName;
	}
	public String getMobileNo() {
		return strMobileNo;
	}
	public void setMobileNo(String strMobileNo) {
		this.strMobileNo = strMobileNo;
	}
	public String getPassword() {
		return strPassword;
	}
	public void setPassword(String strPassword) {
		this.strPassword = strPassword;
	}
	public int getUserId() {
		return nUserId;
	}
	public void setUserId(int userId) {
		nUserId = userId;
	}

	public void fromJSONObject(JSONObject joUserBean) {
		nUserId = joUserBean.getInt("userId");
		lEnterpriseId = joUserBean.getLong("enterpriseId");
		strEmailId = joUserBean.getString("emailId");
		strFirstName = joUserBean.getString("firstName");
		strLastName = joUserBean.getString("lastName");
//		strMobileNo = joUserBean.getString("mobile");
		bActiveFlag = joUserBean.getBoolean("activeFlag");
		strPassword = joUserBean.getString("password");
	}
}
