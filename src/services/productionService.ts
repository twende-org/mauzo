import {
  collection,
  addDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { type ProductionBatch } from "../store/features/products/productionSlice";

const productionRef = collection(db, "production_batches");

export const getProduction = async (): Promise<ProductionBatch[]> => {
  const snapshot = await getDocs(productionRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ProductionBatch, "id">),
  }));
};

export const addProduction = async (data: {
  totalProduced: number;
  totalCost: number;
}): Promise<string> => {
  const docRef = await addDoc(productionRef, {
    ...data,
    date: Timestamp.now(),
  });
  return docRef.id;
};
