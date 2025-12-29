import { db, auth } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

/* =======================
   TYPES
======================= */

export type UserRole = "owner" | "admin" | "manager" | "cashier" | "seller";

export interface AppUser {
  id: string;
  uid: string;          // Firebase Auth UID
  businessId: string;    // Required for multi-business
  name: string;
  contact: string;
  route: string;
  role: UserRole;
  totalSales: number;
  active: boolean;
  createdAt: string;     // ISO string
  email: string;
}

/* =======================
   COLLECTION
======================= */

const usersCollection = collection(db, "users");

/* =======================
   CREATE USER WITH AUTH
======================= */

export const addUser = async (user: {
  email: string;
  password: string;
  name: string;
  contact?: string;
  route?: string;
  businessId: string;
  role?: UserRole;
}): Promise<string> => {
  // 1. Create Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
  const uid = userCredential.user.uid;

  // 2. Create Firestore profile
  const docRef = await addDoc(usersCollection, {
    uid,
    email: user.email,
    name: user.name,
    contact: user.contact ?? "",
    route: user.route ?? "",
    businessId: user.businessId,
    role: user.role ?? "seller",
    totalSales: 0,
    active: true,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
};

/* =======================
   GET USERS BY BUSINESS
======================= */

export const getUsersByBusiness = async (businessId: string): Promise<AppUser[]> => {
  const q = query(usersCollection, where("businessId", "==", businessId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      uid: data.uid,
      email: data.email,
      name: data.name ?? "",
      contact: data.contact ?? "",
      route: data.route ?? "",
      businessId: data.businessId ?? "",
      role: data.role ?? "seller",
      totalSales: data.totalSales ?? 0,
      active: data.active ?? true,
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt ?? new Date().toISOString(),
    } as AppUser;
  });
};

/* =======================
   GET USER BY UID
======================= */

export const getUserByUid = async (uid: string): Promise<AppUser | null> => {
  const q = query(usersCollection, where("uid", "==", uid));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const data = snapshot.docs[0].data();
  return {
    id: snapshot.docs[0].id,
    uid: data.uid,
    email: data.email,
    name: data.name ?? "",
    contact: data.contact ?? "",
    route: data.route ?? "",
    businessId: data.businessId ?? "",
    role: data.role ?? "seller",
    totalSales: data.totalSales ?? 0,
    active: data.active ?? true,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : data.createdAt ?? new Date().toISOString(),
  };
};

/* =======================
   UPDATE USER
======================= */

export const updateUser = async (
  id: string,
  data: Partial<AppUser>
): Promise<void> => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, { ...data });
};

/* =======================
   DEACTIVATE USER
======================= */

export const deactivateUser = async (id: string): Promise<void> => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, { active: false });
};

/* =======================
   DELETE USER
======================= */

export const deleteUser = async (id: string): Promise<void> => {
  const docRef = doc(db, "users", id);
  await deleteDoc(docRef);
};
