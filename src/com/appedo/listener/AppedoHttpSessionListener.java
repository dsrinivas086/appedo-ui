package com.appedo.listener;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import net.sf.json.JSONObject;

import org.apache.commons.httpclient.HttpStatus;

import com.appedo.bean.LoginUserBean;
import com.appedo.common.Constants;
import com.appedo.manager.WebServiceManager;
import com.appedo.model.LogManager;


/**
 * Do the relative operation on Login & Logout.
 * Maintains and process the active sessions.
 * 
 * @author Venkateswaran
 *
 */
public class AppedoHttpSessionListener implements HttpSessionListener {
	
	// To maintain all active sessions of this application
//	private static HashMap<String, HttpSession> hmSessionsList = new HashMap<String, HttpSession>();

	LoginUserBean loginUserBean = null;
	WebServiceManager wsm = null;
	HttpServletRequest request=null;
	JSONObject joResponse = null;
	/**
	 * Receives notification that a session has been created.
	 */
	public void sessionCreated(HttpSessionEvent se) {
		
		try {
			// 
			HttpSession session = se.getSession();

			LogManager.infoLog("---------- sessionCreated ------------");
		} catch(Exception e) {
			LogManager.errorLog(e);
		}
	}
	
	/**
	 * Receives notification that a session is about to be invalidated.
	 */
	public void sessionDestroyed(HttpSessionEvent se) {
		
		try{
			HttpSession session = se.getSession();
			//UtilsFactory.clearAllSession( session );
			loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
			
			if( loginUserBean != null ) {
				wsm = new WebServiceManager();
				wsm.addParameter("lLoginHistoryId",loginUserBean.getLoginHistoryId()+"");
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES+"/credentials/timeOutSession");
				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					joResponse = JSONObject.fromObject(wsm.getResponse());
				} else {
					throw new Exception("1");	// TODO Inform that Service has problem
				}
				
				if( joResponse.getBoolean("success") ) {
					LogManager.infoLog("---------- Successfully updated in login histroy for Session Time Out ------------");
				}
		        LogManager.infoLog("---------- sessionDestroyed ------------");
			}
		}catch(Exception e){
			LogManager.errorLog(e);
		} finally {
			if ( wsm != null ) {
				wsm.destory();
				wsm = null;	
			}
		}
	}
}
