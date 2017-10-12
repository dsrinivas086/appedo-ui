package com.appedo.controller;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.httpclient.HttpStatus;

import com.appedo.bean.LoginUserBean;
import com.appedo.common.Constants;
import com.appedo.manager.WebServiceManager;
import com.appedo.utils.UtilsFactory;

/**
 * Servlet implementation class ModuleController
 */
@WebServlet("/SUMController")
public class SUMController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public SUMController() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doAction(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doAction(request, response);
	}
	
	public void doAction(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String strRequestAction = null;
		LoginUserBean loginUserBean = null;
		HttpSession session = request.getSession(false);
		
		// return Exception if session is already expired.
		if ( session == null || session.getAttribute("login_user_bean") == null ) {
			throw new ServletException("SESSION_EXPIRED");
		}
		
		loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
		request.setAttribute("login_user_bean", loginUserBean.toJSON());
		
		// get the URI portion without Application Name
		strRequestAction = request.getRequestURI();
		strRequestAction = strRequestAction.substring( strRequestAction.indexOf("/", 1), strRequestAction.length());
		
		WebServiceManager wsm = new WebServiceManager();
		wsm.sendRequest(Constants.APPEDO_UI_SUM_SERVICES + strRequestAction, request );
		
		if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
			response.getWriter().write(wsm.getResponse());
		} else {
			response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
		}
		
		// clear used variables
		loginUserBean = null;
		strRequestAction = null;
	}
}
