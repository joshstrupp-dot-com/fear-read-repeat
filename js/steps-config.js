/**
 * Steps Configuration
 * Each step has:
 * - id: unique identifier
 * - text: what appears in the step
 * - render: function to update the figure when this step is active
 * - fullwidth: boolean to determine if figure spans full viewport width
 * - visualizationId: identifies which visualization this step belongs to (steps with same ID share/reuse the same visualization)
 */
const stepsConfig = [
  {
    id: "intro",
    text: "STEP 1",
    fullwidth: true,
    visualizationId: "chapter-1-viz",
    render: () => {
      const figure = d3.select("#figure-container");

      // Only initialize if this is a new visualization or none exists
      if (
        !window.currentVisualizationId ||
        window.currentVisualizationId !== "chapter-1-viz"
      ) {
        figure.html("");

        // Create a container for the script
        const scriptContainer = figure
          .append("div")
          .attr("id", "chapter-1")
          .style("width", "100%")
          .style("height", "100%");

        // Load and execute chapter-1-dev.js
        const script = document.createElement("script");
        script.src = "chapter-1-dev.js";
        script.async = true;

        // Append the script to the container
        scriptContainer.node().appendChild(script);

        // Update current visualization ID
        window.currentVisualizationId = "chapter-1-viz";
      }

      // Trigger step-specific updates via event
      const event = new CustomEvent("visualizationUpdate", {
        detail: { step: "intro" },
      });
      document.dispatchEvent(event);
    },
  },
  {
    id: "intro-2",
    text: "STEP 1.5",
    fullwidth: true,
    visualizationId: "chapter-1-viz", // Same as previous step - will reuse visualization
    render: () => {
      // No need to reinitialize - just update the existing visualization
      const event = new CustomEvent("visualizationUpdate", {
        detail: { step: "intro-2" },
      });
      document.dispatchEvent(event);
    },
  },
  {
    id: "analysis",
    text: "STEP 2",
    fullwidth: false,
    visualizationId: "analysis-viz", // Different ID - will create new visualization
    render: () => {
      const figure = d3.select("#figure-container");

      // Different visualization ID, so create new visualization
      if (window.currentVisualizationId !== "analysis-viz") {
        figure.html("");
        figure.style("background-color", "#1e88e5");
        figure.append("p").text("2");

        window.currentVisualizationId = "analysis-viz";
      }
    },
  },
  {
    id: "results",
    text: "STEP 3",
    fullwidth: true,
    render: () => {
      // Example with SVG content
      const figure = d3.select("#figure-container");
      figure.html("");

      // Alternative: inserting SVG - make the circle white to be visible
      figure.html(
        '<svg width="100%" height="100%"><circle cx="50%" cy="50%" r="40%" fill="white"></circle><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#333" font-size="8rem" font-weight="900">3</text></svg>'
      );
    },
  },
  {
    id: "conclusion",
    text: "STEP 4",
    fullwidth: false,
    render: () => {
      // Return to default state
      const figure = d3.select("#figure-container");
      figure.html("");
      figure.style("background-color", "#8a8a8a");
      figure.append("p").text("4");
    },
  },
];

// Make steps available globally
window.stepsConfig = stepsConfig;
