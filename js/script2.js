document.addEventListener("DOMContentLoaded", () => {
  const mainScene = document.getElementById("main-scene");
  const characterImg = document.getElementById("character-img");
  const characterName = document.getElementById("character-name");
  const dialogueText = document.getElementById("dialogue-text");

  let currentIndex = 0;
  let isTyping = false;
  let fullText = "";
  let skipRequested = false; // 新增：跳過請求鎖

  const typingAudio = new Audio("typing.mp3");
  typingAudio.loop = true;

  function startTalking(characterNameText) {
    if (characterNameText === "（旁白）") return;
    characterImg.style.transition = "transform 0.1s ease";
    characterImg.style.transform = "translateY(-10px)";
    setTimeout(() => {
      characterImg.style.transform = "translateY(0)";
    }, 100);
  }

  function stopTalking() {
    // 預留可加動畫清除
  }

  async function typeText(text, targetElement, characterNameText) {
    startTalking(characterNameText);
    targetElement.textContent = "";
    for (let i = 0; i < text.length; i++) {
      if (skipRequested) {
        targetElement.textContent = text;
        break;
      }
      targetElement.textContent += text[i];
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    stopTalking();
  }

  async function showEntry(index) {
    const entry = dialogueFlow[index];
    if (!entry) return;

    characterName.textContent = "";
    characterImg.src = "";
    dialogueText.textContent = "";
    fullText = entry.text;

    if (entry.type === "dialogue") {
      characterName.textContent = entry.characterName || "";
      characterImg.src = entry.characterImg || "";
    }

    isTyping = true;
    skipRequested = false; // reset skip flag
    typingAudio.currentTime = 0;
    typingAudio.play().catch(() => {});

    await typeText(fullText, dialogueText, characterName.textContent);

    typingAudio.pause();
    typingAudio.currentTime = 0;
    isTyping = false;
  }

  document.body.addEventListener("click", () => {
    if (isTyping) {
      // 第一次點擊時，只設定跳過，不繼續進行下一句
      skipRequested = true;
      return;
    }

    // 若尚未打字或已完成打字，才允許往下跳下一段
    currentIndex++;
    if (currentIndex < dialogueFlow.length) {
      showEntry(currentIndex);
    } else {
      setTimeout(() => {
        window.location.href = "fifth.html";
      }, 1000);
    }
  });

  // 初始載入
  mainScene.classList.remove("hidden");
  showEntry(0);
});
