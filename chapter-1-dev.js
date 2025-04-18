// Chapter 1 - Simple Data Visualization
(function () {
  // First, adjust the chapter-1 div to fill the viewport
  const chapter1Div = document.getElementById("chapter-1");
  chapter1Div.style.width = "100vw";
  chapter1Div.style.height = "100vh";
  chapter1Div.style.margin = "0";
  chapter1Div.style.padding = "0";
  chapter1Div.style.border = "none";
  chapter1Div.style.overflow = "hidden";
  chapter1Div.style.position = "relative";

  // Get the actual dimensions of the container
  const width = chapter1Div.clientWidth;
  const height = chapter1Div.clientHeight;

  // Set up margins for the chart
  const margin = { top: 0, right: 20, bottom: 20, left: 20 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Target number of rectangles (approximate)
  const targetCount = 45000; // Adjust this number based on desired density
  const spacing = 1;

  // Calculate rectangle dimensions to fit the available space
  // Maintain aspect ratio of 3:5
  const aspectRatio = 3 / 5;

  // Calculate optimal dimensions based on available space and target count
  const rectHeight = Math.sqrt(
    (chartWidth * chartHeight) / (targetCount * aspectRatio)
  );
  const rectWidth = rectHeight * aspectRatio;

  // Calculate total width and height needed for each rectangle including spacing
  const totalRectWidth = rectWidth + 2 * spacing;
  const totalRectHeight = rectHeight + 2 * spacing;

  // Calculate how many rectangles can fit in each dimension
  const rectsPerRow = Math.floor(chartWidth / totalRectWidth);
  const rectsPerColumn = Math.floor(chartHeight / totalRectHeight);

  // Calculate total number of rectangles that can fit
  const totalRectangles = rectsPerRow * rectsPerColumn;

  console.log(
    `Rectangle size: ${rectWidth.toFixed(2)}x${rectHeight.toFixed(2)} pixels`
  );
  console.log(`Number of rectangles that can fit: ${totalRectangles}`);
  console.log(
    `Rectangles per row: ${rectsPerRow}, Rectangles per column: ${rectsPerColumn}`
  );

  // Create SVG container with 100% dimensions
  const svg = d3
    .select("#chapter-1")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .style("display", "block");

  // Add a group for zoom transformation
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create zoom behavior
  const zoom = d3
    .zoom()
    .scaleExtent([1, 10])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    })
    .filter((event) => {
      // Disable mouse wheel/scroll zooming
      return !event.type.includes("wheel");
    });

  // Apply zoom behavior to svg
  svg.call(zoom);

  // Variable to track if we've zoomed in on a specific book
  let zoomedIn = false;
  let activeRectangle = null;

  // Function to display data as a grid of rectangles
  function displayData(data) {
    if (data && data.length > 0) {
      // Calculate how many records we can display
      const recordsToDisplay = Math.min(data.length, totalRectangles);

      // Add tooltip div to body
      const tooltip = d3.select("body").append("div").attr("class", "tooltip");

      // Create rectangles for each record
      for (let i = 0; i < recordsToDisplay; i++) {
        const row = Math.floor(i / rectsPerRow);
        const col = i % rectsPerRow;

        const x = col * totalRectWidth + spacing;
        const y = row * totalRectHeight + spacing;

        g.append("rect")
          .attr("x", x)
          .attr("y", y)
          .attr("width", rectWidth)
          .attr("height", rectHeight)
          .attr("fill", "var(--color-purple)")
          .attr("stroke", "none")
          .attr("rx", 1) // Add 1px rounded corner
          .datum(data[i])
          .on("mouseover", function (event, d) {
            // Show tooltip with name
            tooltip
              .html(d.name || "Unnamed Record")
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 28 + "px")
              .style("opacity", 0.9);
          })
          .on("mouseout", function () {
            // Hide tooltip
            tooltip.style("opacity", 0);
          })
          .on("click", function (event, d) {
            event.stopPropagation(); // Prevent event from bubbling up

            if (!zoomedIn || this !== activeRectangle) {
              // Store the clicked rectangle as active
              activeRectangle = this;
              // Only highlight the active rectangle
              g.selectAll("rect").attr("fill", "var(--color-base-darker)");
              d3.select(this).attr("fill", "var(--color-purple)");

              // Calculate zoom level - we want to show approximately 5-7 books around the clicked one
              const zoomScale = 5;

              // Get the center position of the clicked rectangle
              const centerX = x + rectWidth / 2;
              const centerY = y + rectHeight / 2;

              // Calculate the transform to center on the clicked rectangle
              const transform = d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(zoomScale)
                .translate(-centerX, -centerY);

              // Apply the zoom transition
              svg.transition().duration(750).call(zoom.transform, transform);

              zoomedIn = true;
            } else if (this === activeRectangle) {
              // We're clicking on the already zoomed book, so zoom back out
              activeRectangle = null;

              svg
                .transition()
                .duration(750)
                .call(
                  zoom.transform,
                  d3.zoomIdentity.translate(margin.left, margin.top).scale(1)
                );

              zoomedIn = false;

              // Reset all rectangle colors
              g.selectAll("rect").attr("fill", "var(--color-base-darker)");
            }
          });
      }

      // Add info text about visualization
      g.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-family", "Libre Caslon Display, serif")
        .style("font-weight", "bold")
        .attr("fill", "white")
        .attr("filter", "drop-shadow(1px 1px 2px var(--color-base-darker))")
        .text(`Displaying ${recordsToDisplay} of ${data.length} records`);

      // Add click handler to background to zoom out
      svg.on("click", function (event) {
        if (zoomedIn && !event.defaultPrevented) {
          // Reset active rectangle
          activeRectangle = null;

          // Zoom out to initial state
          svg
            .transition()
            .duration(750)
            .call(
              zoom.transform,
              d3.zoomIdentity.translate(margin.left, margin.top).scale(1)
            );

          zoomedIn = false;

          // Reset all rectangle colors
          g.selectAll("rect").attr("fill", "var(--color-purple)");
        }
      });
    }
  }

  // Try loading data
  try {
    d3.csv("data/sh_0415_time/sh_0415_time.csv")
      .then(displayData)
      .catch(() => {
        // Alternative fetch method if d3.csv fails
        fetch("data/sh_0415_time/sh_0415_time.csv")
          .then((response) => response.text())
          .then((csvText) => {
            const rows = csvText.split("\n");
            const headers = rows[0].split(",");
            const parsedData = rows.slice(1).map((row) => {
              const values = row.split(",");
              const obj = {};
              headers.forEach((header, i) => {
                obj[header] = values[i];
              });
              return obj;
            });
            displayData(parsedData);
          })
          .catch(useHardcodedData);
      });
  } catch (error) {
    useHardcodedData();
  }

  // Function to generate hard-coded data if CSV loading fails
  function useHardcodedData() {
    console.warn("Using hard-coded data as fallback");
    const fakeData = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Book ${i}`,
      value: Math.random() * 100,
    }));
    displayData(fakeData);
  }
  // Near the end of chapter-1-dev.js
  document.addEventListener("visualizationUpdate", (event) => {
    const stepId = event.detail.step;

    // Apply step-specific changes to your visualization
    if (stepId === "intro") {
      // Reset/initial view
      svg
        .transition()
        .duration(0)
        .call(
          zoom.transform,
          d3.zoomIdentity.translate(margin.left, margin.top).scale(1)
        );
      zoomedIn = false;
      g.selectAll("rect").attr("fill", "var(--color-base-darker)");
    } else if (stepId === "intro-2") {
      // Zoom in to a specific area
      const centerX = chartWidth / 3;
      const centerY = chartHeight / 3;

      // Transition to a zoomed view
      const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(3)
        .translate(-centerX, -centerY);

      svg.transition().duration(1000).call(zoom.transform, transform);
      zoomedIn = true;
    } else if (stepId === "goodreads-data") {
      // Remove our visualization when moving to the next section
      const chapter1Div = document.getElementById("chapter-1");
      if (chapter1Div) {
        chapter1Div.innerHTML = "";
      }
    }
  });
})();
