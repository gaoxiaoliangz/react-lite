export default React => {
  const useState = React.useState
  const UseStateTest = () => {
    const [clicks, setClicks] = useState(0)
    const ele = (
      <div>
        clicks: {clicks}
        <button onClick={() => setClicks(clicks + 1)}>update clicks</button>
      </div>
    )
    return ele
  }
  return UseStateTest
}
