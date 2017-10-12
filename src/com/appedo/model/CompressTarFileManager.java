package com.appedo.model;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.zip.GZIPOutputStream;

import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.io.IOUtils;

import com.appedo.common.Constants;





/**
 * Manager handles the business logic for adding file to archive and compression
 * @author navin
 *
 */
public class CompressTarFileManager {

	private static BufferedOutputStream buffos = null;
	private static TarArchiveOutputStream taos = null;
	private static GZIPOutputStream gzos = null;
	private static FileOutputStream fos = null; 
	
	private HashSet<String> hsExcludeFiles = new HashSet<String>();
	
	public void addExcludeFiles(String strExcludeFile) {
		this.hsExcludeFiles.add( new File(strExcludeFile).getAbsolutePath().toString() );
	}

	/**
	 * TAR archive's output is saved in the given file
	 * 
	 * @params file
	 */
	public CompressTarFileManager(File fileOuput) {
		try {
			// Wrap the output file stream in streams that will tar and gzip everything
			fos = new FileOutputStream(fileOuput);
			buffos = new BufferedOutputStream(fos);
			gzos = new GZIPOutputStream(buffos);
			taos = new TarArchiveOutputStream(gzos);
			
			// TAR has an 8 gig file limit by default, this gets around that
			//taos.setBigNumberMode(TarArchiveOutputStream.BIGNUMBER_STAR); // to get past the 8 gig limit
			// TAR originally didn't support long file names, so enable the support for it
			taos.setLongFileMode(TarArchiveOutputStream.LONGFILE_GNU);
		} catch(Exception e) {
			LogManager.errorLog(e);			
		}
	}

	/**
	 * TAR archive's output is saved in the bytesArrayOutputStream(in the memory)
	 * 
	 * @param baos
	 */
	public CompressTarFileManager(ByteArrayOutputStream baos) {
		try {
			// Wrap the output file stream in streams that will tar and gzip everything
			buffos = new BufferedOutputStream(baos);
			taos = new TarArchiveOutputStream(buffos);
			
			// TAR has an 8 gig file limit by default, this gets around that
			//taos.setBigNumberMode(TarArchiveOutputStream.BIGNUMBER_STAR); // to get past the 8 gig limit
			// TAR originally didn't support long file names, so enable the support for it
			taos.setLongFileMode(TarArchiveOutputStream.LONGFILE_GNU);
		} catch(Exception e) {
			LogManager.errorLog(e);
		}
	}
	
	/**
	 * Archive the filelist
	 * 
	 * @param files
	 * @throws Exception
	 */
	public void compress(List<File> files) throws Exception {
		for (File file : files) {
			addFileToCompression(file, "");
		}
	}
	
	/**
	 * Archive given bytes, adds entry to the archive by the given name  
	 * 
	 * @param bytes
	 * @param strEntryName
	 * @throws Exception
	 */
	public void compress(byte[] bytes, String strEntryName) throws Exception {
		addByteToCompression(bytes, strEntryName);
	}
	
	/**
	 * Archive the file with given name as the file/directory name
	 * 
	 * @param file
	 * @param strDir
	 * @param taos
	 * @throws Exception
	 */
	public void addFileToCompression(File file, String strName) throws Exception {
		String strEntryName = strName+file.getName();
		
		try {
			if( ! hsExcludeFiles.contains(file.getAbsoluteFile().toString()) ) {
				// Create an entry for the file
				taos.putArchiveEntry(new TarArchiveEntry(file, strEntryName));
				
				if (file.isFile()) {
					// Add the file to the archive
					FileInputStream fis = new FileInputStream(file);
					BufferedInputStream bis = new BufferedInputStream(fis);
					IOUtils.copy(bis, taos);
					taos.closeArchiveEntry();
					bis.close();
				} else if (file.isDirectory()) {
					// close the archive entry
					taos.closeArchiveEntry();
					// go through all the files in the directory and using recursion, add them to the archive 
					for (File childFile : file.listFiles()) {
						addFileToCompression(childFile, strEntryName+"/");
					}
				}
			}
		} catch(Exception e){
			LogManager.errorLog(e);
			throw e;
		}
	}
	
