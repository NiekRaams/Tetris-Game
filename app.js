
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const ScoreDisplay = document.querySelector('#score')
  const StartBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ]
  //Vormpies
  const Lvorm = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]
  const zvorm = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]
  const tvorm = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]
  const ovorm = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]
  const ivorm = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  //theTVormes = vormpies
  const vormpies = [Lvorm, ivorm, ovorm, zvorm, tvorm]
  let currentPosition = 4
  let currentRotation = 0

  //randomly generate a vormpie to make it hard ;)
  let random = Math.floor(Math.random() * vormpies.length)
  let current = vormpies[random][currentRotation]


  //draw the vorm 
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('vorm')
    })
  }

  //undraw the vorm
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('vorm')
    })
  }

  //drop the vormpies down every second
  timerId = setInterval(moveDown, 1000)

  //assign functions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a nieuw vorm falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * vormpies.length)
      current = vormpies[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
    }
  }
  //move the vormpie to the left , unless there is an edge or blockage
  function moveLeft() {
    undraw()
    const leftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!leftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  //move vormpies right, unless there is an edge or a blockage
  function moveRight() {
    undraw()
    const rightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!rightEdge) currentPosition += 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  //rotate the vormpies
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = vormpies[random][currentRotation]
    draw()

  }
  //show up-next vormpies in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0


  //the vormpies without rotations
  const upNextVormpies = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTVorm
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTVorm
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTVorm
    [0, 1, displayWidth, displayWidth + 1], //oTVorm
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTVorm
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a vorm from the entire grid 
    displaySquares.forEach(square => {
      square.classList.remove('vorm')

    })
    upNextVormpies[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('vorm')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

})
