import { BodyWithFunctions } from "./body";
import { ObjectList } from "./objectList";
import { OrganizationWithFunctions } from "./organization";
import { fetchSystem } from "./system";


const ENDPOINT = "https://ris-oparl.itk-rheinland.de/Oparl";

export const systemEntryPoint = `${ENDPOINT}/system`;

(async () => {
  const system = await fetchSystem();
  let bodyList: ObjectList<BodyWithFunctions> | undefined =
    await system.getBodyExternalList();
  do {
    for (const body of bodyList.data) {
      if (body.getOrganizationExternalList) {
        let organizationList: ObjectList<OrganizationWithFunctions> | undefined =
          await body.getOrganizationExternalList();
        if (organizationList) {
          do {
            console.log("organizationList Pages", organizationList?.pagination);
            organizationList = await organizationList?.next?.();
          } while (organizationList?.next);
        }
      }
    }
    bodyList = await bodyList.next?.();
  } while (bodyList);
  console.log("🚀 done")
})();
