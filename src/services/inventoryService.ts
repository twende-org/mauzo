import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  increment,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/config";

const inventoryCollection = collection(db, "inventory");
const movementsRef = collection(db, "inventory_movements");

/**
 * Get current inventory for all products
 */
export const getInventory = async () => {
  const snap = await getDocs(inventoryCollection); // getDocs for collections
  if (snap.empty) {
    return {};
  }

  const inventory: Record<string, any> = {};
  snap.forEach((docSnap) => {
    inventory[docSnap.id] = docSnap.data();
  });

  return inventory;
};

/**
 * Get inventory for a specific product
 */
export const getProductInventory = async (productId: string) => {
  const productDoc = doc(db, "inventory", productId);
  const snap = await getDoc(productDoc); // getDoc for a single document

  if (!snap.exists()) {
    const now = Timestamp.now();
    await setDoc(productDoc, {
      availableQty: 0,
      lastUpdated: now,
    });
    return { availableQty: 0, lastUpdated: now };
  }

  return snap.data();
};

/**
 * Adjust inventory for a specific product
 */
export const adjustInventory = async ({
  productId,
  type,
  quantity,
  referenceId,
  note,
}: {
  productId: string;
  type: "PRODUCTION" | "DISPATCH" | "RETURN" | "MELT";
  quantity: number;
  referenceId?: string;
  note?: string;
}) => {
  const productDoc = doc(db, "inventory", productId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(productDoc);

    if (!snap.exists()) {
      transaction.set(productDoc, {
        availableQty: 0,
        lastUpdated: Timestamp.now(),
      });
    }

    const delta = type === "PRODUCTION" || type === "RETURN" ? quantity : -quantity;

    transaction.update(productDoc, {
      availableQty: increment(delta),
      lastUpdated: Timestamp.now(),
    });

    const movementDoc = doc(movementsRef); // auto-generated ID
    transaction.set(movementDoc, {
      productId,
      type,
      quantity,
      delta,
      referenceId: referenceId || null,
      note: note || "",
      date: Timestamp.now(),
    });
  });
};
