# Local Setup and Env Guide

## Current State

As of April 14, 2026, this repository is in a workable local-development state:

- `pnpm build` succeeds.
- Local MySQL and Redis are defined in `docker-compose.yml`.
- `pnpm infra:up` starts the local dependencies.
- `pnpm db:migrate` applies the checked-in Prisma migration.
- `pnpm run dev` can start the app once MySQL, Redis, and a free HTTP port are available.

The main local blocker right now is environmental, not code-related:

- Port `3000` is already in use on this machine by another project (`shop-dev-server`).
- If you want to run this app without stopping that process, start it on another port:

```powershell
$env:PORT='3001'
pnpm run dev
```

## Recommended Local Flow

1. Install dependencies:

```bash
pnpm install
```

2. Start local infrastructure:

```bash
pnpm infra:up
```

3. Apply database migrations:

```bash
pnpm db:migrate
```

4. Start the API:

```bash
pnpm run dev
```

Swagger UI will then be available at:

```text
http://localhost:3003/api/docs
```

5. If port `3000` is occupied, use another port:

```powershell
$env:PORT='3001'
pnpm run dev
```

6. Stop local infrastructure when done:

```bash
pnpm infra:down
```

## Working Local Defaults

If you use the included Docker Compose file, these values work locally:

```env
PORT=3000
DATABASE_URL="mysql://user:password@localhost:3306/mpesa_db"
REDIS_URL=redis://localhost:6379
MPESA_ENV=SANDBOX
```

Everything else depends on which M-Pesa APIs you want to exercise.

## Env Variables

### Core Runtime

`PORT`

- Purpose: HTTP port for the Nest app.
- Where it comes from: local choice.
- Local value: `3000` or another free port such as `3001`.

`DATABASE_URL`

- Purpose: Prisma connection string for MySQL.
- Where it comes from: either the included Docker Compose stack or your own MySQL instance.
- Local value with this repo: `mysql://user:password@localhost:3306/mpesa_db`.

`REDIS_URL`

- Purpose: Redis connection used for callback and transaction state caching.
- Where it comes from: either the included Docker Compose stack or your own Redis instance.
- Local value with this repo: `redis://localhost:6379`.

`MPESA_ENV`

- Purpose: selects Safaricom sandbox or production endpoints.
- Allowed values: `SANDBOX`, `PRODUCTION`.
- Where it comes from: your deployment target.
- Recommended local value: `SANDBOX`.

### Safaricom OAuth and STK Push

`CONSUMER_KEY`

- Purpose: OAuth client key for Daraja API access.
- Where to get it: Safaricom Daraja Developer Portal, by creating an app.
- Portal: `https://developer.safaricom.co.ke/`

`CONSUMER_SECRET`

- Purpose: OAuth client secret paired with `CONSUMER_KEY`.
- Where to get it: Safaricom Daraja Developer Portal, from the same app.

`PASS_KEY`

- Purpose: STK Push password generation.
- Where to get it: Daraja Lipa Na M-Pesa Online credentials for your shortcode.
- In sandbox: use the sandbox Lipa Na M-Pesa credentials provided through Safaricom's Daraja documentation and app setup.
- In production: issued for your live shortcode by Safaricom.

`STK_SHORTCODE`

- Purpose: business shortcode used for STK Push.
- Where to get it: your Safaricom shortcode.
- In sandbox: commonly `174379` for test flows.
- In production: your assigned PayBill or Till shortcode.

`STK_CALLBACK_URL`

- Purpose: public callback endpoint for STK results.
- Where to get it: you create this yourself by exposing your local app or using a deployed URL.
- Local options: `ngrok`, `Cloudflare Tunnel`, `localtunnel`, or a staging deployment.
- Example: `https://your-public-host/api/mpesa/callback`

## Security Credential Variables

These are needed for APIs that require encrypted initiator credentials: B2C, B2B, account balance, transaction status, and reversal.

`INITIATOR_NAME`

- Purpose: M-Pesa initiator username for organization-level operations.
- Where to get it: from Safaricom Daraja or your M-Pesa organization setup.
- In production: assigned as part of your live M-Pesa operational credentials.

