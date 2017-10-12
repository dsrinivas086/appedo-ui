package com.appedo.servlet;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;

import com.appedo.bean.LoginUserBean;
import com.appedo.common.Constants;
import com.appedo.manager.WebServiceManager;
import com.appedo.model.CompressTarFileManager;
import com.appedo.model.LogManager;
import com.appedo.utils.UtilsFactory;


/**
 * Servlet to compress and download agent 
 * @author navin
 *
 */
public class DownloadAgentServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doAction(request, response);
	}

	/**
	 * The doPost method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to post.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doAction(request, response);
	}

	/**
	 * Accessed for both GET and POST,
	 * Downloads the agent by adds to TAR archive and compressed gziped 
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
	public void doAction(HttpServletRequest request, HttpServletResponse response) throws ServletException,IOException {
		
		String strRequestAction = null;
		LinkedHashMap<String, String> lhmAgentDownloadFilePath = null;
		response.setContentType("application/x-gzip");
		
		HttpSession session = request.getSession(false);
		if ( session == null || session.getAttribute("login_user_bean") == null ) {
			throw new ServletException("SESSION_EXPIRED");
		}
		// get the URI portion without Application Name
		if(Constants.COUNTER_TYPES_DOWNLOAD_FILE_PATH.size() <= 0 || Constants.AGENT_LATEST_BUILD_VERSION.size() <= 0){
			
			WebServiceManager wsm = new WebServiceManager();
			wsm.sendRequest(Constants.APPEDO_UI_MODULE_SERVICES + "/apm/getVersions", request);
			
			if( wsm.getStatusCode() != null && wsm.getStatusCode() == HttpStatus.SC_OK ) {
				String strVersions = wsm.getResponse();
				JSONObject joVersions = JSONObject.fromObject(strVersions);
				
				JSONObject joLatestVersions = joVersions.getJSONObject("AGENT_LATEST_BUILD_VERSION");
				Iterator keys = joLatestVersions.keys();
				while(keys.hasNext()) {
					String strKey = (String)keys.next();
					Constants.AGENT_LATEST_BUILD_VERSION.put(strKey, joLatestVersions.getString(strKey));
				}
				
				JSONObject joDownloadFiles = joVersions.getJSONObject("COUNTER_TYPES_DOWNLOAD_FILE_PATH");
				Iterator filekeys = joDownloadFiles.keys();
				while(filekeys.hasNext()) {
					String strKey = (String)filekeys.next();
					JSONObject joFiles = joDownloadFiles.getJSONObject(strKey);
					Iterator fileskeys = joFiles.keys();
					lhmAgentDownloadFilePath = new LinkedHashMap<String, String>();
					if(joFiles.size()>0){
						while(fileskeys.hasNext()) {
							String str = (String)fileskeys.next();
							lhmAgentDownloadFilePath.put(str, joFiles.getString(str));
						}
					}
					Constants.COUNTER_TYPES_DOWNLOAD_FILE_PATH.put(strKey, lhmAgentDownloadFilePath);
					strKey =  null;
					joFiles = null;
					fileskeys = null;
					lhmAgentDownloadFilePath = null;
				}
				joDownloadFiles = null;
				filekeys = null;
				keys = null;
				strVersions = null;
				joVersions = null;
				joLatestVersions = null;
			} else {
				response.getWriter().write( UtilsFactory.getJSONFailureReturn("Problem with Services").toString() );
			}
		}
		
		strRequestAction = request.getRequestURI();
		strRequestAction = strRequestAction.substring( strRequestAction.indexOf("/", 1), strRequestAction.length());
		
		ByteArrayOutputStream baosTarOut = null, baosGZOut = null, baosOut = null;
		ServletOutputStream sos = null;
		File fileDirectDownload = null, fileAgentDownload = null;
		FileInputStream fis = null;
		
		HashMap<String, String> hmUserAgentInfo = null;
		//LinkedHashMap<String, String> lhmRtnAgentFiles = null;
		LinkedHashMap<String, String> lhmAgentFiles = null;
		
		ArrayList<File> alFiles = null;
		//ArrayList<GUIDAppendFileBean> alGUIDAppendFiles = null;
		ArrayList<LinkedHashMap<String, String>> alGUIDAppendFiles = null;
		LinkedHashMap<String, String> lhmGUIDAppendFiles = null;
		
		String strFileName = "", strDirectDownloadFilePath = "", strAgentFileFullPath = "", strGUIDAppendFile = "", strGUIDFileTarEntryName = "";
		String[] saGUIDAppendFiles = null;
		
		byte[] bytesConfigFile = null;
		boolean bDirectDownload = false;
		
		
		CompressTarFileManager tarFileManager = null;
		//CompressZipFileManager zipFileManager = null;
		
		LoginUserBean loginUserBean = null;
		try {
			
			loginUserBean = new LoginUserBean();
			loginUserBean = (LoginUserBean) session.getAttribute("login_user_bean");
			
			// DownloadType, based on this for application to download PROFILER/MONITOR differs  
			String strDownloadType = UtilsFactory.replaceNull(request.getParameter("downloadtype"), "").toUpperCase();
			String strAgentType = request.getParameter("type");
			String strGUID = UtilsFactory.replaceNull(request.getParameter("guid"), "");
			// uid is the added for sum user reg id
			String strUID = UtilsFactory.replaceNull(request.getParameter("uid"), "");

			String strModuleName = UtilsFactory.replaceNull(request.getParameter("modulename"), "");
			String strCLRVersion = UtilsFactory.replaceNull(request.getParameter("clrVersion"), ""); 
			
			String strVersion = ""; 

			// download
			sos = response.getOutputStream();
			
			
			/*
			 * The agent's jar download, 
			 * adding the file to the TAR archive, output of the archive is stored in BytesArrayOutputStream(in memory)
			 * After adding required files & directory to archive, it is compressed(gz)
			 * then gz is converted into byte[] for download 
			 */
			
			// Object to hold the tar of required files & directories
			baosTarOut = new ByteArrayOutputStream();
			
			tarFileManager = new CompressTarFileManager(baosTarOut);
			
			alFiles = new ArrayList<File>();
			hmUserAgentInfo = new HashMap<String, String>();
			hmUserAgentInfo.put("guid", strGUID);
			hmUserAgentInfo.put("uid", strUID);
			hmUserAgentInfo.put("encryptedId", loginUserBean.getEncryptedUserId());
			hmUserAgentInfo.put("agentType", strAgentType.toUpperCase());
			hmUserAgentInfo.put("downloadtype", strDownloadType);
			hmUserAgentInfo.put("clrVersion", strCLRVersion);
			// thinks, below would be not in use, because port to differentiate added for dev instance
			//hmUserAgentInfo.put("port", Constants.FG_INSTANCE_PORT);
			hmUserAgentInfo.put("host", Constants.WEBSERVICE_HOST);
			hmUserAgentInfo.put("modulename", strModuleName);
			hmUserAgentInfo.put("port", "80");
			
			/* 
			 * TODO: to avoid repeat of multiple times GUID append files in the output of downloaded agent in tar.gz,
			 * a folders have to add for agents. 
			*/
			// gets files to download other than SUM and APPEDO_LT, for them has not added to database 
			if( ! strAgentType.equals("SUM") && ! strAgentType.equals("APPEDO_LT") ) {
				lhmAgentFiles = Constants.COUNTER_TYPES_DOWNLOAD_FILE_PATH.get(strAgentType);	
			}
			
			// to download SUM agent
			if( strAgentType.equals("SUM") ) {
				strVersion = Constants.AGENT_LATEST_BUILD_VERSION.get("SUM_AGENT");
				
				strAgentFileFullPath = Constants.DOWNLOADS+"/appedo_sum_agent_"+strVersion;
				
				tarFileManager.addExcludeFiles(Constants.DOWNLOADS+"/appedo_sum_agent_"+strVersion+"/resource/config.properties");
				
				saGUIDAppendFiles = new String[1];
				saGUIDAppendFiles[0] = "/resource/config.properties";
			} else if(strAgentType.equals("SLA") ) {
				if(request.getParameter("os").equals("windows")){
					hmUserAgentInfo.put("os", request.getParameter("os").toUpperCase());
					hmUserAgentInfo.put("protocol", Constants.SLA_COLLECTOR.getString("protocol"));
					hmUserAgentInfo.put("server", Constants.SLA_COLLECTOR.getString("server"));
					hmUserAgentInfo.put("slaport", Constants.SLA_COLLECTOR.getString("port"));
					hmUserAgentInfo.put("application_name", Constants.SLA_COLLECTOR.getString("application_name"));
					
					strVersion = Constants.AGENT_LATEST_BUILD_VERSION.get("APPEDO_WINDOWS_SLA_SLAVE");
					strAgentFileFullPath = Constants.DOWNLOADS+"appedo_sla_windows_slave_"+strVersion;
					
					saGUIDAppendFiles = new String[1];
					saGUIDAppendFiles[0] = "/APPEDO_SLA_WINDOWS_SLAVE/APPEDO_SLA_WINDOWS_AGENT.exe.config";
				}else{
					strVersion = Constants.AGENT_LATEST_BUILD_VERSION.get("APPEDO_SLA_SLAVE");
					strAgentFileFullPath = Constants.DOWNLOADS+"appedo_sla_slave_"+strVersion;
					
					saGUIDAppendFiles = new String[1];
					saGUIDAppendFiles[0] = "/resource/config.properties";
				}
				
				//tarFileManager.addExcludeFiles(Constants.DOWNLOADS+"/appedo_sum_agent_"+strVersion+"/resource/config.properties");
				
				
			}
			// to download Floodgates OR Appedo_LT tool
			else if( strAgentType.equals("APPEDO_LT") ) {
				strVersion = Constants.AGENT_LATEST_BUILD_VERSION.get("APPEDO_LT");
				
				strDirectDownloadFilePath = Constants.DOWNLOADS+"/AppedoLT_"+strVersion+".rar";
				fileDirectDownload = new File(strDirectDownloadFilePath);
				
				bDirectDownload = true;
				
				// download file name for end user 
				strFileName = fileDirectDownload.getName();
			}
			// to download profiler agent
			else if( strDownloadType.equalsIgnoreCase("PROFILER") ) {
				strVersion = Constants.AGENT_LATEST_BUILD_VERSION.get( lhmAgentFiles.get("profiler_build_module_name") );
				
				strAgentFileFullPath = lhmAgentFiles.get("profiler_agent_full_path").replaceAll("#VERSION#", strVersion);

				// files to append GUID
				saGUIDAppendFiles = lhmAgentFiles.get("profiler_guid_files").split(",");
			}
			// to download monitor agent
			else {
				strVersion = Constants.AGENT_LATEST_BUILD_VERSION.get( lhmAgentFiles.get("monitor_build_module_name") );
				
				strAgentFileFullPath = lhmAgentFiles.get("monitor_agent_full_path").replaceAll("#VERSION#", strVersion);

				// files to append GUID
				saGUIDAppendFiles = lhmAgentFiles.get("monitor_guid_files").split(",");
			}
			hmUserAgentInfo.put("version", strVersion);
			
			
			
			if( bDirectDownload == false ) {
				/*
				 * files to add tar archive
				 */
				// 
				fileAgentDownload = new File( strAgentFileFullPath );
				
				alFiles.add(fileAgentDownload);
				
				// guid appending files
				alGUIDAppendFiles = new ArrayList<LinkedHashMap<String, String>>(saGUIDAppendFiles.length);
				for(int i = 0; i < saGUIDAppendFiles.length; i++) {
					strGUIDAppendFile = strAgentFileFullPath + saGUIDAppendFiles[i];
					// entry name in the tar archive
					strGUIDFileTarEntryName = "/"+fileAgentDownload.getName()+"/"+saGUIDAppendFiles[i];
					
					// adding to exclude, the guid appending files  
					tarFileManager.addExcludeFiles(strGUIDAppendFile);
					
					lhmGUIDAppendFiles = new LinkedHashMap<String, String>(2);
					lhmGUIDAppendFiles.put("guid_append_file", strGUIDAppendFile);
					lhmGUIDAppendFiles.put("entry_name", strGUIDFileTarEntryName);
					
					alGUIDAppendFiles.add(lhmGUIDAppendFiles);
				}
				// download file name for end user 
				strFileName = fileAgentDownload.getName()+".tar.gz";
				
				response.setHeader("Content-position", "attachment;filename="+strFileName);
				/*
				 * COMPRESS or Adss to archive
				 */
				// Add files to the TAR archive 
				tarFileManager.compress(alFiles);
				
				// multiple files to append GUID
				for (int i = 0; i < alGUIDAppendFiles.size(); i++) {
					LinkedHashMap<String, String> lhmGUIDAppendFiles1 = alGUIDAppendFiles.get(i);
					
					// convert config into bytes
					bytesConfigFile = tarFileManager.getBytesFromFile(new File(lhmGUIDAppendFiles1.get("guid_append_file")), hmUserAgentInfo);
					
					// to add archive config file, TAR the config file's bytes 
					tarFileManager.compress(bytesConfigFile, lhmGUIDAppendFiles1.get("entry_name"));
				}
				
				CompressTarFileManager.finsihTAOS();
				
				// since gzip ignored for SUM, (heap space exception occurss when gzip for SUM)   
				if( ! strAgentType.equalsIgnoreCase("SUM") ) {
					// compress the tar to gzip, for other than SUM agent
					baosGZOut = tarFileManager.zipGZFromBytesTar(baosTarOut);
					baosOut = baosGZOut;
				} else {
					baosOut = baosTarOut;
				}
				
				// this makes the files downloadable in IE for SSL(https) websites [
				//response.setHeader("Cache-Control", "private, max-age=15");
				//response.setHeader("Pragma", "");
				//response.setContentLength(bytesArchiveOut.length);
				response.setHeader("Content-Disposition", "attachment; fileName=\""+strFileName+"\"");
				
				
				// download
				baosOut.writeTo(sos);
				LogManager.infoLog(strDownloadType+" agent "+strFileName+" downloaded...");
			} else {
				// for Appedo tool direct download
				response.setHeader("Content-Disposition", "attachment; fileName=\""+strFileName+"\"");
				
				fis = new FileInputStream(fileDirectDownload);
				int byteLength = 1024, readLength;
				byte[] outputByte = new byte[byteLength];
				// copy binary contect to output stream
				while( (readLength = fis.read(outputByte, 0, byteLength) ) != -1) {
					sos.write(outputByte, 0, readLength);
					outputByte = new byte[byteLength];
				}
				
				LogManager.infoLog("Tool "+strFileName+" downloaded...");
			}
			
			sos.flush();
			fileDirectDownload = null;
			UtilsFactory.clearCollectionHieracy( hmUserAgentInfo );
			UtilsFactory.clearCollectionHieracy( alFiles );
			strFileName = null;
			strDirectDownloadFilePath = null;
			
		} catch (Throwable e) {
			LogManager.errorLog(e);
			e.printStackTrace();
		} finally {
			bytesConfigFile = null;
			
			// tar archive to finish, before close 
			CompressTarFileManager.closeTAOS();
			CompressTarFileManager.closeGZOS();
			CompressTarFileManager.closeFOS();
			CompressTarFileManager.closeBuffOS();
			
			UtilsFactory.close(fis);
			fis = null;
			
			if( sos != null ){
				sos.close();
			}
			sos = null;
			
			if( baosGZOut != null ) {
				baosGZOut.close();
			}
			baosGZOut = null;
			
			if( baosTarOut != null ) {
				baosTarOut.close();
			}
			baosTarOut = null;
			
			if( baosOut != null ) {
				baosOut.close();
			}
			baosOut = null;
		}
	}
}
