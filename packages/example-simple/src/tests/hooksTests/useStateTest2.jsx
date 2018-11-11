export default React => {
  const useState = React.useState
  const UseStateTest2 = () => {
    const [clicks, setClicks] = useState(0)
    const [clicks2, setClicks2] = useState(0)
    const ele = (
      <div>
        <div>
          clicks: {clicks}
          <button onClick={() => setClicks(clicks + 1)}>update clicks</button>
        </div>
        <div>
          clicks2: {clicks2}
          <button onClick={() => setClicks2(clicks2 + 1)}>update clicks</button>
        </div>
      </div>
    )
    return ele
  }
  return UseStateTest2
}
