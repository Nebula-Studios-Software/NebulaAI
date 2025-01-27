$(document).ready(async function () {
  gsap.registerPlugin(ScrollToPlugin, TextPlugin);
  let userId = localStorage.getItem("user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("user_id", userId);
  }

  let aiBubbleClasses =
    "bg-zinc-800/50 min-w-[70%] border border-zinc-600 text-white p-2 rounded-lg max-w-xs";
  let userBubbleClasses =
    "bg-zinc-600/50 min-w-[70%] border border-zinc-600 text-white p-2 rounded-lg max-w-xs";
  let messageHistory = JSON.parse(localStorage.getItem("messageHistory")) || [];
  let historyIndex = messageHistory.length;

  function formatTimestamp(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async function loadMessages() {
    const response = await fetch(`/Chat/LoadMessages?userId=${userId}`);
    const messages = await response.json();
    const $chatArea = $("#chatArea");
    $chatArea.empty(); // Clear chat area before loading messages

    messages.forEach((message) => {
      const userMessage = `
                <div class="flex justify-end mb-8">
                    <div class="${userBubbleClasses}">
                        <strong>You:</strong>
                        <p>${message.question}</p>
                        <span class="text-xs text-gray-500">${formatTimestamp(new Date(message.timestamp))}</span>
                    </div>
                </div>`;
      $chatArea.append(userMessage);

      const aiResponse = `
                <div class="flex justify-start mb-8">
                    <div class="${aiBubbleClasses}">
                        <strong>AI:</strong>
                        <p>${message.answer}</p>
                        <span class="text-xs text-gray-500">${formatTimestamp(new Date(message.timestamp))}</span>
                    </div>
                </div>`;
      $chatArea.append(aiResponse);
    });

    // Scroll to the bottom of the chat area
    gsap.to($chatArea, { scrollTo: $chatArea[0].scrollHeight, duration: 0.5 });
  }

  await loadMessages();

  const $textarea = $("#prompt");
  const $maxContextSelect = $("#maxContext");
  const $charCounter = $("#charCounter");

  function tokensToChars(tokens) {
    return tokens * 4; // Approximate 4 chars per token
  }

  function updateMaxChars() {
    const maxTokens = parseInt($maxContextSelect.val(), 10);
    const maxChars = tokensToChars(maxTokens);
    $textarea.attr("maxlength", maxChars);
    updateCharCounter();
  }

  function updateCharCounter() {
    const currentLength = $textarea.val().length;
    const maxLength = $textarea.attr("maxlength");
    $charCounter.text(`${currentLength} / ${maxLength}`);
  }

  $maxContextSelect.on("change", updateMaxChars);
  updateMaxChars(); // Set initial max length

  $textarea.on("input", function () {
    $(this).css("height", "auto");
    $(this).css("height", this.scrollHeight + "px");
    updateCharCounter();
  });

  $textarea.on("keydown", function (event) {
    if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey) {
      event.preventDefault();
      $("#chatForm").trigger("submit");
    } else if (event.key === "Enter" && (event.ctrlKey || event.shiftKey)) {
      event.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      $(this).val(
        $(this).val().substring(0, start) + "\n" + $(this).val().substring(end),
      );
      this.selectionStart = this.selectionEnd = start + 1;
      $(this).css("height", "auto");
      $(this).css("height", this.scrollHeight + "px");
    } else if (event.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        $textarea.val(messageHistory[historyIndex].text);
      }
    } else if (event.key === "ArrowDown") {
      if (historyIndex < messageHistory.length - 1) {
        historyIndex++;
        $textarea.val(messageHistory[historyIndex].text);
      } else {
        historyIndex = messageHistory.length;
        $textarea.val("");
      }
    }
  });

  $("#chatForm").on("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    formData.append("user_id", userId);

    const timestamp = new Date().toISOString();

    // Append the user's message to the chat area
    const userMessage = `
            <div class="flex justify-end mb-8">
                <div class="${userBubbleClasses}">
                    <strong>You:</strong>
                    <p>${$textarea.val()}</p>
                    <span class="text-xs text-gray-500">${formatTimestamp(new Date(timestamp))}</span>
                </div>
            </div>`;
    const $chatArea = $("#chatArea");
    $chatArea.append(userMessage);

    // Add the message to the history
    messageHistory.push({ text: $textarea.val(), timestamp: timestamp });
    localStorage.setItem("messageHistory", JSON.stringify(messageHistory));
    historyIndex = messageHistory.length;

    // Scroll to the bottom of the chat area
    gsap.to($chatArea, { scrollTo: $chatArea[0].scrollHeight, duration: 0.5 });

    // Add temporary chat bubble with three dots
    const $loadingBubble = $(`
            <div class="flex justify-start mb-8">
                <div class="bg-zinc-700/50 w-fit border border-zinc-600 text-white p-2 rounded-lg max-w-xs">
                    <strong>AI:</strong>
                    <p class="loading-dots">...</p>
                </div>
            </div>`);
    $chatArea.append($loadingBubble);

    const response = await fetch("/Chat/Send", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    // Remove the loading bubble
    $loadingBubble.remove();

    // Add the actual response with GSAP animation
    const $aiResponse = $(`
            <div class="flex justify-start mb-8">
                <div class="${aiBubbleClasses}">
                    <strong>AI:</strong>
                    <p class="ai-response">${data.text.text}</p>
                    <span class="text-xs text-gray-500">${formatTimestamp(new Date(timestamp))}</span>
                </div>
            </div>`);
    $chatArea.append($aiResponse);

    // Animate the text with GSAP
    gsap.to(".ai-response", {
      duration: 0.5,
      text: {
        value: data.text.text,
        delimiter: " ",
      },
    });

    // Scroll to the bottom of the chat area
    gsap.to($chatArea, { scrollTo: $chatArea[0].scrollHeight, duration: 0.5 });

    // Clear the textarea and adjust its height
    $textarea.val("");
    $textarea.css("height", "auto");
    $textarea.css("height", $textarea[0].scrollHeight + "px");
    updateCharCounter();
  });

  // Clear chat button functionality
  $("#clearChat").on("click", async function () {
    const response = await fetch(`/Chat/ClearMessages?userId=${userId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      $("#chatArea").empty();
      localStorage.removeItem("messageHistory");
    } else {
      console.error("Failed to clear messages");
    }
  });
});
