# Tax System

Smart tax platform that turns bank statements into structured, classified financial data.

This workspace contains a React frontend in `client/` and an Express + TypeScript backend in `backend-clean/`.

## Backend features

- Four portal flows: `individual`, `sme`, `company`, and `admin`
- Auth endpoints with local JWT fallback and optional database integration
- File upload for PDF, image, CSV, XLSX, and TXT statements
- Flexible Nigerian bank-statement parsing with heuristics for GTBank, Access, UBA, FirstBank, Zenith, Moniepoint, OPay, and similar layouts
- Ollama transaction classification when `ollama qwen2.5:7b` is set
- Nigerian tax estimates for personal income tax, company income tax, VAT, and estimated withholding tax
- Admin metrics, filing review, AI monitoring, and filing PDF export

## Tax-law assumptions used

- Personal income tax relief uses the current Consolidated Relief Allowance formula: the higher of `N200,000` or `1%` of gross income, plus `20%` of gross income.
- Personal income tax bands remain `7%`, `11%`, `15%`, `19%`, `21%`, and `24%`.
- Company income tax remains `0%` for turnover up to `N25,000,000`, `20%` for turnover above `N25,000,000` and up to `N100,000,000`, and `30%` above `N100,000,000`.
- VAT remains `7.5%`.
- Withholding tax in this project is an estimate based on statement keywords and should be reviewed before filing.

## Setup

1. Copy `.env.example` to `.env`.
2. Fill in your database and Ollama settings if you want live integrations.
3. Run `npm install --prefix backend-clean`.
4. Run `npm install --prefix client`.
5. Start the backend with `npm run dev --prefix backend-clean`.
6. Start the frontend with `npm run dev --prefix client`.

## Notes

- Secret `.env` files are intentionally ignored by Git.
- Build outputs like `dist/` and dependencies like `node_modules/` are also ignored.

