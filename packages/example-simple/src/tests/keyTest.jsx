import _ from 'lodash'

export default React => {
  const Item = props => {
    return <div>item {props.label}</div>
  }

  // class Item extends React.Component {
  //   render() {
  //     return <div>item {this.props.label}</div>
  //   }
  // }

  const KeyTest = () => {
    return (
      <div>
        {_.times(3, n => {
          return (
            <Item
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
