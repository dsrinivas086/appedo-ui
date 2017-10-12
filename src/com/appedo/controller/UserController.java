package com.appedo.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;

import com.appedo.bean.LoginUserBean;
import com.appedo.bean.UserBean;
import com.appedo.common.Constants;
import com.appedo.manager.WebServiceManager;
import com.appedo.model.CryptManager;
import com.appedo.model.LogManager;
import com.appedo.utils.UtilsFactory;

/**
 * Excutes HTTP request and response for the User related operation
 * @author navin
 *
 */
public class UserController extends HttpServlet{
	
	//do when post request comes
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * Handles POST request
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
	throws ServletException,IOException{
		doAction(request, response);
	}
	
	/**
	 * Handles GET request comes
	 */	
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
	throws ServletException,IOException{
		doAction(request, response);
	}
	
	/**
	 * Accessed in both GET and POSTrequests for the operations below, 
	 * 1. Creates a new user by user registrations
	 * 2. Updates user details
	 * 3. Deletes the user(ie.. Logical delete)
	 * 4. Creates a new user by admin
	 * 5. Email verification of the user's email address
	 * 6. An email sent to user to reset their password, if user forgot their password
	 * 7. Validate the user to reset their password link to be within 24 hrs and not to be reused,
	 *  	if validate conditions are true then it redirects for new password to be updated.
	 * 8. Updates new password.
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doAction(HttpServletRequest request, HttpServletResponse response) 
	throws ServletException,IOException{
		String action = request.getServletPath(), responseJSONStream = null;
		//
		HttpSession session = request.getSession(false);
		
		JSONObject joResponse = null, joUserBean = null;
		response.setContentType("text/html");
		
		HttpClient client = new HttpClient();
		
		// TODO: Have to separate license services into separate LicenseController.java
		
		if(action.equals("/userSignup")){
			UserBean userBean = null;
			
			try {
				String strEmailId = request.getParameter("userid").trim();
				String strPassword = request.getParameter("password");
				String firstName = request.getParameter("firstName");
				String lastName = request.getParameter("lastName");
				String strRePass = request.getParameter("retypePwd");
				String strRequestImageText = request.getParameter("user_imageText");
				String strSessionCaptchaText = (String) request.getSession().getAttribute("captcha");
				
				if( !strPassword.equals(strRePass)){
					joResponse = new JSONObject();
					throw new Exception( "3" );
				} else if(!strRequestImageText.equals(strSessionCaptchaText) && Constants.IS_CAPTCHA_VALIDATION_ENABLE ){
					throw new Exception( "4" );
				}else {
					// Get the response from WebService
					PostMethod method = new PostMethod(Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/userSignup");
					
					try{
						method.setParameter("user_email_id", strEmailId);
						method.setParameter("user_password", strPassword);
						method.setParameter("user_first_name", firstName);
						method.setParameter("user_last_name", lastName);
						// method.setParameter("user_mobileno", mobileNo);
						
						int statusCode = client.executeMethod(method);
						
						if (statusCode != HttpStatus.SC_OK) {
							LogManager.infoLog("HTTP Failed for "+Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/userSignup <> "+strEmailId+" <> StatusCode: "+statusCode+" <> StatusLine: "+method.getStatusLine());
						}
						
						try {
							responseJSONStream = method.getResponseBodyAsString();
							
							if( responseJSONStream.trim().startsWith("{") && responseJSONStream.trim().endsWith("}")) {
								joResponse = JSONObject.fromObject(responseJSONStream);
								
								if( joResponse.getBoolean("success") ) {
									if( joResponse.containsKey("userBean") ) {
										joUserBean = joResponse.getJSONObject("userBean");
										
										userBean = new UserBean();
										userBean.fromJSONObject(joUserBean);
									} else {
										throw new Exception("1");	// TODO Inform that Service has problem
									}
								} else {
									if( joResponse.containsKey("errorMessage") ) {
										throw new Exception( joResponse.getString("errorMessage") );
									} else {
										throw new Exception("1");	// TODO Inform that Service has problem
									}
								}
							}
						} catch (HttpException he) {
							LogManager.errorLog(he);
						}
					} catch (IOException ie) {
						LogManager.errorLog(ie);
					} catch (Exception e) {
						if(e.getMessage().equalsIgnoreCase("1")){
							response.sendRedirect("#/signup?_err=7");
						}
						LogManager.errorLog(e);
					} finally {
						method.releaseConnection();
						method = null;
					}
					
					
					if ( userBean != null ) {
						
						response.sendRedirect("#/loginResponse?_smsg=2");
					} else {
						// Error message to show for if emailId or password not found  
						response.sendRedirect("#/signup?_err=1");
					}
					
				}
			} catch (Exception e) {
				LogManager.errorLog(e);
				
				if(e.getMessage().equalsIgnoreCase("2")) {
//					request.setAttribute("errPasswordSame", "Password should be same.");
//					RequestDispatcher view = request.getRequestDispatcher("view/userSignup.jsp");
//					view.forward(request, response);
					response.sendRedirect("#/signup?_err=6");
				}else if(e.getMessage().equalsIgnoreCase("1")) {
//					request.setAttribute("errEmailIdExists", "Email Id already exists.");
//					RequestDispatcher view = request.getRequestDispatcher("view/userSignup.jsp");
//					view.forward(request, response);
					response.sendRedirect("#/signup?_err=7");
				}else if(e.getMessage().equalsIgnoreCase("3")) {
//					request.setAttribute("errEmailIdExists", "Email Id already exists.");
//					RequestDispatcher view = request.getRequestDispatcher("view/userSignup.jsp");
//					view.forward(request, response);
					response.sendRedirect("#/signup?_err=8");
				} else if(e.getMessage().equalsIgnoreCase("4")) {
//					request.setAttribute("errEmailIdExists", "Email Id already exists.");
//					RequestDispatcher view = request.getRequestDispatcher("view/userSignup.jsp");
//					view.forward(request, response);
					response.sendRedirect("#/signup?_err=9");
				}
			}
		} else if(action.equals("/verifyEmailAddress")){
			try {
				String struId = request.getParameter("uid");
				String strDecodedUserId = CryptManager.decodeDecryptURL(struId);
				PostMethod method = new PostMethod(Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/verifyEmailAddress");
				try {
					method.setParameter("user_id", strDecodedUserId);
					int statusCode = client.executeMethod(method);
					
					if (statusCode != HttpStatus.SC_OK) {
						LogManager.infoLog("HTTP Failed for "+Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/verifyEmailAddress <> "+struId+" <> StatusCode: "+statusCode+" <> StatusLine: "+method.getStatusLine());
						response.sendRedirect("#/loginResponse?_err=6");
					} else {
						response.sendRedirect("#/loginResponse?_smsg=4");
					}
				} catch(Exception e) {
					LogManager.errorLog(e);
				} finally {
					struId = null;
					strDecodedUserId = null;
					method.releaseConnection();
					method = null;
				}
				
			} catch (Exception e) {
				LogManager.errorLog(e);
			}
		} else if(action.equals("/forgotPassword")){
			try {
				String strEmail = request.getParameter("emailId");
				PostMethod method = new PostMethod(Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/requestResetPassword");
				try {
					method.setParameter("emailId", strEmail);
					int statusCode = client.executeMethod(method);
					
					try {
						responseJSONStream = method.getResponseBodyAsString();
						
						if( responseJSONStream.trim().startsWith("{") && responseJSONStream.trim().endsWith("}")) {
							joResponse = JSONObject.fromObject(responseJSONStream);
							
							if( joResponse.getBoolean("success") ) {
								response.sendRedirect("#/loginResponse?_smsg=1");
							} else {
								response.sendRedirect("#/loginResponse?_err=4");
							}
						}
					} catch (HttpException he) {
						LogManager.errorLog(he);
					}
				} catch(Exception e) {
					LogManager.errorLog(e);
				} finally {
					strEmail = null;
					method.releaseConnection();
					method = null;
				}
				
			} catch (Exception e) {
				LogManager.errorLog(e);
			}
		} else if(action.equals("/resetPassword")){
			response.sendRedirect("#/resetPassword?userId="+request.getParameter("uid"));
		} else if(action.equals("/newPassword")){
			try {
				String strPassword = request.getParameter("password");
				String strRePass = request.getParameter("retype_password");
				String strUID = CryptManager.decodeDecryptURL(request.getParameter("uid"));
				
				if( !strPassword.equals(strRePass)){
					joResponse = new JSONObject();
					throw new Exception( "3" );
				}
				
				PostMethod method = new PostMethod(Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/newPassword");
				try {
					method.setParameter("user_id", strUID);
					method.setParameter("password", strPassword);
					int statusCode = client.executeMethod(method);
					
					if (statusCode != HttpStatus.SC_OK) {
						LogManager.infoLog("HTTP Failed for "+Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/newPassword <> "+strUID+" <> StatusCode: "+statusCode+" <> StatusLine: "+method.getStatusLine());
						response.sendRedirect("#/loginResponse?_err=6");
					} else {
						response.sendRedirect("#/loginResponse?_smsg=6");
					}
				} catch(Exception e) {
					LogManager.errorLog(e);
				} finally {
					strUID = null;
					method.releaseConnection();
					method = null;
				}
			} catch (Exception e) {
				LogManager.errorLog(e);
			}
		} else if(action.equals("/getMyProfileDetails")){
			
			JSONObject joRtn = null, joResp = null;
			
			LoginUserBean loginUserBean = null;
			
			try {
				
				// return Exception if session is already expired.
				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");

				// since to use in  credential services, sets in attribute 
				request.setAttribute("userId", loginUserBean.getUserId());
				
				WebServiceManager wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/getUserDetails", request );

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse());
					joRtn = UtilsFactory.getJSONSuccessReturn(joResp.getJSONObject("message"));
				} else {
					//throw new Exception("3");
					//response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
					joRtn = UtilsFactory.getJSONFailureReturn("Problem with Services");
				}
				
				// clear used variables
				loginUserBean = null;
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Unable to getMyProfileDetails. ");
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		} else if(action.equals("/changePassword")){
			LoginUserBean loginUserBean = null;
			
			JSONObject joResp = null, joRtn = null;
			
			String strParamMsg = "";
			
			try {
				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
				
				
				// since to use in  credential services, sets in attribute 
				request.setAttribute("userId", loginUserBean.getUserId());
				/*
				String strOldPassword = request.getParameter("oldPassword");
				String strNewPassword = request.getParameter("newPassword");
				String strReTypePassword = request.getParameter("retypePassword");
				*/
				WebServiceManager wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/changePassword", request );

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse()); 
				} else {
					throw new Exception("3");
					//response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
				}
				
				
				if( joResp.getBoolean("success") ) {
					//strParamMsg = "_smsg=1";
					joRtn = UtilsFactory.getJSONSuccessReturn("1");
				} else {
					// from Credential Service errorMsgs received as `1` (old password doesn't match), `2` (newPassword doesn't match with retypePassword)
					throw new Exception(joResp.getString("errorMessage"));
				}
				
				loginUserBean = null;
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn(e.getMessage());
				
