// src/services/dailySalesService.ts
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export interface DailySaleRecord {
  id?: string;
  date: Date;
  sellerId: string;
  givenQty: number;
  soldQty: number;
  meltedQty: number;
  returnedQty: number;
  cashCollected: number;
}

const salesRef = collection(db, "daily_sales");

// Fetch all sales
export const getDailySales = async (): Promise<DailySaleRecord[]> => {
  const snapshot = await getDocs(salesRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<DailySaleRecord, "id">),
  }));
};

// Add a new sale
export const addDailySale = async (sale: Omit<DailySaleRecord, "id">): Promise<string> => {
  const docRef = await addDoc(salesRef, {
    ...sale,
    date: Timestamp.fromDate(sale.date),
  });
  return docRef.id;
};

// Update a sale
export const updateDailySale = async (id: string, data: Partial<DailySaleRecord>) => {
  await updateDoc(doc(db, "daily_sales", id), data);
};

// Delete a sale
export const deleteDailySale = async (id: string) => {
  await deleteDoc(doc(db, "daily_sales", id));
};
