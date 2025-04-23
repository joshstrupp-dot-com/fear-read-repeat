// Immediately Invoked Function Expression to prevent global variable conflicts
(function () {
  // Get the container element
  const gridContainer = document.getElementById("chapter-1-grid");

  // Make sure the container exists
  if (!gridContainer) {
    console.error("Could not find chapter-1-grid container");
    return;
  }

  // Create an overlay container for absolute positioning
  // This will remain fixed even when parent container changes
  const absoluteContainer = document.createElement("div");
  absoluteContainer.id = "chapter-1-grid-absolute";
  absoluteContainer.style.position = "fixed";
  absoluteContainer.style.top = "0";
  absoluteContainer.style.left = "0";
  absoluteContainer.style.width = "100%";
  absoluteContainer.style.height = "100%";
  absoluteContainer.style.pointerEvents = "none"; // Allow clicks to pass through
  absoluteContainer.style.zIndex = "1"; // Ensure it's on top
  document.body.appendChild(absoluteContainer);

  // Set container styles
  gridContainer.style.width = "110%";
  gridContainer.style.height = "110%";
  gridContainer.style.fontFamily = "Andale Mono, monospace";
  gridContainer.style.fontSize = "24px";
  gridContainer.style.color = "var(--color-base-darker)";
  gridContainer.style.position = "relative";
  gridContainer.style.left = "-5%";
  gridContainer.style.top = "-5%";

  // Create a map to store book positions from the blame-game step
  const bookPositions = new Map();

  // Keep track of initial load animation completion
  let initialAnimationComplete = false;

  // Keep track of whether we've frozen the positions
  let positionsFrozen = false;

  // Keep a reference to the book covers
  let bookElements = [];

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

      // Calculate total animation time for all books
      const lastBookDelay = (covers.length - 1) * 0.05; // Delay for the last book
      const singleAnimDuration = 0.7; // Duration of a single animation
      const totalAnimTime = lastBookDelay + singleAnimDuration + 0.5; // Add 0.5s buffer

      // Create placeholders in the grid
      covers.forEach((d, i) => {
        const placeholder = document.createElement("div");
        placeholder.style.width = "70px";
        placeholder.style.height = "100px"; // Approximate height
        placeholder.dataset.index = i;
        gridContainer.appendChild(placeholder);
      });

      // Create the actual book images
      covers.forEach((d, i) => {
        const img = document.createElement("img");
        img.src = d.image_url;
        img.style.width = "70px";
        img.style.height = "auto";
        img.style.boxShadow = "0 3px 6px rgba(0,0,0,0.2)";
        img.style.opacity = "0";
        img.style.pointerEvents = "none";
        img.dataset.index = i;
        img.dataset.bookId = d.book_id || i; // Store book ID if available
        bookElements.push(img);

        // Add the initial animation
        img.style.animation = `fadeInUp 0.7s ease-out forwards ${i * 0.05}s`;

        // Position it over its placeholder initially
        const placeholder = gridContainer.querySelector(
          `div[data-index="${i}"]`
        );
        if (placeholder) {
          const rect = placeholder.getBoundingClientRect();
          img.style.position = "fixed";
          img.style.left = `${rect.left}px`;
          img.style.top = `${rect.top}px`;

          // Store initial position for animation starting point
          bookPositions.set(i, {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          });
        }

        absoluteContainer.appendChild(img);
      });

      // Set a timer to mark animation completion
      setTimeout(() => {
        initialAnimationComplete = true;
        console.log(
          "Initial grid animation complete after",
          totalAnimTime,
          "seconds"
        );

        // If we're already in blame-game step, freeze positions
        if (currentStep === "blame-game" && !positionsFrozen) {
          freezeBookPositions();
        }
      }, totalAnimTime * 1000);
    })
    .catch((error) => {
      console.error("Error loading book covers:", error);
    });

  // Keep track of current step
  let currentStep = "";

  // Function to freeze book positions
  function freezeBookPositions() {
    if (!initialAnimationComplete) {
      console.log(
        "Waiting for initial animation to complete before freezing positions"
      );
      return;
    }

    if (positionsFrozen) {
      console.log("Positions already frozen, skipping");
      return;
    }

    console.log("Freezing book positions for step:", currentStep);

    // Update positions based on the current placeholders
    bookElements.forEach((img) => {
      const i = parseInt(img.dataset.index);
      const placeholder = gridContainer.querySelector(`div[data-index="${i}"]`);

      if (placeholder) {
        const rect = placeholder.getBoundingClientRect();

        // Update position data
        bookPositions.set(i, {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: placeholder.offsetHeight || rect.height,
        });

        // Position the image at its final resting place
        img.style.position = "fixed";
        img.style.left = `${rect.left}px`;
        img.style.top = `${rect.top}px`;
        img.style.width = `${rect.width}px`;
        img.style.height = "auto";
        img.style.opacity = "1";
        img.style.transform = "translate(0, 0) rotate(0deg)";
        img.style.animation = "none";
      }
    });

    positionsFrozen = true;

    // Store the visible viewport dimensions at freeze time
    window.gridViewportWidth = window.innerWidth;
    window.gridViewportHeight = window.innerHeight;
  }

  // Listen for grid visualization update events
  document.addEventListener("gridVisualizationUpdate", (event) => {
    const step = event.detail.step;
    currentStep = step;
    console.log(`Grid visualization step entered: ${step}`);

    if (step === "blame-game") {
      // Make absoluteContainer visible
      absoluteContainer.style.display = "block";

      // If the initial animation is already complete, freeze positions
      if (initialAnimationComplete && !positionsFrozen) {
        freezeBookPositions();
      }
    } else if (step === "systemic-problems") {
      // Add a style for the cascade animation
      const cascadeStyle = document.createElement("style");
      cascadeStyle.textContent = `
        @keyframes cascadeOut {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--target-x), 150vh) rotate(var(--rotate-deg)); opacity: 0; }
        }
      `;
      document.head.appendChild(cascadeStyle);

      // Ensure positions are frozen before cascading
      if (!positionsFrozen && initialAnimationComplete) {
        freezeBookPositions();
      }

      // Calculate the center point (bottom middle of screen)
      const centerX = window.gridViewportWidth / 2;
      const bottomY = window.gridViewportHeight;

      // Apply cascade animation to each book with staggered delay
      bookElements.forEach((img) => {
        const i = parseInt(img.dataset.index);

        // Get stored position
        const storedPos = bookPositions.get(i);

        if (!storedPos) {
          console.warn(`No stored position for book ${i}`);
          return;
        }

        // Reset any existing animations
        img.style.animation = "none";

        // Force a reflow to make sure animation cancellation takes effect
        void img.offsetWidth;

        // Make sure book is at its stored position before starting animation
        img.style.position = "fixed";
        img.style.left = `${storedPos.left}px`;
        img.style.top = `${storedPos.top}px`;
        img.style.width = `${storedPos.width}px`;
        img.style.opacity = "1";
        img.style.transform = "translate(0, 0) rotate(0deg)";

        // Calculate how far to move horizontally to reach center
        const currentX = storedPos.left + storedPos.width / 2;
        const targetX = centerX - currentX;
        img.style.setProperty("--target-x", `${targetX}px`);

        // Random rotation for more natural falling effect
        const randomRotation = -20 + Math.random() * 40;
        img.style.setProperty("--rotate-deg", `${randomRotation}deg`);

        // Apply animation with staggered delay
        const delay = 0.1 + i * 0.02 + Math.random() * 0.1; // Add some randomness to delay

        // Force a reflow again before adding the new animation
        void img.offsetWidth;

        img.style.animation = `cascadeOut 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards ${delay}s`;

        // Ensure proper transform origin
        img.style.transformOrigin = "center";
      });
    } else {
      // For other steps, hide the absolute container
      absoluteContainer.style.display = "none";
    }
  });

  // Clean up function to remove the absolute container when moving to a different chapter
  function cleanup() {
    if (absoluteContainer && absoluteContainer.parentNode) {
      absoluteContainer.parentNode.removeChild(absoluteContainer);
    }
  }

  // Listen for chapter changes
  document.addEventListener("chapterChange", cleanup);

  // Also clean up when window unloads
  window.addEventListener("unload", cleanup);
})();
