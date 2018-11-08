import _ from 'lodash'
import './reconcileTest.css'

export default React => {
  // const ItemA = () => <div>itemA</div>
  // const ItemB = () => <div>itemB</div>

  class ReconcileTest extends React.Component {
    state = {
      clicks: 0,
      orderFlag: true,
      hasLeadingEle: false,
    }

    componentDidMount() {
      this.flag.setAttribute('class', 'box bg-green')
      this.itemA.setAttribute('class', 'green')
    }

    updateClicks = clicks => {
      this.setState({
        clicks,
      })
    }

    reorder = () => {
      this.setState({
        orderFlag: !this.state.orderFlag,
      })
    }

    render() {
      const { clicks, orderFlag, hasLeadingEle } = this.state
      // const itemA = <ItemA ref={ref => (this.itemA = ref)} />
      // const itemB = <ItemB />

      const itemA = <div ref={ref => (this.itemA = ref)}>itemA</div>
      const itemB = <div>itemB</div>
      // const itemA = <div ref={ref => (this.itemA = ref)}>itemA</div>
      // const itemB = <span>itemB</span>
      return (
        <div>
          <div>
            <button
              onClick={() => {
                this.setState({
                  hasLeadingEle: !hasLeadingEle,
                })
              }}
            >
              toggle leading ele
            </button>
            <button onClick={this.reorder}>change order</button>
          </div>
          <div className="reconcileTest">
            {hasLeadingEle && <div>leading ele</div>}
            <div className="box bg-red" ref={ref => (this.flag = ref)} />
            <button onClick={() => this.updateClicks(clicks - 1)}>-</button>
            {clicks}
            <button onClick={() => this.updateClicks(clicks + 1)}>+</button>
            {_.times(3, n => {
              return <div key={n}>{n}</div>
            })}
            {orderFlag ? itemA : itemB}
            {!orderFlag ? itemA : itemB}
          </div>
        </div>
      )
    }
  }
  return ReconcileTest
}
