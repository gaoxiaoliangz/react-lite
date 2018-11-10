export default React => {
  const useState = React.useState
  const UseStateTest = () => {
    const [clicks, setClicks] = useState(0)

    return (
      <div>
        clicks: {clicks}
        <button onClick={() => setClicks(clicks + 1)}>update clicks</button>
      </div>
    )
  }
  return UseStateTest
}
