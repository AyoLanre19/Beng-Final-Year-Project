export interface TaxItem {
  id: string;
  title: string;
  amount: number;
  paid: number;
  deadline: string;
  description: string;
}

export interface IndividualTaxBreakdown {
  totalEstimated: number;
  paid: number;
  items: TaxItem[];
}