/**
 * Main application entry point
 * Initializes the scrollytelling functionality
 */

// Initialize on document load
document.addEventListener("DOMContentLoaded", () => {
  // using d3 for convenience
  const main = d3.select("main");
  const scrolly = main.select("#scrolly");
  const figure = scrolly.select("figure");
  const stepsContainer = scrolly.select("#steps-container");

  // initialize the scrollama
  const scroller = scrollama();

  // Initialize utils with DOM references
  initScrollyUtils(figure, stepsContainer, scroller);

  // Generic window resize listener event
  function handleResize() {
    // Get current step elements
    const step = stepsContainer.selectAll(".step");

    // 1. Update height of step elements
    const stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");

    // Set figure to take up full viewport height with padding
    figure.style("height", "calc(100vh - 2rem)").style("top", "1rem");

    // 3. Tell scrollama to update new element dimensions
    scroller.resize();
  }

  function init() {
    // Check for saved steps
    const hasSavedSteps = window.scrollyTools.loadSteps();

    if (!hasSavedSteps) {
      // Create fresh steps if none were loaded
      window.scrollyTools.createSteps();
    }

    // Set up resize handling
    handleResize();
    window.addEventListener("resize", handleResize);

    // Initialize scrollama
    window.scrollyTools.updateScrollama();
  }

  // Start the application
  init();
});
