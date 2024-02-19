import { fetchItemExternalList, fetchList, fetchPage } from "./utils";
import {
  OrganizationWithFunctions,
  fetchOrganizationExternalList,
} from "./organization";
import { PersonWithFunctions, fetchPersonExternalList } from "./person";
import { MeetingWithFunctions, fetchMeetingExternalList } from "./meeting";
import { PaperWithFunctions, fetchPaperExternalList } from "./paper";
import {
  AgendaItemWithFunctions,
  fetchAgendaItemExternalList,
} from "./agendaItem";
import {
  ConsultationWithFunctions,
  fetchConsultationExternalList,
} from "./consultation";
import { File, fetchFileExternalList } from "./file";
import {
  LegislativeTerm,
  LegislativeTermWithFunctions,
  extendLegislativeTermWithFunctions,
  fetchLegislativeTermExternalList,
} from "./legislativeTerm";
import { ObjectList } from "./objectList";

interface BodyFunctions {
  getOrganizationExternalList: () => Promise<
    ObjectList<OrganizationWithFunctions>
  >;
  getMeetingExternalList: () => Promise<ObjectList<MeetingWithFunctions>>;
  getPersonExternalList: () => Promise<ObjectList<PersonWithFunctions>>;
  getPaperExternalList: () => Promise<ObjectList<PaperWithFunctions>>;
  getAgendaItemExternalList?: () => Promise<
    ObjectList<AgendaItemWithFunctions>
  >;
  getConsultationExternalList?: () => Promise<
    ObjectList<ConsultationWithFunctions>
  >;
  getFileExternalList?: () => Promise<ObjectList<File>>;
  getLegislativeTermExternalList?: () => Promise<ObjectList<LegislativeTerm>>;
}

export interface Body {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/Body$'
  system: string; // format: url
  shortName?: string;
  name: string;
  website?: string; // format: url
  license?: string; // format: url
  licenseValidSince?: string; // format: date-time
  oparlSince?: string; // format: date-time
  ags?: string;
  rgs?: string;
  equivalent?: string[]; // format: url
  contactEmail?: string;
  contactName?: string;
  organization: string; // format: url
  person: string; // format: url
  meeting: string; // format: url
  paper: string; // format: url
  legislativeTerm: LegislativeTermWithFunctions[]; // This assumes you have a LegislativeTerm interface defined
  agendaItem?: string; // format: url
  consultation?: string; // format: url
  file?: string; // format: url
  locationList?: string; // format: url
  legislativeTermList?: string; // format: url
  membership?: string; // format: url
  classification?: string;
  location?: Location; // This assumes you have a Location interface defined
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type BodyWithFunctions = Body & BodyFunctions;

export const extendBodyWithFunctions = (body: Body): BodyWithFunctions => ({
  ...body,
  legislativeTerm: body.legislativeTerm.map(extendLegislativeTermWithFunctions),
  getOrganizationExternalList: () =>
    fetchOrganizationExternalList(body.organization),
  getMeetingExternalList: () => fetchMeetingExternalList(body.meeting),
  getPersonExternalList: () => fetchPersonExternalList(body.person),
  getPaperExternalList: () => fetchPaperExternalList(body.paper),
  getAgendaItemExternalList: body.agendaItem
    ? () => fetchAgendaItemExternalList(body.agendaItem!)
    : undefined,
  getConsultationExternalList: body.consultation
    ? () => fetchConsultationExternalList(body.consultation!)
    : undefined,
  getFileExternalList: body.file
    ? () => fetchFileExternalList(body.file!)
    : undefined,
  getLegislativeTermExternalList: body.legislativeTermList
    ? () => fetchLegislativeTermExternalList(body.legislativeTermList!)
    : undefined,
});

export const fetchBody = async (url: string): Promise<BodyWithFunctions> =>
  fetchPage<Body>(url).then(extendBodyWithFunctions);

export const fetchBodies = async (
  bodyList: string[]
): Promise<BodyWithFunctions[]> => Promise.all(bodyList.map(fetchBody));

export const fetchBodyExternalList = (bodyExternalList: string) =>
  fetchItemExternalList<Body, BodyWithFunctions>(
    bodyExternalList,
    fetchList,
    extendBodyWithFunctions
  );
