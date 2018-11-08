export default React => {
  const RenderPrimitiveTest = () => {
    const list = [0, 1, undefined, null, true, false, []]
    return (
      <div>
        {list.map((item, idx) => {
          return (
            <p key={idx}>
              <span>{'' + item}: </span>
              <span>{item}</span>
            </p>
          )
        })}
      </div>
    )
  }
  return RenderPrimitiveTest
}