`INITIATOR_PASSWORD`

- Purpose: clear-text initiator password, encrypted in-app using the M-Pesa public certificate.
- Where to get it: from Safaricom or your organization credential setup.

`MPESA_CERT_PATH`

- Purpose: path to the M-Pesa public certificate used to encrypt `INITIATOR_PASSWORD`.
- Where to get it: Safaricom Daraja Portal.
- Certificate guidance in repo: `certificates/README.md`
- Typical production path: `./certificates/ProductionCertificate.cer`
- Portal reference: `https://developer.safaricom.co.ke/APIs/MpesaG2`

Important:

- If the certificate file is missing, B2C, B2B, account balance, transaction status, and reversal flows will fail when they try to build the security credential.
- STK Push and C2B simulation do not depend on the initiator certificate path in the same way.

## C2B Variables

`C2B_SHORTCODE`

- Purpose: shortcode used for C2B register and simulate requests.
- Where to get it: your sandbox or production PayBill / Till shortcode from Safaricom.
- In sandbox examples, `600496` is commonly used.

`C2B_VALIDATION_URL`

- Purpose: public endpoint Safaricom calls for C2B validation.
- Where to get it: you host this yourself.
- Value shape: `https://your-public-host/api/c2b/validation`

`C2B_CONFIRMATION_URL`

- Purpose: public endpoint Safaricom calls for C2B confirmation.
- Where to get it: you host this yourself.
- Value shape: `https://your-public-host/api/c2b/confirmation`

## B2C Variables

`B2C_SHORTCODE`

- Purpose: sender shortcode for B2C payments.
- Where to get it: your organization shortcode enabled for B2C.
- In sandbox: use the shortcode associated with your test setup.

`B2C_RESULT_URL`

- Purpose: public result callback for B2C.
- Where to get it: your own public endpoint.
- Value shape: `https://your-public-host/api/b2c/callback/result`

`B2C_TIMEOUT_URL`

- Purpose: public timeout callback for B2C.
- Where to get it: your own public endpoint.
- Value shape: `https://your-public-host/api/b2c/callback/timeout`

## B2B Variables

`B2B_SHORTCODE`

- Purpose: sender shortcode for B2B payments.
- Where to get it: your organization shortcode enabled for B2B.

`B2B_RESULT_URL`

- Purpose: public result callback for B2B.
- Where to get it: your own public endpoint.

`B2B_TIMEOUT_URL`

- Purpose: public timeout callback for B2B.
- Where to get it: your own public endpoint.

## Account Balance Variables

`BALANCE_SHORTCODE`

- Purpose: organization shortcode queried for account balance.
- Where to get it: your Safaricom shortcode.

`BALANCE_RESULT_URL`

- Purpose: public result callback for account balance queries.
- Where to get it: your own public endpoint.

`BALANCE_TIMEOUT_URL`

- Purpose: public timeout callback for account balance queries.
- Where to get it: your own public endpoint.

## Transaction Status Variables

`STATUS_SHORTCODE`

- Purpose: organization shortcode used for status lookups.
- Where to get it: your Safaricom shortcode.

`STATUS_RESULT_URL`

- Purpose: public result callback for transaction status queries.
- Where to get it: your own public endpoint.

`STATUS_TIMEOUT_URL`

- Purpose: public timeout callback for transaction status queries.
- Where to get it: your own public endpoint.

## Reversal Variables

`REVERSAL_RESULT_URL`

- Purpose: public result callback for reversals.
- Where to get it: your own public endpoint.

`REVERSAL_TIMEOUT_URL`

- Purpose: public timeout callback for reversals.
- Where to get it: your own public endpoint.

## Dynamic QR Variables

`QR_MERCHANT_NAME`

- Purpose: default merchant identifier used when generating QR codes if the request does not supply `cpi`.
- Where to get it: your own business or merchant display name.
- This is not a Safaricom-issued secret.

## Bill Manager Variables

The `.env.example` lists these values:

- `BILL_SHORTCODE`
- `BILL_EMAIL`
- `BILL_OFFICIAL_CONTACT`
- `BILL_CALLBACK_URL`

Current code note:

