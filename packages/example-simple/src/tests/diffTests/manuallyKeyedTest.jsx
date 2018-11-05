import _ from 'lodash'
import section from '../../section'

export default React => {
  const Section = section(React)
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
        <Section title="manually keyed test">
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
        </Section>
      )
    }
  }
  return ReconcileTest2
}
