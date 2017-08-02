function main() {
  let context

  // game state
  let px = 200
  let py = 200
  let xv = 0
  let yv = 0
  const gravity = 0.5
  let onGround = false
  const plat = []
  let holdLeft = false
  let holdRight = false

  init()

  function init() {
    const canvas = document.getElementById("canvas")
    context = canvas.getContext('2d')
    setInterval(updateFrame, 1000 / 30)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    for (let i = 0; i < 50; i++) {
      plat.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        w: Math.random() * 100 + 30,
        h: Math.random() * 30 + 20
      })
    }
  }

  function updateFrame() {
    if (holdLeft) {
      xv = -2
    }
    if (holdRight) {
      xv = 2
    }
    px += xv
    py += yv


    if (onGround) {
      xv *= 0.8
    } else {
      yv += gravity
    }

    onGround = false
    for (let i = 0; i < 50; i++) {
      if (px > plat[i].x && px < plat[i].x + plat[i].w && py > plat[i].y && py < plat[i].y + plat[i].h) {
        onGround = true
        vy = 0
        py = plat[i].y
      }
    }

    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = 'white'

    // place player
    context.fillRect(px - 5, py - 20, 10, 20)

    // place plats
    for (let i = 0; i < 50; i++) {
      context.fillRect(plat[i].x, plat[i].y, plat[i].w, plat[i].h)
    }
  }

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowUp':
        if (onGround) {
          yv = -10
        }
        break

      case 'ArrowLeft':
        holdLeft = true
        break

      case 'ArrowRight':
        holdRight = true
        break
    }
  }

  function handleKeyUp(e) {
    switch (e.key) {
      case 'ArrowUp':
        if (yv < -3) {
          yv = -3
        }
        break

      case 'ArrowLeft':
        holdLeft = false
        break

      case 'ArrowRight':
        holdRight = false
        break
    }
  }
}

window.onload = main
