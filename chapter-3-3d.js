// Chapter 3 - 3D Author Visualization
(function () {
  // Adjust chapter-3-3d div to fill the viewport
  const chapter3_3dDiv = document.getElementById("chapter-3-3d");
  chapter3_3dDiv.style.width = "100vw";
  chapter3_3dDiv.style.height = "100vh";
  chapter3_3dDiv.style.margin = "0";
  chapter3_3dDiv.style.padding = "0";
  chapter3_3dDiv.style.border = "none";
  chapter3_3dDiv.style.position = "relative";

  // Function to display author data in 3D
  function displayAuthorData3D(data) {
    if (data && data.length > 0) {
      // Parse numeric data
      data.forEach((d) => {
        d.avg_star_rating = +d.avg_star_rating;
        d.author_num_books = Math.max(1, +d.author_num_books); // Ensure minimum value of 1
        d.avg_cred_score = +d.avg_cred_score;
        d.bt_count = +d.bt_count;
      });

      // Calculate opacity based on avg_star_rating (Y axis)
      const minRating = d3.min(data, (d) => d.avg_star_rating);
      const maxRating = d3.max(data, (d) => d.avg_star_rating);
      const opacityScale = d3
        .scaleLinear()
        .domain([minRating, maxRating])
        .range([0.3, 1]);

      // Prepare data for Plotly
      const plotData = [
        {
          x: data.map((d) => d.author_num_books),
          y: data.map((d) => d.avg_star_rating),
          z: data.map((d) => d.avg_cred_score),
          mode: "markers",
          type: "scatter3d",
          text: data.map((d) => d.author_clean),
          hovertemplate:
            "<b>%{text}</b><br>" +
            "Books: %{x}<br>" +
            "Rating: %{y}<br>" +
            "Cred Score: %{z}<br>",
          marker: {
            size: 8,
            color: data.map(() => "#e1d6c2"), // --color-base-darker
            opacity: data.map((d) => opacityScale(d.avg_star_rating)),
            line: {
              color: data.map((d) =>
                d.bt_count > 0 ? "var(--color-teal)" : "rgba(0,0,0,0)"
              ),
              width: 2,
            },
          },
        },
      ];

      const layout = {
        autosize: true,
        height: chapter3_3dDiv.clientHeight,
        width: chapter3_3dDiv.clientWidth,
        paper_bgcolor: "#f2efe9", // Set background color
        plot_bgcolor: "#f2efe9",
        scene: {
          xaxis: {
            title: "Number of Books",
            type: "log",
            titlefont: { family: "Andale Mono", size: 15, color: "#000" },
            tickfont: { family: "Andale Mono", size: 15, color: "#000" },
          },
          yaxis: {
            title: "Avg Star Rating",
            titlefont: { family: "Andale Mono", size: 15, color: "#000" },
            tickfont: { family: "Andale Mono", size: 15, color: "#000" },
          },
          zaxis: {
            title: "Avg Cred Score",
            titlefont: { family: "Andale Mono", size: 15, color: "#000" },
            tickfont: { family: "Andale Mono", size: 15, color: "#000" },
          },
          bgcolor: "#f2efe9",
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 0,
        },
      };

      // Add window resize event handler for responsive behavior
      window.addEventListener("resize", function () {
        Plotly.relayout("chapter-3-3d", {
          width: chapter3_3dDiv.clientWidth,
          height: chapter3_3dDiv.clientHeight,
        });
      });

      Plotly.newPlot("chapter-3-3d", plotData, layout);
    }
  }

  try {
    // Try loading data
    d3.csv("data/sh_0415_author/author.csv")
      .then(displayAuthorData3D)
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
            displayAuthorData3D(parsedData);
          })
          .catch(useHardcodedData);
      });
  } catch (error) {
    useHardcodedData();
  }
})();
