export const getIdFromUrl = () => {
  const route = window.location.href;
  const routeArr = route.split('/');
  return routeArr[routeArr.length - 1];
};

export const getSourcecodeUrl = () => window.location.href;

export const getBaseUrl = () => window.location.origin;

export const updateUrl = (res: any, ownerId: string) => {
  const location = window.location.href;
  const href = `${location}${ownerId}/${res.id}`;
  var base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);

  //Change to new page with hash
  var newPage = window.location.href + '#' + href.replace(base, '');
  window.location.href = newPage;

  //Remove hash from URL and replace with desired URL
  if (window.history && window.history.pushState) {
    //Only do this if history.pushState is supported by the browser
    window.history.pushState({}, '', href);
  }
};
