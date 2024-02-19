import { systemEntryPoint } from "./dev";
import { BodyWithFunctions, fetchBodyExternalList } from "./body";
import { ObjectList } from "./objectList";

export interface SystemFunctions {
  getBodyExternalList: () => Promise<ObjectList<BodyWithFunctions>>;
}

export interface System {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/System$'
  oparlVersion: string; // pattern: '^https\:\/\/schema\.oparl\.org/1\.(0|1)\/$'
  license?: string; // format: url
  body: string; // format: url
  name?: string;
  contactEmail?: string;
  contactName?: string;
  website?: string; // format: url
  vendor?: string; // format: url
  product?: string; // format: url
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
  [k: string]: unknown; // any property
}

export type SystemWithFunctions = System & SystemFunctions;

export const fetchSystem = async (): Promise<SystemWithFunctions> => {
  const response = await fetch(systemEntryPoint);
  const data = (await response.json()) as System;
  return {
    ...data,
    getBodyExternalList: () => fetchBodyExternalList(data.body),
  };
};
