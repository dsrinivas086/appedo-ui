package com.appedo.common;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Properties;

import net.sf.json.JSONObject;

import com.appedo.model.LogManager;
import com.appedo.utils.UtilsFactory;

/**
 * This class holds the application level variables which required through the application.
 * 
 * @author navin
 *
 */
public class Constants {
	
	//public final static String CONFIGFILEPATH = InitServlet.realPath+"/WEB-INF/classes/com/softsmith/floodgates/resource/config.properties";
	public static String CONSTANTS_FILE_PATH = "";
	
	public static String RESOURCE_PATH = "";
	
	public static String APPEDO_CONFIG_FILE_PATH = "";
	public static String APPEDO_SLA_CONFIG_FILE_PATH = "";
	public static String SMTP_MAIL_CONFIG_FILE_PATH = "";
	
	public static String PATH = ""; 
	public static String VUSCRIPTSPATH = "";
	public static String JMETERVUSCRIPTSFOLDERPATH = "";
	public static String JMETERVUSCRIPTSPATH = "";
	public static String FLOODGATESVUSCRIPTSPATH = "";
	public static String FLOODGATESSCENARIOXMLPATH = "";
	public static String FLOODGATESSCENARIOXMLFOLDERPATH = "";
	public static String JMETERSCENARIOXMLFOLDERPATH = "";
	public static String JMETERSCENARIOXMLPATH = "";
	public static String JMETERSCENARIOFOLDERPATH = "";
	public static String JMETERSCENARIOSPATH = "";
	public static String CSVFILE = "";
	public static String UPLOADPATH = "";
	public static String VARIABLEPATH = "";
	public static String SUMMARYREPORTPATH = "";
	public static String VARIABLEXMLPATH = "";
	public static String VARIABLEXMLFOLDERPATH = "";
	public static String JMETERTESTPATH = "";
	public static String JMETERTESTJTLPATH = "";
	public static String JMETERCSVPATH = "";
	public static String JMETERSUMMARYREPORTPATH="";
	public static String EMAIL_TEMPLATES_PATH = "";
	public static String DOWNLOADS = "";
	
	public static String SELENIUM_SCRIPT_CLASS_FILE_PATH = "";
	public static String FROMEMAILADDRESS = "";

	public static String FG_CONTROLLER_IP = "";
	public static String FG_CONTROLLER_PORT = "";
	public static String FG_CONTROLLER_PORT1 = "";
	public static String FG_APPLICATION_IP = "";
	
	public static String JM_CONTROLLER_IP= "";
	public static String JM_CONTROLLER_PORT = "";

	public static String APPEDO_URL = "";	
	public static String WEBSERVICE_HOST = "";
	public static String FLOODGATESVUSCRIPTSFOLDERPATH = "";
	public static String FLOODGATESVUSCRIPTSTEMPFOLDERPATH = "";
	public static String APPEDO_SCHEDULER = "";
	public static String LICENSEPATH = "";
	public static String LICENSEXMLPATH = "";
	public static String APPEDO_HARFILES = "";
	public static String HAR_REPOSITORY_URL = "";
	public static String APPEDO_COLLECTOR = "";	
	public static String APPEDO_UI_RUM_SERVICES = "";
	public static String APPEDO_UI_CREDENTIAL_SERVICES = null;
	public static String APPEDO_UI_MODULE_SERVICES = null;
	public static String APPEDO_UI_LT_SERVICES = null;
	public static String APPEDO_LT_EXECUTION_SERVICES = null;
	public static String APPEDO_UI_SUM_SERVICES = null;
	public static String APPEDO_UI_SLA_SERVICES = null;
	public static String FG_VUSCRIPTS_TEMP_PATH = "";
	
	public static String ACTION_LOG_FILE_FOLDER = "";
	public static String SLAVE_CONNECTION_PRIMARY_PORT = "";
	public static String SLAVE_CONNECTION_SECONDARY_PORT = "";
	// Since license 
	//public static String MAX_COUNTERS = "";
	
