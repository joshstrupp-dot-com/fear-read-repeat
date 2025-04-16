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
    id: "life-sucks",
    text: "Life can really suck. Advice can help. And there is no shortage of advice.",
    fullwidth: true,
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
      figure
        .append("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("font-size", "2rem")
        .style("text-align", "center")
        .style("color", "white")
        .text("Intro statement");
    },
  },
  {
    id: "quick-fixes",
    text: "You're a few keystrokes from fixing your marriage. You're one Amazon order from never aging again. You're 8 minutes from knowing all of Wall Street's secrets (or 4 minutes if you watch on 2x).",
    fullwidth: false,
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
      figure
        .append("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("font-size", "2rem")
        .style("text-align", "center")
        .style("color", "white")
        .text(
          "stylized slew of youtube talking heads, podcasters, self help articles, etc."
        );
    },
  },
  {
    id: "self-help",
    text: "This advice is called self-help. Like it or not, realize it or not — you're probably a consumer of self-help.",
    fullwidth: true,
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
      figure
        .append("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("font-size", "2rem")
        .style("text-align", "center")
        .style("color", "white")
        .text("same as above or blank");
    },
  },

  {
    id: "fastest-growing",
    text: "Self-help literature, a product born out of and almost entirely consumed in the United States, is the fastest growing nonfiction genre since 2013.",
    fullwidth: true,
    render: () => {
      // Clear existing content
      const figure = d3.select("#figure-container");
      figure.html("");

      // Create a container for the chapter-1 visualization
      const vizContainer = figure
        .append("div")
        .attr("id", "chapter-1")
        .style("width", "100%")
        .style("height", "100%");

      // Load and execute chapter-1-dev.js
      const script = document.createElement("script");
      script.src = "chapter-1-dev.js";
      document.body.appendChild(script);

      // Dispatch an initialization event
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("visualizationUpdate", {
            detail: { step: "intro" },
          })
        );
      }, 100);
    },
  },
  {
    id: "blame-game",
    text: "There are titles that claim your dead-end job is your fault and yours to fix; that you're depressed because you're not doing enough squat jumps; that you can't connect with your child unless you follow these \"ten steps to tame your teen.\"",
    fullwidth: true,
    render: () => {
      // Keep the existing visualization but trigger the zoom update
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "intro-2" },
        })
      );
    },
  },

  {
    id: "systemic-problems",
    text: "So much of self-help suggests you're not doing enough, which, in my opinion, isn't cool. Our anxieties are often the result of events outside of our control and some authors efforts to, in the words of scholar Beth Blum in her book The Self-Help Compulsion, \"privatize solutions to systemic problems.\"",
    fullwidth: true,
    render: () => {
      // Keep the existing visualization in its zoomed state
      // No need to dispatch a new event as we want to maintain the same view as "blame-game"
    },
  },
  {
    id: "goodreads-data",
    text: "From a Goodreads dataset featuring tens of thousands of books, we will explore how the self help industry took advantage of neoliberal shifts in self care, how (western) world events — not our inability to pray more or take ashwaganda — are at the root of our fears, and which authors may be cashing in.",
    fullwidth: true,
    render: () => {
      // Clear any existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "goodreads-data" },
        })
      );

      // Set up the placeholder display
      const figure = d3.select("#figure-container");
      figure.html("");
      figure
        .append("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("align-items", "center")
        .style("font-size", "2rem")
        .style("text-align", "center")
        .style("color", "white")
        .text("placeholder for Goodreads dataset analysis");
    },
  },
];

// Make steps available globally
window.stepsConfig = stepsConfig;
