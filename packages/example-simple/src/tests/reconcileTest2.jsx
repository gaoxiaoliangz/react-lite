import _ from 'lodash'
import section from '../section'
import './reconcileTest.css'

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
      const stuff = (
        <div>
          {showFirst ? (
            <div>
              <div>
                <div>0</div>
              </div>
            </div>
          ) : null}
          <div>
            <div>
              <div>1</div>
            </div>
          </div>
          <div>
            <div>
              <div>2</div>
            </div>
          </div>
        </div>
      )
      console.log(stuff)
      return (
        <Section title="reconcile test">
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
          {showFirst ? (
            <div>
              <div>0</div>
              <div>1</div>
              <div>2</div>
            </div>
          ) : (
            <div>
              <div>1</div>
              <div>2</div>
            </div>
          )}
          <hr />
          {showFirst ? (
            <div>
              <div>0</div>
              <div>1</div>
              <div>2</div>
            </div>
          ) : (
            <div>
              <div>1</div>
              <div>2</div>
            </div>
          )}
          {stuff}
          <ul>
            {_.times(3, n => {
              if (n === 0 && !showFirst) {
                return null
              }
              return (
                <li
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
