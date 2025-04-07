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

    const figureHeight = window.innerHeight / 2;
    const figureMarginTop = (window.innerHeight - figureHeight) / 2;

    figure
      .style("height", figureHeight + "px")
      .style("top", figureMarginTop + "px");

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
