type TransactionForClassification = {
  transaction_date: string | null;
  description: string;
  amount: number;
  direction: "inflow" | "outflow";
};

export type ClassifiedTransaction = TransactionForClassification & {
  category: string | null;
  confidence: number | null;
};

const OLLAMA_URL = "http://localhost:11434/api/chat";
const OLLAMA_MODEL = "qwen2.5:7b";

const buildPrompt = (
  userType: "individual" | "sme" | "company",
  transactions: TransactionForClassification[]
) => {
  return `
You are a transaction classification assistant for a Nigerian tax platform.

User type: ${userType}

Classify each transaction into the most suitable category.

Return ONLY valid JSON.
Do not explain anything.
Do not use markdown.
Return an array with the same number of items as the input.

Each output item must contain:
- description
- category
- confidence

confidence must be a number between 0 and 1.

Suggested categories:

For individual:
Salary, OtherIncome, TransferIn, TransferOut, PersonalExpense, Rent, Utilities, PAYE, Savings, DeductibleExpense

For sme:
Revenue, BusinessExpense, Payroll, TaxPayment, LoanInflow, LoanRepayment, InventoryPurchase, TransferIn, TransferOut, OtherIncome

For company:
Revenue, BusinessExpense, Payroll, VAT, WithholdingTax, CorporateTax, AssetPurchase, IntercompanyTransfer, OtherIncome, TransferIn, TransferOut

Transactions:
${JSON.stringify(transactions, null, 2)}
`;
};

export const classifyTransactions = async (
  userType: "individual" | "sme" | "company",
  transactions: TransactionForClassification[]
): Promise<ClassifiedTransaction[]> => {
  if (transactions.length === 0) {
    return [];
  }

  const prompt = buildPrompt(userType, transactions);

  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.message?.content?.trim();

  if (!text) {
    throw new Error("Empty response from Ollama");
  }

  let parsed: Array<{
    description: string;
    category: string | null;
    confidence: number | null;
  }>;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Ollama returned invalid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Ollama response is not an array");
  }

  return transactions.map((tx, index) => ({
    ...tx,
    category: parsed[index]?.category ?? null,
    confidence:
      typeof parsed[index]?.confidence === "number"
        ? parsed[index].confidence
        : null,
  }));
};