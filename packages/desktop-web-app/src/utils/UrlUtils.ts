export const getSourceCodeIdFromUrl = () => {
  const route = window.location.href;
  const routeArr = route.split("/");
  return routeArr[routeArr.length - 1];
};

export const getSourcecodeUrl = () => window.location.href;

export const getBaseUrl = () => window.location.origin;

export const updateUrl = (res: any, ownerId: string) => {
  const location = window.location.origin;
  const href = `${location}/${ownerId}/${res.id}`;
  window.location.href = href;
};
