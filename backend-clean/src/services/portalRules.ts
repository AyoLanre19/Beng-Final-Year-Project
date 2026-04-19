export type PortalType = "individual" | "sme" | "company";

export type PortalCategoryRule = {
  categories: string[];
  warningHints: string[];
  suggestionHints: string[];
};

const portalRules: Record<PortalType, PortalCategoryRule> = {
  individual: {
    categories: [
      "Salary",
      "OtherIncome",
      "TransferIn",
      "TransferOut",
      "PersonalExpense",
      "Rent",
      "Utilities",
      "PAYE",
      "Savings",
      "DeductibleExpense",
    ],
    warningHints: [
      "Large untaxed inflow detected",
      "Repeated cash inflows may need tax review",
      "Possible personal expense misclassification",
    ],
    suggestionHints: [
      "Review deductible expenses carefully",
      "Check whether PAYE was already deducted",
      "Separate taxable and non-taxable inflows",
    ],
  },

  sme: {
    categories: [
      "Revenue",
      "BusinessExpense",
      "Payroll",
      "TaxPayment",
      "LoanInflow",
      "LoanRepayment",
      "InventoryPurchase",
      "TransferIn",
      "TransferOut",
      "OtherIncome",
    ],
    warningHints: [
      "Revenue may be underclassified",
      "Expense-heavy month detected",
      "Possible missing tax payment entries",
    ],
    suggestionHints: [
      "Review payroll vs business expense separation",
      "Track inventory-related outflows properly",
      "Separate loan flows from operating revenue",
    ],
  },

  company: {
    categories: [
      "Revenue",
      "BusinessExpense",
      "Payroll",
      "VAT",
      "WithholdingTax",
      "CorporateTax",
      "AssetPurchase",
      "IntercompanyTransfer",
      "OtherIncome",
      "TransferIn",
      "TransferOut",
    ],
    warningHints: [
      "Possible VAT-related transactions detected",
      "Large expense outflows need review",
      "Potential withholding tax entries found",
    ],
    suggestionHints: [
      "Review payroll and tax remittance entries",
      "Separate asset purchases from operating expenses",
      "Track VAT and withholding tax separately",
    ],
  },
};

export const getPortalRules = (userType: PortalType): PortalCategoryRule => {
  return portalRules[userType];
};