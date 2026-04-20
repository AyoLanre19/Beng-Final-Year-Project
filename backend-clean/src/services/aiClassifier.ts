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

export const OLLAMA_URL =
  process.env.OLLAMA_URL?.trim() || "http://localhost:11434/api/chat";
export const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL?.trim() || "auto-select";
const OLLAMA_KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE?.trim() || "30m";
const OLLAMA_BATCH_SIZE = Number(process.env.OLLAMA_BATCH_SIZE || 12);
const OLLAMA_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 600000);
const OLLAMA_TAGS_URL = OLLAMA_URL.replace(/\/api\/chat$/, "/api/tags");
const MODEL_CANDIDATES = ["qwen2.5:3b", "llama3.2:3b", "qwen2.5:7b"];
let resolvedModelCache: string | null = null;

const buildPrompt = (
  userType: "individual" | "sme" | "company",
  transactions: TransactionForClassification[]
) => {
  const allowedCategories =
    userType === "individual"
      ? "Salary, OtherIncome, TransferIn, TransferOut, PersonalExpense, Rent, Utilities, PAYE, Savings, DeductibleExpense"
      : userType === "sme"
        ? "Revenue, BusinessExpense, Payroll, TaxPayment, LoanInflow, LoanRepayment, InventoryPurchase, TransferIn, TransferOut, OtherIncome"
        : "Revenue, BusinessExpense, Payroll, VAT, WithholdingTax, CorporateTax, AssetPurchase, IntercompanyTransfer, OtherIncome, TransferIn, TransferOut";

  const compactTransactions = transactions.map((transaction) => ({
    d: transaction.description,
    a: transaction.amount,
    dir: transaction.direction,
  }));

  return `Classify Nigerian bank transactions for a ${userType} tax user.
Allowed categories: ${allowedCategories}
Return ONLY JSON array with the same order and length as input.
Each item must be {"category":"allowed-category","confidence":0-1}.
Example: [{"category":"Salary","confidence":0.98},{"category":"PersonalExpense","confidence":0.76}]
Input: ${JSON.stringify(compactTransactions)}`;
};

const includesAny = (text: string, values: string[]): boolean => {
  return values.some((value) => text.includes(value));
};

const classifyFallbackCategory = (
  userType: "individual" | "sme" | "company",
  transaction: TransactionForClassification
): { category: string; confidence: number } => {
  const description = transaction.description.toLowerCase();

  if (userType === "individual") {
    if (transaction.direction === "inflow" && includesAny(description, ["salary", "payroll"])) {
      return { category: "Salary", confidence: 0.74 };
    }

    if (includesAny(description, ["paye", "tax"])) {
      return { category: "PAYE", confidence: 0.7 };
    }

    if (includesAny(description, ["rent", "landlord"])) {
      return { category: "Rent", confidence: 0.68 };
    }

    if (includesAny(description, ["electric", "water", "internet", "airtime", "data"])) {
      return { category: "Utilities", confidence: 0.64 };
    }

    if (includesAny(description, ["spotify", "apple", "netflix", "pos", "purchase", "atm"])) {
      return { category: "PersonalExpense", confidence: 0.62 };
    }

    if (includesAny(description, ["transfer", "trf", "frm", "from"])) {
      return {
        category: transaction.direction === "inflow" ? "TransferIn" : "TransferOut",
        confidence: 0.66,
      };
    }

    return {
      category: transaction.direction === "inflow" ? "OtherIncome" : "PersonalExpense",
      confidence: 0.52,
    };
  }

  if (userType === "sme") {
    if (transaction.direction === "inflow" && includesAny(description, ["invoice", "sales", "payment", "transfer", "deposit"])) {
      return { category: "Revenue", confidence: 0.68 };
    }

    if (includesAny(description, ["salary", "payroll", "staff"])) {
      return { category: "Payroll", confidence: 0.7 };
    }

    if (includesAny(description, ["tax", "vat", "firs"])) {
      return { category: "TaxPayment", confidence: 0.68 };
    }

    if (includesAny(description, ["inventory", "supplier", "stock"])) {
      return { category: "InventoryPurchase", confidence: 0.63 };
    }

    if (includesAny(description, ["loan"])) {
      return {
        category: transaction.direction === "inflow" ? "LoanInflow" : "LoanRepayment",
        confidence: 0.66,
      };
    }

    if (includesAny(description, ["transfer", "trf"])) {
      return {
        category: transaction.direction === "inflow" ? "TransferIn" : "TransferOut",
        confidence: 0.64,
      };
    }

    return {
      category: transaction.direction === "inflow" ? "Revenue" : "BusinessExpense",
      confidence: 0.53,
    };
  }

  if (includesAny(description, ["salary", "payroll", "staff"])) {
    return { category: "Payroll", confidence: 0.72 };
  }

  if (includesAny(description, ["vat"])) {
    return { category: "VAT", confidence: 0.72 };
  }

  if (includesAny(description, ["withholding", "wht"])) {
    return { category: "WithholdingTax", confidence: 0.72 };
  }

  if (includesAny(description, ["tax", "firs"])) {
    return { category: "CorporateTax", confidence: 0.68 };
  }

  if (includesAny(description, ["asset", "equipment", "machine"])) {
    return { category: "AssetPurchase", confidence: 0.62 };
  }

  if (includesAny(description, ["transfer", "intercompany", "trf"])) {
    return {
      category: transaction.direction === "inflow" ? "TransferIn" : "IntercompanyTransfer",
      confidence: 0.64,
    };
  }

  return {
    category: transaction.direction === "inflow" ? "Revenue" : "BusinessExpense",
    confidence: 0.54,
  };
};

