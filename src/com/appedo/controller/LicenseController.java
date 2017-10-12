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
public class LicenseController extends HttpServlet{
	
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
		response.setContentType("text/html");
		String action = request.getServletPath(), responseJSONStream = null;
		//
		HttpSession session = request.getSession(false);
		
		// TODO: Have to separate license services into separate LicenseController.java
		
		/*if(action.equals("/isAdmin")){
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
		}*/
		if (action.equals("/updateUserAccessRights")) {
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

				if ( ! loginUserBean.isAdminUser() ) {
					// for logged in user is not a Admin,  `Access denied`
					throw new Exception("1");
				}
				
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

				if ( e.getMessage().equals("1") ) {
					joRtn = UtilsFactory.getJSONFailureReturn("Access denied.");
				} else {
					joRtn = UtilsFactory.getJSONFailureReturn("Unable to getUsersAdminPrivilages. ");
				}
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		} else if (action.equals("/getLicenseExpiredUsers")) {
			// gets users whose license is expired
			LoginUserBean loginUserBean = null;

			JSONObject joRtn = null, joResp = null;
			
			try {

				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");

				if ( ! loginUserBean.isAdminUser() ) {
					// for logged in user is not a Admin,  `Access denied`
					throw new Exception("1");
				}

				
				WebServiceManager wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/getLicenseExpiredUsers", request);
				
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

				if ( e.getMessage().equals("1") ) {
					joRtn = UtilsFactory.getJSONFailureReturn("Access denied.");
				} else {
					joRtn = UtilsFactory.getJSONFailureReturn("Unable to getLicenseExpiredUsers. ");
				}
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		} else if (action.equals("/getLicenseWillExipreUsers")) {
			// gets users whose license is expired
			LoginUserBean loginUserBean = null;

			JSONObject joRtn = null, joResp = null;
			
			try {

				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					throw new ServletException("SESSION_EXPIRED");
				}
				loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");

				if ( ! loginUserBean.isAdminUser() ) {
					// for logged in user is not a Admin,  `Access denied`
					throw new Exception("1");
				}

				
				WebServiceManager wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES + "/credentials/getLicenseWillExipreUsers", request);
				
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

				if ( e.getMessage().equals("1") ) {
					joRtn = UtilsFactory.getJSONFailureReturn("Access denied.");
				} else {
					joRtn = UtilsFactory.getJSONFailureReturn("Unable to getLicenseWillExipreUsers. ");
				}
			} finally {
				response.getWriter().write(joRtn.toString());
			}
		}
		
		action = null;
	}
}
