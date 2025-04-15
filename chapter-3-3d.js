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
            color: data.map((d) => d.avg_cred_score),
            colorscale: "Viridis",
            line: {
              color: data.map((d) =>
                d.bt_count > 0 ? "black" : "rgba(0,0,0,0)"
              ),
              width: 2,
            },
            opacity: 0.8,
          },
        },
      ];

      const layout = {
        title: "Author Data Visualization",
        autosize: true,
        height: chapter3_3dDiv.clientHeight,
        width: chapter3_3dDiv.clientWidth,
        scene: {
          xaxis: { title: "Number of Books", type: "log" },
          yaxis: { title: "Avg Star Rating" },
          zaxis: { title: "Avg Cred Score" },
        },
        margin: {
          l: 0,
          r: 0,
          b: 0,
          t: 50,
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
      {
        author_clean: "Malcolm Gladwell",
        avg_star_rating: 4.3,
        author_num_books: 7,
        avg_cred_score: 3.5,
        bt_count: 1,
      },
      {
        author_clean: "Jim Collins",
        avg_star_rating: 4.6,
        author_num_books: 6,
        avg_cred_score: 4.7,
        bt_count: 2,
      },
    ];

    displayAuthorData3D(hardcodedData);
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
