const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  name: String,
  mobilePhone: String,
  pan: String,
  creditScore: String,
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalance: Number,
    securedAmount: Number,
    unsecuredAmount: Number,
    last7DaysEnquiries: Number,
  },
  creditAccounts: [
    {
      bank: String,
      accountNumber: String,
      currentBalance: Number,
      overdueAmount: Number,
      creditLimit: Number,
      originalLoanAmount: Number,
    },
  ],
  suitFiled: Boolean,
  writtenOffStatus: String,
  paymentHistory: [String],
  addressDetails: [
    {
      street: String,
      city: String,
      state: String,
      postalCode: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);