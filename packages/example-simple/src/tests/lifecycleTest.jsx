export default React => {
  class InnerDeep extends React.Component {
    componentDidMount() {
      console.log('InnerDeep mount')
    }

    render() {
      return <div>inner deep</div>
    }
  }

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

  class LifecycleTest extends React.Component {
    componentDidMount() {
      console.log('LifecycleTest mount')
    }

    render() {
      return (
        <div>
          <div>lifecycle</div>
          <Inner />
        </div>
      )
    }
  }

  return LifecycleTest
}
