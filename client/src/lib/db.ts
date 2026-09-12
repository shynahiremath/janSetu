import Dexie, { Table } from "dexie";

export interface DraftTransaction {
  id?: number;
  type: "income" | "expense";
  category: string;
  amount: number;
  note?: string;
  date: string;
  synced: boolean;
}

export interface DraftSymptomLog {
  id?: number;
  symptoms: string[];
  lat: number;
  lng: number;
  synced: boolean;
}

class JanSetuDB extends Dexie {
  transactions!: Table<DraftTransaction>;
  symptomLogs!: Table<DraftSymptomLog>;

  constructor() {
    super("jansetu");
    this.version(1).stores({
      transactions: "++id, synced",
      symptomLogs: "++id, synced",
    });
  }
}

export const db = new JanSetuDB();