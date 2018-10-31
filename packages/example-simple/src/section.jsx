export default React => {
  const Section = ({ title, children }) => {
    return (
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    )
  }
  return Section
}
