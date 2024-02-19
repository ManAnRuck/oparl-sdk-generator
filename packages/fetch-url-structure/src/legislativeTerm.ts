import { BodyWithFunctions, fetchBody } from "./body";
import { fetchItemExternalList, fetchList, fetchPage } from "./utils";

interface LegislativeTermFunctions {
  getBody?: () => Promise<BodyWithFunctions>;
}

export interface LegislativeTerm {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/LegislativeTerm$'
  body?: string; // format: url
  name?: string;
  startDate?: string; // format: date
  endDate?: string; // format: date
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type LegislativeTermWithFunctions = LegislativeTerm &
  LegislativeTermFunctions;

export const extendLegislativeTermWithFunctions = (
  legislativeTerm: LegislativeTerm
): LegislativeTermWithFunctions => ({
  ...legislativeTerm,
  getBody: legislativeTerm.body
    ? () => fetchBody(legislativeTerm.body!)
    : undefined,
});

export const fetchLegislativeTerm = async (
  url: string
): Promise<LegislativeTermWithFunctions> =>
  fetchPage<LegislativeTerm>(url).then(extendLegislativeTermWithFunctions);

export const fetchLegislativeTerms = async (
  legislativeTermList: string[]
): Promise<LegislativeTermWithFunctions[]> =>
  Promise.all(legislativeTermList.map(fetchLegislativeTerm));

export const fetchLegislativeTermExternalList = (
  legislativeTermExternalList: string
) =>
  fetchItemExternalList<LegislativeTerm, LegislativeTermWithFunctions>(
    legislativeTermExternalList,
    fetchList,
    extendLegislativeTermWithFunctions
  );
