/**
 * Scrollytelling Utility Functions
 * These functions provide a developer API for managing steps
 */

// Maintain references to key DOM elements and scrollama
let figure, stepsContainer, scroller;

// Initialize utils with references to DOM elements
function initScrollyUtils(figureRef, stepsContainerRef, scrollerRef) {
  figure = figureRef;
  stepsContainer = stepsContainerRef;
  scroller = scrollerRef;
}

// Create steps from configuration
function createSteps() {
  stepsContainer.html(""); // Clear existing steps

  window.stepsConfig.forEach((step) => {
    stepsContainer
      .append("div")
      .attr("class", "step")
      .attr("data-step", step.id)
      .html(`<p>${step.text}</p>`);
  });

  return stepsContainer.selectAll(".step");
}

// Handle step transitions
function handleStepEnter(response) {
  // response = { element, direction, index }
  console.log(response);

  // Add color to current step only
  stepsContainer.selectAll(".step").classed("is-active", (d, i) => {
    return i === response.index;
  });

  // Call the appropriate render function for this step
  if (
    window.stepsConfig[response.index] &&
    window.stepsConfig[response.index].render
  ) {
    window.stepsConfig[response.index].render();
  }
}

// Update scrollama setup
function updateScrollama() {
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.33,
      debug: false,
    })
    .onStepEnter(handleStepEnter);

  scroller.resize();
}

// Add a new step
function addStep(id, text, renderFn) {
  window.stepsConfig.push({
    id: id || `step-${window.stepsConfig.length + 1}`,
    text: text || `STEP ${window.stepsConfig.length + 1}`,
    render:
      renderFn ||
      (() => {
        figure.html("");
        figure.style("background-color", "#8a8a8a");
        figure.append("p").text(window.stepsConfig.length);
      }),
  });

  // Refresh the steps and scroll instance
  createSteps();
  updateScrollama();

  return window.stepsConfig.length - 1; // Return index of new step
}

// Remove a step by index
function removeStep(index) {
  if (index >= 0 && index < window.stepsConfig.length) {
    window.stepsConfig.splice(index, 1);
    createSteps();
    updateScrollama();
    return true;
  }
  return false;
}

// Move a step from one position to another
function moveStep(fromIndex, toIndex) {
  if (
    fromIndex >= 0 &&
    fromIndex < window.stepsConfig.length &&
    toIndex >= 0 &&
    toIndex < window.stepsConfig.length
  ) {
    const step = window.stepsConfig.splice(fromIndex, 1)[0];
    window.stepsConfig.splice(toIndex, 0, step);
    createSteps();
    updateScrollama();
    return true;
  }
  return false;
}

// Export steps config to JSON
function exportSteps() {
  // Create a simplified version without functions
  const exportable = window.stepsConfig.map((step) => ({
    id: step.id,
    text: step.text,
    // Note: render functions can't be easily serialized
  }));
  return JSON.stringify(exportable, null, 2);
}

// Save steps to localStorage
function saveSteps() {
  localStorage.setItem("scrollySteps", exportSteps());
  console.log("Steps saved to localStorage");
  return true;
}

// Load steps from localStorage
function loadSteps() {
  const savedSteps = localStorage.getItem("scrollySteps");
  if (savedSteps) {
    try {
      const parsed = JSON.parse(savedSteps);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // We need to preserve the render functions when rehydrating saved steps
        const newConfig = [];

        parsed.forEach((savedStep) => {
          // Try to find existing step with same id to preserve render function
          const existingStep = window.stepsConfig.find(
            (s) => s.id === savedStep.id
          );

          if (existingStep) {
            // Use existing render function with updated text
            newConfig.push({
              ...savedStep,
              render: existingStep.render,
            });
          } else {
            // Create default render function for new steps
            newConfig.push({
              ...savedStep,
              render: () => {
                figure.html("");
                figure.append("p").text(savedStep.id);
              },
            });
          }
        });

        // Replace existing config with loaded version
        window.stepsConfig.length = 0;
        newConfig.forEach((step) => window.stepsConfig.push(step));

        createSteps();
        updateScrollama();
        return true;
      }
    } catch (e) {
      console.error("Error loading saved steps:", e);
    }
  }
  return false;
}

// Make these functions available globally
window.scrollyTools = {
  createSteps,
  handleStepEnter,
  updateScrollama,
  addStep,
  removeStep,
  moveStep,
  exportSteps,
  saveSteps,
  loadSteps,
  getConfig: () => window.stepsConfig,
};
