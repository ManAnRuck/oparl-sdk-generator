import { fetchItemExternalList, fetchList, fetchPage } from "./utils";
import { BodyWithFunctions, fetchBody } from "./body";
import {
  ConsultationWithFunctions,
  extendConsultationWithFunctions,
} from "./consultation";
import { File } from "./file";

interface PaperFunctions {
  getBody: () => Promise<BodyWithFunctions>;
}

export interface Paper {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/Paper$'
  body?: string; // format: url
  name?: string;
  reference?: string;
  date?: string; // format: date
  paperType?: string;
  relatedPaper?: string[]; // format: url
  superordinatedPaper?: string[]; // format: url
  subordinatedPaper?: string[]; // format: url
  mainFile?: File; // This assumes you have a File interface defined
  auxiliaryFile?: File[]; // This assumes you have a File interface defined
  location?: Location[]; // This assumes you have a Location interface defined
  originatorPerson?: string[]; // format: url
  underDirectionOf?: string[]; // format: url
  originatorOrganization?: string[]; // format: url
  consultation?: ConsultationWithFunctions[]; // This assumes you have a Consultation interface defined
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type PaperWithFunctions = Paper & PaperFunctions;

export const extendPaperWithFunctions = (paper: Paper): PaperWithFunctions => ({
  ...paper,
  getBody: () => fetchBody(paper.body!),
  consultation: paper.consultation
    ? paper.consultation.map(extendConsultationWithFunctions)
    : undefined,
});

export const fetchPaper = async (url: string): Promise<PaperWithFunctions> =>
  fetchPage<Paper>(url).then(extendPaperWithFunctions);

export const fetchPapers = async (
  paperList: string[]
): Promise<PaperWithFunctions[]> => Promise.all(paperList.map(fetchPaper));

export const fetchPaperExternalList = (paperExternalList: string) =>
  fetchItemExternalList<Paper, PaperWithFunctions>(
    paperExternalList,
    fetchList,
    extendPaperWithFunctions
  );
