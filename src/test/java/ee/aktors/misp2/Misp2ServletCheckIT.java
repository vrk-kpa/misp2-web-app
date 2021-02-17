package ee.aktors.misp2;

import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.springframework.http.HttpStatus;


import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import static org.junit.Assert.assertEquals;

public class Misp2ServletCheckIT extends BaseUITest {

    @Test
    public void classifierCheck() throws Exception {

        userLogin();
        // TODO: What it needs to get SESSION_PORTAL initialized?
        URL url = new URL(baseUrl + "/classifier");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        assertEquals("misp2 /classifier endpoint should reply status 200",
                HttpStatus.OK.value(), connection.getResponseCode()
        );

    }

    @Test
    public void loadCertificationCheck() throws Exception {
        userLogin();
        URL url = new URL(baseUrl + "/loadCertification" + "?certificate=fakecert");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        assertEquals("misp2 /loadCertification endpoint should reply status 200",
                HttpStatus.OK.value(), connection.getResponseCode()
        );

    }

    @Test
    public void ssnValidationCheck() throws Exception {
        userLogin();
        URL url = new URL(baseUrl + "/ssnValidation" + "?ssn=fakessn&countryCode=EE");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        assertEquals("misp2 /loadCertification endpoint should reply status 200",
                HttpStatus.OK.value(), connection.getResponseCode()
        );
        assertEquals("text/xml;charset=UTF-8", connection.getContentType());
    }

    @Test
    public void getXSLTCheck() throws Exception {
        userLogin();
        URL url = new URL(baseUrl + "/getXSLT");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setDoOutput(true);
        connection.setRequestMethod("POST");


        assertEquals("misp2 /getXSLT endpoint should reply status 200",
                HttpStatus.OK.value(), connection.getResponseCode()
        );
        assertEquals("text/xml", connection.getContentType());

    }

    // TODO: echo

    @Test
    public void parseDigiDocCheck() throws Exception {
        userLogin();
        URL url = new URL(baseUrl + "/parseDigiDoc");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        // TODO: why the content-type does not get through to DigiDocServlet?
        connection.setRequestProperty("Content-Type","text/xml");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);


        OutputStreamWriter writer = new OutputStreamWriter(
                connection.getOutputStream()
        );
        writer.write("<?xml version=\"1.0\" encoding=\"UTF-8\" ?>  " +
                "<SignedDoc format=\"DIGIDOC-XML\" version=\"1.3\"             " +
                "xmlns=\"http://www.sk.ee/DigiDoc/v1.3.0#\">   " +
                "<DataFile>My data file</DataFile>" +
                "<Signature /> " +
                "</SignedDoc> ");
        writer.flush();
        writer.close();

        assertEquals("misp2 /parseDigiDoc endpoint should reply status 200",
                HttpStatus.OK.value(), connection.getResponseCode()
        );
        assertEquals("text/plain", connection.getContentType());

    }

    // TODO: mediator

    @Test
    public void generatePDFCheck() throws Exception {
        userLogin();
        URL url = new URL(baseUrl + "/generate-pdf");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Content-Type","text/html");
        connection.setDoOutput(true);
        connection.setRequestMethod("POST");
        String htmlContent = "<html>\n" +
                "<head>\n" +
                "<title>TEst</title>\n" +
                "</head>\n" +
                "<body>\n" +
                "\n" +
                "TEsting html'''''äöäääää\n" +
                "\n" +
                "</body>\n" +
                "</html>";


        assertEquals("misp2 /generate-pdf endpoint should reply status 200",
                HttpStatus.OK.value(), connection.getResponseCode()
        );
        assertEquals("application/pdf", connection.getContentType());

    }

}
