package com.appedo.controller;

import java.io.IOException;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.httpclient.HttpStatus;

import com.appedo.bean.LoginUserBean;
import com.appedo.common.Constants;
import com.appedo.manager.WebServiceManager;
import com.appedo.model.LogManager;
import com.appedo.utils.UtilsFactory;

/**
 * Executes HTTP request and response for User to signin
 * 
 */
public class LoginController extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private ServletConfig config;
	
	public void init(ServletConfig config) throws ServletException{
		this.config = config;
	}
	
	/**
	 * Do process when POST request comes.
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doAction(request, response);
	}
	
	/**
	 * Do process when GET request comes.
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doAction(request, response);
	}
	
	/**
	 * Get the request and do the needful.
	 * Call respective function flow in Customize Model for Settings operation.
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doAction(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		String action = request.getServletPath(), responseJSONStream = null, strRedirectUri = null;
		
		JSONObject joResponse = null, joLoginUserBean = null;
		
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		
		HttpSession session;
		WebServiceManager wsm = null;
		
		LoginUserBean loginUserBean = null;
		
		if(action.equals("/loginSession")) {
			session = null;
			request.getSession().removeAttribute("status");
			String strEmailId = request.getParameter("emailId").trim();
			
			try {
				wsm = new WebServiceManager();
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/loginSession", request);
				
				int statusCode = wsm.getStatusCode();
				responseJSONStream = wsm.getResponse().trim();
				
				if( statusCode != HttpStatus.SC_OK ) {
					throw new Exception("1");	// TODO Inform that Service has problem
				}
				
				if( responseJSONStream.startsWith("{") && responseJSONStream.endsWith("}") ) {
					joResponse = JSONObject.fromObject(responseJSONStream);
					
					if( joResponse.getBoolean("success") ) {
						if( joResponse.containsKey("loginUserBean") ) {
							joLoginUserBean = joResponse.getJSONObject("loginUserBean");
							
							loginUserBean = new LoginUserBean();
							loginUserBean.fromJSONObject(joLoginUserBean);
						} else {
							throw new Exception("1");	// TODO Inform that Service has problem
						}
					} else {
						if( joResponse.containsKey("errorMessage") ) {
							throw new Exception( joResponse.getString("errorMessage") );
						}
					}
				}
				
				if ( loginUserBean != null ) {
					session = request.getSession(true);
					
					// To check admin has logged in
					if( loginUserBean.getEmailId().equals("sysadmin@appedo.com") ){
						loginUserBean.setAdmin(true);
					}
					
					// to display Guessed User name in /manager/html/sessions page
					session.setAttribute("username", loginUserBean.getFirstName()+" "+loginUserBean.getLastName());
					
					// For valid user the connection is added to session, con carried out till session expires or signout
					session.setAttribute("login_user_bean", loginUserBean);
					//TODO moved into loginUserBean session.setAttribute("login_history_id", lLoginHistoryId);
					
					response.sendRedirect("#/loginResponse");
				} else {
					// Error message to show for if emailId or password not found  
					response.sendRedirect("#/loginResponse?_err=1&emailId="+strEmailId);
				}
				
			} catch (Exception e) {
				LogManager.errorLog(e);
				
				// Error message to show for Invalid login user
				if ( e.getMessage().equalsIgnoreCase("1") ) {
					strRedirectUri = "#/loginResponse?_err=1&emailId="+strEmailId;
				} else if(e.getMessage().equalsIgnoreCase("2")) {
					strRedirectUri = "#/loginResponse?_err=2&emailId="+strEmailId;
				}else if(e.getMessage().equalsIgnoreCase("3")) {
					strRedirectUri = "#/loginResponse?_err=3&emailId="+strEmailId;
				}else if(e.getMessage().equalsIgnoreCase("5")) {
					strRedirectUri = "#/loginResponse?_err=5&emailId="+strEmailId;
				}
				response.sendRedirect(strRedirectUri);
			
			} finally {
				if ( wsm != null ) {
					wsm.destory();
					wsm = null;	
				}
				
				//UtilsFactory.clearCollectionHieracy(loginUserBean);
				loginUserBean = null;
				
				action = null;
				responseJSONStream = null;
				strRedirectUri = null;
			}
		} else if(action.equals("/logoutSession")){
			
			try {
				
				// return Exception if session is already expired.
				session = request.getSession(false);
				if ( session == null || session.getAttribute("login_user_bean") == null ) {
					response.sendRedirect("#/login");
				} else {
					loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
					request.setAttribute("login_user_bean", loginUserBean.toJSON());

					wsm = new WebServiceManager();
					wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/logoutSession", request);

					if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
						joResponse = JSONObject.fromObject(wsm.getResponse());
					} else {
						throw new Exception("1");	// TODO Inform that Service has problem
					}
					
					session.removeAttribute("login_user_bean");
					session.invalidate();

					if( joResponse.getBoolean("success") ) {
						response.sendRedirect("#/loginResponse?_smsg=5");
					}
				}
			} catch (Exception e) {
				LogManager.errorLog(e);
				
				//response.getWriter().write("<B style=\"color: red; \">Exception occurred: "+(e.getMessage().equals("1") ? "Problem with Services" : e.getMessage())+"</B>");
			} finally {
				if ( wsm != null ) {
					wsm.destory();
					wsm = null;	
				}
				
				//UtilsFactory.clearCollectionHieracy(loginUserBean);
				loginUserBean = null;
				
				action = null;
			}
		}
	}
}
