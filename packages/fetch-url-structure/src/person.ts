import {
  MembershipWithFunctions,
  extendMembershipWithFunctions,
} from "./membership";
import { fetchList, fetchPage } from "./utils";
import { BodyWithFunctions, fetchBody } from "./body";
import { ObjectList } from "./objectList";

interface PersonFunctions {
  getBody: () => Promise<BodyWithFunctions>;
}

export interface Person {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/Person$'
  body: string; // format: url
  name: string;
  familyName?: string;
  givenName?: string;
  formOfAddress?: string;
  affix?: string;
  title?: string[];
  gender?: string;
  phone?: string[];
  email?: string[];
  location?: string; // format: url
  locationObject?: Location; // This assumes you have a Location interface defined
  status?: string[];
  membership?: MembershipWithFunctions[]; // This assumes you have a Membership interface defined
  life?: string;
  lifeSource?: string;
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type PersonWithFunctions = Person & PersonFunctions;

export const extendPersonWithFunctions = (
  person: Person
): PersonWithFunctions => ({
  ...person,
  membership: person.membership
    ? person.membership.map(extendMembershipWithFunctions)
    : undefined,
  getBody: () => fetchBody(person.body),
});

export const fetchPerson = async (url: string): Promise<PersonWithFunctions> =>
  fetchPage<Person>(url).then(extendPersonWithFunctions);

export const fetchPersons = async (
  personList: string[]
): Promise<PersonWithFunctions[]> => Promise.all(personList.map(fetchPerson));

export const fetchPersonExternalList = async (
  personExternalList: string
): Promise<ObjectList<PersonWithFunctions>> =>
  fetchList<PersonWithFunctions>(personExternalList)().then(
    (personExternalList) => ({
      ...personExternalList,
      data: personExternalList.data.map(extendPersonWithFunctions),
    })
  );
