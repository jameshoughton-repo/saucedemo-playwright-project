## PNR XML Anonymiser – Click to Run

This tool anonymises airline PNR XML files for testing, debugging, and safe sharing, while preserving XML structure and internal consistency.

---

## How to use

1. Put your **PNR XML files** into the folder:
   input-pnrs

2. Run the anonymiser:
   - Double-click `run-anonymiser.bat`
   - Or run `node anonymise-pnr.js` manually

3. Collect the anonymised XML files from:
   anonymized

Output files end with:
.anonymized.xml

---

## What is anonymised

- Passenger names
  - The same real passenger is always replaced with the same anonymised name
  - Consistent across structured XML, SSRs, remarks, and PNR history

- Email addresses
  - Masked in structured fields and free-text (SSR CTCE, remarks, history)

- Phone numbers
  - Numbers with or without `+`
  - Numbers embedded in free-text

- Airline-specific free-text PII
  - Name formats like `SURNAME/GIVENNAME MS`
  - SMS and EMAIL notification text

---

## What is NOT anonymised

- Dates of any kind
- Flight numbers, routes, or schedules
- Booking references / record locators
- Ticket numbers
- Agent or office IDs
- Airline and system codes

(These are preserved to keep PNRs realistic for testing.)

---

## Important behaviour notes

- Deterministic identities
  - One real passenger will never appear as multiple anonymised passengers

- XML-safe
  - XML tags and attributes are never modified

- Multi-passenger safe
  - Handles multiple passengers correctly and consistently

- Airline PNR-aware
  - Repeated passenger data in SSRs, remarks, and history is fully anonymised

---

## Example

Original:
BLOGGS/JOE MR
SSR CTCMOUHK1 447415658146
EMAIL NOTIFICATION SENT TO joe@example.com

Anonymised:
testLast/testFirst
SSR CTCMOUHK1 0000000000
EMAIL NOTIFICATION SENT TO test@test.com

---

## Troubleshooting

- No output files
  - Ensure `.xml` files exist in `input-pnrs`

- Real PII still visible
  - Verify you are using the latest `anonymise-pnr.js`
  - Re-run the tool (input files are never modified)

---

## Intended use

- QA testing
- Debugging
- Sharing logs with vendors or support
- Documentation and training

This tool is not intended to replace formal GDPR redaction processes. Always review anonymised data before external sharing.
