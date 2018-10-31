import section from './section'

export default React => {
  const Section = section(React)
  const App = () => (
    <div>
      <Section title="render all kinds of stuff">test</Section>
    </div>
  )
  return App
}
