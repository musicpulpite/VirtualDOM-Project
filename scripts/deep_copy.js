const deepCopy = (obj) => {
  // necessary condition because we are storing children in an array
  let copy = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj[key] != null && typeof(obj[key]) == "object")
      copy[key] = deepCopy(obj[key]);
    else
      copy[key] = obj[key];
  }

  return copy;
};
