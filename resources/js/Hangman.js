class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }

    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }
  getRandomWord(difficulty) {
    return fetch(
      `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    )
      .then((r) => r.json())
      .then((r) => r.word);
  }
  async start(difficulty, next) {
    this.word = await this.getRandomWord(difficulty);
    sessionStorage.setItem("Word", this.word);
    this.clearCanvas();
    this.drawBase();
    this.guesses = [];
    this.isOver = false;
    this.didWin = false;
    next();
  }
  guess(letter) {
    if (letter === "") {
      alert("You must provide a letter - Input can not be null");
      throw Error("You must provide a letter - Input can not be null");
    }
    if (!/^[a-zA-Z]*$/g.test(letter)) {
      alert(`You must provide a letter - "${letter}" is not a valid input`);
      throw Error(
        `You must provide a letter - "${letter}" is not a valid input`
      );
    }
    if (letter.length > 1) {
      alert(`Must provide ONE letter - "${letter}" is not a valid input`);
      throw Error(`Must provide ONE letter - "${letter}" is not a valid input`);
    }
    letter = letter.toLowerCase();
    if (!this.guesses.includes(letter)) {
      this.guesses.push(letter);
    } else {
      throw Error(`${letter} has been guessed already`);
    }
    if (this.word.includes(letter)) {
      this.checkWin();
    } else {
      this.onWrongGuess();
    }
  }

  checkWin() {
    let remainingUnknowns = this.word.length;
    for (let i = 0; i < this.guesses.length; i++) {
      for (let j = 0; j < this.word.length; j++) {
        if (this.word.charAt(j) == this.guesses[i]) {
          remainingUnknowns--;
        }
      }
    }
    if (remainingUnknowns === 0) {
      this.isOver = true;
      this.didWin = true;
    }
  }
  onWrongGuess() {
    let wrongGuesses = 0;
    for (let i = 0; i < this.guesses.length; i++) {
      if (!this.word.includes(this.guesses[i])) {
        wrongGuesses++;
      }
    }
    if (wrongGuesses === 1) {
      this.drawHead();
    } else if (wrongGuesses === 2) {
      this.drawBody();
    } else if (wrongGuesses === 3) {
      this.drawLeftArm();
    } else if (wrongGuesses === 4) {
      this.drawRightArm();
    } else if (wrongGuesses === 5) {
      this.drawLeftLeg();
    } else if (wrongGuesses === 6) {
      this.drawRightLeg();
      this.isOver = true;
      this.didWin = false;
    }
  }
  getWordHolderText() {
    let placeholder = "";
    for (let i = 0; i < this.word.length; i++) {
      if (this.guesses.includes(this.word[i]) === true) {
        placeholder += `${this.word[i]}`;
      } else {
        placeholder += "_ ";
      }
    }
    return placeholder.toUpperCase();
  }
  getGuessesText() {
    return `Letters Guessed:<br/>${this.guesses.join("   ").toUpperCase()}`;
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10);
    this.ctx.fillRect(245, 10, 10, 50);
    this.ctx.fillRect(95, 10, 10, 400);
    this.ctx.fillRect(10, 410, 175, 10);
  }

  drawHead() {
    this.ctx.beginPath();
    this.ctx.arc(250, 95, 35, 0, Math.PI * 2, false);
    this.ctx.stroke();
  }

  drawBody() {
    this.ctx.beginPath();
    this.ctx.fillRect(249, 130, 2, 125);
    this.ctx.stroke();
  }

  drawLeftArm() {
    this.ctx.fillRect(185, 160, 65, 2);
  }

  drawRightArm() {
    this.ctx.fillRect(251, 160, 65, 2);
  }

  drawLeftLeg() {
    this.ctx.fillRect(185, 253, 65, 2);
  }

  drawRightLeg() {
    this.ctx.fillRect(251, 253, 65, 2);
  }
}
