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

// Create placeholder visualizations
function createPlaceholderVisualizations() {
  const canvasPlaceholders = document.querySelectorAll(".canvas-placeholder");

  canvasPlaceholders.forEach((placeholder, index) => {
    // Create an SVG element for visual placeholder
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("class", "canvas-visualization");
    svg.style.overflow = "visible";
    svg.style.position = "absolute"; // Make sure it's absolutely positioned
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.zIndex = "10"; // Ensure it's above other elements

    // Different shape for each section
    const sectionId = placeholder.closest(".section").id;

    // Base styling
    svg.innerHTML = getPlaceholderSVG(sectionId, 0);

    placeholder.appendChild(svg);

    // Log to console for debugging
    console.log(`Created SVG for section: ${sectionId}`, placeholder);
  });
}

// Generate SVG content based on section and step
function getPlaceholderSVG(sectionId, stepIndex) {
  // Get colors from CSS variables
  const colors = {
    introduction: getComputedStyle(document.documentElement)
      .getPropertyValue("--introduction-color")
      .trim(),
    preface: getComputedStyle(document.documentElement)
      .getPropertyValue("--preface-color")
      .trim(),
    chapter1: getComputedStyle(document.documentElement)
      .getPropertyValue("--chapter1-color")
      .trim(),
    chapter2: getComputedStyle(document.documentElement)
      .getPropertyValue("--chapter2-color")
      .trim(),
    chapter3: getComputedStyle(document.documentElement)
      .getPropertyValue("--chapter3-color")
      .trim(),
    epilogue: getComputedStyle(document.documentElement)
      .getPropertyValue("--epilogue-color")
      .trim(),
  };

  const baseColor = colors[sectionId] || "#333";

  // Different SVG patterns for each section
  switch (sectionId) {
    case "introduction":
      return `
        <circle cx="50%" cy="50%" r="${
          30 + stepIndex * 20
        }%" fill="none" stroke="${baseColor}" stroke-width="4" />
        <circle cx="50%" cy="50%" r="${
          10 + stepIndex * 10
        }%" fill="${baseColor}" opacity="0.3" />
        <text x="50%" y="50%" text-anchor="middle" fill="${baseColor}" style="font-size: 24px; font-weight: bold;">Step ${
        stepIndex + 1
      }</text>
      `;
    case "preface":
      return `
        <rect x="${20 - stepIndex * 10}%" y="${20 - stepIndex * 10}%" width="${
        60 + stepIndex * 20
      }%" height="${
        60 + stepIndex * 20
      }%" fill="none" stroke="${baseColor}" stroke-width="4" />
        <rect x="${35}%" y="${35}%" width="${30}%" height="${30}%" fill="${baseColor}" opacity="0.3" />
        <text x="50%" y="50%" text-anchor="middle" fill="${baseColor}" style="font-size: 24px; font-weight: bold;">Step ${
        stepIndex + 1
      }</text>
      `;
    case "chapter1":
      const points = generatePolygonPoints(6 + stepIndex, 40 + stepIndex * 10);
      return `
        <polygon points="${points}" fill="none" stroke="${baseColor}" stroke-width="4" />
        <circle cx="50%" cy="50%" r="${
          15 + stepIndex * 5
        }%" fill="${baseColor}" opacity="0.3" />
        <text x="50%" y="50%" text-anchor="middle" fill="${baseColor}" style="font-size: 24px; font-weight: bold;">Step ${
        stepIndex + 1
      }</text>
      `;
    case "chapter2":
      return `
        <line x1="${10 + stepIndex * 5}%" y1="${50}%" x2="${
        90 - stepIndex * 5
      }%" y2="${50}%" stroke="${baseColor}" stroke-width="4" />
        <line x1="${50}%" y1="${10 + stepIndex * 5}%" x2="${50}%" y2="${
        90 - stepIndex * 5
      }%" stroke="${baseColor}" stroke-width="4" />
        <rect x="${40 - stepIndex * 5}%" y="${40 - stepIndex * 5}%" width="${
        20 + stepIndex * 10
      }%" height="${20 + stepIndex * 10}%" fill="${baseColor}" opacity="0.3" />
        <text x="50%" y="50%" text-anchor="middle" fill="${baseColor}" style="font-size: 24px; font-weight: bold;">Step ${
        stepIndex + 1
      }</text>
      `;
    case "chapter3":
      return `
        <circle cx="${
          30 + stepIndex * 10
        }%" cy="50%" r="10%" fill="${baseColor}" opacity="0.3" />
        <circle cx="${
          70 - stepIndex * 10
        }%" cy="50%" r="10%" fill="${baseColor}" opacity="0.3" />
        <path d="M ${30 + stepIndex * 10}% 50% Q 50% ${20 + stepIndex * 15}%, ${
        70 - stepIndex * 10
      }% 50%" fill="none" stroke="${baseColor}" stroke-width="4" />
        <text x="50%" y="50%" text-anchor="middle" fill="${baseColor}" style="font-size: 24px; font-weight: bold;">Step ${
        stepIndex + 1
      }</text>
      `;
    case "epilogue":
      return `
        <rect x="20%" y="20%" width="60%" height="60%" fill="none" stroke="${baseColor}" stroke-width="4" rx="${
        5 + stepIndex * 15
      }%" ry="${5 + stepIndex * 15}%" />
        <circle cx="50%" cy="50%" r="${
          10 + stepIndex * 7
        }%" fill="${baseColor}" opacity="0.3" />
        <text x="50%" y="50%" text-anchor="middle" fill="${baseColor}" style="font-size: 24px; font-weight: bold;">Step ${
        stepIndex + 1
      }</text>
      `;
    default:
      return `
        <circle cx="50%" cy="50%" r="30%" fill="none" stroke="${baseColor}" stroke-width="4" />
        <text x="50%" y="50%" text-anchor="middle" fill="${baseColor}" style="font-size: 24px; font-weight: bold;">Step ${
        stepIndex + 1
      }</text>
      `;
  }
}

