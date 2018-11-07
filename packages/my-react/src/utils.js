export const alwaysArray = arrOrEle => {
  if (!_.isUndefined(arrOrEle)) {
    return Array.isArray(arrOrEle) ? arrOrEle : [arrOrEle]
  }
  return []
}
