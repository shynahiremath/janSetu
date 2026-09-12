import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/apiClient";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function Khatabook() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ direction: "i_owe", counterparty: "", amount: "" });

  const { data } = useQuery({
    queryKey: ["khatabook"],
    queryFn: async () => (await api.get("/finance/khatabook")).data,
  });

  async function addLoan() {
    await api.post("/finance/loans", { ...form, amount: Number(form.amount) });
    setForm({ direction: "i_owe", counterparty: "", amount: "" });
    queryClient.invalidateQueries({ queryKey: ["khatabook"] });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">💰 Khatabook</h1>
      <p className="text-gray-500 mb-6">Money you owe, and money owed to you.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500">I owe</p>
          <p className="text-2xl font-bold text-red-600">₹{data?.iOwe ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Owed to me</p>
          <p className="text-2xl font-bold text-green-600">₹{data?.owedToMe ?? 0}</p>
        </Card>
      </div>

      <Card className="mb-6">
        <h3 className="font-semibold mb-3">Add entry</h3>
        <div className="grid grid-cols-3 gap-3">
          <select
            className="border border-gray-200 rounded-xl px-3 text-sm"
            value={form.direction}
            onChange={(e) => setForm({ ...form, direction: e.target.value })}
          >
            <option value="i_owe">I owe them</option>
            <option value="owed_to_me">They owe me</option>
          </select>
          <Input placeholder="Name" value={form.counterparty} onChange={(e) => setForm({ ...form, counterparty: e.target.value })} />
          <Input placeholder="Amount" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <Button className="mt-3" onClick={addLoan}>Add</Button>
      </Card>

      <div className="space-y-2">
        {data?.loans?.map((l: any) => (
          <Card key={l._id} className="flex justify-between items-center py-3">
            <span>{l.counterparty}</span>
            <span className={l.direction === "i_owe" ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
              ₹{l.amount}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}