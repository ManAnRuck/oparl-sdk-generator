import { fetchList, fetchPage } from "./utils";
import { MeetingWithFunctions, fetchMeeting } from "./meeting";
import { AgendaItemWithFunctions, fetchAgendaItem } from "./agendaItem";
import { PaperWithFunctions, fetchPaper } from "./paper";
import { ObjectList } from "./objectList";

interface FileFunctions {
  getMasterFile?: () => Promise<FileWithFunctions>;
  getDerivativeFiles?: () => Promise<FileWithFunctions[]>;
  getMeetings?: () => Promise<MeetingWithFunctions[]>;
  getAgendaItems?: () => Promise<AgendaItemWithFunctions[]>;
  getPapers?: () => Promise<PaperWithFunctions[]>;
}

export interface File {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/File$'
  name?: string;
  fileName?: string;
  mimeType?: string;
  date?: string; // format: date
  size?: number;
  sha1Checksum?: string; // deprecated
  sha512Checksum?: string;
  text?: string;
  accessUrl: string; // format: url
  downloadUrl?: string; // format: url
  externalServiceUrl?: string; // format: url
  masterFile?: string; // format: url
  derivativeFile?: string[]; // format: url
  fileLicense?: string; // format: url
  meeting?: string[]; // format: url
  agendaItem?: string[]; // format: url
  paper?: string[]; // format: url
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type FileWithFunctions = File & FileFunctions;

export const extendFileWithFunctions = (file: File): FileWithFunctions => ({
  ...file,
  getMasterFile: file.masterFile
    ? () => fetchFile(file.masterFile!)
    : undefined,
  getDerivativeFiles: file.derivativeFile
    ? () => Promise.all(file.derivativeFile!.map(fetchFile))
    : undefined,
  getMeetings: file.meeting
    ? () => Promise.all(file.meeting!.map(fetchMeeting))
    : undefined,
  getAgendaItems: file.agendaItem
    ? () => Promise.all(file.agendaItem!.map(fetchAgendaItem))
    : undefined,
  getPapers: file.paper
    ? () => Promise.all(file.paper!.map(fetchPaper))
    : undefined,
});

export const fetchFile = async (url: string): Promise<FileWithFunctions> =>
  fetchPage<File>(url).then(extendFileWithFunctions);

export const fetchFiles = async (
  fileList: string[]
): Promise<FileWithFunctions[]> => Promise.all(fileList.map(fetchFile));

export const fetchFileExternalList = async (
  fileExternalList: string
): Promise<ObjectList<FileWithFunctions>> =>
  fetchList<FileWithFunctions>(fileExternalList)().then((fileExternalList) => ({
    ...fileExternalList,
    data: fileExternalList.data.map(extendFileWithFunctions),
  }));
