// Chapter 3 - Author Visualization
(function () {
  ///////////////////////////////////////////////////////////// ! Setup and Configuration
  // Adjust chapter-3 div to fill the viewport
  const chapter3Div = document.getElementById("chapter-3");
  chapter3Div.style.width = "100vw";
  chapter3Div.style.height = "100vh";
  chapter3Div.style.margin = "0";
  chapter3Div.style.padding = "0";
  chapter3Div.style.border = "none";
  chapter3Div.style.overflow = "hidden";
  chapter3Div.style.position = "relative";

  // Get the actual dimensions of the container
  const fullWidth = chapter3Div.clientWidth;
  const fullHeight = chapter3Div.clientHeight;

  // Set up dimensions and margins for the chart
  const margin = { top: 100, right: 100, bottom: 100, left: 100 };
  const width = fullWidth - margin.left - margin.right;
  const height = fullHeight - margin.top - margin.bottom;

  let allAuthorData; // Store the data globally
  let svg; // Store the SVG globally

  // Define celebrity authors list once
  const celebrityAuthors = [
    "50 Cent",
    "Arnold Schwarzenegger",
    "Cameron Diaz",
    "Brené Brown",
    "Deepak Chopra",
    "David Goggins",
    "Demi Lovato",
    "Donald J. Trump",
    "Eckhart Tolle",
    "Esther Hicks",
    "Gabrielle Bernstein",
    "Gary Vaynerchuk",
    "Gwyneth Paltrow",
    "Jay Shetty",
    "Jen Sincero",
    "Jillian Michaels",
    "Marie Kondo",
    "Mark Manson",
    "Matthew McConaughey",
    "Mel Robbins",
    "Oprah Winfrey",
    "Michelle Obama",
    "Rachel Hollis",
    "Rhonda Byrne",
    "Russell Brand",
    "Phillip C. McGraw",
    "Tim Ferriss",
    "Tony Robbins",
    "Rich Roll",
    "Russell Brand",
  ];

  ///////////////////////////////////////////////////////////// ! Data Filtering Functions
  // Function to filter data based on step ID
  function filterDataForStep(stepId) {
    if (!allAuthorData) return [];

    switch (stepId) {
      case "celebrity-authors":
        return allAuthorData.filter((d) =>
          celebrityAuthors.includes(d.author_clean)
        );
      case "celebrity-authors-2":
        return allAuthorData.filter((d) => {
          const isCelebrity = celebrityAuthors.includes(d.author_clean);
          if (isCelebrity) {
            d.highlighted =
              d.author_clean === "Jillian Michaels" ||
              d.author_clean === "Donald J. Trump";
          }
          return isCelebrity;
        });
      case "all-authors":
      default:
        return allAuthorData;
    }
  }

  ///////////////////////////////////////////////////////////// ! Visualization Functions
  // Function to display author data
  function displayAuthorData(data) {
    if (!data || data.length === 0) return;

    // Clear existing SVG content first
    svg.selectAll("*").remove();

    ///////////////////////////////////////////////////////////// ! Data Processing
    // Parse numeric data
    data.forEach((d) => {
      d.avg_star_rating = +d.avg_star_rating;
      d.author_num_books = Math.max(1, +d.author_num_books); // Ensure minimum value of 1
      d.avg_cred_score = +d.avg_cred_score;
      d.bt_count = +d.bt_count;
    });

    ///////////////////////////////////////////////////////////// ! Scales Creation
    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.avg_star_rating),
        d3.max(data, (d) => d.avg_star_rating),
      ])
      .nice()
      .range([0, width]);

    const yScale = d3
      .scaleLog()
      .domain([
        1, // Keeping minimum at 1 for log scale
        d3.max(data, (d) => d.author_num_books),
      ])
      .nice()
      .range([height, 0]);

    // Color scale for avg_cred_score (1-5)
    const colorScale = d3
      .scaleSequential()
      .domain([1, 5])
      .interpolator(
        d3.interpolateHsl("var(--color-yellow)", "var(--color-pink)")
      );

    ///////////////////////////////////////////////////////////// ! Axes Creation
    // Add X axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("class", "annotation");

    // Add X axis label
    svg
      .append("text")
      .attr("class", "annotation")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 50)
      .style("text-anchor", "middle")
      .text("Average Star Rating");

    // Add Y axis
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .attr("class", "annotation");

    // Add Y axis label
    svg
      .append("text")
      .attr("class", "annotation")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 50)
      .style("text-anchor", "middle")
      .text("Number of Books");

    ///////////////////////////////////////////////////////////// ! Tooltip Creation
    // Add tooltip
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    ///////////////////////////////////////////////////////////// ! Data Points Creation
    // Add dots
    const circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.avg_star_rating))
      .attr("cy", (d) => yScale(d.author_num_books))
      .attr("r", (d) => (d.highlighted ? 10 : 5))
      .style("fill", "var(--color-base-darker)")
      .style("opacity", 0.9)
      .style("stroke", (d) => (d.bt_count > 0 ? "var(--color-teal)" : "none"))
      .style("stroke-width", 1.5);

    // Add mouseover and mouseout events to circles
    circles.on("mouseover", function (event, d) {
      tooltip
        .html(
          `<strong>${d.author_clean}</strong><br/>
           Books: ${d.author_num_books}<br/>
           Rating: ${d.avg_star_rating.toFixed(2)}`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px")
        .style("opacity", 0.9);
    });

    circles.on("mouseout", function () {
      tooltip.style("opacity", 0);
    });

    // Apply transition separately after setting up the event handlers
    circles
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr("r", (d) => (d.highlighted ? 10 : 5));
  }

  // ///////////////////////////////////////////////////////////// ! Call Filters

  function stepFilter() {
    allAuthorData = hardcodedData;

    // Get initial step from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const currentStep = urlParams.get("step") || "all-authors";

    displayAuthorData(filterDataForStep(currentStep));
  }

  ///////////////////////////////////////////////////////////// ! Initialization
  try {
    // Create SVG container
    svg = d3
      .select("#chapter-3")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("display", "block")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Check if data is already preloaded in dataCache
    if (window.dataCache && window.dataCache.authorData) {
      console.log("Using preloaded author data");
      allAuthorData = window.dataCache.authorData;

      // Get initial step from URL if available
      const urlParams = new URLSearchParams(window.location.search);
      const currentStep = urlParams.get("step") || "all-authors";

      displayAuthorData(filterDataForStep(currentStep));
    } else {
      // Try loading data directly if not preloaded
      d3.csv("data/sh_0415_author/author.csv")
        .then((data) => {
          allAuthorData = data; // Store the loaded data

          // Get initial step from URL if available
          const urlParams = new URLSearchParams(window.location.search);
          const currentStep = urlParams.get("step") || "all-authors";

          displayAuthorData(filterDataForStep(currentStep));
        })
        .catch(stepFilter);
    }
  } catch (error) {
    stepFilter();
  }

  ///////////////////////////////////////////////////////////// ! Event Listeners
  // Add event listener for visualization updates
  document.addEventListener("visualizationUpdate", (event) => {
    const stepId = event.detail.step;
    displayAuthorData(filterDataForStep(stepId));
  });
})();
