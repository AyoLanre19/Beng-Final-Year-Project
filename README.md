# Tax System

This workspace contains a React frontend in `client/` and an Express + TypeScript backend in `server/`.

## Backend features

- Four portal flows: `individual`, `sme`, `company`, and `admin`
- Auth endpoints with local JWT fallback and optional Supabase integration
- File upload for PDF, image, CSV, XLSX, and TXT statements
- Flexible Nigerian bank-statement parsing with heuristics for GTBank, Access, UBA, FirstBank, Zenith, Moniepoint, OPay, and similar layouts
- Gemini-powered transaction classification when `GEMINI_API_KEY` is set
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
2. Fill in Supabase and Gemini keys if you want live integrations.
3. Run `npm install --prefix server`.
4. Run `npm install --prefix client` if the frontend dependencies are missing.
5. Start the backend with `npm run dev --prefix server`.
6. Start the frontend with `npm run dev --prefix client`.

## API overview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `POST /api/upload`
- `POST /api/classify`
- `POST /api/save-transactions`
- `POST /api/calculate`
- `POST /api/submit-filing`
- `GET /api/download-filing/download/:filingId`
- `GET /api/admin/metrics`
- `GET /api/admin/charts`
- `GET /api/admin/users`
- `GET /api/admin/filings/:id`
- `POST /api/admin/filings/:id/approve`
- `POST /api/admin/filings/:id/flag`
- `GET /api/admin/ai/metrics`
- `GET /api/admin/ai/misclassifications`
- `GET /api/admin/ai/accuracy-trend`

## Notes

- If Supabase keys are not configured, the backend still works in local-memory mode for development.
- The upload pipeline stores extracted text and metadata in memory right now; `schema.sql` provides the tables needed to persist them in Supabase.
- To make a user an admin in Supabase, run:

```sql
update profiles
set role = 'admin'
where email = 'your-email@example.com';
```
