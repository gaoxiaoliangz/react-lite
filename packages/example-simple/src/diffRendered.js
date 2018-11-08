const slice = (arr, start, end) => {
  return arr.slice(start < 0 ? 0 : start, end)
}

const diffRendered = (html1, html2) => {
  const chars1 = Array.from(html1)
  const chars2 = Array.from(html2)

  let differentIdx = -1

  for (let i = 0; i < chars1.length; i++) {
    if (chars1[i] !== chars2[i]) {
      differentIdx = i
      break
    }
  }

  if (differentIdx === -1) {
    return null
  }
  const range = 50

  return [
    slice(chars1, differentIdx - range, differentIdx + range).join(''),
    slice(chars2, differentIdx - range, differentIdx + range).join(''),
  ]
}

export default diffRendered
