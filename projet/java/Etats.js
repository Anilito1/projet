let isRequestPending = false; // Indique si une requête est en cours

// Gestion de l'événement "Envoyer"
document.getElementById("send-button").addEventListener("click", async function () {
    if (isRequestPending) {
        alert("Veuillez patienter avant de poser une autre question.");
        return; // Empêche l'utilisateur de déclencher une nouvelle requête
    }

    const userInput = document.getElementById("chat-input").value;

    if (!userInput) {
        alert("Veuillez entrer un message.");
        return;
    }

    // Ajouter le message utilisateur au chat
    addMessage(userInput, "user");

    // Effacer le champ de saisie
    document.getElementById("chat-input").value = "";

    // Ajouter un message temporaire de chargement
    addMessage("L'IA réfléchit...", "ai");

    // Marquer qu'une requête est en cours
    isRequestPending = true;

    try {
        // Appeler l'API OpenAI
        const aiResponse = await fetchAIResponse(userInput);

        // Remplacer le message de chargement par la réponse de l'IA
        updateLastMessage(aiResponse);
    } catch (error) {
        console.error("Erreur :", error);
        updateLastMessage("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
        // Définir un délai de 3 secondes avant d'autoriser une nouvelle requête
        setTimeout(() => {
            isRequestPending = false;
        }, 3000); // Délai de 3 secondes
    }
});

// Fonction pour ajouter un message au chat
function addMessage(text, sender) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);

    // Faire défiler vers le bas
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fonction pour mettre à jour le dernier message (ex. : remplace "L'IA réfléchit...")
function updateLastMessage(text) {
    const chatMessages = document.getElementById("chat-messages");
    const lastMessage = chatMessages.lastChild;
    if (lastMessage && lastMessage.classList.contains("ai")) {
        lastMessage.textContent = text;
    }
}

// Fonction pour appeler l'API OpenAI
async function fetchAIResponse(userInput) {
    const apiEndpoint = "https://api.openai.com/v1/chat/completions";
    const apiKey = "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"; // Remplacez par votre clé API

    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Modèle utilisé
            messages: [{ role: "user", content: userInput }],
        }),
    });

    if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
