import section from '../section'

export default React => {
  const Section = section(React)
  const RenderPrimitiveTest = () => {
    const list = [0, 1, undefined, null, true, false, []]
    return (
      <Section title="render primitive">
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
      </Section>
    )
  }
  return RenderPrimitiveTest
}