	public static HashMap<String, String> AGENT_LATEST_BUILD_VERSION = new HashMap<String, String>();
	
	
	// Limitation for Counter Charts time window
	public static int COUNTER_CHART_START_DELAY = 60;//62;
	public static int COUNTER_CHART_END_DELAY = 0;//2;
	public static int COUNTER_MINICHART_START_DELAY = 10;//12;
	public static int COUNTER_MINICHART_END_DELAY = 0;//2;
	
	// tried to append 0 for diff between the prev result time and current result time is > 3 min
	public static final int COUNTER_CHART_TIME_INTERVAL = 3;
	public static final int COUNTER_CHART_ADD_0_FOR_EVERY = 3;
	
	public static String CLASS_EXPORT_URL;
	
	public static String SELENIUM_SCRIPT_PACKAGES;
	
	// UI-Service applications
	public static String RUM_UI_SERVICE_APPLICATION_NAME = null;
	public static String SLA_UI_SERVICE_APPLICATION_NAME = null;
	
	// RUM related variables, TODO remove below 2 commented lines later next builds
	//public static String RUM_JS_SCRIPT_FILES_URL = null;
	//public static String RUM_COLLECTOR_IP = null;
	
	//log4j properties file path
	public static String LOG4J_PROPERTIES_FILE = "";
	
	public static boolean IS_CAPTCHA_VALIDATION_ENABLE = true;
	
	public static HashMap<String, String> MINICHART_COUNTERS = new HashMap<String, String>();
	
	public static LinkedHashMap<String, LinkedHashMap<String, String>> COUNTER_TYPES_DOWNLOAD_FILE_PATH = new LinkedHashMap<String, LinkedHashMap<String, String>>();
	
	//
	/*public static String MONITOR_COLLECTOR_URL = "";
	public static String RUM_COLLECTOR_URL = "";
	public static String CI_COLLECTOR_URL = "";*/
	
	public static JSONObject MONITOR_COLLECTOR = null;
	public static JSONObject RUM_COLLECTOR = null;
	public static JSONObject CI_COLLECTOR = null;
	public static JSONObject SLA_COLLECTOR = null;
	
	public static String HTTPS_CRT_NAME = null;
	
	// For APM license, to check total max modules added, so that to restrict ADD module for download agents
	public static String APM_GROUP = "";
	public static String MAX_LOADGEN_CREATION = "";
	public static String DELAY_SAMPLING = "";
	public static String UPLOAD_URL = "";
	public static String APPEDO_UI_MODULE_SERVICE_APPLICATION_NAME = "";
	
	/*public enum AGENT_TYPE {
	TOMCAT_7X("TOMCAT 7.X", "tomcat_performance_counter"), JBOSS("JBOSS", "jboss_performance_counter"), MSIIS("MSIIS", "msiis_performance_counter"), 
	JAVA_PROFILER("JAVA_PROFILER", "tomcat_profiler"), 
	LINUX("LINUX", "linux_performance_counter"), MSWINDOWS("MSWINDOWS", "windows_performance_counter"), 
	MYSQL("MYSQL", "mysql_performance_counter"), MSSQL("MSSQL", "mssql_performance_counter");
	
	private String strAgentType, strTableName;
	
	private AGENT_TYPE(String agentType, String tableName) {
		strAgentType = agentType;
		strTableName = tableName;
	}
	
	public void setMySQLVersion(String strVersionNo) {
		strAgentType = "MYSQL "+strVersionNo;
	}
	
	public String getTableName() {
		return strTableName;
	}
	
	@Override
	public String toString() {
		return strAgentType;
	}
}*/
	
	public enum CHART_START_INTERVAL {
		_1("3 hours"), _2("24 hours"), _3("7 days"), _4("15 days"), _5("30 days");
		
		private String strInterval;
		
		private CHART_START_INTERVAL(String strInterval) {
			this.strInterval = strInterval;
		}
		
