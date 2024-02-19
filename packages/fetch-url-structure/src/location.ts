import { BodyWithFunctions, fetchBodies } from "./body";
import { Meeting, fetchMeetings } from "./meeting";
import { Organization, fetchOrganizations } from "./organization";
import { Paper, fetchPapers } from "./paper";
import { Person, fetchPersons } from "./person";

interface LocationFunctions {
  getBodies?: () => Promise<BodyWithFunctions[]>;
  getOrganizations?: () => Promise<Organization[]>;
  getPersons?: () => Promise<Person[]>;
  getMeetings?: () => Promise<Meeting[]>;
  getPapers?: () => Promise<Paper[]>;
}

export interface Location {
  id: string; // format: url
  type: string; // pattern: '^https://schema.oparl.org/1.1/Location$'
  description?: string;
  geojson?: object; // This should be a GeoJSON Feature object
  streetAddress?: string;
  room?: string;
  postalCode?: string;
  subLocality?: string;
  locality?: string;
  bodies?: string[]; // format: url
  organizations?: string[]; // format: url
  persons?: string[]; // format: url
  meetings?: string[]; // format: url
  papers?: string[]; // format: url
  license?: string;
  keyword?: string[];
  created?: string; // format: date-time
  modified?: string; // format: date-time
  web?: string; // format: url
  deleted?: boolean;
}

export type LocationWithFunctions = Location & LocationFunctions;

export const extendLocationWithFunctions = (
  location: Location
): LocationWithFunctions => ({
  ...location,
  getBodies: location.bodies ? () => fetchBodies(location.bodies!) : undefined,
  getOrganizations: location.organizations
    ? () => fetchOrganizations(location.organizations!)
    : undefined,
  getPersons: location.persons
    ? () => fetchPersons(location.persons!)
    : undefined,
  getMeetings: location.meetings
    ? () => fetchMeetings(location.meetings!)
    : undefined,
  getPapers: location.papers ? () => fetchPapers(location.papers!) : undefined,
});
