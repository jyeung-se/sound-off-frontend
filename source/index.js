document.addEventListener('DOMContentLoaded', () => {

  const mainPlayArea = document.getElementById('main-play-area')
  const keyBoxContainer = document.getElementById('key-box-container')
  const keyBoxes = document.getElementsByClassName("key-box")
  const userLogin = document.getElementById("user-login")
  const userLoginInput = document.getElementById("user-login-input")
  const createNewUser = document.getElementById("create-new-user")
  const createNewUserInput = document.getElementById("create-new-user-input")
  const loggedInUserInfo = document.getElementById("display-user-info")

  let loggedInUser

  const usersUrl = "http://localhost:3000/api/v1/users"
  const createUserConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({name: createNewUserInput.value})}

  const scoresUrl = "http://localhost:3000/api/v1/scores"
  const scoresConfig = {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({total: 500, user_id: 1})}
  // fetch(scoresUrl, scoresConfig).then(res => res.json()).then(console.log)

  userLogin.addEventListener("submit", event => logInUser(event))
  createNewUser.addEventListener("submit", event => createUser(event))


  fetch(usersUrl).then(res => res.json()).then(createUserDropdown)
  function createUserDropdown(data) {
    data.forEach(user => {
      userLoginInput.innerHTML += `<option value="${user.id}">${user.name}</option>`
    })
  }


  function logInUser(event) {
    event.preventDefault()
    fetch(usersUrl + "/" + userLoginInput.value).then(res => res.json()).then(displayLoggedInUser)
    userLogin.style.display = 'none'
    createNewUser.style.display = 'none'
    keyBoxContainer.style.display = 'block'
  }

  function displayLoggedInUser(user) {
    loggedInUserInfo.innerHTML = `<h3>Player: ${user.name}</h3>`
    getUserHighScore(user)
    if (user.scores.length > 0) {
      let highScore = getUserHighScore(user)
      loggedInUserInfo.innerHTML += `<h4>High Score: ${highScore}</h4>`
    }
  }

  function getUserHighScore(user) {
    let scores = user.scores.map(score => score.total)
    return scores.sort((a, b) => b - a)[0]
  }

  function createUser(event) {
    event.preventDefault()
    console.log(createNewUserInput.value)
  }

  function randomlyLightUpKey() {
    let keyBoxNumber = Math.ceil((Math.random() * keyBoxes.length) )
    let boxToHighlight = document.getElementById(`key-box-${keyBoxNumber}`)
    // console.log(`key-box-${keyBoxNumber}`);
    boxToHighlight.classList.remove('key-box')
    boxToHighlight.classList.add('lit-up-box')
    // console.log(boxToHighlight.innerText);
    // checkKey(boxToHighlight)
    setTimeout(() => {
      // boxToHighlight.classList.remove('lit-up-box')
      // boxToHighlight.classList.add('key-box')
      if (Array.from(boxToHighlight.classList).includes("lit-up-box")) {
        continueGame = false;
      }
    }, 1950)
    setTimeout(() => {}, 50)
  }

  let continueGame = true

  function playGame() {
    let gameInterval = setInterval(() => {
      if (continueGame === true) {
        randomlyLightUpKey()
      } else {
        clearInterval(gameInterval)
        alert('game over man')
      }
    }, 2000)
    checkKey()
  }

  let score = 0

  function checkKey() {
    window.addEventListener("keydown", (e) => {
      e.preventDefault()
      let highlightedBox
      if (document.querySelector(".lit-up-box")) {
        highlightedBox = document.querySelector(".lit-up-box")
        if (e.key.toUpperCase() === highlightedBox.innerText[0]) {
          correctKeyPressed(highlightedBox)
        } else {
          wrongKeyPressed(highlightedBox)
          continueGame = false
        }
      }
    })
  }

  function correctKeyPressed(highlightedBox) {
    highlightedBox.classList.remove('lit-up-box')
    highlightedBox.classList.add('correct-key')
    setTimeout(() => {
      highlightedBox.classList.remove('correct-key')
      highlightedBox.classList.add('key-box')
    }, 100)
    score += 10
    console.log(score)
    // implement score here
  }


  function wrongKeyPressed(highlightedBox) {
    highlightedBox.classList.remove('lit-up-box')
    highlightedBox.classList.add('incorrect-key')
    setTimeout(() => {
      highlightedBox.classList.remove('incorrect-key')
      highlightedBox.classList.add('key-box')
    }, 100)
  }



  // playGame()

})
