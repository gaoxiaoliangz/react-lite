import invariant from 'invariant'

export default React => {
  const order = []
  class InnerDeep extends React.Component {
    componentDidMount() {
      order.push(0)
    }

    render() {
      return <div>inner deep</div>
    }
  }

  class Inner extends React.Component {
    componentDidMount() {
      order.push(1)
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
      order.push(2)
      invariant(order.join(',') === '0,1,2', 'order is wrong!')
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