/* avoided for page redirection
				if( e.getMessage().equals("1") ) {
					// old password doesn't match
					strParamMsg = "_err=1";
				} else if( e.getMessage().equals("2") ) {
					// newPassword doesn't match with retypePassword
					strParamMsg = "_err=2";
				} else if( e.getMessage().equals("3") ) {
					// Problem with services
					strParamMsg = "_err=3";
				}
*/
			} finally {
				response.getWriter().write( joRtn.toString() );
				
				// avoided for page redirection
				//response.sendRedirect("#/changePasswordResponse?"+strParamMsg);
			}
		} else if(action.equals("/updateProfile")){
			LoginUserBean loginUserBean = null;

			JSONObject joResp = null;
			
			String strParamMsg = "";
			
			try {

				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
				

				// since to use in  credential services, sets in attribute 
				request.setAttribute("userId", loginUserBean.getUserId());
				
				
				WebServiceManager wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/updateProfile", request );

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse()); 
				} else {
					// errmsg for Problem with services
					throw new Exception("2");
					//response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
				}

				if( joResp.getBoolean("success") ) {
					strParamMsg = "_smsg=1";
				} else {
					throw new Exception(joResp.getString("errorMessage"));
				}

			} catch (Exception e) {
				LogManager.errorLog(e);

				if( ! e.getMessage().equals("2") ) {
					// Unable to update profile.
					strParamMsg = "_err=1";
				} else {
					// Problem with services
					strParamMsg = "_err=2";
				}
			} finally {
				response.sendRedirect("#/profileSettingsResponse?"+strParamMsg);
			}
		}else if(action.equals("/isAdmin")){
			LoginUserBean loginUserBean = null;
			JSONObject joResp = null;
			try{
				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
				joResp = UtilsFactory.getJSONSuccessReturn("");
				joResp.put("isAdmin", loginUserBean.isAdminUser());
			}catch(Exception e){
				LogManager.errorLog(e);
			}finally{
				response.getWriter().write(joResp.toString());
			}
		}else if(action.equals("/credentials/getAppedoPricing")){
			JSONObject joRtn = null, joResp = null;
			
			try {
				
				request.setAttribute("selectedPeriod", request.getParameter("selectedPeriod"));
				WebServiceManager wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/getAppedoPricing", request );

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse());
					joRtn = UtilsFactory.getJSONSuccessReturn(joResp.getJSONArray("message"));
				} else {
					//throw new Exception("3");
					//response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
					joRtn = UtilsFactory.getJSONFailureReturn("Problem with Services");
				}
				
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Unable to getAppedoPricing. ");
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		}else if(action.equals("/credentials/getLicesingEmails")){
			// get User email ids, based on logged in user has privilage of view_all_users_enabled
			JSONObject joRtn = null, joResp = null;
			LoginUserBean loginUserBean = null;
			try {

				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
				
				request.setAttribute("emailId", loginUserBean.getEmailId());
				WebServiceManager wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/getLicesingEmails", request );

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse());
					joRtn = UtilsFactory.getJSONSuccessReturn(joResp.getJSONArray("message"));
				} else {
					//throw new Exception("3");
					//response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
					joRtn = UtilsFactory.getJSONFailureReturn("Problem with Services");
				}
				
				// clear used variables
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Unable to getLicesingEmails. ");
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		}else if(action.equals("/checkSessionExists")) {
			JSONObject joRtn = null;
			
			try {
				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					joRtn = UtilsFactory.getJSONSuccessReturn("SESSION_EXPIRED");
				} else {
					joRtn = UtilsFactory.getJSONSuccessReturn("SESSION_EXISTS");
				}
				
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Exception "+e.getMessage());
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		}else if(action.equals("/credentials/getUsageMetrics")){
			JSONObject joRtn = null, joResp = null;
			
			try {
				
				String code = request.getParameter("code");
			    
			    WebServiceManager wsm = new WebServiceManager();
			    wsm.addParameter("code",code);
				
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/getUsageMetrics", request );

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse());
					joRtn = UtilsFactory.getJSONSuccessReturn(joResp.getJSONObject("message"));
				} else {
					//throw new Exception("3");
					//response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
					joRtn = UtilsFactory.getJSONFailureReturn("Problem with Services");
				}
				
				// clear used variables
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Unable to getUsageMetrics. ");
			} finally {
				response.getWriter().write(joRtn.toString());
			}

		}else if(action.equals("/credentials/updateLicesense")){
			JSONObject joRtn = null, joResp = null;
			
			try {
				
			    WebServiceManager wsm = new WebServiceManager();
			    wsm.addParameter("email_id",request.getParameter("email_id"));
			    wsm.addParameter("lic_category",request.getParameter("lic_category"));
			    wsm.addParameter("lic_type",request.getParameter("lic_type"));
			    wsm.addParameter("lic_period",request.getParameter("lic_period"));
			    wsm.addParameter("lic_start_date",request.getParameter("lic_start_date"));
			    wsm.addParameter("lic_end_date",request.getParameter("lic_end_date"));
				
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + action, request );

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse());
					joRtn = UtilsFactory.getJSONSuccessReturn(joResp.getString("message"));
				} else {
					//throw new Exception("3");
					//response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
					joRtn = UtilsFactory.getJSONFailureReturn("Problem with Services");
				}
				
				// clear used variables
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Unable to updateLicesense. ");
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		}else if(action.equals("/credentials/getLicesenseDetails")){
			JSONObject joRtn = null, joResp = null;
			
			try {
				
			    WebServiceManager wsm = new WebServiceManager();
			    wsm.addParameter("email_id",request.getParameter("email_id"));
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + action, request );

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse());
					joRtn = UtilsFactory.getJSONSuccessReturn(joResp.getJSONObject("message"));
				} else {
					//throw new Exception("3");
					//response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
					joRtn = UtilsFactory.getJSONFailureReturn("Problem with Services");
				}
				
				// clear used variables
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Unable to getLicesenseDetails. ");
			
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		} else if(action.equals("/getLoginUserDetails")){
			// 
			
			JSONObject joRtn = null;

			LoginUserBean loginUserBean = null;
			
			try {
				
				// return Exception if session is already expired.
				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
				
				joRtn = UtilsFactory.getJSONSuccessReturn(loginUserBean.toJSON());
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Unable to getLoginUserDetails. ");
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		} else if (action.equals("/updateUserAccessRights")) {
			// update access rights for a user (ie.. user has privilege to access License management/Usage metrics)
			LoginUserBean loginUserBean = null;

			JSONObject joRtn = null, joResp = null;
			
			try {

				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
				
				// TODO : check below conditions
				if ( ! loginUserBean.isAdminUser() || ! loginUserBean.isEnableAccessRights() ) {
					// logged in user can update privilage only if enable_access_rights is true, else `Access denied`
					throw new Exception("1");
				} else {
					// since to use in  credential services, sets in attribute 
					request.setAttribute("modifiedUserId", loginUserBean.getUserId());
					
					WebServiceManager wsm = new WebServiceManager();
					wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/updateUserAccessRights", request);
	
					if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
						//response.getWriter().write(wsm.getResponse());
						joResp = JSONObject.fromObject(wsm.getResponse()); 
					} else {
						// errmsg for Problem with services
						joRtn = UtilsFactory.getJSONFailureReturn("Problem with services");
					}
	
					if( joResp.getBoolean("success") ) {
						// sccess
						joRtn = UtilsFactory.getJSONSuccessReturn("Updated access rights.");
					} else {
						// err 
						joRtn = UtilsFactory.getJSONFailureReturn(joResp.getString("errorMessage"));
					}
				}
			} catch (Exception e) {
				LogManager.errorLog(e);
				
				if ( e.getMessage().equals("1") ) {
					joRtn = UtilsFactory.getJSONFailureReturn("Access denied.");
				} else {
					joRtn = UtilsFactory.getJSONFailureReturn("Unable to updateUserAccessRights. ");	
				}
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		} else if (action.equals("/getUsersAdminPrivilege")) {
			// gets users has either license can manage or view usage reports is enabled
			LoginUserBean loginUserBean = null;

			JSONObject joRtn = null, joResp = null;
			
			try {

				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");

				WebServiceManager wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/getUsersAdminPrivilege", request);

				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					joResp = JSONObject.fromObject(wsm.getResponse()); 
				} else {
					// errmsg for Problem with services
					joRtn = UtilsFactory.getJSONFailureReturn("Problem with services");
				}

				if( joResp.getBoolean("success") ) {
					// sccess
					joRtn = UtilsFactory.getJSONSuccessReturn(joResp.getJSONArray("message"));
				} else {
					// err 
					joRtn = UtilsFactory.getJSONFailureReturn(joResp.getString("errorMessage"));
				}
			} catch (Exception e) {
				LogManager.errorLog(e);
				joRtn = UtilsFactory.getJSONFailureReturn("Unable to getUsersAdminPrivilages. ");

			} finally {
				response.getWriter().write(joRtn.toString());
			}
		}
		
		action = null;
	}
}
