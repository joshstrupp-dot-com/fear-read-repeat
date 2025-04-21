/**
 * Scrollytelling Utility Functions
 * These functions provide a developer API for managing steps
 */

// Maintain references to key DOM elements and scrollama
let figure, stepsContainer, scroller, scrolly;
// Global vizSequence removed in favor of per-step fade flags

// Initialize utils with references to DOM elements
function initScrollyUtils(
  figureRef,
  stepsContainerRef,
  scrollerRef,
  scrollyRef
) {
  figure = figureRef;
  stepsContainer = stepsContainerRef;
  scroller = scrollerRef;
  scrolly = scrollyRef;
}

// Create steps from configuration
function createSteps() {
  stepsContainer.html(""); // Clear existing steps

  window.stepsConfig.forEach((step) => {
    const stepElement = stepsContainer
      .append("div")
      .attr("class", "step")
      .attr("data-step", step.id)
      .html(`<p>${step.text}</p>`);
    // Apply custom class if specified
    if (step.customClass) {
      stepElement.classed(step.customClass, true);
    }
  });

  return stepsContainer.selectAll(".step");
}

// Handle step transitions
function handleStepEnter(response) {
  // response = { element, direction, index }
  console.log("Step enter:", response);
  console.log(`Step ID: ${window.stepsConfig[response.index]?.id}`);

  // Add color to current step only
  stepsContainer.selectAll(".step").classed("is-active", (d, i) => {
    return i === response.index;
  });

  // Toggle fullwidth class based on step configuration
  const isFullWidth = window.stepsConfig[response.index]?.fullwidth || false;
  figure.classed("fullwidth", isFullWidth);
  scrolly.classed("fullwidth-active", isFullWidth);

  // Get current step config
  const currentStep = window.stepsConfig[response.index];

  // Call the render function for this step
  if (currentStep && currentStep.render) {
    currentStep.render();
  }
  // Per-step fade-in; ensure visibility for steps without fadeIn
  if (currentStep.fadeIn) {
    figure
      .interrupt()
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);
  } else {
    // Non-fade steps: reset opacity to fully visible
    figure.interrupt().style("opacity", 1);
  }
}

// Handle step exit transitions
function handleStepExit(response) {
  // response = { element, direction, index }
  // Per-step fade-out
  const exitingStep = window.stepsConfig[response.index];
  if (exitingStep.fadeOut) {
    figure.interrupt().transition().duration(500).style("opacity", 0);
  }
  console.log("Step exit:", response);
  console.log(`Exiting Step ID: ${window.stepsConfig[response.index]?.id}`);

  // Additional exit handling can be added here if needed
}

// Generic window resize listener event
function handleResize() {
  // Get current step elements
  const step = stepsContainer.selectAll(".step");

  // Calculate viewport height
  const viewportHeight = window.innerHeight;

  // Position first step 75% down the viewport
  step
    .filter((d, i) => i === 0)
    .style("margin-top", `${Math.floor(viewportHeight * 0.75)}px`);

  // Set vertical margin between steps
  const verticalMargin = Math.floor(viewportHeight * 0.5);
  step.style("margin-bottom", `${verticalMargin}px`);

  // But remove margin from last step
  step
    .filter((d, i, nodes) => i === nodes.length - 1)
    .style("margin-bottom", "0px");

  // Set figure to take up full viewport height with padding
  figure.style("height", "calc(100vh - 2rem)").style("top", "1rem");

  // Tell scrollama to update new element dimensions
  scroller.resize();
}

// Update scrollama setup
function updateScrollama() {
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.6, // Set to 75% down the viewport
      debug: false,
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onStepProgress((response) => {
      // response = { element, index, progress, direction }
      // This fires continuously as the user scrolls through a step

      // You can use this to create animations that respond to scroll position
      // For example, fade elements based on progress
      if (window.stepsConfig[response.index]?.fade) {
        d3.select(response.element).style("opacity", response.progress);
      }
    });

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
        // Add console log to show when steps are loaded from localStorage
        console.log(`Loading ${parsed.length} steps from localStorage`, parsed);

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
