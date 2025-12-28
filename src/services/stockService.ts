// src/services/stockService.ts
import { db } from "../firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const stockCollection = collection(db, "stock");

// Add new stock item
export const addStockItem = async (item: { name: string; quantity: number; lowStockThreshold?: number }) => {
  const docRef = await addDoc(stockCollection, { ...item, createdAt: new Date(), updatedAt: new Date() });
  return docRef.id;
};

// Get all stock items
export const getStockItems = async () => {
  const snapshot = await getDocs(stockCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update stock item
export const updateStockItem = async (id: string, data: Partial<{ name: string; quantity: number; lowStockThreshold?: number }>) => {
  const docRef = doc(db, "stock", id);
  await updateDoc(docRef, { ...data, updatedAt: new Date() });
};

// Delete stock item
export const deleteStockItem = async (id: string) => {
  const docRef = doc(db, "stock", id);
  await deleteDoc(docRef);
};
