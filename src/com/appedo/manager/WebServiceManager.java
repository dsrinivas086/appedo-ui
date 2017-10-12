package com.appedo.manager;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;

import com.appedo.model.LogManager;
import com.appedo.utils.UtilsFactory;

public class WebServiceManager {

	HashMap<String, String> hmMultipart = new HashMap<String, String>(); 
	HashMap<String, String> hmStringpart = new HashMap<String, String>(); 
	
	private Integer nStatusCode = null;
	private String strResponse = null;
	
	/**
	 * Sennd a HTTP request 
	 * 
	 * @param request
	 */
	public void sendRequest(String URL, HttpServletRequest request) {
		Enumeration<String> enumRequest = null;
		Iterator<String> iterMultipartFileName = null;
		String strMultipartFileName = null;
		
		HttpClient client = new HttpClient();
		PostMethod method = null;
		
		try{
			// Get the response from WebService
			method = new PostMethod(URL);

			if(request !=null){
				enumRequest = request.getParameterNames();
				while(enumRequest.hasMoreElements()){
					String param = enumRequest.nextElement();
					method.setParameter(param, request.getParameter(param));
				}
				UtilsFactory.clearCollectionHieracy(enumRequest);
				
				// setAttributes are set after receiving the Parameter
				enumRequest = request.getAttributeNames();
				while(enumRequest.hasMoreElements()){
					String param = enumRequest.nextElement();
					method.setParameter(param, request.getAttribute(param).toString());
				}
			}

			// Get all the file-multipart came in request
			// and put them in new HTTPRequest's parameter
			// In new HTTPRequest, file-multipart is going as String. So receiver should convert that into bytes.
			iterMultipartFileName = hmMultipart.keySet().iterator();
			while(iterMultipartFileName.hasNext()){
				strMultipartFileName = iterMultipartFileName.next();
				method.setParameter(strMultipartFileName, hmMultipart.get(strMultipartFileName));
			}

			nStatusCode = client.executeMethod(method);
			if (nStatusCode != HttpStatus.SC_OK) {
				System.err.println("statusCode: "+nStatusCode);
				System.err.println("Method failed: " + method.getStatusLine());
			}
			
			strResponse = method.getResponseBodyAsString();
			//System.out.println("strResponseJSONStream: "+strResponse);
		} catch (HttpException he) {
			LogManager.errorLog(he);
		} catch (IOException ie) {
			LogManager.errorLog(ie);
		} catch (Exception e) {
			LogManager.errorLog(e);
		} finally {
			UtilsFactory.clearCollectionHieracy(enumRequest);
			
			method.releaseConnection();
			method = null;
			
			client = null;
		}
	}
	
	public void sendRequest(String URL) {
		Iterator<String> iterStringName = null;
		String strStringContent = null;
		
		HttpClient client = new HttpClient();
		PostMethod method = null;
		
		try{
			// Get the response from WebService
			method = new PostMethod(URL);
			
			iterStringName = hmStringpart.keySet().iterator();
			while(iterStringName.hasNext()){
				strStringContent = iterStringName.next();
				method.setParameter(strStringContent, hmStringpart.get(strStringContent));
			}
			
			nStatusCode = client.executeMethod(method);
			if (nStatusCode != HttpStatus.SC_OK) {
				System.err.println("statusCode: "+nStatusCode);
				System.err.println("Method failed: " + method.getStatusLine());
			}
			
			strResponse = method.getResponseBodyAsString();
			//System.out.println("strResponseJSONStream: "+strResponse);
		} catch (HttpException he) {
			LogManager.errorLog(he);
		} catch (IOException ie) {
			LogManager.errorLog(ie);
		} catch (Exception e) {
			LogManager.errorLog(e);
		} finally {
			method.releaseConnection();
			method = null;
			
			client = null;
		}
	}

	public void addMultipartIntoParameter(HttpServletRequest request) {
		byte dataBytes[];
		Part filePart;
		String uploadFileName;
		String upload_file_count;
		String file;
		try{
			
			upload_file_count = request.getParameter("upload_file_count")==null?"0":request.getParameter("upload_file_count");
			for(int mIndex=0; mIndex < Integer.parseInt(upload_file_count); mIndex++){
				filePart=request.getPart("file_"+mIndex);
				uploadFileName = getUploadFileName(filePart);
				dataBytes = getBytes(filePart.getInputStream());
				file = new String(dataBytes);
				hmMultipart.put("file_name_"+mIndex, uploadFileName);
				hmMultipart.put("file_content_"+mIndex, file);
			}	
			hmMultipart.put("upload_file_count", upload_file_count);
		} catch (Exception e) {
			LogManager.errorLog(e);
		} finally {
			dataBytes=null;
			filePart=null;
			uploadFileName=null;
			upload_file_count=null;
			file=null;
		}
	}

	public void addParameter(String key,String value) {
		try{
			hmStringpart.put(key, value);
		} catch (Exception e) {
			LogManager.errorLog(e);
		}
	}
	
	protected String getUploadFileName(final Part part) {
		final String partHeader = part.getHeader("content-disposition");
	
		for(String content : part.getHeader("content-disposition").split(";")) {
			if (content.trim().startsWith("filename")) {
				return content.substring(content.indexOf('=') + 1).trim().replace("\"", "");
		    }
		}
		return null;
	}

	protected static byte[] getBytes(InputStream is) throws IOException {

		int len;
		int size = 1024;
		byte[] buf;

		if (is instanceof ByteArrayInputStream) {
			size = is.available();
			buf = new byte[size];
			len = is.read(buf, 0, size);
		} else {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			buf = new byte[size];
			while ((len = is.read(buf, 0, size)) != -1)
				bos.write(buf, 0, len);
			buf = bos.toByteArray();
		}
		return buf;
	}

	public Integer getStatusCode() {
		return nStatusCode;
	}
	
	public String getResponse() {
		return strResponse;
	}
	
	public void destory() {
		strResponse = null;
		nStatusCode = null;
	}
	
	@Override
	protected void finalize() throws Throwable {
		destory();
		super.finalize();
	}
}
