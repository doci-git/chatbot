const messagesContainer = document.getElementById("messages");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const chatbotContainer = document.getElementById("chatbot-container");
const chatbotIcon = document.getElementById("chatbot-icon");

let responses = {};

// Carica il file JSON
fetch("responses.json")
  .then((response) => response.json())
  .then((data) => {
    responses = data;
    showInitialMessage();
  })
  .catch((error) =>
    console.error("Errore nel caricamento del file JSON:", error)
  );

// Mostra un messaggio iniziale
function showInitialMessage() {
 
  addMessage( "");
}

// Aggiungi un messaggio alla chat
function addMessage(content, sender, type = "text", link = null) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  if (type === "text") {
    messageElement.textContent = content;
  } else if (type === "text_with_link") {
    const span = document.createElement("span");
    span.textContent = content;

    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.textContent = link.text;
    anchor.target = "_blank";

    messageElement.appendChild(span);
    messageElement.appendChild(anchor);
  } else if (type === "image") {
    const img = document.createElement("img");
    img.src = content;
    img.alt = "Immagine";
    img.style.maxWidth = "100%";
    messageElement.appendChild(img);
  } else if (type === "video") {
    const video = document.createElement("video");
    video.src = content;
    video.controls = true;
    video.style.maxWidth = "100%";
    messageElement.appendChild(video);
  } else {
    messageElement.textContent = "Tipo di contenuto non supportato.";
  }

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Trova la risposta del bot
function getBotResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  const keywords = {
    greetings: ["ciao", "salve", "buongiorno"],
    greeting: ["hi", "hello"],
    blind: ["shutters", "blinders"],
    photo: ["transport", "tram", "photo"],
    fototram: ["linefoto"],
    wifi: ["wifi", "code", "internet"],
    lugg: ["luggage", "valige", "lug"],
    checkout: ["checkout", "check-out", "keys", "leave"],
    taxi: ["taxi", "cab", "uber"],
    ticket: ["ticket", "trainticket", "box office"],
    other: ["taxi", "cab", "uber"],
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((word) => lowerMessage.includes(word))) {
      const responsesForCategory = responses[category];
      if (responsesForCategory) {
        return responsesForCategory[
          Math.floor(Math.random() * responsesForCategory.length)
        ];
      }
    }
  }

  const defaultResponses = responses.default || [
    { type: "text", content: "Mi dispiace, non ho capito. Puoi riformulare?" },
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Invia un messaggio
function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  setTimeout(() => {
    const botResponse = getBotResponse(message);
    if (botResponse) {
      addMessage(
        botResponse.content,
        "bot",
        botResponse.type,
        botResponse.link || null
      );
    } else {
      addMessage("Errore nella risposta.", "bot");
    }
  }, 1000);
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Mostra o nasconde il chatbot
chatbotIcon.addEventListener("click", () => {
  chatbotContainer.classList.toggle("hidden");
});
