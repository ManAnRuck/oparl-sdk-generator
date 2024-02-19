import { fetchItemExternalList, fetchList, fetchPage } from "./utils";
import { OrganizationWithFunctions, fetchOrganization } from "./organization";
import {
  AgendaItemWithFunctions,
  extendAgendaItemWithFunctions,
} from "./agendaItem";
import { File } from "./file";

interface MeetingFunctions {
  getOrganizations: () => Promise<OrganizationWithFunctions[]>;
}

export interface Meeting {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/Meeting$'
  name?: string;
  meetingState?: string;
  cancelled?: boolean;
  start?: string; // format: date-time
  end?: string; // format: date-time
  location?: Location; // This assumes you have a Location interface defined
  organization?: string[]; // format: url
  participant?: string[]; // format: url
  invitation?: File; // This assumes you have a File interface defined
  resultsProtocol?: File; // This assumes you have a File interface defined
  verbatimProtocol?: File; // This assumes you have a File interface defined
  auxiliaryFile?: File[]; // This assumes you have a File interface defined
  agendaItem?: AgendaItemWithFunctions[]; // This assumes you have an AgendaItem interface defined
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type MeetingWithFunctions = Meeting & MeetingFunctions;

export const extendMeetingWithFunctions = (
  meeting: Meeting
): MeetingWithFunctions => ({
  ...meeting,
  getOrganizations: () =>
    Promise.all(meeting.organization!.map(fetchOrganization)),
  agendaItem: meeting.agendaItem
    ? meeting.agendaItem.map(extendAgendaItemWithFunctions)
    : undefined,
});

export const fetchMeeting = async (
  url: string
): Promise<MeetingWithFunctions> =>
  fetchPage<Meeting>(url).then(extendMeetingWithFunctions);

export const fetchMeetings = async (
  meetingList: string[]
): Promise<MeetingWithFunctions[]> =>
  Promise.all(meetingList.map(fetchMeeting));

export const fetchMeetingExternalList = (meetingExternalList: string) =>
  fetchItemExternalList<Meeting, MeetingWithFunctions>(
    meetingExternalList,
    fetchList,
    extendMeetingWithFunctions
  );
