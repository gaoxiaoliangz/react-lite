function createE(type, props) {
  return {
    type,
    props
  }
}


function compA() {
  return [
    createE('a', 'b'),
    createE('a', 'b')
  ]
}

const evaled = compA()
const evaled2 = compA()

const ele1 = evaled[0]

console.log(evaled[0] === ele1)
