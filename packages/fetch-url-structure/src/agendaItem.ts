import { fetchList, fetchPage } from "./utils";
import { MeetingWithFunctions, fetchMeeting } from "./meeting";
import { ConsultationWithFunctions, fetchConsultation } from "./consultation";
import { File } from "./file";
import { ObjectList } from "./objectList";

interface AgendaItemFunctions {
  getMeeting?: () => Promise<MeetingWithFunctions>;
  getConsultation?: () => Promise<ConsultationWithFunctions>;
}

export interface AgendaItem {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/AgendaItem$'
  meeting?: string; // format: url
  number?: string;
  order: number;
  name?: string;
  public?: boolean;
  consultation?: string; // format: url
  result?: string;
  resolutionText?: string;
  resolutionFile?: File; // This assumes you have a File interface defined
  auxiliaryFile?: File[]; // This assumes you have a File interface defined
  start?: string; // format: date-time
  end?: string; // format: date-time
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type AgendaItemWithFunctions = AgendaItem & AgendaItemFunctions;

export const extendAgendaItemWithFunctions = (
  agendaItem: AgendaItem
): AgendaItemWithFunctions => ({
  ...agendaItem,
  getMeeting: agendaItem.meeting
    ? () => fetchMeeting(agendaItem.meeting!)
    : undefined,
  getConsultation: agendaItem.consultation
    ? () => fetchConsultation(agendaItem.consultation!)
    : undefined,
});

export const fetchAgendaItem = async (
  url: string
): Promise<AgendaItemWithFunctions> =>
  fetchPage<AgendaItem>(url).then(extendAgendaItemWithFunctions);

export const fetchAgendaItems = async (
  agendaItemList: string[]
): Promise<AgendaItemWithFunctions[]> =>
  Promise.all(agendaItemList.map(fetchAgendaItem));

export const fetchAgendaItemExternalList = async (
  agendaItemExternalList: string
): Promise<ObjectList<AgendaItemWithFunctions>> =>
  fetchList<AgendaItemWithFunctions>(agendaItemExternalList)().then(
    (agendaItemExternalList) => ({
      ...agendaItemExternalList,
      data: agendaItemExternalList.data.map(extendAgendaItemWithFunctions),
    })
  );
