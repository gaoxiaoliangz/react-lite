const parseQuery = queryStr =>
  queryStr.split('&').reduce((obj, part) => {
    const [key, val] = part.split('=')
    return {
      ...obj,
      [key]: val,
    }
  }, {})

export default parseQuery
