// Chapter 3 - Author Visualization
(function () {
  // Adjust chapter-3 div to fill the viewport
  const chapter3Div = document.getElementById("chapter-3");
  chapter3Div.style.width = "100vw";
  chapter3Div.style.height = "90vh";
  chapter3Div.style.margin = "0";
  chapter3Div.style.padding = "0";
  chapter3Div.style.border = "none";
  chapter3Div.style.overflow = "hidden";
  chapter3Div.style.position = "relative";

  // Get the actual dimensions of the container
  const fullWidth = chapter3Div.clientWidth;
  const fullHeight = chapter3Div.clientHeight;

  // Set up dimensions and margins for the chart
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = fullWidth - margin.left - margin.right;
  const height = fullHeight - margin.top - margin.bottom;

  let allAuthorData; // Store the data globally
  let svg; // Store the SVG globally

  // Function to filter data based on step ID
  function filterDataForStep(stepId) {
    if (!allAuthorData) return [];

    switch (stepId) {
      case "celebrity-authors":
        return allAuthorData.filter((d) =>
          [
            "Jillian Michaels",
            "Oprah Winfrey",
            "Tony Robbins",
            "Deepak Chopra",
            "Gwyneth Paltrow",
            "Marie Kondo",
            "Tim Ferriss",
            "Brené Brown",
            "Rachel Hollis",
            "Jay Shetty",
          ].includes(d.author_clean)
        );
      case "celebrity-authors-2":
        return allAuthorData.filter(
          (d) =>
            d.author_clean === "Jillian Michaels" ||
            d.author_clean === "Donald J. Trump"
        );
      case "all-authors":
      default:
        return allAuthorData;
    }
  }

  // Function to display author data
  function displayAuthorData(data) {
    if (!data || data.length === 0) return;

    // Clear existing SVG content first
    svg.selectAll("*").remove();

    // Parse numeric data
    data.forEach((d) => {
      d.avg_star_rating = +d.avg_star_rating;
      d.author_num_books = Math.max(1, +d.author_num_books); // Ensure minimum value of 1
      d.avg_cred_score = +d.avg_cred_score;
      d.bt_count = +d.bt_count;
    });

    // Create scales
    const xScale = d3
      .scaleLog()
      .domain([1, d3.max(data, (d) => d.author_num_books)]) // Start at 1 since log(0) is undefined
      .nice()
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([2.3, d3.max(data, (d) => d.avg_star_rating)])
      .nice()
      .range([height, 0]);

    // Color scale for avg_cred_score (1-5)
    const colorScale = d3
      .scaleSequential()
      .domain([1, 5])
      .interpolator(d3.interpolateViridis);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .text("Number of Books");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("x", -height / 2)
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .text("Average Star Rating");

    // Add tooltip
    const tooltip = d3
      .select("#chapter-3")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    // Add dots
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.author_num_books))
      .attr("cy", (d) => yScale(d.avg_star_rating))
      .attr("r", 5)
      .style("fill", (d) =>
        d.avg_cred_score === 0
          ? "rgba(0,0,0,0.1)"
          : colorScale(d.avg_cred_score)
      )
      .style("stroke", (d) => (d.bt_count > 0 ? "black" : "none"))
      .style("stroke-width", 1.5)
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `<strong>${d.author_clean}</strong><br/>
                       Books: ${d.author_num_books}<br/>
                       Rating: ${d.avg_star_rating.toFixed(2)}<br/>
                       Cred Score: ${d.avg_cred_score.toFixed(2)}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }

  // Function to use hardcoded data as fallback
  function useHardcodedData() {
    const hardcodedData = [
      {
        author_clean: "Jillian Michaels",
        avg_star_rating: 4.1,
        author_num_books: 7,
        avg_cred_score: 3.2,
        bt_count: 1,
      },
      {
        author_clean: "Donald J. Trump",
        avg_star_rating: 3.8,
        author_num_books: 14,
        avg_cred_score: 2.9,
        bt_count: 0,
      },
      {
        author_clean: "Daniel Kahneman",
        avg_star_rating: 4.7,
        author_num_books: 3,
        avg_cred_score: 4.9,
        bt_count: 2,
      },
    ];

    allAuthorData = hardcodedData;

    // Get initial step from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const currentStep = urlParams.get("step") || "all-authors";

    displayAuthorData(filterDataForStep(currentStep));
  }

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

    // Try loading data
    d3.csv("data/sh_0415_author/author.csv")
      .then((data) => {
        allAuthorData = data; // Store the loaded data

        // Get initial step from URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const currentStep = urlParams.get("step") || "all-authors";

        displayAuthorData(filterDataForStep(currentStep));
      })
      .catch(useHardcodedData);
  } catch (error) {
    useHardcodedData();
  }

  // Add event listener for visualization updates
  document.addEventListener("visualizationUpdate", (event) => {
    const stepId = event.detail.step;
    displayAuthorData(filterDataForStep(stepId));
  });
})();
