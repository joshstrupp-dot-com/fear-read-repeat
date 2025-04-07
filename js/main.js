// This file is a backup of the original main.js
// We've switched to an inline script in index.html that follows Russell Samora's exact example pattern

// Original content below:

// Main JavaScript for Fear, Read, Repeat scrollytelling experience

// Track active section for progress indicator
let activeSection = "introduction";
const sections = [
  "introduction",
  "preface",
  "chapter1",
  "chapter2",
  "chapter3",
  "epilogue",
];

// Initialize SVGs for each section's placeholder
function createPlaceholderVisualizations() {
  const canvasPlaceholders = document.querySelectorAll(".canvas-placeholder");

  canvasPlaceholders.forEach((placeholder) => {
    // Create an SVG element for visual placeholder
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("class", "canvas-visualization");
    svg.style.overflow = "visible";
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";

    // Set an empty initial SVG (without waiting text)
    svg.innerHTML = `<rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="#ccc" stroke-width="1" />`;

    placeholder.appendChild(svg);

    // Find the closest step and update the visualization immediately
    setTimeout(() => {
      const section = placeholder.closest(".section");
      if (section) {
        const firstStep = section.querySelector(".step");
        if (firstStep) {
          const stepText =
            firstStep.querySelector("p")?.textContent.trim() || "";
          updateStepVisualization(placeholder, stepText, 0);
        }
      }
    }, 100);
  });
}

// Initialize scrollama for each section
function initScrollama() {
  // Set up scrollers for each scrolly section
  const scrollyElements = document.querySelectorAll(".scrolly");

  scrollyElements.forEach((scrollyEl) => {
    const figure = scrollyEl.querySelector("figure");
    const article = scrollyEl.querySelector("article");
    const steps = article.querySelectorAll(".step");

    // Initialize a new scroller for this section
    const scroller = scrollama();

    // Handle window resize
    function handleResize() {
      const figureHeight = window.innerHeight;
      figure.style.height = `${figureHeight}px`;
      figure.style.top = "0";
      scroller.resize();
    }

    // Handle step enter
    function handleStepEnter(response) {
      // Add is-active class to the current step
      steps.forEach((step, idx) => {
        if (idx === response.index) {
          step.classList.add("is-active");
        } else {
          step.classList.remove("is-active");
        }
      });

      // Get the text content from the current step
      const stepText =
        response.element.querySelector("p")?.textContent.trim() || "";

      // Update active section for progress indicator
      const currentSection = findCurrentSection(response.element);
      if (currentSection) {
        updateProgressIndicator(currentSection);

        // Update SVG with current step's content
        updateStepVisualization(figure, stepText, response.index);
      }
    }

    // Set up the scroller
    scroller
      .setup({
        step: `#${scrollyEl.closest(".section").id} .scrolly article .step`,
        offset: 0.5,
        debug: false,
      })
      .onStepEnter(handleStepEnter);

    // Initial resize
    handleResize();
    window.addEventListener("resize", handleResize);
  });
}

// Find which section a step belongs to
function findCurrentSection(stepElement) {
  const sectionElement = stepElement.closest(".section");
  return sectionElement ? sectionElement.id : null;
}

// Create a unique visualization for each step, including the step's text
function updateStepVisualization(figure, stepText, stepIndex) {
  const svg = figure.querySelector(".canvas-visualization");
  if (!svg) return;

  // Get color based on step index
  const colors = [
    "#e41a1c",
    "#377eb8",
    "#4daf4a",
    "#984ea3",
    "#ff7f00",
    "#a65628",
  ];
  const color = colors[stepIndex % colors.length];

  // Create a unique visualization for this step
  let svgContent = "";

  switch (stepIndex % 3) {
    case 0:
      // Rectangle with step text
      svgContent = `
        <rect x="10%" y="10%" width="80%" height="80%" fill="none" stroke="${color}" stroke-width="3" />
        <foreignObject x="15%" y="15%" width="70%" height="70%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; color: ${color}; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">
            <p style="margin: 0;">${stepText}</p>
          </div>
        </foreignObject>
      `;
      break;
    case 1:
      // Circle with step text
      svgContent = `
        <circle cx="50%" cy="50%" r="40%" fill="none" stroke="${color}" stroke-width="3" />
        <foreignObject x="20%" y="20%" width="60%" height="60%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; color: ${color}; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">
            <p style="margin: 0;">${stepText}</p>
          </div>
        </foreignObject>
      `;
      break;
    case 2:
      // Triangle with step text - fixed the polygon points to use absolute values instead of percentages
      svgContent = `
        <polygon points="300,50 450,350 150,350" fill="none" stroke="${color}" stroke-width="3" />
        <foreignObject x="20%" y="30%" width="60%" height="50%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; color: ${color}; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center;">
            <p style="margin: 0;">${stepText}</p>
          </div>
        </foreignObject>
      `;
      break;
  }

  // Update the SVG content
  svg.innerHTML = svgContent;

  // Add animation effect
  svg.style.opacity = "0";
  svg.style.transform = "scale(0.95)";
  setTimeout(() => {
    svg.style.opacity = "1";
    svg.style.transform = "scale(1)";
    svg.style.transition = "all 0.5s ease";
  }, 50);
}

// Update progress indicator
function updateProgressIndicator(sectionId) {
  if (activeSection === sectionId) return;
  activeSection = sectionId;

  const progressItems = document.querySelectorAll(".progress-nav li");
  progressItems.forEach((item) => {
    if (item.dataset.section === sectionId) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Add click events to progress nav
function setupProgressNav() {
  const progressItems = document.querySelectorAll(".progress-nav li");
  progressItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetSection = document.getElementById(item.dataset.section);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  // Create placeholder visualizations
  createPlaceholderVisualizations();

  // Set up progress navigation
  setupProgressNav();

  // Mark initial section as active
  updateProgressIndicator("introduction");

  // Initialize scrollama
  initScrollama();

  // Setup intersection observers to track active section
  setupSectionObservers();
});

// Use Intersection Observer to track active section
function setupSectionObservers() {
  const sectionElements = document.querySelectorAll(".section");
  const options = { threshold: 0.2 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateProgressIndicator(entry.target.id);
      }
    });
  }, options);

  sectionElements.forEach((section) => {
    observer.observe(section);
  });
}

/* 
Note: Future functions for data visualization will go here.
These could include:
- Functions to load data from the data/ directory
- D3 visualization setup and update functions
- WebGL/Three.js canvas setup for 3D visualizations
- P5.js sketch initialization and integration
*/
