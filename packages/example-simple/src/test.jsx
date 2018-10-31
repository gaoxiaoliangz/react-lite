export default React => {
  // util components
  const Section = ({ title, children }) => {
    return (
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    )
  }

  return () => (
    <div>
      <Section title="render all kinds of stuff">test</Section>
    </div>
  )
}
