import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    direction: { type: String, enum: ["i_owe", "owed_to_me"], required: true },
    counterparty: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: Date,
    status: { type: String, enum: ["pending", "settled"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);