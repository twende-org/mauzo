import { collection, addDoc, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { type BusinessTypeKey } from "../config/businessTypes";

export interface Business {
  id?: string;
  name: string;
  type: BusinessTypeKey;
  ownerUid: string;
  createdAt: Timestamp;
}

const businessRef = collection(db, "businesses");

export const createBusiness = async (
  data: Omit<Business, "id" | "createdAt">
) => {
  const docRef = await addDoc(businessRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getBusinessById = async (id: string) => {
  const snap = await getDoc(doc(db, "businesses", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};