		public String getInterval() {
			return strInterval;
		}
	}

	/*public enum SUM_CHART_START_INTERVAL {
		_1("24 hours"), _2("7 days"), _3("15 days"), _4("30 days"), _5("60 days"), _6("120 days"), _7("180 days");
		
		private String strInterval;
		
		private SUM_CHART_START_INTERVAL(String strInterval) {
			this.strInterval = strInterval;
		}
		
		public String getInterval() {
			return strInterval;
		}
	}*/
	
	/**
	 * Loads constants properties 
	 * 
	 * @param srtConstantsPath
	 */
	public static void loadConstantsProperties(String srtConstantsPath) throws Exception {
    	Properties prop = new Properties();
    	InputStream is = null;
    	
        try {
    		is = new FileInputStream(srtConstantsPath);
    		prop.load(is);
    		
     		// Appedo application's resource directory path
     		RESOURCE_PATH = prop.getProperty("RESOURCE_PATH");
     		
     		APPEDO_CONFIG_FILE_PATH = RESOURCE_PATH+prop.getProperty("APPEDO_CONFIG_FILE_PATH");
     		APPEDO_SLA_CONFIG_FILE_PATH = RESOURCE_PATH+prop.getProperty("APPEDO_SLA_CONFIG_FILE_PATH");
     		PATH = RESOURCE_PATH+prop.getProperty("Path");
     		
     		FLOODGATESVUSCRIPTSFOLDERPATH = RESOURCE_PATH+prop.getProperty("floodgatesvuscriptsfolderpath");
     		FLOODGATESVUSCRIPTSTEMPFOLDERPATH = RESOURCE_PATH+prop.getProperty("floodgatesvuscriptstempfolderpath");
     		VUSCRIPTSPATH = RESOURCE_PATH+prop.getProperty("VUScriptspath");
     		FLOODGATESVUSCRIPTSPATH = RESOURCE_PATH+prop.getProperty("floodgatesvuscriptspath");
     		JMETERVUSCRIPTSFOLDERPATH = RESOURCE_PATH+prop.getProperty("jmetervuscriptsfolderpath");
     		JMETERVUSCRIPTSPATH = RESOURCE_PATH+prop.getProperty("jmetervuscriptspath");
     		FLOODGATESSCENARIOXMLPATH = RESOURCE_PATH+prop.getProperty("floodgatesscenarioxmlpath");
     		FLOODGATESSCENARIOXMLFOLDERPATH = RESOURCE_PATH+prop.getProperty("floodgatesscenarioxmlfolderpath");
     		JMETERSCENARIOXMLPATH = RESOURCE_PATH+prop.getProperty("jmeterscenarioxmlpath");
     		JMETERSCENARIOXMLFOLDERPATH = RESOURCE_PATH+prop.getProperty("jmeterscenarioxmlfolderpath");
     		JMETERSCENARIOFOLDERPATH = RESOURCE_PATH+prop.getProperty("jmeterscenariofolderpath");
     		CSVFILE = RESOURCE_PATH+prop.getProperty("Csvfile");
     		UPLOADPATH = RESOURCE_PATH+prop.getProperty("Uploadpath");
     		VARIABLEPATH = RESOURCE_PATH+prop.getProperty("Variablepath");
     		SUMMARYREPORTPATH = RESOURCE_PATH+prop.getProperty("summaryreportpath");
     		VARIABLEXMLPATH = RESOURCE_PATH+prop.getProperty("VariableXMLpath");
     		VARIABLEXMLFOLDERPATH = RESOURCE_PATH+prop.getProperty("VariableXMLFolderpath");
     		JMETERSCENARIOSPATH = RESOURCE_PATH+prop.getProperty("jmeterscenariospath");
     		JMETERTESTPATH = RESOURCE_PATH+prop.getProperty("jmetertestpath");
     		JMETERTESTJTLPATH = RESOURCE_PATH+prop.getProperty("jmetertestjtlpath");
     		DOWNLOADS = RESOURCE_PATH+prop.getProperty("downloads");
     		JMETERCSVPATH = RESOURCE_PATH+prop.getProperty("jmetercsvpath");
     		JMETERSUMMARYREPORTPATH = RESOURCE_PATH+prop.getProperty("jmetersummaryreportpath");
     		LICENSEPATH = RESOURCE_PATH+prop.getProperty("licensepath");
     		LICENSEXMLPATH = RESOURCE_PATH+prop.getProperty("licensexmlpath");
     		EMAIL_TEMPLATES_PATH = RESOURCE_PATH+prop.getProperty("EMAIL_TEMPLATES_PATH");
     		FG_VUSCRIPTS_TEMP_PATH = RESOURCE_PATH+prop.getProperty("FG_VUSCRIPTS_TEMP_PATH");
     		//MAX_COUNTERS = prop.getProperty("max_counters");
     		APM_GROUP = prop.getProperty("APM_GROUP");
     		MAX_LOADGEN_CREATION = prop.getProperty("MAX_LOADGEN_CREATION");
     		DELAY_SAMPLING = prop.getProperty("DELAY_SAMPLING");
     		
     		// Mail configuration 
     		SMTP_MAIL_CONFIG_FILE_PATH = RESOURCE_PATH+prop.getProperty("SMTP_MAIL_CONFIG_FILE_PATH");
     		FROMEMAILADDRESS = prop.getProperty("FromEmailAddress");
     		
     		Constants.SELENIUM_SCRIPT_CLASS_FILE_PATH = Constants.RESOURCE_PATH+prop.getProperty("sumtransactionfilepath");
     		LOG4J_PROPERTIES_FILE = RESOURCE_PATH+prop.getProperty("LOG4J_CONFIG_FILE_PATH");
     		SELENIUM_SCRIPT_PACKAGES = prop.getProperty("seleniumscriptpackages");
     		ACTION_LOG_FILE_FOLDER = RESOURCE_PATH+prop.getProperty("ACTION_LOG_FILE_FOLDER");
        } catch(Throwable th) {
        	System.out.println("Exception in loadConstantsProperties: "+th.getMessage());
        	LogManager.errorLog(th);
        	
        	throw th;
        } finally {
        	UtilsFactory.close(is);
        	is = null;
        }
	}
	
