// Immediately Invoked Function Expression to prevent global variable conflicts
(function () {
  // Get the container element
  const gridContainer = document.getElementById("chapter-1-grid");

  // Make sure the container exists
  if (!gridContainer) {
    console.error("Could not find chapter-1-grid container");
    return;
  }

  // Set container styles
  gridContainer.style.width = "110%";
  gridContainer.style.height = "110%";
  gridContainer.style.fontFamily = "Andale Mono, monospace";
  gridContainer.style.fontSize = "24px";
  gridContainer.style.color = "var(--color-base-darker)";
  gridContainer.style.position = "relative";
  gridContainer.style.left = "-5%";
  gridContainer.style.top = "-5%";

  // Load and display book covers in a more compact grid with entry animation
  d3.csv("data/sh_train_0409.csv")
    .then((data) => {
      const covers = data.slice(0, 140);
      gridContainer.innerHTML = ""; // clear placeholder content

      // More compact grid layout with more columns and smaller gaps
      gridContainer.style.display = "grid";
      gridContainer.style.gridTemplateColumns = "repeat(20, 1fr)";
      gridContainer.style.gridTemplateRows = "repeat(7, auto)";
      gridContainer.style.gap = "8px";
      gridContainer.style.padding = "12px";
      gridContainer.style.justifyItems = "center";
      gridContainer.style.alignItems = "start";

      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.8); }
          60% { opacity: 1; transform: translateY(-5px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `;
      document.head.appendChild(styleSheet);

      covers.forEach((d, i) => {
        const img = document.createElement("img");
        img.src = d.image_url;
        // Smaller image size to fit more in viewport
        img.style.width = "70px";
        img.style.height = "auto";
        img.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
        img.style.opacity = "0";
        img.style.transform = "translateY(20px) scale(0.8)";
        img.style.animation = `fadeInUp 0.7s ease-out forwards ${i * 0.05}s`;
        gridContainer.appendChild(img);
      });
    })
    .catch((error) => {
      console.error("Error loading book covers:", error);
    });

  // Listen for grid visualization update events
  document.addEventListener("gridVisualizationUpdate", (event) => {
    const step = event.detail.step;
    console.log(`Grid visualization step entered: ${step}`);

    if (step === "systemic-problems") {
      // Left blank for now
    }
  });
})();