export const classifyTransactionsHeuristically = (
  userType: "individual" | "sme" | "company",
  transactions: TransactionForClassification[]
): ClassifiedTransaction[] => {
  return transactions.map((transaction) => {
    const suggestion = classifyFallbackCategory(userType, transaction);

    return {
      ...transaction,
      category: suggestion.category,
      confidence: suggestion.confidence,
    };
  });
};

const resolveOllamaModel = async (): Promise<string> => {
  if (resolvedModelCache) {
    return resolvedModelCache;
  }

  if (process.env.OLLAMA_MODEL?.trim()) {
    resolvedModelCache = process.env.OLLAMA_MODEL.trim();
    return resolvedModelCache;
  }

  try {
    const response = await fetch(OLLAMA_TAGS_URL);

    if (!response.ok) {
      throw new Error("Unable to query Ollama tags");
    }

    const data = (await response.json()) as {
      models?: Array<{ name?: string }>;
    };

    const installedModels = new Set(
      (data.models || [])
        .map((model) => model.name?.trim())
        .filter((name): name is string => Boolean(name))
    );

    resolvedModelCache =
      MODEL_CANDIDATES.find((candidate) => installedModels.has(candidate)) ||
      [...installedModels][0] ||
      "qwen2.5:7b";
  } catch {
    resolvedModelCache = "qwen2.5:7b";
  }

  return resolvedModelCache;
};

export const warmOllamaModel = async (): Promise<void> => {
  const model = await resolveOllamaModel();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        keep_alive: OLLAMA_KEEP_ALIVE,
        format: "json",
        messages: [
          {
            role: "user",
            content: "Reply with exactly: ok",
          },
        ],
        options: {
          temperature: 0,
          num_predict: 8,
        },
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Warm-up failed with status ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

export const classifyTransactions = async (
  userType: "individual" | "sme" | "company",
  transactions: TransactionForClassification[]
): Promise<ClassifiedTransaction[]> => {
  if (transactions.length === 0) {
    return [];
  }

  const batches: TransactionForClassification[][] = [];

  for (let index = 0; index < transactions.length; index += OLLAMA_BATCH_SIZE) {
    batches.push(transactions.slice(index, index + OLLAMA_BATCH_SIZE));
  }

  const classified: ClassifiedTransaction[] = [];
  const model = await resolveOllamaModel();

  for (const batch of batches) {
    const prompt = buildPrompt(userType, batch);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

    let response: globalThis.Response;

    try {
      response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          keep_alive: OLLAMA_KEEP_ALIVE,
          format: "json",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          options: {
            temperature: 0,
            num_predict: 256,
          },
          stream: false,
        }),
      });
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `Ollama took too long to respond. The selected model needs more time or a warm start on this machine.`
        );
      }

      throw new Error(
        `Could not reach Ollama at ${OLLAMA_URL}. Start an installed Ollama model and try again.`
      );
    }

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Ollama request failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.message?.content?.trim();

    if (!text) {
      throw new Error("Empty response from Ollama");
    }

    let parsed: Array<{
      category: string | null;
      confidence: number | null;
    }>;

    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("Ollama returned invalid JSON");
    }

    if (!Array.isArray(parsed)) {
      if (parsed && typeof parsed === "object" && "items" in parsed && Array.isArray((parsed as { items?: unknown[] }).items)) {
        parsed = (parsed as { items: Array<{ category: string | null; confidence: number | null }> }).items;
      } else if (
        batch.length === 1 &&
        parsed &&
        typeof parsed === "object" &&
        "category" in parsed
      ) {
        parsed = [parsed as { category: string | null; confidence: number | null }];
      } else {
        throw new Error("Ollama response is not an array");
      }
    }

    classified.push(
      ...batch.map((tx, index) => ({
        ...tx,
        category: parsed[index]?.category ?? null,
        confidence:
          typeof parsed[index]?.confidence === "number"
            ? parsed[index].confidence
            : null,
      }))
    );
  }

  return classified;
};
