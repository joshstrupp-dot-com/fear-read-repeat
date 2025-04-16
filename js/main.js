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
  initScrollyUtils(figure, stepsContainer, scroller, scrolly);

  // Generic window resize listener event
  function handleResize() {
    // Get current step elements
    const step = stepsContainer.selectAll(".step");

    // Set vertical margin between steps to 75vh
    const verticalMargin = Math.floor(window.innerHeight * 0.5);
    step.style("margin-bottom", `${verticalMargin}px`);

    // But remove margin from last step
    step
      .filter((d, i, nodes) => i === nodes.length - 1)
      .style("margin-bottom", "0px");

    // Set figure to take up full viewport height with padding
    figure.style("height", "calc(100vh - 2rem)").style("top", "1rem");

    // 3. Tell scrollama to update new element dimensions
    scroller.resize();
  }

  function init() {
    // Clear localStorage to always use the configuration from steps-config.js
    localStorage.removeItem("scrollySteps");

    // Always create fresh steps from the configuration
    window.scrollyTools.createSteps();

    // Add specific styling for first step to position it at the top
    stepsContainer.select(".step:first-child").style("margin-top", "0");

    // Set up resize handling
    handleResize();
    window.addEventListener("resize", handleResize);

    // Initialize scrollama
    window.scrollyTools.updateScrollama();

    // Trigger the first step's visualization immediately on load
    if (window.stepsConfig && window.stepsConfig.length > 0) {
      // Add active class to first step
      stepsContainer.select(".step:first-child").classed("is-active", true);

      // Render the first step's visualization
      const firstStep = window.stepsConfig[0];
      if (firstStep && firstStep.render) {
        firstStep.render();
      }

      // Apply fullwidth class if needed
      figure.classed("fullwidth", firstStep.fullwidth || false);
      scrolly.classed("fullwidth-active", firstStep.fullwidth || false);

      // Apply centered-statement class if needed
      stepsContainer
        .select(".step:first-child")
        .classed("centered-statement", firstStep.centerStatement || false);
    }
  }

  // Start the application
  init();
});
