# Lead Management Module (Backend)

Node + Express + MongoDB. Clean code with models, routes, controllers, services, and middleware.

## Quickstart

```bash
cp .env.example .env
# edit .env if needed
npm i
npm run dev
```

Server: `http://localhost:$PORT` (default 4000)

### API Key (optional)

Send header `x-api-key: <API_KEY>` if you set API_KEY in `.env`. If not set, auth is skipped.

## REST Endpoints

Base path: `/api/leads`

- `GET /` — List leads (filters: `status, source, owner, minValue, maxValue, fromDate, toDate, tags`, search via `?search=term`, paginate `page,limit`, sort by any field e.g. `?sort=-createdAt`).
- `POST /` — Create lead.
- `POST /upsert` — Create or update by `email` or `phone`.
- `GET /:id` — Get single lead.
- `PATCH /:id` — Update lead.
- `DELETE /:id` — Soft-delete lead.
- `POST /:id/activity` — Add activity `{ type, note, createdBy }`.
- `POST /:id/status` — Change status `{ status, changedBy }` with history.
- `POST /:id/assign` — Assign owner `{ owner, changedBy }`.
- `GET /duplicates` — Find duplicates by email/phone.
- `POST /import/csv` — Import leads from CSV (`multipart/form-data` with field `file`).
- `GET /export/csv` — Export filtered leads as CSV.

## cURL Examples

```bash
# Create
curl -X POST http://localhost:4000/api/leads \
-H 'Content-Type: application/json' \
-d '{
"firstName": "Ada",
"lastName": "Lovelace",
"email": "ada@example.com",
"phone": "+1-555-0100",
"company": "Analytical Engines",
"source": "website",
"status": "new",
"owner": "sales@company.com",
"value": 5000,
"tags": ["priority","vip"]
}'


# List (search + filter)
curl 'http://localhost:4000/api/leads?search=Analytical&page=1&limit=10&status=new,contacted'


# Update
curl -X PATCH http://localhost:4000/api/leads/<id> \
-H 'Content-Type: application/json' \
-d '{ "status": "qualified", "value": 7500 }'


# Add activity
curl -X POST http://localhost:4000/api/leads/<id>/activity \
-H 'Content-Type: application/json' \
-d '{ "type": "call", "note": "Had a great discovery call", "createdBy": "user@company.com" }'


# Import CSV
curl -X POST http://localhost:4000/api/leads/import/csv \
-H 'Content-Type: multipart/form-data' \
-F 'file=@leads.csv'
- Swap `owner: String` to a `ref: 'User'` if/when you connect a user system.
```
