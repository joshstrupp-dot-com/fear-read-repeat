// Chapter 3 - Author Visualization
(function () {
  // Set up dimensions and margins for the chart
  const margin = { top: 20, right: 20, bottom: 50, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const chapter3Div = document.getElementById("chapter-3");

  try {
    // Create SVG container
    const svg = d3
      .select("#chapter-3")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Function to display author data
    function displayAuthorData(data) {
      if (data && data.length > 0) {
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
    }

    // Function to use hardcoded data as fallback
    function useHardcodedData() {
      const hardcodedData = [
        {
          author_clean: "S. Truett Cathy",
          avg_star_rating: 4.2,
          author_num_books: 5,
          avg_cred_score: 3.8,
          bt_count: 1,
        },
        {
          author_clean: "Michael Lewis",
          avg_star_rating: 4.5,
          author_num_books: 12,
          avg_cred_score: 4.2,
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

      displayAuthorData(hardcodedData);
    }

    // Try loading data
    d3.csv("data/sh_0415_author/author.csv")
      .then(displayAuthorData)
      .catch(() => {
        fetch("data/sh_0415_author/author.csv")
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
            displayAuthorData(parsedData);
          })
          .catch(useHardcodedData);
      });
  } catch (error) {
    useHardcodedData();
  }
})();