// Helper function to generate polygon points
function generatePolygonPoints(sides, radius) {
  let points = [];
  const centerX = 50;
  const centerY = 50;

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2; // Start from top
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x}%,${y}%`);
  }

  return points.join(" ");
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
      const figureMarginTop = 0;

      figure.style.height = `${figureHeight}px`;
      figure.style.top = `${figureMarginTop}px`;

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

      // Update active section for progress indicator
      const currentSection = findCurrentSection(response.element);
      if (currentSection) {
        updateProgressIndicator(currentSection);

        // Update visualization placeholder
        updateVisualizationPlaceholder(currentSection, response.index, figure);
      }

      // Here you would also update visualizations based on the current step
      // This can be implemented later when you're ready to add data visualizations
    }

    // Set up the scroller
    scroller
      .setup({
        step: `#${scrollyEl.closest(".section").id} .scrolly article .step`,
        offset: 0.5,
        debug: false,
      })
      .onStepEnter(handleStepEnter);

    // Initial resize to properly size elements
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);
  });
}

// Find which section a step belongs to
function findCurrentSection(stepElement) {
  const sectionElement = stepElement.closest(".section");
  return sectionElement ? sectionElement.id : null;
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

// Update visualization placeholder
function updateVisualizationPlaceholder(sectionId, stepIndex, figure) {
  const svg = figure.querySelector(".canvas-visualization");
  if (svg) {
    console.log(
      `Updating visualization for section ${sectionId}, step ${stepIndex}`
    );

    // Update the SVG content based on the current step
    svg.innerHTML = getPlaceholderSVG(sectionId, stepIndex);

    // Add animation to show transition - update to avoid translate conflicts
    svg.style.opacity = "0.9";
    svg.style.transform = "scale(0.95)";
    setTimeout(() => {
      svg.style.opacity = "1";
      svg.style.transform = "scale(1)";
    }, 50);

    // Change the border of the placeholder
    const placeholder = figure.querySelector(".canvas-placeholder");
    if (placeholder) {
      // Get the CSS variable for this section's color
      const sectionColor = getComputedStyle(document.documentElement)
        .getPropertyValue(`--${sectionId}-color`)
        .trim();

      // Apply styles based on step
      placeholder.style.borderColor = sectionColor;
      placeholder.style.borderWidth = `${2 + stepIndex}px`;

      // Make background more visible with a bit of color
      const opacity = 0.1 + stepIndex * 0.05;
      placeholder.style.backgroundColor = `rgba(${
        sectionId === "introduction"
          ? "108, 117, 125"
          : sectionId === "preface"
          ? "74, 124, 89"
          : sectionId === "chapter1"
          ? "134, 117, 169"
          : sectionId === "chapter2"
          ? "199, 81, 70"
          : sectionId === "chapter3"
          ? "65, 101, 138"
          : "86, 77, 74"
      }, ${opacity})`;

      console.log(
        `Updated placeholder styles for ${sectionId}`,
        placeholder.style.backgroundColor
      );
    }
  } else {
    console.warn("SVG element not found in figure");
  }
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

  const options = {
    threshold: 0.2, // 20% of the section is visible
  };

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
