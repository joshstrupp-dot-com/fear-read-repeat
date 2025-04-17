// Chapter 1 - Simple Data Visualization
(function () {
  ///////////////////////////////////////////////////////////// ! Data Preloading
  // Global data cache
  window.dataCache = window.dataCache || {};

  // Preload all needed datasets at the start
  function preloadAllData() {
    // Preload time data
    if (!window.dataCache.timeData) {
      console.log("Preloading time data");
      d3.csv("data/sh_0415_time/sh_0415_time.csv")
        .then(function (data) {
          window.dataCache.timeData = data;
          console.log("Time data preloaded:", data.length, "records");
        })
        .catch(function (error) {
          console.error("Error preloading time data:", error);
        });
    }

    // Preload author data
    if (!window.dataCache.authorData) {
      console.log("Preloading author data");
      d3.csv("data/sh_0415_author/author.csv")
        .then(function (data) {
          window.dataCache.authorData = data;
          console.log("Author data preloaded:", data.length, "records");
        })
        .catch(function (error) {
          console.error("Error preloading author data:", error);
        });
    }
  }

  // Start preloading all data immediately
  preloadAllData();

  ///////////////////////////////////////////////////////////// ! Setup and Configuration
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

  ///////////////////////////////////////////////////////////// ! Rectangle Calculations
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

  ///////////////////////////////////////////////////////////// ! Create SVG
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

  ///////////////////////////////////////////////////////////// ! Zoom Behavior
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

  // Define categories globally for reuse
  // Self-help categories (teal/internal)
  const selfHelpCategories = [
    "Stress Management",
    "Underachievement & Stalled Potential",
    "Identity, Self-Image & Belonging",
    "Confidence & Assertiveness Issues",
    "Life Direction & Motivation",
  ];

  // Other categories (orange/external)
  const otherCategories = [
    "Finding Meaning in Metaphysics",
    "Interpersonal & Family Dynamics",
    "Mental & Emotional Health",
    "Spiritual & Existential Crisis",
    "Structural & Physical Challenges",
  ];

  // All categories combined
  const allCategories = [...selfHelpCategories, ...otherCategories];

  ///////////////////////////////////////////////////////////// ! Data Display Function
  // Function to display data as a grid of rectangles
  function displayData(data) {
    if (data && data.length > 0) {
      // Calculate how many records we can display
      const recordsToDisplay = Math.min(data.length, totalRectangles);

      // // Sort data by key_cat_primary_agg before displaying
      // data = data.sort((a, b) => {
      //   if (!a.key_cat_primary_agg) return 1;
      //   if (!b.key_cat_primary_agg) return -1;
      //   return a.key_cat_primary_agg.localeCompare(b.key_cat_primary_agg);
      // });

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
          .attr("fill", "var(--color-base-darker)")
          .attr("stroke", "none")
          .attr("rx", 1) // Add 1px rounded corner
          .datum(data[i])
          .on("mouseover", function (event, d) {
            // Show tooltip with name and category
            tooltip
              .html(
                `${d.name || "Unnamed Record"}${
                  d.key_cat_primary_agg
                    ? "<br>Category: " + d.key_cat_primary_agg
                    : ""
                }`
              )
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
              // g.selectAll("rect").attr("fill", "var(--color-base-darker)");
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
              // g.selectAll("rect").attr("fill", "var(--color-base-darker)");
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
          // g.selectAll("rect").attr("fill", "var(--color-base-darker)");
        }
      });
    }
  }

  ///////////////////////////////////////////////////////////// ! Data Loading
  // Try loading data
  function loadData() {
    // First, check if data is already preloaded in dataCache
    if (window.dataCache && window.dataCache.timeData) {
      console.log("Using preloaded time data");
      displayData(window.dataCache.timeData);
      return;
    }

    // Otherwise, fall back to loading data directly
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
  }

  // Load data when visualization is ready
  loadData();

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

  ///////////////////////////////////////////////////////////// ! Event Handling
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

      // Reset positions to grid
      g.selectAll("rect")
        .transition()
        .duration(750)
        .attr("x", function (d, i) {
          const col = i % rectsPerRow;
          return col * totalRectWidth + spacing;
        })
        .attr("y", function (d, i) {
          const row = Math.floor(i / rectsPerRow);
          return row * totalRectHeight + spacing;
        });

      // Remove any category labels
      g.selectAll(".category-label").remove();
      ///////////////////////////////////////////////////////////// ! organize by category
    } else if (stepId === "intro-2") {
      // Create category piles in a grid layout (5 columns, 2 rows)
      const pilePositions = {};
      const gridCols = 5;
      const colWidth = chartWidth / gridCols;
      const rowHeight = chartHeight / 3;

      // Position self-help categories on top row
      selfHelpCategories.forEach((category, i) => {
        pilePositions[category] = {
          x: colWidth * (i + 0.5),
          y: rowHeight * 1,
        };
      });

      // Position other categories on bottom row
      otherCategories.forEach((category, i) => {
        pilePositions[category] = {
          x: colWidth * (i + 0.5),
          y: rowHeight * 2,
        };
      });

      // Add an "Uncategorized" position for any that don't match
      pilePositions["Uncategorized"] = {
        x: chartWidth / 2,
        y: rowHeight * 2.5,
      };

      // Prepare nodes for positioning
      const nodes = [];
      g.selectAll("rect").each(function (d) {
        if (!d) return; // Skip if no data

        const rect = d3.select(this);
        let targetCat = "Uncategorized";

        // Find which category this rectangle belongs to
        if (d.key_cat_primary_agg) {
          if (allCategories.includes(d.key_cat_primary_agg)) {
            targetCat = d.key_cat_primary_agg;
          }
        }

        // Store node data
        nodes.push({
          category: targetCat,
          element: this,
          x: parseFloat(rect.attr("x")) + rectWidth / 2,
          y: parseFloat(rect.attr("y")) + rectHeight / 2,
        });
      });

      // Apply positions with more heavily staggered movement in batches
      const batchSize = 100; // Increase batch size from 50 to 100
      const totalTime = 700; // Reduce total time from 2000 to 700ms

      // Process nodes in batches
      for (
        let batch = 0;
        batch < Math.ceil(nodes.length / batchSize);
        batch++
      ) {
        const start = batch * batchSize;
        const end = Math.min(start + batchSize, nodes.length);

        // Add a delay between batches - reduce delay between batches
        const batchDelay = batch * 70; // Reduce from 200ms to 70ms per batch

        // Process this batch
        for (let i = start; i < end; i++) {
          const node = nodes[i];
          const pos = pilePositions[node.category];

          // Skip any nodes with undefined positions
          if (!pos) continue;

          // Add random offset within the pile to create natural clustering
          const offsetX = (Math.random() - 0.5) * colWidth * 0.4;
          const offsetY = (Math.random() - 0.5) * rowHeight * 0.25;

          // Calculate target position
          const targetX = pos.x + offsetX;
          const targetY = pos.y + offsetY;

          // Apply transition with delay
          const withinBatchDelay = Math.random() * 130; // Reduce from 400ms to 130ms

          d3.select(node.element)
            .transition()
            .delay(batchDelay + withinBatchDelay)
            .duration(80) // Reduce from 100ms to 80ms
            .ease(d3.easeQuadOut) // Change to slightly faster easing
            .attr("x", targetX - rectWidth / 2)
            .attr("y", targetY - rectHeight / 2);
        }
      }

      // Remove any existing category labels
      g.selectAll(".category-label").remove();

      // Add category labels for all categories
      allCategories.forEach((category) => {
        const pos = pilePositions[category];
        if (!pos) return;

        g.append("text")
          .attr("class", "category-label")
          .attr("x", pos.x)
          .attr("y", pos.y - rowHeight * 0.25)
          .attr("text-anchor", "middle")
          .style("font-family", "Libre Franklin, sans-serif")
          .style("font-weight", "200")
          .style("font-size", "14px")
          .style("color", "#000")
          // .attr("fill", "white")
          .attr("filter", "drop-shadow(1px 1px 2px var(--color-base-darker))")
          .text(category);
      });
    } else if (stepId === "external-internal") {
      // Apply color changes immediately based on category
      g.selectAll("rect").attr("fill", function (d) {
        if (
          d &&
          d.key_cat_primary_agg &&
          selfHelpCategories.includes(d.key_cat_primary_agg)
        ) {
          return "var(--color-teal)";
        } else if (
          d &&
          d.key_cat_primary_agg &&
          otherCategories.includes(d.key_cat_primary_agg)
        ) {
          return "var(--color-orange)";
        } else {
          return "var(--color-base-darker)";
        }
      });
    } else if (stepId === "goodreads-data") {
      // Remove our visualization when moving to the next section
      const chapter1Div = document.getElementById("chapter-1");
      if (chapter1Div) {
        chapter1Div.innerHTML = "";
      }
    }
  });
})();
