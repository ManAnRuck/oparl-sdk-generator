import { fetchItemExternalList, fetchList, fetchPage } from "./utils";
import { MembershipWithFunctions, fetchMemberships } from "./membership";
import { Meeting, fetchMeetingExternalList } from "./meeting";
import { Consultation, fetchConsultationExternalList } from "./consultation";
import { ObjectList } from "./objectList";

export interface OrganizationFunctions {
  getMemberships?: () => Promise<MembershipWithFunctions[]>;
  getMeetingsExternalList?: () => Promise<ObjectList<Meeting>>;
  getConsultationsExternalList?: () => Promise<ObjectList<Consultation>>;
}

export interface Organization {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/Organization$'
  body: string; // format: url
  name: string;
  membership?: string[]; // format: url
  meeting?: string; // format: url
  consultation?: string; // format: url
  shortName?: string;
  post?: string[];
  subOrganizationOf?: string; // format: url
  organizationType?: string;
  classification?: string;
  startDate?: string; // format: date
  endDate?: string; // format: date
  website?: string; // format: url
  location?: Location; // This assumes you have a Location interface defined
  externalBody?: string; // format: url
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type OrganizationWithFunctions = Organization & OrganizationFunctions;

export const extendOrganizationWithFunctions = (
  organization: Organization
): OrganizationWithFunctions => ({
  ...organization,
  getMemberships: organization.membership
    ? () => fetchMemberships(organization.membership!)
    : undefined,
  getMeetingsExternalList: organization.meeting
    ? () => fetchMeetingExternalList(organization.meeting!)
    : undefined,
  getConsultationsExternalList: organization.consultation
    ? () => fetchConsultationExternalList(organization.consultation!)
    : undefined,
});

export const fetchOrganization = async (
  url: string
): Promise<OrganizationWithFunctions> =>
  fetchPage<Organization>(url).then(extendOrganizationWithFunctions);

export const fetchOrganizations = async (
  organizationList: string[]
): Promise<OrganizationWithFunctions[]> =>
  Promise.all(organizationList.map(fetchOrganization));

export const fetchOrganizationExternalList = (
  organizationExternalList: string
) =>
  fetchItemExternalList<Organization, OrganizationWithFunctions>(
    organizationExternalList,
    fetchList,
    extendOrganizationWithFunctions
  );
