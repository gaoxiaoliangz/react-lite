export default (React, Component) => {
  class Abc extends Component {
    constructor(props) {
      super(props)
      this.state = {
        clicked: false
      }
    }

    handleClick() {
      this.setState({
        clicked: true
      })
    }

    render() {
      return <div onClick={this.handleClick.bind(this)}>
        {this.state.clicked ? 'clicked' : 'not clicked'}
      </div>
    }
  }


  const App = () => {
    return (
      <ul className="ul" abc="1212">
        <Abc />
        <li>2</li>
      </ul>
    )
  }

  return App
}