	/**
	 * Archive the bytes with given name as the file/directory name
	 * 
	 * @param bytes
	 * @param strDir
	 * @param taos
	 * @throws IOException
	 */
	public void addByteToCompression(byte[] bytes, String strName) throws IOException {
		String strEntryName = strName;
		
		// entry setted for the byte the file will be created to the entry name
		TarArchiveEntry tarArchiveEntry = new TarArchiveEntry(strEntryName);
		tarArchiveEntry.setSize(bytes.length);
		tarArchiveEntry.setMode(TarArchiveEntry.DEFAULT_FILE_MODE);
		
		taos.putArchiveEntry(tarArchiveEntry);
		taos.write(bytes, 0, bytes.length);
		taos.closeArchiveEntry();
	}
	
	
	/**
	 * Keywords in the file are replaced with hashmap content
	 * And the file content is converted to bytes
	 * 
	 * @param file
	 * @param hmUserAgentInfo
	 * @return
	 * @throws Exception
	 */
	public byte[] getBytesFromFile(File file, HashMap<String, String> hmUserAgentInfo) throws Exception {
		FileInputStream fileInputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader bufferedReader = null;
		
		byte[] bytes = null;
		
		StringBuilder sbLines = new StringBuilder();
		
		String strLine, strAgentType = "";
		
		try {
			//
			fileInputStream = new FileInputStream(file);
			inputStreamReader = new InputStreamReader(fileInputStream); 
			bufferedReader = new BufferedReader(inputStreamReader);
			
			strAgentType = hmUserAgentInfo.get("agentType");
			
			// Add the GUID with the agent_type as label
			while((strLine = bufferedReader.readLine()) != null) {
				if( sbLines.length() > 0 ) {
					sbLines.append("\n");
				}
				
				strLine = strLine.replaceAll("#VERSION#", hmUserAgentInfo.get("version"));
				if( strAgentType.equals("MSIIS") || strAgentType.equals("MSSQL") || strAgentType.equals("WINDOWS") ) {
					// for windows respective agents 
					strLine = strLine.replaceAll("@GUID@", hmUserAgentInfo.get("guid"));
					strLine = strLine.replaceAll("@PROTOCOL@", Constants.MONITOR_COLLECTOR.getString("protocol"));
					strLine = strLine.replaceAll("@SERVER@", Constants.MONITOR_COLLECTOR.getString("server"));
					strLine = strLine.replaceAll("@PORT@", Constants.MONITOR_COLLECTOR.getString("port"));
					strLine = strLine.replaceAll("@APPLICATION_NAME@", Constants.MONITOR_COLLECTOR.getString("application_name"));
					
					// only used in MSIIS agent, WIP
					strLine = strLine.replaceAll("@CLR_VERSION@", hmUserAgentInfo.get("clrVersion"));
					sbLines.append(strLine);
				} else if( strAgentType.equals("SUM") ) {
					// for SUM agent
					strLine = strLine.replaceAll("@UID@", hmUserAgentInfo.get("uid"));
					sbLines.append(strLine);
				} else if( strAgentType.equals("RUM")  || strAgentType.startsWith("CI") ) {
					// for RUM, CI
					strLine = strLine.replaceAll("@GUID@", hmUserAgentInfo.get("guid"));
					strLine = strLine.replaceAll("@RUM_COLLECTOR_URL@", Constants.getAsURL(Constants.RUM_COLLECTOR));
					// Note: CI collector URL is append in `appedo_ci.js` based on given in config as one time process in `Appedo-RUM-Collector`.
					sbLines.append(strLine);
				} else if( strAgentType.equals("SLA") ) {
					// for SLA agent
					if(hmUserAgentInfo.containsKey("os") && hmUserAgentInfo.get("os").equalsIgnoreCase("windows")){
						strLine = strLine.replaceAll("@SLAVEUSERID@", hmUserAgentInfo.get("encryptedId"));
						strLine = strLine.replaceAll("@APPLICATION_NAME@", hmUserAgentInfo.get("application_name"));
						strLine = strLine.replaceAll("@PORT@", hmUserAgentInfo.get("slaport"));
						strLine = strLine.replaceAll("@SERVER@", hmUserAgentInfo.get("server"));
						strLine = strLine.replaceAll("@PROTOCOL@", hmUserAgentInfo.get("protocol"));
					}else{
						strLine = strLine.replaceAll("@USERID@", hmUserAgentInfo.get("encryptedId"));
					}
					sbLines.append(strLine);
				}else {
					// for Tomcat, Linux, Mysql agents and Tomcat profiler
					if( ! strLine.equals("@GUID@") && ! strLine.equals("@TOMCAT_GUID_ONLY@") && ! strLine.equals("@COLLECTOR_URL@") ) {
						sbLines.append(strLine);
					} // tomcat profiler guid 
					else if ( strLine.equals("@TOMCAT_GUID_ONLY@") ) {
						sbLines.append("TOMCAT_GUID=").append(hmUserAgentInfo.get("guid"));
					} 
					else if ( strLine.equals("@COLLECTOR_URL@") ) {
						sbLines.append("WEBSERVICE_URL=").append(Constants.getAsURL(Constants.MONITOR_COLLECTOR));
					}
					else {
						// key value of guid and uid is appended 
						if( strAgentType.equals("TOMCAT") ) {
							sbLines	.append("AGENT_CONFIG=[{\"guid\":\"")
									.append(hmUserAgentInfo.get("guid"))
									.append("\",\"port\":\"")
									.append(hmUserAgentInfo.get("port"))
									.append("\",\"app\":\"")
									.append(hmUserAgentInfo.get("modulename"))
									.append("\"}]")
									.append("\n\n");
						}else if( strAgentType.equals("JBOSS") ) {
							sbLines	.append("AGENT_CONFIG=[{\"guid\":\"")
							.append(hmUserAgentInfo.get("guid"))
							.append("\",\"app\":\"")
							.append(hmUserAgentInfo.get("modulename"))
							.append("\"}]")
							.append("\n\n");
						} else if( strAgentType.equals("POSTGRES") ) {

						       sbLines .append("AGENT_CONFIG=[{\"guid\":\"")
						       .append(hmUserAgentInfo.get("guid"))
						       .append("\",\"dbname\":\"")
						       .append(hmUserAgentInfo.get("modulename"))
						       .append("\"}]")
						       .append("\n\n");
					   }else if( strAgentType.equals("MYSQL") ) {
							sbLines	.append("AGENT_CONFIG=[{\"guid\":\"")
							.append(hmUserAgentInfo.get("guid"))
							.append("\",\"dbname\":\"")
							.append(hmUserAgentInfo.get("modulename"))
							.append("\"}]")
							.append("\n\n");
						} else if( strAgentType.equals("MYSQL") ) {
							sbLines	.append("AGENT_CONFIG=[{\"guid\":\"")
									.append(hmUserAgentInfo.get("guid"))
									.append("\",\"dbname\":\"")
									.append("mysql")
									.append("\"}]")
									.append("\n\n");
						} else if( strAgentType.equals("FEDORA") ) {
							sbLines	.append("AGENT_CONFIG=[{\"guid\":\"")
							.append(hmUserAgentInfo.get("guid"))
							.append("\"}]")
							.append("\n\n");
						}else {
							sbLines	.append("AGENT_CONFIG=[{\"guid\":\"")
									.append(hmUserAgentInfo.get("guid"))
									.append("\",\"app\":\"")
									.append(hmUserAgentInfo.get("modulename"))
									.append("\"}]")
									.append("\n\n");
						}
					}
				}
			}
			
			bytes = sbLines.toString().getBytes();
			
		} catch (Exception e) {
			LogManager.errorLog(e);
			
			throw e;
		} finally {
			if(bufferedReader != null) {
				bufferedReader.close();
			}
			bufferedReader = null;
			
			if(inputStreamReader != null) {
				inputStreamReader.close();
			}
			inputStreamReader = null;
			
			if(fileInputStream != null) {
				fileInputStream.close();
			}
			fileInputStream = null;
		}
		
		return bytes;
	}
	
