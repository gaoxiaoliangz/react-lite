import section from '../section'

// @ts-check
export default React => {
  const Section = section(React)

  class Inner extends React.Component {
    componentDidMount() {
      console.log('Inner mount')
    }

    render() {
      return (
        <div>
          <div>inner</div>
          <InnerDeep />
        </div>
      )
    }
  }

  class InnerDeep extends React.Component {
    componentDidMount() {
      console.log('InnerDeep mount')
    }

    render() {
      return <div>inner deep</div>
    }
  }

  class LifecycleTest extends React.Component {
    componentDidMount() {
      console.log('LifecycleTest mount')
    }

    render() {
      return (
        <Section title="lifecycle test">
          <div>lifecycle</div>
          <Inner />
        </Section>
      )
    }
  }

  return LifecycleTest
}
