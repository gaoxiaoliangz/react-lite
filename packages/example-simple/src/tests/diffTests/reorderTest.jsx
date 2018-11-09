export default React => {
  return class ReorderTest extends React.Component {
    state = {
      orderFlag: false,
    }

    render() {
      const { orderFlag } = this.state
      const items = [<div className="green" key="0">0</div>, <div key="1">1</div>]
      return (
        <div>
          <div>
            <button
              onClick={() => {
                this.setState({
                  orderFlag: !orderFlag,
                })
              }}
            >
              toggle order
            </button>
          </div>
          {(orderFlag ? [0, 1] : [1, 0]).map(order => {
            return items[order]
          })}
          <div>2</div>
        </div>
      )
    }
  }
}
