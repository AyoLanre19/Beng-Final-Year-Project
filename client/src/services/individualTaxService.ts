import { IndividualTaxBreakdown } from "../types/individualTax";

export const getIndividualTaxBreakdown = async (): Promise<IndividualTaxBreakdown> => {
  return {
    totalEstimated: 348500,
    paid: 50000,
    items: [
      {
        id: "paye",
        title: "PAYE",
        amount: 34000,
        paid: 0,
        deadline: "2024-05-30",
        description: "Tax on employment income"
      },
      {
        id: "wht",
        title: "Withholding Tax",
        amount: 9000,
        paid: 0,
        deadline: "2024-05-30",
        description: "Tax on contracts"
      },
      {
        id: "vat",
        title: "VAT",
        amount: 34000,
        paid: 0,
        deadline: "2024-05-30",
        description: "Value Added Tax"
      },
      {
        id: "levies",
        title: "Levies",
        amount: 7500,
        paid: 0,
        deadline: "2024-05-30",
        description: "Assigned levies"
      }
    ]
  };
};