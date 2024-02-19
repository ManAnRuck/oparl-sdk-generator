import { ObjectList } from "@repo/types/index";
import { Organization, fetchOrganization } from "./organization";
import { Person, fetchPerson } from "./person";
import { fetchList, fetchPage } from "./utils";

export interface MembershipFunctions {
  getPerson?: () => Promise<Person>;
  getOrganization: () => Promise<Organization>;
}

export interface Membership {
  id: string; // format: url
  type: string; // pattern: 'https://schema.oparl.org/1.1/Membership$'
  person?: string; // format: url
  organization: string; // format: url
  role?: string;
  votingRight?: boolean;
  startDate?: string; // format: date
  endDate?: string; // format: date
  onBehalfOf?: string; // format: url
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type MembershipWithFunctions = Membership & MembershipFunctions;

export const extendMembershipWithFunctions = (
  membership: Membership
): MembershipWithFunctions => ({
  ...membership,
  getOrganization: () => fetchOrganization(membership.organization),
  getPerson: membership.person
    ? () => fetchPerson(membership.person!)
    : undefined,
});

export const fetchMembership = async (
  url: string
): Promise<MembershipWithFunctions> =>
  fetchPage<Membership>(url).then(extendMembershipWithFunctions);

export const fetchMembershipExternalList = async (
  membershipExternalList: string
): Promise<ObjectList<MembershipWithFunctions>> =>
  fetchList<MembershipWithFunctions>(membershipExternalList)().then(
    (membershipExternalList) => ({
      ...membershipExternalList,
      data: membershipExternalList.data.map(extendMembershipWithFunctions),
    })
  );

export const fetchMemberships = async (
  membershipList: string[]
): Promise<MembershipWithFunctions[]> =>
  Promise.all(membershipList.map(fetchMembership));
