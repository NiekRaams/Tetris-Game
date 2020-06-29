
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

  //drop the vormpies down every second
  timerId = setInterval(moveDown, 1000)


  //draw the vorm 
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('vorm')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //undraw the vorm
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('vorm')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }


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
      addScore()
      gameOver()
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

  ///FIX ROTATION OF THE VORMPIES A THE EDGE 
  function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % width === 0)
  }

  function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0)
  }

  function checkRotatedPosition(P) {
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()) {            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
      }
    }
    else if (P % width > 5) {
      if (isAtLeft()) {
        currentPosition -= 1
        checkRotatedPosition(P)
      }
    }
  }

  //rotate the vormpies
  function rotate() {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = vormpies[random][currentRotation]
    checkRotatedPosition()
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
    //remove any trace of ('vorm form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('vorm')
      square.style.backgroundColor = ''
    })
    upNextVormpies[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('vorm')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //button function
  StartBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * vormpies.length)
      displayShape()
    }
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        ScoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('vorm')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      ScoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

})
