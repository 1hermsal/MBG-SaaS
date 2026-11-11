export type Role = "ahli_gizi" | "kepala_dapur" | "kurir" | "owner" | "admin_yayasan";

export type TodayMenu = {
  id: number;
  name: string;
  target_portions: number;
  done: boolean;
  made: number | null;
};

export type Ingredient = {
  name: string;
  unit: string;
  stock: number;
  need: number;
};
