"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInvoiceAction, type ActionResult } from "@/lib/actions/invoices";

const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AUD", "CAD"];

type LineItem = { description: string; quantity: number; unit_price: number };

export function InvoiceForm({
  clients,
  projects,
  defaultClientId,
}: {
  clients: { id: string; name: string }[];
  projects: { id: string; client_id: string; name: string }[];
  defaultClientId?: string;
}) {
  const [state, formAction, pending] = useActionState<
    ActionResult | null,
    FormData
  >(createInvoiceAction, null);
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [taxRate, setTaxRate] = useState(0);
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: 0 },
  ]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0),
    [items],
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const filteredProjects = projects.filter((p) => p.client_id === clientId);

  function updateItem(index: number, patch: Partial<LineItem>) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="items_json" value={JSON.stringify(items)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="client_id">Client</Label>
          <select
            id="client_id"
            name="client_id"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
            className="block w-full rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="project_id">Project (optional)</Label>
          <select
            id="project_id"
            name="project_id"
            defaultValue=""
            className="block w-full rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">No project</option>
            {filteredProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="invoice_number">Invoice Number</Label>
          <Input
            id="invoice_number"
            name="invoice_number"
            placeholder="INV-0001"
            required
          />
        </div>
        <div>
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            name="currency"
            defaultValue="USD"
            className="block w-full rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="issue_date">Issue Date</Label>
          <Input
            id="issue_date"
            name="issue_date"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>
        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input id="due_date" name="due_date" type="date" />
        </div>
      </div>

      <div>
        <Label>Line Items</Label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(i, { description: e.target.value })}
                className="flex-1"
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(i, { quantity: Number(e.target.value) })
                }
                className="w-20"
              />
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="Price"
                value={item.unit_price}
                onChange={(e) =>
                  updateItem(i, { unit_price: Number(e.target.value) })
                }
                className="w-28"
              />
              <span className="w-24 text-right text-sm text-secondary">
                {(item.quantity * item.unit_price).toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() =>
                  setItems((prev) => prev.filter((_, idx) => idx !== i))
                }
                disabled={items.length === 1}
                aria-label="Remove line item"
                className="text-outline hover:text-destructive disabled:opacity-30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={() =>
            setItems((prev) => [
              ...prev,
              { description: "", quantity: 1, unit_price: 0 },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Add Line
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Label htmlFor="tax_rate" className="mb-0 shrink-0">
          Tax Rate (%)
        </Label>
        <Input
          id="tax_rate"
          name="tax_rate"
          type="number"
          min={0}
          max={100}
          step="0.01"
          value={taxRate}
          onChange={(e) => setTaxRate(Number(e.target.value))}
          className="w-24"
        />
      </div>

      <div className="ml-auto max-w-xs space-y-1 text-sm">
        <div className="flex justify-between text-secondary">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-secondary">
          <span>Tax</span>
          <span>{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-900">
          <span>Total</span>
          <span>{total.toFixed(2)}</span>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="block w-full rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {state && "error" in state && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create Invoice"}
      </Button>
    </form>
  );
}
