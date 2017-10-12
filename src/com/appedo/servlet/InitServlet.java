package com.appedo.servlet;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.appedo.common.Constants;
import com.appedo.model.LogManager;

/**
 * Servlet to handle one operation for the whole application
 * 
 * @author navin
 * 
 */
public class InitServlet extends HttpServlet {
	// set log access

	private static final long serialVersionUID = 1L;
	public static String realPath = null;
	public static TimerTask timerTaskLoadTest = null, timerTaskProcessingQueue = null, timerTaskCount = null, timerTaskPaid = null, timerJmeter = null, timerJmeterPro = null, timerJmeterDrain = null;
	public static Timer timerLT = new Timer(), timerProcessing = new Timer(), timerCount = new Timer(), timerPaid = new Timer(), timerJM = new Timer(),timerJMPro = new Timer(),timerJMDrain = new Timer();

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public void init() {
		// super();

		// declare servlet context
		ServletContext context = getServletContext();

		realPath = context.getRealPath("//");

		try {
			String strConstantsFilePath = context.getInitParameter("CONSTANTS_PROPERTIES_FILE_PATH");
			String strLog4jFilePath = context.getInitParameter("LOG4J_PROPERTIES_FILE_PATH");

			Constants.CONSTANTS_FILE_PATH = InitServlet.realPath + strConstantsFilePath;
			Constants.LOG4J_PROPERTIES_FILE = InitServlet.realPath + strLog4jFilePath;

			// Loads log4j configuration properties
			LogManager.initializePropertyConfigurator();
			// Loads Constant properties
			Constants.loadConstantsProperties(Constants.CONSTANTS_FILE_PATH);

			// Loads Appedo config properties from the system path
			Constants.loadAppedoConfigProperties(Constants.APPEDO_CONFIG_FILE_PATH);
			
			/* TODO 
			// loads agent's latest build version
			ModulesDBI.loadAgentsLatestVersion(con);

			// Load minichart template ids
			ModulesDBI.loadMiniChartCounters(con);
			
			// loads agents(counter_types) download file paths 
			ModulesDBI.loadAgentsDownloadFilePath(con);
			*/
			strConstantsFilePath = null;
			strLog4jFilePath = null;

		} catch (Throwable e) {
        	System.out.println("Exception in InitServlet.init: "+e.getMessage());
        	e.printStackTrace();
        	
			LogManager.errorLog(e);
		}
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
