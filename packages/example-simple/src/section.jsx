export default React => {
  const Section = ({ title, children }) => {
    return (
      <div className="test-container">
        <h3>{title}</h3>
        {children}
      </div>
    )
  }
  return Section
}
