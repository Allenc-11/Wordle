document.addEventListener("DOMContentLoaded", () => {
  createSquares();

  let guessedWords = [[]];
  let availableSpece = 1;

  let word;
  fetch("https://random-word-api.herokuapp.com/word?number=1&length=5")
    .then((response) => response.json())
    .then((data) => {
      word = data[0]; // Store the word in a variable
    })
    .catch((error) => console.error("Error fetching the word:", error));

  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".keyboard-row button");

  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);

      const availableSpeceEl = document.getElementById(String(availableSpece));
      availableSpece = availableSpece + 1;

      availableSpeceEl.textContent = letter;
    }
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58,58,60)";
    }

    const letterInThatPostion = word.charAt(index);
    const isCorrectPostion = letter === letterInThatPostion;

    if (isCorrectPostion) {
      return "rgb(83,141,78)";
    }

    return "rgb(181,159,59)";
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters");
      return;
    }

    const currenWord = currentWordArr.join("");

    const firstLetterId = guessedWordCount * 5 + 1;
    const interval = 200;
    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = getTileColor(letter, index);

        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(letterId);
        letterEl.classList.add("animate__flipInX");
        letterEl.style = `background-color: ${tileColor}; border-color:${tileColor};`;
      }, interval * index);
    });

    const totalAnimationTime = interval * currentWordArr.length;

    setTimeout(() => {
      if (currenWord === word) {
        window.alert("Congratulations");
      } else if (guessedWords.length === 6) {
        window.alert(`Sorry, you lost, the word is ${word}.`);
      }
      guessedWords.push([]);
    }, totalAnimationTime);
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    const removedLetter = currentWordArr.pop();

    guessedWords[guessedWords.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpece - 1));

    lastLetterEl.textContent = "";

    availableSpece = availableSpece - 1;
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");

      if (letter == "enter") {
        handleSubmitWord();
        return;
      }

      if (letter == "del") {
        handleDeleteLetter();
        return;
      }

      updateGuessedWords(letter);
    };
  }
});
