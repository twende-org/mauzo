import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { type Seller } from "../store/features/sellers/sellersSlice";

const sellersRef = collection(db, "sellers");

export const getSellers = async (): Promise<Seller[]> => {
  const snapshot = await getDocs(sellersRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Seller, "id">),
  }));
};

export const addSeller = async (
  seller: Omit<Seller, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(sellersRef, {
    ...seller,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateSeller = async (
  id: string,
  data: Partial<Seller>
) => {
  await updateDoc(doc(db, "sellers", id), data);
};

export const deleteSeller = async (id: string) => {
  await deleteDoc(doc(db, "sellers", id));
};
