export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type StudentData = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export interface ZabbixHistory {
  itemid: string;
  clock: string;
  value: string;
  ns?: string;
}

export interface AppStat {
  name: string;
  seconds: number;
  timeDisplay: string;
}

export {};