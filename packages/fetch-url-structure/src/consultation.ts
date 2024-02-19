import { fetchList, fetchPage } from "./utils";
import { PaperWithFunctions, fetchPaper } from "./paper";
import { AgendaItemWithFunctions, fetchAgendaItem } from "./agendaItem";
import { MeetingWithFunctions, fetchMeeting } from "./meeting";
import { OrganizationWithFunctions, fetchOrganizations } from "./organization";
import { ObjectList } from "./objectList";

interface ConsultationFunctions {
  getPaper?: () => Promise<PaperWithFunctions>;
  getAgendaItem?: () => Promise<AgendaItemWithFunctions>;
  getMeeting?: () => Promise<MeetingWithFunctions>;
  getOrganizations?: () => Promise<OrganizationWithFunctions[]>;
}

export interface Consultation {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/Consultation$'
  paper?: string; // format: url
  agendaItem?: string; // format: url
  meeting?: string; // format: url
  organization?: string[]; // format: url
  authoritative?: boolean;
  role?: string;
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type ConsultationWithFunctions = Consultation & ConsultationFunctions;

export const extendConsultationWithFunctions = (
  consultation: Consultation
): ConsultationWithFunctions => ({
  ...consultation,
  getPaper: consultation.paper
    ? () => fetchPaper(consultation.paper!)
    : undefined,
  getAgendaItem: consultation.agendaItem
    ? () => fetchAgendaItem(consultation.agendaItem!)
    : undefined,
  getMeeting: consultation.meeting
    ? () => fetchMeeting(consultation.meeting!)
    : undefined,
  getOrganizations: consultation.organization
    ? () => fetchOrganizations(consultation.organization!)
    : undefined,
});

export const fetchConsultation = async (
  url: string
): Promise<ConsultationWithFunctions> =>
  fetchPage<Consultation>(url).then(extendConsultationWithFunctions);

export const fetchConsultations = async (
  consultationList: string[]
): Promise<ConsultationWithFunctions[]> =>
  Promise.all(consultationList.map(fetchConsultation));

export const fetchConsultationExternalList = async (
  consultationExternalList: string
): Promise<ObjectList<ConsultationWithFunctions>> =>
  fetchList<ConsultationWithFunctions>(consultationExternalList)().then(
    (consultationExternalList) => ({
      ...consultationExternalList,
      data: consultationExternalList.data.map(extendConsultationWithFunctions),
    })
  );
