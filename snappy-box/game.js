function main() {
  const canvas = document.getElementById('canvas')
  const context = canvas.getContext('2d')

  // game env
  const gravity = 1.2
  const bgVX = -10
  const obstacleGap = 80
  const obstacleWidth = 30

  // game state
  let ganmeOver = false
  let obstacles = []

  const box = {
    x: canvas.width * 0.3,
    y: canvas.height * 0.5,
    vx: 0,
    vy: 0
  }

  init()

  function makeObstacle(pos, x) {
    const w = obstacleWidth
    const gap = 30
    const topH = canvas.height * pos

    const top = {
      h: topH,
      w,
      x,
      y: 0
    }
    const bottom = {
      h: canvas.height - topH - gap,
      w,
      x,
      y: topH + gap
    }
    return { top, bottom }
  }

  function init() {
    setInterval(updateFrame, 1000 / 30)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    for (let i = 0; i < 10; i++) {
      obstacles.push(makeObstacle(Math.random(), i * obstacleGap + canvas.width * 0.5))
    }
  }

  function updateFrame() {
    // update bird position
    box.x += box.vx
    box.y += box.vy

    box.vy += gravity

    // fill bg
    context.fillStyle = 'gray'
    context.fillRect(0, 0, canvas.width, canvas.height)

    // place bird
    context.fillStyle = 'white'
    context.fillRect(box.x, box.y, 20, 20)

    // place obstacles
    obstacles.forEach((obstacle, index) => {
      context.fillRect(obstacle.top.x, obstacle.top.y, obstacle.top.w, obstacle.top.h)
      context.fillRect(obstacle.bottom.x, obstacle.bottom.y, obstacle.bottom.w, obstacle.bottom.h)

      obstacles[index].bottom.x += bgVX
      obstacles[index].top.x += bgVX
    })

    const obstaclesCount = obstacles.length
    const lastObstacle = obstacles[obstaclesCount - 1]
    const maxObsCount = Math.round(canvas.width / (obstacleWidth + obstacleGap)) + 2
    if (lastObstacle.top.x + obstacleWidth <= 800 && obstaclesCount <= maxObsCount) {
      obstacles.push(makeObstacle(Math.random(), lastObstacle.top.x + obstacleGap))
    }

    // release off-screen obstacles
    obstacles = obstacles.filter(obs => {
      return obs.top.x + obstacleWidth > 0
    })
  }

  function handleKeyDown(e) {
    if (e.key === ' ') {
      box.vy = -10
    }
  }

  function handleKeyUp(e) {
  }
}

window.onload = main
