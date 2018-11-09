import _ from 'lodash'

export default React => {
  class ReconcileTest2 extends React.Component {
    state = {
      showFirst: false,
    }

    componentDidMount() {
      this.item.setAttribute('class', 'green')
    }

    updateClicks = clicks => {
      this.setState({
        clicks,
      })
    }

    render() {
      const { showFirst } = this.state
      return (
        <div>
          <div>
            <button
              onClick={() => {
                this.setState({
                  showFirst: !showFirst,
                })
              }}
            >
              toggle first
            </button>
          </div>
          <ul>
            {_.times(3, n => {
              if (n === 0 && !showFirst) {
                return null
              }
              return (
                <li
                  key={n}
                  className={`i-${n}`}
                  ref={ref => {
                    if (n === 1) {
                      this.item = ref
                    }
                  }}
                >
                  {n}
                </li>
              )
            }).filter(Boolean)}
          </ul>
        </div>
      )
    }
  }
  return ReconcileTest2
}
