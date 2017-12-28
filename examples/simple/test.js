export default (React, Component, isFb = false) => {
  const container = () => {
    class Abc extends Component {
      constructor(props) {
        super(props)
        console.log('Abc constructor called')
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
          <p>{this.props.label}</p>
          {this.state.clicked ? 'clicked' : 'not clicked'}
        </div>
      }
    }
  
  
    const App = () => {
      return (
        <ul className="ul" abc="1212">
          <Abc label="this is a label" />
          <li>2</li>
        </ul>
      )
    }
  
    const App2 = () => {
      return <Abc label="this is a label"/>
    }
  
    const App3 = () => {
      return <ul>
        <li>1</li>
        <li>2</li>
      </ul>
    }
  
    return App3
  }

  const beforeRun = () => {
    const App = container()
    console.log('---', isFb ? 'fb here' : 'my own', '---')
    console.log('App children', App().props.children)
    console.log('App inside', App())
    return App
  }

  return beforeRun()
}
