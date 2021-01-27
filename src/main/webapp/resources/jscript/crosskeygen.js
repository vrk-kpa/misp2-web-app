/**
 * 
 * Copyright (c) 2008-2010, The University of Manchester, United Kingdom. All
 * rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. Neither the name of the The University of Manchester
 * nor the names of its contributors may be used to endorse or promote products
 * derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * 
 * Author........: Bruno Harbulot
 * 
 */


function createCsrCertEnroll(enrollFactObj) {
    /*
     * Creates a CX509EnrollmentWebClassFactory (used to create all the other
     * objects).
     */
    if (enrollFactObj == null) {
        enrollFactObj = new ActiveXObject("X509Enrollment.CX509EnrollmentWebClassFactory");
    }

    /*
     * Load the information about the providers.
     */
    var providerInfosObj = enrollFactObj.CreateObject("X509Enrollment.CCspInformations");
    providerInfosObj.AddAvailableCsps();

    /*
     * Find the provider of RSA type (sufficient for this example). The type
     * numbers for this are 1, 2 and 24.
     * http://msdn.microsoft.com/en-us/library/aa379427%28VS.85%29.aspx
     */
    var providerType = -1;
    var providerName = null;
    for ( var i = 0; i < providerInfosObj.Count; i++) {
        var providerInfoObj = providerInfosObj.ItemByIndex(i);
        switch (providerInfoObj.Type) {
            case 1:
            case 2:
            case 24:
                providerType = providerInfoObj.Type;
                providerName = providerInfoObj.Name;
                break;
            default:
        }
    }

    /*
     * Creates a 2048-bit key with this provider.
     */
    var privKeyObj = enrollFactObj.CreateObject("X509Enrollment.CX509PrivateKey");
    privKeyObj.ProviderType = providerInfoObj.Type;
    privKeyObj.KeySpec = 1;
//    privKeyObj.Length = keylength;
    privKeyObj.Length = 2048;
    // http://msdn.microsoft.com/en-us/library/aa379024%28VS.85%29.aspx
    privKeyObj.MachineContext = false;
    // http://msdn.microsoft.com/en-us/library/aa379414%28VS.85%29.aspx
    privKeyObj.KeyProtection = 0;
    // http://msdn.microsoft.com/en-us/library/aa379002%28VS.85%29.aspx
    privKeyObj.ExportPolicy = 1;

    /*
     * Creates the PKCS#10 object and initialise as a user context.
     */
    var pkcs10CsrObj = enrollFactObj.CreateObject("X509Enrollment.CX509CertificateRequestPkcs10");
    pkcs10CsrObj.InitializeFromPrivateKey(1, privKeyObj, "");

    /*
     * Creates the enrolment object and exports the CSR.
     */
    var enrollObj = enrollFactObj.CreateObject("X509Enrollment.CX509Enrollment");
    enrollObj.InitializeFromRequest(pkcs10CsrObj);
    return enrollObj;
}

function createCsrXenroll(enrollObj) {
    if (enrollObj == null) {
        enrollObj = new ActiveXObject("CEnroll.CEnroll");
    }
    var keylength = 2048
    // http://msdn.microsoft.com/en-us/library/aa379941%28VS.85%29.aspx
    // CRYPT_EXPORTABLE: 1?
    enrollObj.GenKeyFlags = (keylength * 256 * 256) + 1;
    enrollObj.KeySpec = 2;

    var csr = enrollObj.createPKCS10("", "");

    csr = "-----BEGIN CERTIFICATE REQUEST-----\r\n" + csr
    + "-----END CERTIFICATE REQUEST-----";
    return csr
//
//    var xmlHttpRequest = new XMLHttpRequest();
//    xmlHttpRequest.open("POST", "/uniport_ca/certGenerate.action", true);
//
//    var params = "webid="
//    + encodeURIComponent(document.getElementById("webid").value);
//    params += "&cn=" + encodeURIComponent(document.getElementById("cn").value);
//    params += "&csrdata=" + encodeURIComponent(csr);
//
//    xmlHttpRequest.setRequestHeader("Content-type",
//        "application/x-www-form-urlencoded");
//    xmlHttpRequest.setRequestHeader("Content-length", params.length);
//    xmlHttpRequest.setRequestHeader("Connection", "close");
//
//    xmlHttpRequest.send(params);
//
//    xmlHttpRequest.onreadystatechange = function() {
//        if (xmlHttpRequest.readyState == 4) {
//            if (xmlHttpRequest.status == 200) {
//                enrollObj.acceptPKCS7(xmlHttpRequest.responseText);
//                window.alert("A certificate has been installed.");
//            } else {
//                window.alert("The server returned an error status: "
//                    + xmlHttpRequest.status);
//            }
//        }
//    }
}

function  createCsr(objCertEnrollClassFactory) {

    if (objCertEnrollClassFactory != null) {
        var csr = createCsrCertEnroll(objCertEnrollClassFactory).CreateRequest(1);
        csr = "-----BEGIN CERTIFICATE REQUEST-----\r\n" + csr
        + "-----END CERTIFICATE REQUEST-----";
        return csr;
    } else {

        //this part is for windows < Vista

        var enrollObj = null;
        //        try {
        //            enrollObj = new ActiveXObject("CEnroll.CEnroll");
        //        } catch (e) {
        //        }
        if (enrollObj != null) {
            return createCsrXenroll(enrollObj, keylength);
        } else {
            window.alert("ActiveX certificate creation not supported or not enabled.");
            return null;
        }
    }
}