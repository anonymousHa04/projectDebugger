// popup.js
document.getElementById("analyzeBtn").addEventListener("click", () => {
  window.addEventListener("message", async (event) => {
    if (event.data.type === "REACT_FIBER_TREE") {
      const fiberTree = event.data.fiberTree;

      const prompt = `Analyze this React Fiber tree and explain why 'UserList' component rendered:\n\n${JSON.stringify(
        fiberTree,
        null,
        2
      )}`;

    //   const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //       "Authorization": "Bearer YOUR_OPENAI_API_KEY",
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       model: "gpt-4",
    //       messages: [{ role: "user", content: prompt }]
    //     })
    //   });

    //   const data = await response.json();
      document.getElementById("output").textContent = JSON.stringify(
        fiberTree,
        null,
        2
      )};
    //   document.getElementById("output").textContent = data.choices[0].message.content;
    
  });
});
