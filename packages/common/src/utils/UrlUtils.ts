export const getSourceCodeIdFromUrl = (): string => {
  const route = window.location.href;
  const routeArr = route.split("/");
  return routeArr[routeArr.length - 1];
};

export const getSourcecodeUrl = (): string => window.location.href;

export const getBaseUrl = (): string => window.location.origin;

export const updateUrl = (res: any, ownerId: string): void => {
  const location = window.location.origin;
  const href = `${location}/${ownerId}/${res.id}`;
  window.location.href = href;
};
