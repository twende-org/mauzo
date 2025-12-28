// src/services/salesService.ts
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";

const salesCollection = collection(db, "sales");

// Add a new sale
export const addSale = async (sale: { sellerId: string; sellerName: string; amount: number; round: number }) => {
  const docRef = await addDoc(salesCollection, { ...sale, date: new Date(), createdAt: new Date() });
  return docRef.id;
};

// Get all sales
export const getSales = async () => {
  const snapshot = await getDocs(salesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get sales by seller
export const getSalesBySeller = async (sellerId: string) => {
  const q = query(salesCollection, where("sellerId", "==", sellerId), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
