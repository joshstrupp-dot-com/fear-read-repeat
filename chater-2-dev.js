// Select the chapter-2 div and append an SVG element
const margin = { top: 40, right: 30, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Global variables to track state
let currentVisibleCount = 6;
let svg;
let x;
let y;
let chartData;
let years;
let color;

// Function to update the chart with new data range
function updateChart() {
  // Get visible years based on current count
  const visibleYears = years.slice(0, currentVisibleCount);

  // Get max count only from visible years' data
  const visibleData = chartData.filter((d) => visibleYears.includes(d.year));
  const visibleMax = d3.max(visibleData, (d) =>
    Math.max(d.INTERNAL, d.EXTERNAL)
  );

  // Update scales
  x.domain(visibleYears);
  y.domain([0, visibleMax]);

  // Update x-axis with transition
  svg
    .select(".x-axis")
    .transition()
    .duration(500)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "middle");

  // Update y-axis with transition
  svg.select(".y-axis").transition().duration(500).call(d3.axisLeft(y));

  // Line generator function
  const line = d3
    .line()
    .x((d) => x(d.year) + x.bandwidth() / 2)
    .y((d) => y(d.value))
    .defined((d) => !isNaN(d.value)); // Handle NaN values

  // Update lines and dots for each origin
  ["INTERNAL", "EXTERNAL"].forEach((origin) => {
    // Filter data to only visible years for this update
    const visibleLineData = chartData
      .filter((d) => visibleYears.includes(d.year))
      .map((d) => ({
        year: d.year,
        value: d[origin],
        names: d[`${origin}_names`],
      }));

    // Update the actual data line
    svg
      .select(`.line-${origin}`)
      .datum(visibleLineData)
      .transition()
      .duration(500)
      .attr("d", line);

    // Update dots - use data join pattern for proper updates
    const dots = svg
      .selectAll(`.dot-${origin}`)
      .data(visibleLineData, (d) => d.year);

    // Update existing dots
    dots
      .transition()
      .duration(500)
      .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.value));
  });

  // Update button state
  const button = d3.select("#expand-chart");
  if (currentVisibleCount >= years.length) {
    button.attr("disabled", true);
  } else {
    button.attr("disabled", null);
  }
}

// Load the CSV file and create a line chart
d3.csv("data/sh_0415_time/sh_0415_time.csv")
  .then((data) => {
    // Filter out specific year bins
    const filteredData = data.filter(
      (d) =>
        d.year_bin_5yr !== "0_0_pre-1855" &&
        d.year_bin_5yr !== "0_pre-1855" &&
        d.year_bin_5yr !== "9_post-2014"
    );

    // Group data by year_bin_5yr and problem_origin, and count records
    const groupedData = d3.rollup(
      filteredData,
      (v) => ({
        count: v.length,
        names: v.map((d) => d.name),
      }),
      (d) => d.year_bin_5yr,
      (d) => d.problem_origin
    );

    // Convert the nested Map to an array format suitable for lines
    years = Array.from(groupedData.keys()).sort();
    chartData = years.map((year) => {
      const yearData = { year: year };
      const origins = groupedData.get(year);
      // Add counts and names for each problem origin
      yearData.INTERNAL = origins.get("INTERNAL")?.count || 0;
      yearData.INTERNAL_names = origins.get("INTERNAL")?.names || [];
      yearData.EXTERNAL = origins.get("EXTERNAL")?.count || 0;
      yearData.EXTERNAL_names = origins.get("EXTERNAL")?.names || [];
      return yearData;
    });

    // Get first 6 years for initial view
    const visibleYears = years.slice(0, currentVisibleCount);

    // Get max count only from visible years' data
    const visibleData = chartData.filter((d) => visibleYears.includes(d.year));
    const visibleMax = d3.max(visibleData, (d) =>
      Math.max(d.INTERNAL, d.EXTERNAL)
    );

    // Create SVG
    svg = d3
      .select("#chapter-2")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up scales
    x = d3.scaleBand().domain(visibleYears).range([0, width]).padding(0.2);
    y = d3.scaleLinear().domain([0, visibleMax]).range([height, 0]);

    // Add x-axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle");

    // Add x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("Year (5-year bins)");

    // Add y-axis
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .style("text-anchor", "middle")
      .text("Count");

    // Color scale
    color = d3
      .scaleOrdinal()
      .domain(["INTERNAL", "EXTERNAL"])
      .range(["#4682b4", "#ff7f50"]);

    // Create the lines
    const line = d3
      .line()
      .x((d) => x(d.year) + x.bandwidth() / 2)
      .y((d) => y(d.value));

    // Add lines for each problem origin
    ["INTERNAL", "EXTERNAL"].forEach((origin) => {
      // Filter data to only visible years for initial render
      const visibleLineData = chartData
        .filter((d) => visibleYears.includes(d.year))
        .map((d) => ({
          year: d.year,
          value: d[origin],
          names: d[`${origin}_names`],
        }));

      // Add the actual data line
      svg
        .append("path")
        .attr("class", `line-${origin}`)
        .datum(visibleLineData)
        .attr("fill", "none")
        .attr("stroke", color(origin))
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add dots for each data point
      svg
        .selectAll(`.dot-${origin}`)
        .data(visibleLineData)
        .join("circle")
        .attr("class", `dot-${origin}`)
        .attr("cx", (d) => x(d.year) + x.bandwidth() / 2)
        .attr("cy", (d) => y(d.value))
        .attr("r", 4)
        .attr("fill", color(origin))
        .on("mouseover", function (event, d) {
          d3.select(this)
            .attr("r", 6)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

          // Create tooltip
          svg
            .append("text")
            .attr("class", "tooltip")
            .attr("x", x(d.year) + x.bandwidth() / 2)
            .attr("y", y(d.value) - 10)
            .attr("text-anchor", "middle")
            .text(
              d.names && d.names.length > 0
                ? d.names.join(", ")
                : "No names available"
            )
            .style("font-size", "12px")
            .style("fill", "black");
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 4).attr("stroke", "none");

          // Remove tooltip
          svg.selectAll(".tooltip").remove();
        });
    });

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 100}, 0)`);

    ["INTERNAL", "EXTERNAL"].forEach((key, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(key));

      legendRow.append("text").attr("x", 25).attr("y", 12.5).text(key);
    });

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Problem Origin by Year");

    // Add button click handler
    d3.select("#expand-chart").on("click", function () {
      if (currentVisibleCount < years.length) {
        currentVisibleCount++;
        updateChart();
      }
    });
  })
  .catch((error) => console.error("Error loading CSV:", error));
