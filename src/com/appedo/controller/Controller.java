package com.appedo.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.httpclient.HttpStatus;

import net.sf.json.JSONObject;




import com.appedo.common.Constants;
import com.appedo.manager.WebServiceManager;
import com.appedo.model.LogManager;
import com.appedo.utils.UtilsFactory;

public class Controller extends HttpServlet {

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
	 * 1. Loads agents latest build version
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doAction(HttpServletRequest request, HttpServletResponse response) 
	throws ServletException,IOException{
		response.setContentType("text/html");
		String action = request.getServletPath();

		if(action.equals("/reloadAgentsLatestVersionAndFilePath")){
			// reload agents latest build version and agents download file path

			JSONObject joResp = null, joRespMessage = null;
			
			StringBuilder sbRtnAgentDetails = new StringBuilder();
			
			try {
				// loads agents latest build version and agents download file path
				Constants.loadAgentsLatestVersionAndFilePath(request);

				// html format
				sbRtnAgentDetails	.append("<B>Latest Build Version:</B> ").append(Constants.AGENT_LATEST_BUILD_VERSION).append("<BR><BR><BR>")
									.append("<B>Agents File Path:</B> ").append(Constants.COUNTER_TYPES_DOWNLOAD_FILE_PATH);
				
			} catch (Exception e) {
				LogManager.errorLog(e);
				sbRtnAgentDetails.append("<B style=\"color: red; \">Exception occurred: "+e.getMessage()+"</B>");
			}finally {
				response.getWriter().write(sbRtnAgentDetails.toString());
				
				UtilsFactory.clearCollectionHieracy(sbRtnAgentDetails);
				sbRtnAgentDetails = null;
			}
		} else if(action.equals("/reloadConfigProperties")) {
			// to reload config and appedo_config properties 

			try {
				// Loads Constant properties
				Constants.loadConstantsProperties(Constants.CONSTANTS_FILE_PATH);

				// Loads Appedo config properties from the system path
				Constants.loadAppedoConfigProperties(Constants.APPEDO_CONFIG_FILE_PATH);

				response.getWriter().write("Loaded <B>Appedo-VelocityUI</B>, config and appedo_config properties.");
			} catch (Exception e) {
				LogManager.errorLog(e);
				response.getWriter().write("<B style=\"color: red; \">Exception occurred Appedo-VelocityUI: "+e.getMessage()+"</B>");
			}
		} else if(action.equals("/reloadAllProjectsConfigProperties")) {
			// reload all projects config and mail properties services
			
			StringBuilder sbRtn = new StringBuilder();
			
			try {
				// Loads Constant properties
				Constants.loadConstantsProperties(Constants.CONSTANTS_FILE_PATH);
				
				// Loads Appedo config properties from the system path
				Constants.loadAppedoConfigProperties(Constants.APPEDO_CONFIG_FILE_PATH);
				
				sbRtn.append("Loaded <B>Appedo-VelocityUI</B>, config and appedo_config properties.").append("<BR>");
				
				WebServiceManager wsm = new WebServiceManager();
				
				// Reloads Appedo-UI-Credential-Services
				wsm.sendRequest(Constants.APPEDO_UI_CREDENTIAL_SERVICES  + "/credentials/reloadConfigAndMailProperties", request );
				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					sbRtn.append(wsm.getResponse()).append("<BR>");
				} else {
					// errmsg for Problem with services
					sbRtn.append("<B style=\"color: red; \">Problem with Appedo-UI-Credential-Services Services</B><BR>");
				}
				
				// Reloads Appedo-UI-Module-Services
				wsm.sendRequest(Constants.APPEDO_UI_MODULE_SERVICES + "/common/reloadConfigProperties", request );
				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					sbRtn.append(wsm.getResponse()).append("<BR>");
				} else {
					// errmsg for Problem with services
					sbRtn.append("<B style=\"color: red; \">Problem with Appedo-UI-Module-Services Services</B><BR>");
				}
				
				// Reloads Appedo-UI-RUM-Services
				wsm.sendRequest(Constants.APPEDO_UI_RUM_SERVICES + "/common/reloadConfigProperties", request );
				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					sbRtn.append(wsm.getResponse()).append("<BR>");
				} else {
					// errmsg for Problem with services
					sbRtn.append("<B style=\"color: red; \">Problem with Appedo-UI-RUM-Services Services</B><BR>");
				}
				
				// Reloads Appedo-UI-SUM-Services
				wsm.sendRequest(Constants.APPEDO_UI_SUM_SERVICES + "/common/reloadConfigProperties", request );
				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					sbRtn.append(wsm.getResponse()).append("<BR>");
				} else {
					// errmsg for Problem with services
					sbRtn.append("<B style=\"color: red; \">Problem with Appedo-UI-SUM-Services Services</B><BR>");
				}
				
				// Reloads Appedo-UI-LT-Services
				wsm.sendRequest(Constants.APPEDO_UI_LT_SERVICES + "/common/reloadConfigProperties", request );
				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					sbRtn.append(wsm.getResponse()).append("<BR>");
				} else {
					// errmsg for Problem with services
					sbRtn.append("<B style=\"color: red; \">Problem with Appedo-UI-LT-Services Services</B><BR>");
				}
				
				// Reloads Appedo-UI-SLA-Service
				wsm.sendRequest(Constants.APPEDO_UI_SLA_SERVICES + "/common/reloadConfigAndMailProperties", request );
				if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
					//response.getWriter().write(wsm.getResponse());
					sbRtn.append(wsm.getResponse()).append("<BR>");
				} else {
					// errmsg for Problem with services
					sbRtn.append("<B style=\"color: red; \">Problem with Appedo-UI-SLA-Service Services</B><BR>");
				}
			} catch (Exception e) {
				LogManager.errorLog(e);
				sbRtn.append("<B style=\"color: red; \">Exception occurred: "+e.getMessage()+"</B>");
			} finally {
				response.getWriter().write(sbRtn.toString());
			}
		}
	}
}
