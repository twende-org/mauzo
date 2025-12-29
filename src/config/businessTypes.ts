export type BusinessTypeKey =
  | "retail"
  | "restaurant"
  | "supermarket"
  | "pharmacy"
  | "salon"
  | "electronics"
  | "clothing"
  | "hardware";

export interface BusinessType {
  key: BusinessTypeKey;
  name: string;
  icon: string;
  modules: {
    inventory: boolean;
    production: boolean;
    dailySales: boolean;
    expenses: boolean;
    sellers: boolean;
  };
}

export const businessTypes: BusinessType[] = [
  {
    key: "retail",
    name: "Maduka ya Rejareja",
    icon: "🛍️",
    modules: {
      inventory: true,
      production: false,
      dailySales: true,
      expenses: true,
      sellers: true,
    },
  },
  {
    key: "restaurant",
    name: "Migahawa",
    icon: "🍽️",
    modules: {
      inventory: true,
      production: true,
      dailySales: true,
      expenses: true,
      sellers: false,
    },
  },
  {
    key: "pharmacy",
    name: "Pharmacy",
    icon: "💊",
    modules: {
      inventory: true,
      production: false,
      dailySales: true,
      expenses: true,
      sellers: true,
    },
  },
];
