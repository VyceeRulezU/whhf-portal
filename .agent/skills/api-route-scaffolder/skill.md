# Skill: API Route Scaffolder

## Purpose

Generate a new Next.js App Router API route (`app/api/.../route.ts`) that
follows this project's conventions for validation, error shape, and
payment-adjacent safety — so every route looks like it was written by the
same person.

## Before you start

Read `.agent/rules/architecture.md` (data flow section) and
`.agent/rules/security.md` (input validation, payment integrity). If the
route touches donations or webhooks, also read the relevant
`*-integration` skill first.

## Conventions every route must follow

1. **File location**: `app/api/<resource>/route.ts` for collection-level
   verbs (`GET` list, `POST` create); `app/api/<resource>/[id]/route.ts` for
   item-level verbs.
2. **Validation first**: parse and validate the request body/query with a
   `zod` schema from `lib/validation/`. If none exists yet for this shape,
   create it there — not inline in the route file.
3. **Response shape** (consistent across the app):
   ```ts
   // success
   { data: T }
   // error
   { error: { code: string; message: string } }
   ```
   Use appropriate HTTP status codes (`400` validation, `401`/`403` auth,
   `404` not found, `409` conflict/idempotency, `500` unexpected).
4. **No business logic in the route file.** The route parses input, calls a
   function in `lib/` (e.g. `lib/donations/createDonation.ts`), and shapes
   the response. This keeps logic testable without spinning up Next.js.
5. **Auth check**: if the route is under `app/api/admin/**` or otherwise
   mutates non-public data, verify the session before doing anything else —
   fail closed.
6. **Webhooks are a special case** — do not scaffold a webhook route with
   this skill's default template; use the matching payment-integration
   skill, which has its own signature-verification requirements.

## Template

```ts
// app/api/<resource>/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  // define fields
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  try {
    // const result = await someLibFunction(parsed.data);
    return NextResponse.json({ data: /* result */ null }, { status: 201 });
  } catch (err) {
    console.error("[api/<resource>] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
```

## Checklist before considering a route "done"

- [ ] Input validated with a `zod` schema
- [ ] Business logic lives in `lib/`, not in `route.ts`
- [ ] Correct status codes for each branch
- [ ] Auth check present if the route isn't meant to be public
- [ ] No secrets or full payloads logged
- [ ] A corresponding test exists for the validation schema and the `lib/`
      function
