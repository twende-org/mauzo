import { collection, addDoc, getDocs, getDoc, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { type DispatchRecord } from "../store/features/sales/dispatchSlice";

const dispatchRef = collection(db, "daily_dispatch");

// Fetch all dispatches
export const getDispatches = async (): Promise<DispatchRecord[]> => {
  const snapshot = await getDocs(dispatchRef);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<DispatchRecord, "id">;
    return {
      id: doc.id,
      ...data,
      date: data.date && typeof (data.date as any).toDate === "function"
        ? (data.date as any).toDate().toISOString()
        : data.date,
    };
  });
};

// Add a new dispatch record
export const addDispatch = async (data: {
  productId: string;
  sellerId: string;
  givenQty: number;
  pricePerUnit: number;
  productName: string;
  unit: string;
}): Promise<string> => {
  const docRef = await addDoc(dispatchRef, {
    ...data,
    meltedQty: 0,
    returnedQty: 0,
    soldQty: 0,
    cashCollected: 0,
    status: "open",
    date: Timestamp.now(),
  });
  return docRef.id;
};

// Close a dispatch record and calculate soldQty + cashCollected
export const closeDispatch = async (
  id: string,
  data: { meltedQty: number; returnedQty: number }
) => {
  const docRef = doc(db, "daily_dispatch", id);

  // Fetch existing doc
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error("Dispatch not found");

  const existingData = docSnap.data();
  const givenQty = existingData.givenQty || 0;
  const pricePerUnit = existingData.pricePerUnit || 0;

  // Sold = given - melted (broken) only
  const soldQty = Math.max(0, givenQty - data.meltedQty);
  const cashCollected = soldQty * pricePerUnit;

  await updateDoc(docRef, {
    ...data,
    soldQty,
    cashCollected,
    status: "closed",
    closedAt: Timestamp.now(),
  });
};