- The bill manager service does not automatically read those values from the environment.
- The onboarding endpoint currently expects them in the request body instead.
- Treat these `.env` entries as documentation hints unless you later refactor the service to default them from config.

## Minimal Sandbox .env

This is the smallest realistic starting point for local sandbox work:

```env
PORT=3001
DATABASE_URL="mysql://user:password@localhost:3306/mpesa_db"
REDIS_URL=redis://localhost:6379

MPESA_ENV=SANDBOX

CONSUMER_KEY=replace_from_daraja_portal
CONSUMER_SECRET=replace_from_daraja_portal

PASS_KEY=replace_from_daraja_portal
STK_SHORTCODE=174379
STK_CALLBACK_URL=https://your-public-host/api/mpesa/callback

C2B_SHORTCODE=600496
C2B_VALIDATION_URL=https://your-public-host/api/c2b/validation
C2B_CONFIRMATION_URL=https://your-public-host/api/c2b/confirmation

INITIATOR_NAME=replace_if_using_b2c_b2b_balance_status_reversal
INITIATOR_PASSWORD=replace_if_using_b2c_b2b_balance_status_reversal
MPESA_CERT_PATH=./certificates/ProductionCertificate.cer

B2C_SHORTCODE=replace_if_using_b2c
B2C_RESULT_URL=https://your-public-host/api/b2c/callback/result
B2C_TIMEOUT_URL=https://your-public-host/api/b2c/callback/timeout

B2B_SHORTCODE=replace_if_using_b2b
B2B_RESULT_URL=https://your-public-host/api/b2b/callback/result
B2B_TIMEOUT_URL=https://your-public-host/api/b2b/callback/timeout

BALANCE_SHORTCODE=replace_if_using_balance_query
BALANCE_RESULT_URL=https://your-public-host/api/account-balance/callback
BALANCE_TIMEOUT_URL=https://your-public-host/api/account-balance/timeout

STATUS_SHORTCODE=replace_if_using_status_query
STATUS_RESULT_URL=https://your-public-host/api/transaction-status/callback
STATUS_TIMEOUT_URL=https://your-public-host/api/transaction-status/timeout

REVERSAL_RESULT_URL=https://your-public-host/api/reversal/callback
REVERSAL_TIMEOUT_URL=https://your-public-host/api/reversal/timeout

QR_MERCHANT_NAME=Your Merchant Name
```

## What You Need For Each Feature

STK Push only:

- `CONSUMER_KEY`
- `CONSUMER_SECRET`
- `PASS_KEY`
- `STK_SHORTCODE`
- `STK_CALLBACK_URL`
- MySQL and Redis

C2B simulate / register:

- `CONSUMER_KEY`
- `CONSUMER_SECRET`
- `C2B_SHORTCODE`
- `C2B_VALIDATION_URL`
- `C2B_CONFIRMATION_URL`

B2C / B2B / balance / status / reversal:

- `CONSUMER_KEY`
- `CONSUMER_SECRET`
- `INITIATOR_NAME`
- `INITIATOR_PASSWORD`
- `MPESA_CERT_PATH`
- the relevant shortcode and callback URLs for that feature

Dynamic QR:

- `CONSUMER_KEY`
- `CONSUMER_SECRET`
- optionally `QR_MERCHANT_NAME`

## Practical Credential Sources

Safaricom-issued:

- Consumer key and secret: Daraja app creation.
- Passkey: Lipa Na M-Pesa Online credentials for your shortcode.
- Initiator name and password: organization credentials for B2C, B2B, balance, status, reversal.
- Feature shortcodes: your sandbox or production organization shortcodes.
- Public certificate: Daraja portal / M-Pesa G2 certificate download.

Self-provided:

- `DATABASE_URL`
- `REDIS_URL`
- `PORT`
- all callback URLs
- `QR_MERCHANT_NAME`

## Known Caveats

- The README still shows `prisma migrate dev`; for this local setup use `pnpm db:migrate`, which runs `prisma migrate deploy`.
- Bill Manager environment variables are currently documented but not auto-read by the service.
- You still need valid Daraja credentials before live API calls will succeed.
- You need a public callback URL for real asynchronous Safaricom callbacks.