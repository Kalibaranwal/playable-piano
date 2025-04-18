const pianoKeys = document.querySelectorAll(".piano-keys .key"),
    volumeSlider = document.querySelector(".volume-slider input"),
    keysCheckbox = document.querySelector(".keys-checkbox input"),
    learnBtn = document.getElementById("learnBtn"),
    songInput = document.getElementById("songInput"),
    searchSongBtn = document.getElementById("searchSong");

let allKeys = [],
    audio = new Audio();

const learnMelody = []; // This will be dynamically updated
let learnIndex = 0;
let learning = false;

// Mapping known songs to melodies
const songMelodies = {
    "twinkle twinkle little star": ['a', 'a', 'h', 'h', 'j', 'j', 'h', 'g', 'g', 'f', 'f', 'd', 'd', 'a'],
    "happy birthday": ['a', 'a', 's', 'a', 'f', 'd', 'a', 'a', 's', 'a', 'h', 'f'],
    "jingle bells": ['d', 'd', 'd', 'd', 'd', 'd', 'd', 'h', 'a', 's', 'd']
};

// Play a note
const playTune = (key) => {
    audio.src = `tunes/${key}.wav`;
    audio.play();

    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    if (clickedKey) {
        clickedKey.classList.add("active");
        setTimeout(() => clickedKey.classList.remove("active"), 150);
    }
};

// Highlight and play the next key
const highlightNextKey = () => {
    if (learnIndex >= learnMelody.length) {
        alert("🎉 Song Finished!");
        learning = false;
        learnBtn.textContent = "Start Learning";
        return;
    }

    const nextKey = learnMelody[learnIndex];
    const keyElement = document.querySelector(`[data-key="${nextKey}"]`);

    if (keyElement) {
        keyElement.classList.add("hint");
        setTimeout(() => keyElement.classList.remove("hint"), 500);
    }

    playTune(nextKey);
    learnIndex++;

    if (learning) {
        setTimeout(highlightNextKey, 1000);
    }
};

// Start/stop learn mode
learnBtn.addEventListener("click", () => {
    if (!learning && learnMelody.length > 0) {
        learnIndex = 0;
        learning = true;
        learnBtn.textContent = "Stop Learning";
        highlightNextKey();
    } else {
        learning = false;
        learnBtn.textContent = "Start Learning";
    }
});

// Listen for song input and play
searchSongBtn.addEventListener("click", () => {
    const songName = songInput.value.toLowerCase().trim();

    if (songMelodies[songName]) {
        learnMelody.length = 0;
        learnMelody.push(...songMelodies[songName]);
        learnIndex = 0;
        learning = true;
        learnBtn.textContent = "Stop Learning";
        highlightNextKey();
    } else {
        alert("❌ Song not found. Try 'twinkle twinkle little star', 'happy birthday', or 'jingle bells'");
    }
});

// Setup
pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key);
    key.addEventListener("click", () => playTune(key.dataset.key));
});

document.addEventListener("keydown", (e) => {
    if (allKeys.includes(e.key)) playTune(e.key);
});

volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
});

keysCheckbox.addEventListener("click", () => {
    pianoKeys.forEach(key => key.classList.toggle("hide"));
});
