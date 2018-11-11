import _ from 'lodash'

export default React => {
  // const Item = props => {
  //   return <div>item {props.label}</div>
  // }

  class Item extends React.Component {
    render() {
      return <div>item {this.props.label}</div>
    }
  }

  return class RefTest extends React.Component {
    render() {
      return (
        <div
          ref={ref => {
            console.log('dom ref', ref)
          }}
        >
          <button
            onClick={() => {
              this.setState({})
            }}
          >
            force update
          </button>
          {_.times(3, n => {
            return (
              <Item
                ref={ref => {
                  console.log('item ref', ref)
                }}
                key={n}
                label={n}
              />
            )
          })}
        </div>
      )
    }
  }
}
