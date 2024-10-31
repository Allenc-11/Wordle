document.addEventListener("DOMContentLoaded", () => {
  createSquares();

  let guessedWords = [[]];
  let availableSpace = 1;

  let word;
  fetch("https://random-word-api.herokuapp.com/word?number=1&length=5")
    .then((response) => {
      if (response.ok) return response.json();
      else window.alert("Failed to fetch Data");
    })
    .then((data) => {
      word = data[0]; // Store the word in a variable
      console.log(word);
    });

  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".keyboard-row button");

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

  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));
      availableSpace = availableSpace + 1;

      availableSpaceEl.textContent = letter;
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

  async function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters");
      return;
    }
    const currentWord = currentWordArr.join("");
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`);
    if (!response.ok) {
      window.alert(`'${currentWord}' is NOT a word.'`);
      return;
    }
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

    guessedWordCount += 1;

    const totalAnimationTime = interval * currentWordArr.length;

    setTimeout(() => {
      if (currentWord === word) {
        window.alert("Congratulations");
      } else if (guessedWords.length > 6) {
        window.alert(`Sorry, you lost, the word is '${word}'.`);
      }
    }, totalAnimationTime);

    guessedWords.push([]);
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    const removedLetter = currentWordArr.pop();
    if (removedLetter !== undefined) {
      guessedWords[guessedWords.length - 1] = currentWordArr;

      const lastLetterEl = document.getElementById(String(availableSpace - 1));

      lastLetterEl.textContent = "";

      availableSpace = availableSpace - 1;
    } else {
      window.alert("Please Enter a Letter");
    }
  }

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "enter") {
      handleSubmitWord();
    } else if (key === "backspace") {
      handleDeleteLetter();
    } else if (key.length === 1 && key >= "a" && key <= "z") {
      updateGuessedWords(key);
    }
  });

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
