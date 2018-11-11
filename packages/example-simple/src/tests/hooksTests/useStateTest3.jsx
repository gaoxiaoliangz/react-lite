export default React => {
  const useState = React.useState
  const UseStateTest2 = () => {
    const [clicks, setClicks] = useState(0)
    const ele = (
      <div>
        clicks: {clicks}
        <button onClick={() => setClicks(clicks + 1)}>update clicks</button>
      </div>
    )
    return ele
  }

  return class UseStateTest3 extends React.Component {
    state = {}
    render() {
      return (
        <div>
          <button onClick={() => this.setState({})}>force update</button>
          <UseStateTest2 />
        </div>
      )
    }
  }
}
