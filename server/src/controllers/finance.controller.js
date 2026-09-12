import Transaction from "../models/Transaction.js";
import Loan from "../models/Loan.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, note, date } = req.body;
  const txn = await Transaction.create({ user: req.user.id, type, category, amount, note, date });
  res.status(201).json(txn);
});

export const getTransactions = asyncHandler(async (req, res) => {
  const txns = await Transaction.find({ user: req.user.id }).sort({ date: -1 }).limit(100);
  res.json(txns);
});

export const addLoan = asyncHandler(async (req, res) => {
  const { direction, counterparty, amount, dueDate } = req.body;
  const loan = await Loan.create({ user: req.user.id, direction, counterparty, amount, dueDate });
  res.status(201).json(loan);
});

export const getKhatabook = asyncHandler(async (req, res) => {
  const loans = await Loan.find({ user: req.user.id, status: "pending" });
  const iOwe = loans.filter((l) => l.direction === "i_owe").reduce((s, l) => s + l.amount, 0);
  const owedToMe = loans
    .filter((l) => l.direction === "owed_to_me")
    .reduce((s, l) => s + l.amount, 0);

  res.json({ iOwe, owedToMe, netPosition: owedToMe - iOwe, loans });
});

export const getHealthScore = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setMonth(since.getMonth() - 1);

  const txns = await Transaction.find({ user: req.user.id, date: { $gte: since } });
  const income = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const loans = await Loan.find({ user: req.user.id, status: "pending" });
  const debtLoad = loans.filter((l) => l.direction === "i_owe").reduce((s, l) => s + l.amount, 0);

  const surplus = income - expenses;
  const savingsRate = income > 0 ? surplus / income : 0;
  const debtToIncome = income > 0 ? debtLoad / income : 1;

  let score = savingsRate * 60 + (1 - Math.min(debtToIncome, 1)) * 40;
  score = Math.max(0, Math.min(100, Math.round(score)));

  res.json({
    score,
    monthlyIncome: income,
    monthlyExpenses: expenses,
    monthlySurplus: surplus,
    debtLoad,
    breakdown: {
      savingsRateComponent: Math.round(savingsRate * 60),
      debtBurdenComponent: Math.round((1 - Math.min(debtToIncome, 1)) * 40),
    },
  });
});

export const simulate = asyncHandler(async (req, res) => {
  const { currentMonthlySavings, targetWeeklySavings, goalAmount } = req.body;
  const monthlyTarget = targetWeeklySavings * 4.33;
  const monthsToGoal = monthlyTarget > 0 ? Math.ceil(goalAmount / monthlyTarget) : null;
  const currentMonthsToGoal =
    currentMonthlySavings > 0 ? Math.ceil(goalAmount / currentMonthlySavings) : null;

  res.json({ monthlyTarget: Math.round(monthlyTarget), monthsToGoal, currentMonthsToGoal });
});