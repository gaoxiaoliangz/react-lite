function main() {
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')

  // game env
  const gravity = 1.2
  const obstacleGap = 380
  const obstacleWidth = 60
  const obstacleVerGap = 120

  // game state
  let bgVX = -5
  let ganmeOver = false
  let obstacles = []

  const box = {
    x: canvas.width * 0.3,
    y: canvas.height * 0.5,
    vx: 0,
    vy: 0,
    w: 50,
    h: 50
  }

  init()

  function makeObstacle(x) {
    const pos = 0.2 + Math.random() * 0.6
    const w = obstacleWidth
    const verGap = obstacleVerGap
    const topH = canvas.height * pos

    const top = {
      h: topH,
      w,
      x,
      y: 0
    }
    const bottom = {
      h: canvas.height - topH - verGap,
      w,
      x,
      y: topH + verGap
    }
    return { top, bottom }
  }

  function init() {
    setInterval(updateFrame, 1000 / 30)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    for (let i = 0; i < 10; i++) {
      obstacles.push(makeObstacle(i * obstacleGap + canvas.width * 0.5))
    }
  }

  function isOverlab(a, b) {
    return a.x > b.x && a.x < b.x + b.w && a.y > b.y && a.y < b.y + b.h
  }

  function updateFrame() {
    // game over
    if (ganmeOver) {
      bgVX = 0
    } else {
      // update bird position
      box.x += box.vx
      box.y += box.vy

      box.vy += gravity
    }

    // fill bg
    context.fillStyle = 'gray'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // place bird
    context.fillStyle = 'white'
    context.fillRect(box.x, box.y, box.w, box.h)

    // place obstacles
    obstacles.forEach((obstacle, index) => {
      context.fillRect(obstacle.top.x, obstacle.top.y, obstacle.top.w, obstacle.top.h)
      context.fillRect(obstacle.bottom.x, obstacle.bottom.y, obstacle.bottom.w, obstacle.bottom.h)

      // determine if game is over
      if (isOverlab(box, obstacle.top) || isOverlab(box, obstacle.bottom)) {
        ganmeOver = true
      }

      obstacles[index].bottom.x += bgVX
      obstacles[index].top.x += bgVX
    })

    // add obstacle
    const obstaclesCount = obstacles.length
    const lastObstacle = obstacles[obstaclesCount - 1]
    const maxObsCount = Math.round(canvas.width / (obstacleWidth + obstacleGap)) + 2
    if (lastObstacle.top.x + obstacleWidth <= 800 && obstaclesCount <= maxObsCount) {
      obstacles.push(makeObstacle(lastObstacle.top.x + obstacleGap))
    }

    // release off-screen obstacles
    obstacles = obstacles.filter(obs => {
      return obs.top.x + obstacleWidth > 0
    })
  }

  function handleKeyDown(e) {
    if (e.key === ' ') {
      box.vy = -12
    }
  }

  function handleKeyUp(e) {
  }
}

window.onload = main
