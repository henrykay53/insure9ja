# Supabase Persistence Setup

This project can persist submissions through a pluggable persistence provider.

## 1) Create tables

Run `supabase/schema.sql` in the Supabase SQL editor.

## 2) Configure environment variables

Set these in your function runtime:

- `PERSISTENCE_PROVIDER=supabase`
- `SUPABASE_URL=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`

Optional table overrides:

- `SUPABASE_TABLE_APPLICATIONS` (default: `applications`)
- `SUPABASE_TABLE_DOCUMENTS` (default: `application_documents`)
- `SUPABASE_TABLE_EVENTS` (default: `application_events`)

## 3) Upload/document payload contract

`submit-application` accepts optional `uploadedDocuments`:

```json
[
  {
    "docType": "payment_receipt",
    "filename": "receipt.pdf",
    "mimeType": "application/pdf",
    "contentBase64": "..."
  }
]
```

Allowed mime types: PDF, JPG, JPEG, PNG.
Max file size: 4MB each. Max total: 20MB.

