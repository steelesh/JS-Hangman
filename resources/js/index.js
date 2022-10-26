const startWrapper = document.getElementById(`startWrapper`);
const difficultySelectForm = document.getElementById(`difficultySelect`);
const difficultySelect = document.getElementById(`difficulty`);
const gameWrapper = document.getElementById(`gameWrapper`);
const guessesText = document.getElementById(`guesses`);
const wordHolderText = document.getElementById(`wordHolder`);
const guessForm = document.getElementById(`guessForm`);
const guessInput = document.getElementById(`guessInput`);
const guessButton = document.getElementById(`guessSubmitButton`);
const resetGame = document.getElementById(`resetGame`);
let canvas = document.getElementById(`hangmanCanvas`);
const nameInput = document.getElementById(`my-name-input`);
const saveNameForm = document.getElementById(`nameInput`);
const saveNameBtn = document.getElementById(`save`);
const startGameBtn = document.getElementById(`start`);
const resetInfoBtn = document.getElementById(`reset`);
const exitGameBtn = document.getElementById(`exitGame`);
const ApiInfo = document.getElementById(`echoApiInfo`);

try {
  const game = new Hangman(canvas);
  startWrapper.style.display = 'block';
  gameWrapper.style.display = 'none';

  $(nameInput).keyup(function () {
    if ($(this).val().length != 0) {
      saveNameBtn.disabled = false;
      resetInfoBtn.disabled = false;
    } else {
      saveNameBtn.disabled = true;
      resetInfoBtn.disabled = true;
    }
  });

  $(guessInput).keyup(function () {
    if ($(this).val().length != 0) {
      guessButton.disabled = false;
    } else {
      guessButton.disabled = true;
    }
  });
  saveNameBtn.addEventListener(`click`, function (event) {
    if (nameInput.value === '') {
      alert(`User must enter a name`);
      throw Error(`User must enter a name`);
    } else if (!/^[A-Za-z\s]*$/.test(nameInput.value)) {
      alert(`Must be a valid name - "${nameInput.value}" is not a valid input`);
      throw Error(
        `Must be a valid name - "${nameInput.value}" is not a valid input`
      );
    } else {
      sessionStorage.setItem('Name', nameInput.value);
      nameInput.innerHTML = sessionStorage.getItem('Name');
      saveNameBtn.value = 'Saved!';
      difficultySelect.disabled = false;
      difficultySelect.focus();
      $(nameInput).keyup(function () {
        if ($(this).val() == `${sessionStorage.getItem('Name')}`) {
          saveNameBtn.value = 'Saved!';
          saveNameBtn.disabled = true;
          difficultySelect.disabled = false;
        } else if (
          $(this).val().length != 0 &&
          $(this).val().value !== `${sessionStorage.getItem('Name')}`
        ) {
          saveNameBtn.value = `Modify Current Name\n${sessionStorage.getItem(
            'Name'
          )} ⟶ ${$(this).val()}`;
          saveNameBtn.style.backgroundColor = '#FFC107';
          saveNameBtn.style.color = '#000';
          difficultySelect.value = 'Select Difficulty';
          difficultySelect.disabled = true;
          startGameBtn.disabled = true;
        } else {
          saveNameBtn.value = 'modify';
          saveNameBtn.disabled = true;
          saveNameBtn.style.backgroundColor = '#F5F5F5';
          saveNameBtn.border = '1px solid gray';
          saveNameBtn.style.color = 'gray';
          difficultySelect.value = 'Select Difficulty';
          difficultySelect.disabled = true;
          startGameBtn.disabled = true;
        }
      });
    }
    if ((saveNameBtn.value = 'Saved!')) {
      saveNameBtn.disabled = true;
    }
  });

  $(difficultySelect).change(function () {
    var theVal = $(this).val();
    switch (theVal) {
      case 'Select Difficulty':
        startGameBtn.disabled = true;
        break;
      case 'easy':
        startGameBtn.disabled = false;
        break;
      case 'medium':
        startGameBtn.disabled = false;
        break;
      case 'hard':
        startGameBtn.disabled = false;
        break;
    }
  });
  startGameBtn.addEventListener(`click`, function (event) {
    if (
      difficultySelect.selectedIndex === 0 &&
      sessionStorage.getItem('Name') == null
    ) {
      alert(`Must save a name AND choose a difficulty to start the game`);
      throw Error(`Must save a name AND choose a difficulty to start the game`);
    } else if (sessionStorage.getItem('Name') == null) {
      alert(`Must save a name to start the game`);
      throw Error(`Must save a name to start the game`);
    } else if (difficultySelect.selectedIndex === 0) {
      alert(`Must select a game difficulty`);
      throw Error(`Must select a game difficulty`);
    } else {
      sessionStorage.setItem('Difficulty', difficultySelect.value);
      event.preventDefault();
      let gameDifficulty = difficultySelect.value;
      game.start(gameDifficulty, function () {
        event.preventDefault();
        startWrapper.style.display = 'none';
        gameWrapper.style.display = 'block';
        wordHolderText.innerHTML = game.getWordHolderText();
        guessesText.innerHTML = game.getGuessesText();
        guessInput.focus();
      });
    }
  });
  resetInfoBtn.addEventListener(`click`, function (e) {
    e.preventDefault();
    location.reload();
  });
  guessForm.addEventListener(`submit`, function (e) {
    e.preventDefault();
    let input = guessInput.value;
    game.guess(input);
    wordHolderText.innerHTML = game.getWordHolderText();
    guessesText.innerHTML = game.getGuessesText();
    guessInput.value = '';
    if (game.isOver === true) {
      guessInput.placeholder = '';
      guessInput.disabled = true;
      guessButton.disabled = true;
      resetGame.style.display = 'block';
      exitGameBtn.style.width = '50%';
      if (game.didWin === true) {
        alert(
          `Congratulations! You won the game!\nYou guessed the word '${sessionStorage.getItem(
            'Word'
          )}' correctly`
        );
      } else {
        alert(
          `Sorry, you lost!\n'${sessionStorage.getItem(
            'Word'
          )}' was the word to guess!`
        );
      }
    }
  });
  resetGame.addEventListener(`click`, function (e) {
    e.preventDefault();
    guessInput.disabled = false;
    guessButton.disabled = false;
    nameInput.value = sessionStorage.getItem('Name');
    saveNameBtn.disabled = true;
    guessInput.placeholder = '';
    resetGame.style.display = 'none';
    exitGameBtn.style.width = '100%';
    let gameDifficulty = sessionStorage.getItem('Difficulty');
    game.start(gameDifficulty, function () {
      e.preventDefault();
      wordHolderText.innerHTML = game.getWordHolderText();
      guessesText.innerHTML = game.getGuessesText();
      guessInput.focus();
    });
  });
} catch (error) {
  console.error(error);
  alert(error);
}
window.onload = function () {
  sessionStorage.clear();
  difficultySelect.selectedIndex = 0;
  nameInput.value = '';
  saveNameBtn.value = 'Save';
  saveNameBtn.disabled = true;
  resetInfoBtn.disabled = true;
  startGameBtn.disabled = true;
  difficultySelect.selectedIndex = 0;
  difficultySelect.disabled = true;
  nameInput.value = '';
  guessInput.value = '';
  nameInput.focus();
};
function limitKeypress(event, value, maxLength) {
  if (value != undefined && value.toString().length >= maxLength) {
    event.preventDefault();
  }
}
guessInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    guessButton.click();
    event.target.blur();
    guessInput.focus();
  }
});
nameInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    saveNameBtn.click();
  }
});

exitGameBtn.addEventListener(`click`, function (e) {
  e.preventDefault();
  location.reload();
});
