# epayco-sdk-node-ts

TypeScript SDK for ePayco APIs in Node.js.

## Installation

```bash
npm i epayco-sdk-node-ts
```

## Requirements

- Node.js 18 or higher

## Quick Start

### ESM / TypeScript

```ts
import { createEpayco } from "epayco-sdk-node-ts";

const epayco = createEpayco({
  apiKey: "PUBLIC_KEY",
  privateKey: "PRIVATE_KEY",
  lang: "ES",
  test: true,
});

const token = await epayco.token.create({
  "card[number]": "4575623182290326",
  "card[exp_year]": "2025",
  "card[exp_month]": "12",
  "card[cvc]": "123",
});

console.log(token);
```

### CommonJS

```js
const { createEpayco } = require("epayco-sdk-node-ts");

const epayco = createEpayco({
  apiKey: "PUBLIC_KEY",
  privateKey: "PRIVATE_KEY",
  lang: "ES",
  test: true,
});
```

## Error Handling

```ts
import { EpaycoError } from "epayco-sdk-node-ts";

try {
  await epayco.token.create({
    "card[number]": "4575623182290326",
    "card[exp_year]": "2025",
    "card[exp_month]": "12",
    "card[cvc]": "123",
  });
} catch (error) {
  if (error instanceof EpaycoError) {
    console.error("SDK validation error:", error.message);
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## API Surface

### Token

```js
epayco.token.create({
  "card[number]": "4575623182290326",
  "card[exp_year]": "2025",
  "card[exp_month]": "12",
  "card[cvc]": "123",
});
```

### Customers

```js
epayco.customers.create({
  token_card: "token_id",
  name: "Joe",
  email: "joe@example.com",
  phone: "3005234321",
  default: true,
});

epayco.customers.get("id_customer");
epayco.customers.list();

epayco.customers.update("id_customer", {
  name: "Alex",
});

epayco.customers.delete({
  franchise: "visa",
  mask: "457562******0326",
  customer_id: "id_customer",
});

epayco.customers.addDefaultCard({
  franchise: "visa",
  token: "new_token",
  mask: "457562******0326",
  customer_id: "id_customer",
});

epayco.customers.addNewToken({
  token_card: "token_id",
  customer_id: "id_customer",
});
```

### Plans

```js
epayco.plans.create({
  id_plan: "plan_id",
  name: "Plan Name",
  description: "Plan description",
  amount: 30000,
  currency: "COP",
  interval: "month",
  interval_count: 1,
  trial_days: 0,
});

epayco.plans.get("plan_id");
epayco.plans.list();
epayco.plans.delete("plan_id");
```

Note:

- plans.update is not supported by the current SDK API.

### Subscriptions

```js
epayco.subscriptions.create({
  id_plan: "plan_id",
  customer: "customer_id",
  token_card: "token_id",
  doc_type: "CC",
  doc_number: "5234567",
});

epayco.subscriptions.get("id_subscription");
epayco.subscriptions.list();
epayco.subscriptions.cancel("id_subscription");

epayco.subscriptions.charge({
  id_plan: "plan_id",
  customer: "customer_id",
  token_card: "token_id",
  doc_type: "CC",
  doc_number: "5234567",
});
```

### Bank (PSE)

```js
epayco.bank.getBanks();

epayco.bank.create({
  bank: "1022",
  invoice: "1472050778",
  description: "pay test",
  value: "10000",
  tax: "0",
  tax_base: "0",
  currency: "COP",
  type_person: "0",
  doc_type: "CC",
  doc_number: "10358519",
  name: "Testing",
  last_name: "PAYCO",
  email: "no-responder@payco.co",
  country: "CO",
  cell_phone: "3010000001",
  url_response: "https://example.com/response",
  url_confirmation: "https://example.com/confirmation",
  method_confirmation: "GET",
});

epayco.bank.get("ticket_id");
```

### Cash

Supported providers:

- efecty
- baloto
- gana
- redservi
- puntored
- sured

```js
epayco.cash.create("efecty", {
  invoice: "1472050778",
  description: "pay test",
  value: "20000",
  tax: "0",
  tax_base: "0",
  currency: "COP",
  type_person: "0",
  doc_type: "CC",
  doc_number: "10358519",
  name: "Testing",
  last_name: "PAYCO",
  email: "test@example.com",
  cell_phone: "3010000001",
  end_date: "2026-12-05",
  url_response: "https://example.com/response",
  url_confirmation: "https://example.com/confirmation",
  method_confirmation: "GET",
});

epayco.cash.get("transaction_id");
```

### Charge

```js
epayco.charge.create({
  token_card: "token_id",
  customer_id: "customer_id",
  doc_type: "CC",
  doc_number: "10358519",
  name: "John",
  last_name: "Doe",
  email: "example@email.com",
  bill: "OR-1234",
  description: "Test Payment",
  value: "116000",
  tax: "16000",
  tax_base: "100000",
  currency: "COP",
  dues: "12",
});

epayco.charge.get("transaction_id");
```

### Daviplata

```js
epayco.daviplata.create({
  doc_type: "CC",
  doc_number: "1053814580",
  name: "Testing",
  last_name: "PAYCO",
  email: "example@epayco.co",
  ind_country: "CO",
  phone: "3003003000",
  country: "CO",
  city: "Bogota",
  address: "Calle 123",
  ip: "190.0.0.1",
  currency: "COP",
  invoice: "INV-123",
  description: "Daviplata payment",
  value: "100",
  tax: "0",
  tax_base: "0",
  ico: "0",
  test: "TRUE",
  url_response: "https://example.com/response",
  url_confirmation: "https://example.com/confirmation",
  method_confirmation: "POST",
});

epayco.daviplata.confirm({
  ref_payco: "45508846",
  id_session_token: "45081749",
  otp: "2580",
});
```

### Safetypay

```js
epayco.safetypay.create({
  cash: "1",
  end_date: "2026-08-05",
  doc_type: "CC",
  doc_number: "123456789",
  name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  ind_country: "57",
  phone: "3003003434",
  country: "CO",
  city: "N/A",
  address: "N/A",
  ip: "192.168.100.100",
  currency: "COP",
  invoice: "fac-01",
  description: "Safetypay test",
  value: "100000",
  tax: "0",
  tax_base: "0",
  ico: "0",
  test: "TRUE",
  url_response: "https://example.com/response",
  url_confirmation: "https://example.com/confirmation",
  method_confirmation: "POST",
});
```

## Split Payments

This SDK accepts split-related fields as part of the payload for supported operations (for example in bank.create, cash.create, and charge.create).

Official guide:

- https://docs.epayco.co/tools/split-payment

Example payload fields:

```js
const splitData = {
  splitpayment: "true",
  split_app_id: "P_CUST_ID_CLIENTE_APPLICATION",
  split_merchant_id: "P_CUST_ID_CLIENTE_COMMERCE",
  split_type: "02",
  split_primary_receiver: "P_CUST_ID_CLIENTE_APPLICATION",
  split_primary_receiver_fee: "0",
  split_rule: "multiple",
  split_receivers: JSON.stringify([
    {
      id: "P_CUST_ID_CLIENTE_1",
      total: "58000",
      iva: "8000",
      base_iva: "50000",
      fee: "10",
    },
  ]),
};

epayco.charge.create(splitData);
```

## Notes

- The SDK exposes Promise-based methods.
- Types for options are available from the package exports.
