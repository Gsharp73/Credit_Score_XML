const express = require("express");
const xml2js = require("xml2js");
const Report = require("../models/Report");
const UploadHistory = require("../models/history");

const router = express.Router();

router.post("/", async (req, res) => {
  if (!req.files || !req.files.xmlFile) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const xmlFile = req.files.xmlFile;
  const fileBuffer = xmlFile.data;

  xml2js.parseString(fileBuffer, { explicitArray: false }, async (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error parsing XML." });
    }

    const parsedData = extractData(result);
    if (parsedData.pan === "N/A") {
      return res.status(400).json({ message: "PAN not found in XML. Upload rejected." });
    }

    try {
      let existingReport = await Report.findOne({ pan: parsedData.pan });
      let message;

      if (existingReport) {
        existingReport.set(parsedData);
        await existingReport.save();
        message = "Existing report updated successfully.";
      } else {
        const report = new Report(parsedData);
        await report.save();
        message = "New report created successfully.";
      }

      const uploadRecord = new UploadHistory({
        pan: parsedData.pan,
        fileName: xmlFile.name,  
        uploadTime: new Date(),
      });
      await uploadRecord.save();

      // console.log(`File uploaded: ${xmlFile.name}, PAN: ${parsedData.pan}`);
      return res.status(200).json({ message, report: parsedData });
    } catch (err) {
      return res.status(500).json({ message: "Error saving to database." });
    }
  });
});

function extractData(xmlObj) {
  const profile = xmlObj.INProfileResponse || {};

  let extractedPAN = "N/A";
  if (Array.isArray(profile?.CAIS_Account?.CAIS_Account_DETAILS)) {
    extractedPAN = profile.CAIS_Account.CAIS_Account_DETAILS.find(
      (detail) => detail?.CAIS_Holder_ID_Details?.Income_TAX_PAN
    )?.CAIS_Holder_ID_Details?.Income_TAX_PAN || "N/A";
  } else {
    extractedPAN =
      profile?.CAIS_Account?.CAIS_Account_DETAILS?.CAIS_Holder_ID_Details?.Income_TAX_PAN ||
      "N/A";
  }

  // console.log("Extracted PAN from XML:", extractedPAN);
  const enquiryDate = profile?.CreditProfileHeader?.ReportDate || "N/A";
  const enquiryTime = profile?.CreditProfileHeader?.ReportTime || "N/A";

  const formattedTime =
    enquiryTime.length === 6
      ? `${enquiryTime.substring(0, 2)}:${enquiryTime.substring(2, 4)}:${enquiryTime.substring(4, 6)}`
      : "N/A";

  const addressDetails = (Array.isArray(profile?.CAIS_Account?.CAIS_Account_DETAILS) 
    ? profile?.CAIS_Account?.CAIS_Account_DETAILS[0] 
    : profile?.CAIS_Account?.CAIS_Account_DETAILS)?.CAIS_Holder_Address_Details;

  const formattedAddress = {
    street: [
      addressDetails?.First_Line_Of_Address_non_normalized,
      addressDetails?.Second_Line_Of_Address_non_normalized,
      addressDetails?.Third_Line_Of_Address_non_normalized,
      addressDetails?.Fifth_Line_Of_Address_non_normalized
    ].filter(Boolean).join(", "),
    city: addressDetails?.City_non_normalized || "N/A",
    state: addressDetails?.State_non_normalized || "N/A",
    postalCode: addressDetails?.ZIP_Postal_Code_non_normalized || "N/A",
    country: addressDetails?.CountryCode_non_normalized || "N/A",
  };

  const paymentDetails = (profile?.CAIS_Account?.CAIS_Account_DETAILS || []).map((account) => ({
    bank: account?.Subscriber_Name || "Unknown",
    accountNumber: account?.Account_Number || "N/A",
    currentBalance: account?.Current_Balance || 0,
    overdueAmount: account?.Amount_Past_Due || 0,
    creditLimit: account?.Credit_Limit_Amount || 0,
    originalLoanAmount: account?.Highest_Credit_or_Original_Loan_Amount || 0,
    openDate: account?.Open_Date || "N/A",
    dateReported: account?.Date_Reported || "N/A",
    accountStatus: account?.Account_Status || "N/A",
    suitFiled: account?.SuitFiled_WilfulDefault === "01" ? "Yes" : "No",
    writtenOffStatus: account?.Written_off_Settled_Status || "N/A",
    dateOfAddition: account?.DateOfAddition || "N/A",
  }));

  return {
    name: `${profile?.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.First_Name || ""} ` +
          `${profile?.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.Last_Name || ""}`.trim(),
    mobilePhone: profile?.Current_Application?.Current_Application_Details?.Current_Applicant_Details?.MobilePhoneNumber || "N/A",
    pan: extractedPAN,
    creditScore: profile?.SCORE?.BureauScore || "N/A",

    enquiryDetails: {
      enquiryDate: enquiryDate,  
      enquiryTime: formattedTime,  
      enquiryUsername: profile?.CreditProfileHeader?.Enquiry_Username || "N/A",
      reportNumber: profile?.CreditProfileHeader?.ReportNumber || "N/A",
      subscriberName: profile?.CreditProfileHeader?.Subscriber_Name || "N/A",
    },

    reportSummary: {
      totalAccounts: profile?.CAIS_Account?.CAIS_Summary?.Credit_Account?.CreditAccountTotal || 0,
      activeAccounts: profile?.CAIS_Account?.CAIS_Summary?.Credit_Account?.CreditAccountActive || 0,
      closedAccounts: profile?.CAIS_Account?.CAIS_Summary?.Credit_Account?.CreditAccountClosed || 0,
      currentBalance: profile?.CAIS_Account?.CAIS_Summary?.Total_Outstanding_Balance?.Outstanding_Balance_All || 0,
      securedAmount: profile?.CAIS_Account?.CAIS_Summary?.Total_Outstanding_Balance?.Outstanding_Balance_Secured || 0,
      unsecuredAmount: profile?.CAIS_Account?.CAIS_Summary?.Total_Outstanding_Balance?.Outstanding_Balance_UnSecured || 0,
      last7DaysEnquiries: profile?.TotalCAPS_Summary?.TotalCAPSLast7Days || 0,
    },

    paymentDetails,
    addressDetails: formattedAddress,
  };
}


module.exports = router;
