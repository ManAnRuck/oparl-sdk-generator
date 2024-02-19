import { fetchSystem } from "./system";

const ENDPOINT = "https://ris-oparl.itk-rheinland.de/Oparl";

export const systemEntryPoint = `${ENDPOINT}/system`;

(async () => {
  const system = await fetchSystem();
  const bodyList = await system.getBodyExternalList();
  const response = await bodyList.data[0];
  console.log(await response?.getLegislativeTermExternalList?.());
  // console.log(
  //   (await bodyList.data[0]?.getPersonExternalList())?.data[0] ?? null
  // );
  // while (personList?.next) {
  //   for (const person of personList.data) {
  //     console.log(`${person.name} (${person.email})`);
  //   }
  //   personList = await personList.next();
  // }
  // if (body.data[0]) {
  //   let organization = await fetchOrganizationList(body.data[0]);
  //   console.log(organization);
  //   while (organization.next) {
  //     organization = await organization.next();
  //     console.log(organization);
  //   }
  // }
})();
