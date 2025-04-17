///////////////////////////////////////////////////////////// ! Setup and Configuration
// Immediately Invoked Function Expression to prevent global variable conflicts
(function () {
  // Adjust chapter-2 div to fill the viewport
  const chapter2Div = document.getElementById("chapter-2");
  chapter2Div.style.width = "100vw";
  chapter2Div.style.height = "100vh";
  chapter2Div.style.margin = "0";
  chapter2Div.style.padding = "0";
  chapter2Div.style.border = "none";
  chapter2Div.style.overflow = "hidden";
  chapter2Div.style.position = "relative";

  // Get the actual dimensions of the container
  const fullWidth = chapter2Div.clientWidth;
  const fullHeight = chapter2Div.clientHeight;

  // Set up margins for the chart
  const margin = { top: 100, right: 100, bottom: 100, left: 100 };
  const width = fullWidth - margin.left - margin.right;
  const height = fullHeight - margin.top - margin.bottom;

  // Global variables to track state
  let currentVisibleCount = 6;
  let svg;
  let x;
  let y;
  let chartData;
  let years;
  let color;
  let categoryData;
  let categories;
  let showCategories = false; // Default to showing problem origin data
  let showPercentage = false; // Default to showing count data

  // Function to create safe CSS selector from category name
  function makeSafeSelector(name) {
    // Replace any characters that aren't valid in CSS selectors
    return name.replace(/[&]/g, "and").replace(/[^a-zA-Z0-9-_]/g, "-");
  }

  ///////////////////////////////////////////////////////////// ! Chart Update Function
  // Function to update the chart with new data range
  function updateChart() {
    // Get visible years based on current count
    const visibleYears = years.slice(0, currentVisibleCount);

    // Get max count based on what data is currently visible and display mode
    let overallMax;

    if (showPercentage) {
      overallMax = 100; // Fixed range for percentage mode
    } else if (showCategories) {
      // Only consider category data for count mode
      const visibleCatData = categoryData.filter((d) =>
        visibleYears.includes(d.year)
      );
      overallMax = d3.max(visibleCatData, (d) => d.value);
    } else {
      // Only consider problem origin data for count mode
      const visibleData = chartData.filter((d) =>
        visibleYears.includes(d.year)
      );
      overallMax = d3.max(visibleData, (d) => Math.max(d.INTERNAL, d.EXTERNAL));
    }

    // Update scales
    x.domain(visibleYears);
    y.domain([0, overallMax]);

    // Update x-axis with transition
    svg
      .attr("class", "annotation")
      .select(".x-axis")
      .transition()
      .duration(500)
      .call(d3.axisBottom(x))
      .selectAll("text");
    // .style("text-anchor", "middle");

    // Update y-axis with transition
    svg.select(".y-axis").transition().duration(500).call(d3.axisLeft(y));

    // Update y-axis label
    svg
      .select(".y-axis-label")
      .attr("class", "annotation")
      .text(showPercentage ? "Percentage (%)" : "Count");

    // Line generator function
    const line = d3
      .line()
      .x((d) => x(d.year) + x.bandwidth() / 2)
      .y((d) => y(d.value))
      .defined((d) => !isNaN(d.value)); // Handle NaN values

    // Update visibility and lines for each origin
    ["INTERNAL", "EXTERNAL"].forEach((origin) => {
      // Filter data to only visible years for this update
      const visibleLineData = chartData
        .filter((d) => visibleYears.includes(d.year))
        .map((d) => {
          if (showPercentage) {
            // Calculate percentage
            const total = d.INTERNAL + d.EXTERNAL;
            const percentage = total > 0 ? (d[origin] / total) * 100 : 0;
            return {
              year: d.year,
              value: percentage,
              names: d[`${origin}_names`],
            };
          } else {
            return {
              year: d.year,
              value: d[origin],
              names: d[`${origin}_names`],
            };
          }
        });

      // Update the actual data line
      svg
        .select(`.line-${origin}`)
        .datum(visibleLineData)
        .transition()
        .duration(500)
        .attr("d", line)
        .style("opacity", showCategories ? 0 : 1); // Hide when showing categories
    });

    // Update category lines
    categories.forEach((category) => {
      // Filter to visible years for this category
      const visibleCatLineData = categoryData.filter(
        (d) => d.category === category && visibleYears.includes(d.year)
      );

      // Map to percentage values if needed
      const mappedCatLineData = visibleCatLineData.map((d) => {
        if (showPercentage) {
          // Find the year's total across all categories
          const yearTotal = categoryData
            .filter((item) => item.year === d.year)
            .reduce((sum, item) => sum + item.value, 0);

          // Calculate the percentage
          const percentage = yearTotal > 0 ? (d.value / yearTotal) * 100 : 0;
          return { ...d, value: percentage };
        }
        return d;
      });

      const safeSelector = makeSafeSelector(category);

      // Update the line
      svg
        .select(`.line-${safeSelector}`)
        .datum(mappedCatLineData)
        .transition()
        .duration(500)
        .attr("d", line)
        .style("opacity", showCategories ? 1 : 0); // Show only when categories are enabled
    });

    // Update button state
    const button = d3.select("#expand-chart");
    if (currentVisibleCount >= years.length) {
      button.attr("disabled", true);
    } else {
      button.attr("disabled", null);
    }

    // Update chart title based on what's shown
    let titleText = showCategories
      ? "Categories by Year"
      : "Problem Origin by Year";
    titleText += showPercentage ? " (Percentage)" : " (Count)";
    svg.select(".chart-title").text(titleText);
  }

  ///////////////////////////////////////////////////////////// ! Toggle Categories Function
  // Function to toggle between problem origin and categories
  function toggleCategories() {
    showCategories = d3.select("#toggle-categories").property("checked");
    updateChart();

    // Update legend visibility based on what's shown
    d3.selectAll(".origin-legend").style("opacity", showCategories ? 0 : 1);
    d3.selectAll(".category-legend").style("opacity", showCategories ? 1 : 0);
  }

  ///////////////////////////////////////////////////////////// ! Toggle Percentage Function
  // Function to toggle between count and percentage view
  function togglePercentage() {
    showPercentage = d3.select("#toggle-percentage").property("checked");
    updateChart();
  }

  ///////////////////////////////////////////////////////////// ! Data Loading and Processing
  // Load the CSV file and create a line chart
  function loadVisualizationData() {
    // First check if data is already preloaded in dataCache
    if (window.dataCache && window.dataCache.timeData) {
      console.log("Using preloaded time data in chapter-2");
      createVisualization(window.dataCache.timeData);
      return;
    }

    // Otherwise, load data directly
    d3.csv("data/sh_0415_time/sh_0415_time.csv")
      .then(createVisualization)
      .catch((error) => console.error("Error loading CSV:", error));
  }

  // Start loading data immediately
  loadVisualizationData();

  function createVisualization(data) {
    // Filter out specific year bins
    const filteredData = data.filter(
      (d) =>
        d.year_bin_5yr !== "0_0_pre-1855" &&
        d.year_bin_5yr !== "0_pre-1855" &&
        d.year_bin_5yr !== "9_post-2014"
    );

    ///////////////////////////////////////////////////////////// ! Data Aggregation
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

    // Group data by year_bin_5yr and key_cat_primary_agg
    const groupedCategoryData = d3.rollup(
      filteredData,
      (v) => ({
        count: v.length,
        names: v.map((d) => d.name),
      }),
      (d) => d.year_bin_5yr,
      (d) => d.key_cat_primary_agg
    );

    // Get all unique categories
    categories = [
      ...new Set(filteredData.map((d) => d.key_cat_primary_agg)),
    ].filter(Boolean);

    ///////////////////////////////////////////////////////////// ! Data Transformation
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

    // Create flattened category data for easier plotting
    categoryData = [];
    years.forEach((year) => {
      const yearCats = groupedCategoryData.get(year);
      if (yearCats) {
        categories.forEach((category) => {
          const catData = yearCats.get(category);
          if (catData) {
            categoryData.push({
              year,
              category,
              value: catData.count,
              names: catData.names,
            });
          } else {
            categoryData.push({
              year,
              category,
              value: 0,
              names: [],
            });
          }
        });
      }
    });

    // Get first 6 years for initial view
    const visibleYears = years.slice(0, currentVisibleCount);

    // Get max count only from visible years' data based on what's shown by default
    const visibleData = chartData.filter((d) => visibleYears.includes(d.year));
    const visibleMax = d3.max(visibleData, (d) =>
      Math.max(d.INTERNAL, d.EXTERNAL)
    );

    ///////////////////////////////////////////////////////////// ! Create SVG
    svg = d3
      .select("#chapter-2")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("display", "block")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    ///////////////////////////////////////////////////////////// ! Scales Definition
    // Set up scales
    x = d3.scaleBand().domain(visibleYears).range([0, width]).padding(0.2);
    y = d3.scaleLinear().domain([0, visibleMax]).range([height, 0]);

    ///////////////////////////////////////////////////////////// ! Axes Creation
    // Add x-axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle");

    // Add y-axis
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

    // Add y-axis label
    svg
      .append("text")
      .attr("class", "annotation")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 50)
      .style("text-anchor", "middle")
      .text("Number of Books");

    ///////////////////////////////////////////////////////////// ! Color Scales
    // Color scale for origin
    const originColors = ["var(--color-teal)", "var(--color-orange)"];

    // Extended color scale for categories
    color = d3
      .scaleOrdinal()
      .domain([...["INTERNAL", "EXTERNAL"], ...categories])
      .range([...originColors, ...d3.schemeCategory10]);

    ///////////////////////////////////////////////////////////// ! Line Creation
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
        .attr("d", line)
        .style("opacity", 1); // Visible by default
    });

    // Add lines for each category
    categories.forEach((category) => {
      // Get data for this category
      const categoryVisibleData = categoryData.filter(
        (d) => d.category === category && visibleYears.includes(d.year)
      );

      const safeSelector = makeSafeSelector(category);

      // Add the line
      svg
        .append("path")
        .attr("class", `line-${safeSelector}`)
        .datum(categoryVisibleData)
        .attr("fill", "none")
        .attr("stroke", color(category))
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "3,3")
        .attr("d", line)
        .style("opacity", 0); // Hidden by default
    });

    ///////////////////////////////////////////////////////////// ! Legend Creation
    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 150}, 0)`);

    // Add origins to legend
    ["INTERNAL", "EXTERNAL"].forEach((key, i) => {
      const legendRow = legend
        .append("g")
        .attr("class", "origin-legend")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color(key));

      legendRow
        .append("text")
        .attr("x", 25)
        .attr("y", 12.5)
        .attr("class", "annotation")
        .text(key);
    });

    // Add simple buttons for toggling percentage and categories
    // Create a button group for percentage toggle
    const percentageButton = legend
      .append("g")
      .attr("transform", `translate(0, ${2 * 20 + 10})`);

    // Add a clickable rectangle for the percentage button
    percentageButton
      .append("rect")
      .attr("width", 100)
      .attr("height", 20)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("click", function () {
        showPercentage = !showPercentage;
        updateChart();
      });

    // Add text label for the percentage button
    percentageButton
      .append("text")
      .attr("x", 0)
      .attr("y", 15)
      .text("Toggle Percentage")
      .style("pointer-events", "none"); // Prevent text from blocking clicks

    // Create a button group for categories toggle
    const categoriesButton = legend
      .append("g")
      .attr("transform", `translate(0, ${3 * 20 + 10})`);

    // Add a clickable rectangle for the categories button
    categoriesButton
      .append("rect")
      .attr("width", 100)
      .attr("height", 20)
      .attr("fill", "transparent")
      .style("cursor", "pointer")
      .on("click", function () {
        showCategories = !showCategories;
        // Update legend visibility
        d3.selectAll(".origin-legend").style("opacity", showCategories ? 0 : 1);
        d3.selectAll(".category-legend").style(
          "opacity",
          showCategories ? 1 : 0
        );
        updateChart();
      });

    // Add text label for the categories button
    categoriesButton
      .append("text")
      .attr("x", 0)
      .attr("y", 15)
      .text("Toggle Categories")
      .style("pointer-events", "none"); // Prevent text from blocking clicks

    // Add categories to legend
    categories.forEach((category, i) => {
      const legendRow = legend
        .append("g")
        .attr("class", "category-legend")
        .attr("transform", `translate(0, ${i * 20})`)
        .style("opacity", 0); // Hidden by default

      legendRow
        .append("line")
        .attr("x1", 0)
        .attr("y1", 7.5)
        .attr("x2", 15)
        .attr("y2", 7.5)
        .attr("stroke", color(category))
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "3,3");

      legendRow
        .append("text")
        .attr("x", 25)
        .attr("y", 12.5)
        .attr("class", "annotation")
        .style("pointer-events", "none") // Prevent text from blocking clicks
        .text(category);
    });

    // Add button click handler for expanding chart
    d3.select("#expand-chart").on("click", function () {
      if (currentVisibleCount < years.length) {
        currentVisibleCount++;
        updateChart();
      }
    });

    // Set checkboxes to unchecked by default
    d3.select("#toggle-categories").property("checked", false);
    d3.select("#toggle-percentage").property("checked", false);

    // Add toggle handlers
    d3.select("#toggle-categories").on("change", toggleCategories);
    d3.select("#toggle-percentage").on("change", togglePercentage);
  }

  // Near the end of chapter-2-dev.js
  document.addEventListener("visualizationUpdate", (event) => {
    const stepId = event.detail.step;

    // Show only 1855-1859
    if (stepId === "samuel-smiles") {
      currentVisibleCount = 2;
      updateChart();
    } else if (stepId === "turn-of-century") {
      // Show all available years
      currentVisibleCount = 8;
      updateChart();
    } else if (stepId === "through-ww1") {
      // Show years through World War I
      currentVisibleCount = 10;
      updateChart();
    } else if (stepId === "post-20s") {
      // Show years through post-1920s
      currentVisibleCount = 16;
      updateChart();
    } else if (stepId === "post-ww2") {
      // Show years through post-1940s
      currentVisibleCount = 23;
      updateChart();
    }
    // neoliberal-shift that takes us to visible count through 1994, which is visible count of 26
    else if (stepId === "neoliberal-shift") {
      currentVisibleCount = 26;
      updateChart();
    } else if (stepId === "self-as-battlefield") {
      // Show years through 1994
      currentVisibleCount = 26;
      updateChart();
    } else if (stepId === "all-years") {
      // Show all available years
      currentVisibleCount = years.length;
      updateChart();
    }
  });
})();
