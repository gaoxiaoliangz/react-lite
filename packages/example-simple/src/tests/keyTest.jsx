import _ from 'lodash'

export default React => {
  // const Item = props => {
  //   console.log(props)
  //   return <div>item {props.label}</div>
  // }

  class Item2 extends React.Component {
    render() {
      console.log(this.props)
      return <div>item {this.props.label}</div>
    }
  }

  const KeyTest = () => {
    return (
      <div>
        {_.times(3, n => {
          return (
            <Item2
              ref={ref => {
                console.log('item2 ref', ref)
              }}
              key={n}
              label={n}
            />
          )
        })}
      </div>
    )
  }

  return KeyTest
}
