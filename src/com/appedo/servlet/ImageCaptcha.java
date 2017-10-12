package com.appedo.servlet;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Iterator;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.appedo.model.LogManager;

/**
 * Servlet to generate capatcha image
 * @author navin
 *
 */
public class ImageCaptcha extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int height = 0;

	private int width = 0;

	public static final String CAPTCHA_KEY = "captcha_key_name";

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		height = Integer.parseInt(getServletConfig().getInitParameter("height"));
		width = Integer.parseInt(getServletConfig().getInitParameter("width"));
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException {
		// Expire response
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expires", 0);
		response.setHeader("Pragma", "no-cache");
		response.setDateHeader("Max-Age", 0);

		response.setContentType("image/jpg");

		try {
			Color backgroundColor = new Color(255,255,255);
			//Color borderColor = Color.red;
			Color textColor = Color.BLACK;
			Color circleColor = new Color(160, 160, 160);
			Font textFont = new Font("Arial", Font.PLAIN, 24);
			int charsToPrint = 6;
			int width = request.getParameter("width") != null ? Integer.parseInt(request.getParameter("width")) : 250;
			int height = request.getParameter("height") != null ? Integer.parseInt(request.getParameter("height")) : 80;
			int circlesToDraw = 4;
			float horizMargin = 20.0f;
			float imageQuality = 0.9f; // max is 1.0 (this is for jpeg)
			double rotationRange = 0.9; // this is radians
			BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

			Graphics2D g = (Graphics2D) bufferedImage.getGraphics();

			// Draw an oval
			g.setColor(backgroundColor);
			g.fillRect(0, 0, width, height);

			// lets make some noisey circles
			g.setColor(circleColor);
			for (int i = 0; i < circlesToDraw; i++) {
				int circleRadius = (int) (Math.random() * height / 2.0);
				int circleX = (int) (Math.random() * width - circleRadius);
				int circleY = (int) (Math.random() * height - circleRadius);
				g.drawOval(circleX, circleY, circleRadius * 2, circleRadius * 2);
			}			
			g.setColor(textColor);
			g.setFont(textFont);

			FontMetrics fontMetrics = g.getFontMetrics();
			int maxAdvance = fontMetrics.getMaxAdvance();
			int fontHeight = fontMetrics.getHeight();

			// i removed 1 and l and i because there are confusing to users...
			// Z, z, and N also get confusing when rotated
			// 0, O, and o are also confusing...
			// lowercase G looks a lot like a 9 so i killed it
			// this should ideally be done for every language...
			// i like controlling the characters though because it helps prevent
			// confusion
			String elegibleChars = "ABCEFGHJKLMNPQRSTUVWXYaegmnt23456789";
			char[] chars = elegibleChars.toCharArray();

			float spaceForLetters = -horizMargin * 3 + width;
			float spacePerChar = spaceForLetters / (charsToPrint - 1.0f);

			StringBuffer finalString = new StringBuffer();

			for (int i = 0; i < charsToPrint; i++) {
				double randomValue = Math.random();
				int randomIndex = (int) Math.round(randomValue * (chars.length - 1));
				char characterToShow = chars[randomIndex];
				finalString.append(characterToShow);

				// this is a separate canvas used for the character so that
				// we can rotate it independently
				//int charImageWidth = maxAdvance * 2;
				//int charImageHeight = fontHeight * 2;
				int charWidth = fontMetrics.charWidth(characterToShow);
				int charDim = Math.max(maxAdvance, fontHeight);
				int halfCharDim = (int) (charDim / 2);

				BufferedImage charImage = new BufferedImage(charDim, charDim, BufferedImage.TYPE_INT_ARGB);
				Graphics2D charGraphics = charImage.createGraphics();
				charGraphics.translate(halfCharDim, halfCharDim);
				double angle = (Math.random() - 0.5) * rotationRange;
				charGraphics.transform(AffineTransform.getRotateInstance(angle));
				charGraphics.translate(-halfCharDim, -halfCharDim);
				charGraphics.setColor(textColor);
				charGraphics.setFont(textFont);

				int charX = (int) (0.5 * charDim - 0.5 * charWidth);
				charGraphics
						.drawString(
								"" + characterToShow,
								charX,
								(int) ((charDim - fontMetrics.getAscent()) / 2 + fontMetrics.getAscent()) );

				float x = horizMargin + spacePerChar * (i) - charDim / 2.0f;
				int y = (int) ((height - charDim) / 2);
				// System.out.println("x=" + x + " height=" + height + "
				// charDim=" + charDim + " y=" + y + " advance=" + maxAdvance +
				// " fontHeight=" + fontHeight + " ascent=" +
				// fontMetrics.getAscent());
				g.drawImage(charImage, (int) x, y, charDim, charDim, null, null);

				charGraphics.dispose();
			}
			
			// let's stick the final string in the session
			request.getSession().setAttribute("captcha", finalString.toString());
			
			// Write the image as a jpg
			Iterator iter = ImageIO.getImageWritersByFormatName("JPG");
			if (iter.hasNext()) {
				ImageWriter writer = (ImageWriter) iter.next();
				ImageWriteParam iwp = writer.getDefaultWriteParam();
				iwp.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
				iwp.setCompressionQuality(imageQuality);
				writer.setOutput(ImageIO.createImageOutputStream(response.getOutputStream()));
				IIOImage imageIO = new IIOImage(bufferedImage, null, null);
				writer.write(null, imageIO, iwp);
			} else {
				LogManager.infoLog("Unable to build image");
			}
			
			g.dispose();
		} catch (IOException ioe) {
			LogManager.errorLog(ioe);
		}catch (Exception e) {
			LogManager.errorLog(e);
		}

	}

}