import section from '../section'
import './reconcileTest.css'

export default React => {
  const Section = section(React)
  class ReconcileTest extends React.Component {
    state = {
      clicks: 0,
    }

    componentDidMount() {
      this.flag.setAttribute('class', 'modified')
    }

    updateClicks = clicks => {
      this.setState({
        clicks,
      })
    }

    render() {
      const { clicks } = this.state
      return (
        <Section title="reconcile test">
          <div className="reconcileTest">
            <div ref={ref => (this.flag = ref)} />
            <button onClick={() => this.updateClicks(clicks - 1)}>-</button>
            {clicks}
            <button onClick={() => this.updateClicks(clicks + 1)}>+</button>
          </div>
        </Section>
      )
    }
  }
  return ReconcileTest
}