	/**
	 * Compress the bytesarrayoutputstream to gzzip, 
	 * output of gz is stored in BytesArrayOS in the memory
	 * 
	 * @param baos
	 * @return
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	public ByteArrayOutputStream zipGZFromBytesTar(ByteArrayOutputStream baos) throws FileNotFoundException, IOException {
	    GZIPOutputStream gzout = null;
	    ByteArrayOutputStream baosGZOut = new ByteArrayOutputStream();
	    
	    InputStream is = null;
	    
	    byte[] bytesRead = null;
	    
	    try {
	    	gzout = new GZIPOutputStream(new BufferedOutputStream(baosGZOut));
	    	
	    	is = new ByteArrayInputStream(baos.toByteArray());
	    	bytesRead = new byte[(int)baos.toByteArray().length];
			is.read(bytesRead);
			
			gzout.write(bytesRead, 0, bytesRead.length);
			
	    	gzout.finish();
	    } finally {
	    	if(is != null) {
	    		is.close();
	    	}
	    	is = null;
	    	
	    	if(gzout != null) {
	    		gzout.close();
	    	}
	    	gzout = null;
	    	bytesRead = null;
	    }
	    
	    return baosGZOut;
	}

	
	public static byte[] getBytes(InputStream is) throws IOException {

		int len;
		int size = 1024;
		byte[] buf;

		if (is instanceof ByteArrayInputStream) {
			size = is.available();
			buf = new byte[size];
			len = is.read(buf, 0, size);
		} else {
			ByteArrayOutputStream bos = new ByteArrayOutputStream();
			//size = is.available();
			buf = new byte[size];
			while ((len = is.read(buf, 0, size)) != -1){
				bos.write(buf, 0, len);
			}
			buf = bos.toByteArray();
		}
		// TODO close
		
		return buf;
	}
	
	/**
	 * Finishes TARArchiveOutputStream
	 *
	 */
	public static void finsihTAOS() {
		try {
			if (taos != null) {
				taos.finish();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Finishes gzipOutputStream
	 *
	 */
	public static void finsihGZ() {
		try {
			if (gzos != null) {
				gzos.finish();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * Closes outputstream
	 *
	 */
	public static void closeBuffOS() {
		try {
			if (buffos != null) {
				buffos.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		buffos = null;
	}
	
	/**
	 * Closes outputstream
	 *
	 */
	public static void closeFOS() {
		try {
			if (fos != null) {
				fos.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		fos = null;
	}
	
	/**
	 * Closes outputstream
	 *
	 */
	public static void closeGZOS() {
		try {
			if (gzos != null) {
				gzos.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		gzos = null;
	}
	
	/**
	 * Closes outputstream
	 *
	 */
	public static void closeTAOS() {
		try {
			if (taos != null) {
				taos.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		taos = null;
	}
	
	
	
	public static void main(String[] args) {
		try {
			CompressTarFileManager compressFileManager = null;
			
			HashMap<String, String> hmUserAgentInfo = new HashMap<String, String>();
			
			// the tar archive in which files are compressed
			//File fileOut = new File("c:/Appedo/resource/compressed/appedo_tomcat_1.0.24.tar.gz");
			
			ByteArrayOutputStream baosOut = new ByteArrayOutputStream();//70000000
			compressFileManager = new CompressTarFileManager(baosOut);
			//TarArchiveOutputStream taos = compressFileManager.getTarArchiveOutputStream(baosOut);
			//TarArchiveOutputStream taos = compressFileManager.getTarArchiveOutputStream(fileOut);
			
			// config file conveted to bytes which is compressed and writes into tar file with given entry name
			File fileTemplateConfig = new File("D:/FloodGates Files/Aug/Aug 20/resource/config.properties");
			hmUserAgentInfo.put("guid", "sadsadadas");
			
			byte[] bytesConfigFile = compressFileManager.getBytesFromFile(fileTemplateConfig, hmUserAgentInfo);
			LogManager.infoLog("bytesConfigFile : "+bytesConfigFile );
			LogManager.infoLog("bytesConfigFile length : "+bytesConfigFile.length );
			
			// compress the bytes of config file, adds entry to the archive with entry name
			compressFileManager.compress(bytesConfigFile, "config.properties");
			

			try {
				if( taos != null ) {
					taos.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			taos = null;
			
		
		} catch (Exception e){
			LogManager.errorLog(e);
		}
		
	}
}
