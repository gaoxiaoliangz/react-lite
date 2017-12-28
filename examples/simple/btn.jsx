import Wrap from './wrap'

export default (props) => {
  return (
    <Wrap>
      <div>{props.children}</div>
    </Wrap>
  )
}
