// src/services/productService.ts
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
import { type Product } from "../store/features/products/productsSlice";

const productsRef = collection(db, "products");

/* -------------------- GET PRODUCTS -------------------- */
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Product, "id">),
  }));
};

/* -------------------- ADD PRODUCT -------------------- */
export const addProduct = async (
  product: Omit<Product, "id" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

/* -------------------- UPDATE PRODUCT -------------------- */
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<void> => {
  await updateDoc(doc(db, "products", id), data);
};

/* -------------------- DELETE PRODUCT -------------------- */
export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "products", id));
};
