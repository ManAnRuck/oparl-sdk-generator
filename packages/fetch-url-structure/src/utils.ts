import { ObjectList } from "./objectList";

const addPagination = <T = Body>(
  data: ObjectList<T>
): ObjectList<T> => {
  return {
    ...data,
    next: data.links.next ? fetchList<T>(data.links.next) : undefined,
    previous: data.links.prev ? fetchList<T>(data.links.prev) : undefined,
    first: data.links.first ? fetchList<T>(data.links.first) : undefined,
    last: data.links.last ? fetchList<T>(data.links.last) : undefined,
  };
};

export const fetchList =
  <T = Body>(url: string) =>
  async (): Promise<ObjectList<T>> => {
    const response = await fetch(url);
    const data = await response.json();
    return addPagination(data);
  };

export const fetchPage = async <T = Body>(url: string): Promise<T> => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const fetchItem = async <T, U>(
  url: string,
  fetchPageFunction: (url: string) => Promise<T>,
  extendFunction: (item: T) => U
): Promise<U> => fetchPageFunction(url).then(extendFunction);

export const fetchItems = async <T, U>(
  itemList: string[],
  fetchItemFunction: (url: string) => Promise<U>
): Promise<U[]> => Promise.all(itemList.map(fetchItemFunction));

export const fetchItemExternalList = async <T, U>(
  itemExternalList: string,
  fetchListFunction: (url: string) => () => Promise<ObjectList<T>>,
  extendFunction: (item: T) => U
): Promise<ObjectList<U>> =>
  fetchListFunction(itemExternalList)().then((itemExternalList) => ({
    ...itemExternalList,
    data: itemExternalList.data.map(extendFunction),
    next: itemExternalList.next as (() => Promise<ObjectList<U>>) | undefined,
    previous: itemExternalList.previous as (() => Promise<ObjectList<U>>) | undefined,
    first: itemExternalList.first as (() => Promise<ObjectList<U>>) | undefined,
    last: itemExternalList.last as (() => Promise<ObjectList<U>>) | undefined,
  }));