	/**
	 * Loads appedo config properties, from the system specifed path, 
	 * (Note.. loads other than db related)
	 *  
	 * @param strAppedoConfigPath
	 */
	public static void loadAppedoConfigProperties(String strAppedoConfigPath) throws Exception {
    	Properties prop = new Properties();
    	InputStream is = null;
    	
    	JSONObject joAppedoCollector = null;
    	
        try {
    		is = new FileInputStream(strAppedoConfigPath);
    		prop.load(is);
    		
     		// Load Test configuration & LoadGen Agent details
    		FG_CONTROLLER_IP = prop.getProperty("FG_CONTROLLER_IP");
    		FG_CONTROLLER_PORT = prop.getProperty("FG_CONTROLLER_PORT");
    		FG_CONTROLLER_PORT1 = prop.getProperty("FG_CONTROLLER_PORT1");
    		FG_APPLICATION_IP = prop.getProperty("FG_APPLICATION_IP");

     		JM_CONTROLLER_IP = prop.getProperty("JM_CONTROLLER_IP");
     		JM_CONTROLLER_PORT = prop.getProperty("JM_CONTROLLER_PORT");
     		
     		// User's email address verification mail's URL link starter
     		APPEDO_URL = prop.getProperty("APPEDO_URL");
     		APPEDO_UI_MODULE_SERVICE_APPLICATION_NAME = prop.getProperty("APPEDO_UI_MODULE_SERVICE_APPLICATION_NAME");
     		// Url to delete har files from har repository
     		HAR_REPOSITORY_URL = prop.getProperty("HAR_REPOSITORY_URL");	
     		
     		// Webservice collector
     		WEBSERVICE_HOST = prop.getProperty("WEBSERVICE_HOST");
     		APPEDO_SCHEDULER = prop.getProperty("APPEDO_SCHEDULER");
     		APPEDO_HARFILES = prop.getProperty("APPEDO_HARFILES");
     		CLASS_EXPORT_URL = prop.getProperty("URL_TO_EXPORT_CLASS_FILE");
     		APPEDO_COLLECTOR = prop.getProperty("APPEDO_COLLECTOR");
     		APPEDO_UI_CREDENTIAL_SERVICES = prop.getProperty("CREDENTIAL_UI_SERVICES");
     		APPEDO_UI_MODULE_SERVICES = prop.getProperty("MODULE_UI_SERVICES");
     		APPEDO_UI_RUM_SERVICES = prop.getProperty("RUM_UI_SERVICES");
     		APPEDO_UI_SUM_SERVICES = prop.getProperty("SUM_UI_SERVICES");
     		APPEDO_UI_LT_SERVICES = prop.getProperty("LT_UI_SERVICES");
     		APPEDO_LT_EXECUTION_SERVICES = prop.getProperty("LT_EXECUTION_SERVICES");
     		APPEDO_UI_SLA_SERVICES = prop.getProperty("SLA_UI_SERVICES");
     		
     		IS_CAPTCHA_VALIDATION_ENABLE = Boolean.parseBoolean( UtilsFactory.replaceNull(prop.getProperty("IS_CAPTCHA_VALIDATION_ENABLE"), "true") );
     		
     		
     		// UI-Service applications
     		RUM_UI_SERVICE_APPLICATION_NAME = prop.getProperty("RUM_UI_SERVICE_APPLICATION_NAME");
     		SLA_UI_SERVICE_APPLICATION_NAME = prop.getProperty("SLA_UI_SERVICE_APPLICATION_NAME");
     		
     		
     		MONITOR_COLLECTOR = JSONObject.fromObject(prop.getProperty("MONITOR_COLLECTOR"));
     		RUM_COLLECTOR = JSONObject.fromObject(prop.getProperty("RUM_COLLECTOR"));
     		CI_COLLECTOR = JSONObject.fromObject(prop.getProperty("CI_COLLECTOR"));
     		SLA_COLLECTOR = JSONObject.fromObject(prop.getProperty("SLA_COLLECTOR"));
     		
     		HTTPS_CRT_NAME = prop.getProperty("HTTPS_CRT_NAME");
     		
     		UPLOAD_URL = prop.getProperty("UPLOAD_URL");

     		SELENIUM_SCRIPT_PACKAGES = prop.getProperty("SELENIUM_SCRIPT_PACKAGES");
     		SLAVE_CONNECTION_PRIMARY_PORT = prop.getProperty("SLAVE_CONNECTION_PRIMARY_PORT");
     		SLAVE_CONNECTION_SECONDARY_PORT = prop.getProperty("SLAVE_CONNECTION_SECONDARY_PORT");
     		
     		// RUM related variables
     		//RUM_JS_SCRIPT_FILES_URL = prop.getProperty("RUM_JS_SCRIPT_FILES_URL");
        } catch(Exception e) {
        	LogManager.errorLog(e);
        	throw e;
        } finally {
        	UtilsFactory.close(is);
        	is = null;
        	
        	UtilsFactory.clearCollectionHieracy(joAppedoCollector);
        	joAppedoCollector = null;
        }	
	}
	
	/**
	 * Collector in JSON format return as URL
	 * 
	 * @param joAppedoCollector
	 * @return
	 */
	public static String getAsURL(JSONObject joAppedoCollector) {
		return joAppedoCollector.getString("protocol") +"://"+ joAppedoCollector.getString("server") + 
				( joAppedoCollector.getString("port").length() > 0 ? ":"+joAppedoCollector.getString("port") : "" ) + 
				"/"+ joAppedoCollector.getString("application_name");
	}
}
