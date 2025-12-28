// src/services/userService.ts
import  {db}  from "../firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const usersCollection = collection(db, "users");

// Create a new user
export const addUser = async (user: { name: string; contact: string; route: string }) => {
  const docRef = await addDoc(usersCollection, { ...user, totalSales: 0, createdAt: new Date() });
  return docRef.id;
};

// Get all users
export const getUsers = async () => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update user
export const updateUser = async (id: string, data: Partial<{ name: string; contact: string; route: string }>) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, data);
};

// Delete user
export const deleteUser = async (id: string) => {
  const docRef = doc(db, "users", id);
  await deleteDoc(docRef);
};
