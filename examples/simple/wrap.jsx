const wrap = (props) => {
  return (
    <div>
      <span>You are wrapped</span>
      {props.children}
    </div>
  )
}

export default wrap
