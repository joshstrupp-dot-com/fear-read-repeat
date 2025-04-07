/**
 * Steps Configuration
 * Each step has:
 * - id: unique identifier
 * - text: what appears in the step
 * - render: function to update the figure when this step is active
 */
const stepsConfig = [
  {
    id: "intro",
    text: "STEP 1",
    render: () => {
      // Simple text rendering
      const figure = d3.select("#figure-container");
      figure.html("");
      figure.append("p").text("1");
    },
  },
  {
    id: "analysis",
    text: "STEP 2",
    render: () => {
      // Example with custom color
      const figure = d3.select("#figure-container");
      figure.html("");
      figure.style("background-color", "#1e88e5");
      figure.append("p").text("2");
    },
  },
  {
    id: "results",
    text: "STEP 3",
    render: () => {
      // Example with SVG content
      const figure = d3.select("#figure-container");
      figure.html("");
      figure.style("background-color", "#8a8a8a");
      figure.append("p").text("3");

      // Alternative: inserting SVG
      // figure.html('<svg width="100%" height="100%"><circle cx="50%" cy="50%" r="40%" fill="red"></circle></svg>');
    },
  },
  {
    id: "conclusion",
    text: "STEP 4",
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
