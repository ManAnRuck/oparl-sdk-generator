import * as Type from "@repo/types/index";

const addPagination = <T = Body>(
  data: Type.ObjectList<T>
): Type.ObjectList<T> => {
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
  async (): Promise<Type.ObjectList<T>> => {
    const response = await fetch(url);
    const data = await response.json();
    return addPagination(data);
  };

export const fetchPage = async <T = Body>(url: string): Promise<T> => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
