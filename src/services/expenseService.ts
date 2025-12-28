import { collection, addDoc, getDocs, updateDoc, deleteDoc, Timestamp, doc } from "firebase/firestore";
import { db } from "../firebase/config";

const expensesRef = collection(db, "expenses");

export type ExpenseCategory = "ingredient" | "fuel" | "maintenance" | "other";

export interface ExpenseData {
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date | Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;   // ✅ MUST be optional here
  productId?: string;
  dispatchId?: string;
}

// Fetch all expenses
export const getExpenses = async (): Promise<(ExpenseData & { id: string })[]> => {
  const snapshot = await getDocs(expensesRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as ExpenseData),
  }));
};

// Add new expense
export const addExpense = async (expense: ExpenseData): Promise<string> => {
  const docRef = await addDoc(expensesRef, { ...expense, createdAt: Timestamp.now() });
  return docRef.id;
};

// Update existing expense
export const updateExpense = async (id: string, data: Partial<ExpenseData>) => {
  await updateDoc(doc(db, "expenses", id), { ...data, updatedAt: Timestamp.now() });
};

// Delete expense
export const deleteExpense = async (id: string) => {
  await deleteDoc(doc(db, "expenses", id));
};
