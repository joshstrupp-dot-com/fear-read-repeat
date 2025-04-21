(function () {
  ///////////////////////////////////////////////////////////// ! Setup and Configuration
  // Adjust chapter-3-3d div to fill the viewport
  const chapter3_3dDiv = document.getElementById("chapter-3-3d");
  chapter3_3dDiv.style.width = "100vw";
  chapter3_3dDiv.style.height = "100vh";
  chapter3_3dDiv.style.margin = "0";
  chapter3_3dDiv.style.padding = "0";
  chapter3_3dDiv.style.border = "none";
  chapter3_3dDiv.style.position = "relative";

  // Store all author data
  let allAuthorData = [];

  ///////////////////////////////////////////////////////////// ! Data Filtering Functions
  // Function to filter data based on step
  function filterDataForStep(stepId) {
    if (!allAuthorData || allAuthorData.length === 0) return [];

    switch (stepId) {
      case "the-secret":
        return allAuthorData.map((d) => {
          // Highlight "The Secret" author (Rhonda Byrne)
          d.highlighted = d.author_clean === "Rhonda Byrne";
          return d;
        });
      case "earned-credibility":
        return allAuthorData.map((d) => {
          d.highlighted =
            d.author_clean === "Elisabeth Kübler-Ross" ||
            d.author_clean === "Gabor Maté";
          return d;
        });
      case "low-credibility":
        return allAuthorData.map((d) => {
          d.highlighted =
            d.author_clean === "L. Ron Hubbard" ||
            d.author_clean === "Kevin Trudeau" ||
            d.author_clean === "P.T. Barnum";
          return d;
        });
      case "bibliotherapy":
        return allAuthorData.map((d) => {
          d.highlighted = d.bt_count >= 1;
          return d;
        });
      default:
        return allAuthorData;
    }
  }

  ///////////////////////////////////////////////////////////// ! Visualization Functions
  // Function to display author data in 3D
  function displayAuthorData3D(data, stepId) {
    if (data && data.length > 0) {
      ///////////////////////////////////////////////////////////// ! Data Processing
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

      ///////////////////////////////////////////////////////////// ! Plot Configuration
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
            size: data.map((d) => (d.highlighted ? 25 : 8)),
            color: data.map((d) =>
              d.highlighted ? "var(--color-yellow)" : "#e1d6c2"
            ),
            opacity: data.map((d) => opacityScale(d.avg_star_rating)),
            line: {
              color: data.map((d) => {
                if (d.highlighted) return "black";
                return d.bt_count > 0 ? "var(--color-teal)" : "rgba(0,0,0,0)";
              }),
              width: data.map((d) => (d.highlighted ? 2 : 1)),
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

      ///////////////////////////////////////////////////////////// ! Camera Positioning
      // Set specific camera position for steps
      if (stepId === "the-secret") {
        layout.scene.camera = {
          center: {
            x: -0.02872391965685726,
            y: 0.0984779590366186,
            z: -0.1589975536559734,
          },
          eye: {
            x: 0.16537051999361835,
            y: 0.4324496308738745,
            z: 0.012789338634007247,
          },
          up: {
            x: -0.0049316314146487635,
            y: 0.002874487571948146,
            z: 0.9999837081237974,
          },
        };
      } else if (stepId === "earned-credibility") {
        layout.scene.camera = {
          center: {
            x: 0.24002179524366402,
            y: 0.019691129043068713,
            z: 0.15702536208015727,
          },
          eye: {
            x: -0.34537609362768534,
            y: 0.8232176147970166,
            z: 1.434816476508483,
          },
          up: {
            x: -0.05679119061976506,
            y: 0.047866731273655566,
            z: 0.9972379539032624,
          },
        };
      } else if (stepId === "low-credibility") {
        layout.scene.camera = {
          center: {
            x: 0.23527415804782587,
            y: 0.15659747965894885,
            z: -0.5702677770421271,
          },
          eye: {
            x: 0.5960229081108494,
            y: 0.7773255383359325,
            z: -0.25098038237298147,
          },
          up: {
            x: 0,
            y: 0,
            z: 1,
          },
        };
      } else if (stepId === "bibliotherapy") {
        // Zoom out to default overview and highlight bibliotherapy authors
        layout.scene.camera = {
          center: { x: 0, y: 0, z: 0 },
          eye: { x: 1.5, y: 1.5, z: 1.5 },
          up: { x: 0, y: 0, z: 1 },
        };
      }

      ///////////////////////////////////////////////////////////// ! Responsive Behavior
      // Add window resize event handler for responsive behavior
      window.addEventListener("resize", function () {
        Plotly.relayout("chapter-3-3d", {
          width: chapter3_3dDiv.clientWidth,
          height: chapter3_3dDiv.clientHeight,
        });
      });

      // Reference the graph div
      const graphDiv = document.getElementById("chapter-3-3d");
      // If already plotted, animate camera; otherwise do a fresh plot
      if (graphDiv && graphDiv._fullLayout && graphDiv._fullLayout.scene) {
        // Animate only the camera movement
        Plotly.animate(
          "chapter-3-3d",
          {
            layout: { scene: { camera: layout.scene.camera } },
          },
          {
            transition: { duration: 10000, easing: "cubic-in-out" }, //transition will take 10 seconds
          }
        );
        Plotly.restyle(
          "chapter-3-3d",
          {
            "marker.size": [plotData[0].marker.size],
            "marker.color": [plotData[0].marker.color],
            "marker.opacity": [plotData[0].marker.opacity],
            "marker.line.color": [plotData[0].marker.line.color],
            "marker.line.width": [plotData[0].marker.line.width],
          },
          [0]
        );
      } else {
        Plotly.newPlot("chapter-3-3d", plotData, layout);
      }

      // Add event listener to log camera position when the view changes
      document
        .getElementById("chapter-3-3d")
        .on("plotly_relayout", function (eventData) {
          // Check if the event contains camera information
          if (eventData && eventData["scene.camera"]) {
            console.log("Camera position:", eventData["scene.camera"]);
          }
        });
    }
  }

  ///////////////////////////////////////////////////////////// ! Event Listeners
  // Add event listener for visualization updates
  document.addEventListener("visualizationUpdate", (event) => {
    const stepId = event.detail.step;
    displayAuthorData3D(filterDataForStep(stepId), stepId);
  });

  // Function to get current camera position
  window.getCameraPosition = function () {
    const graphDiv = document.getElementById("chapter-3-3d");
    if (graphDiv && graphDiv._fullLayout && graphDiv._fullLayout.scene) {
      const camera = graphDiv._fullLayout.scene._scene.camera;
      return {
        eye: camera.eye,
        center: camera.center,
        up: camera.up,
      };
    }
    return null;
  };

  ///////////////////////////////////////////////////////////// ! Initialization
  try {
    // First check if data is already preloaded in dataCache
    if (window.dataCache && window.dataCache.authorData) {
      console.log("Using preloaded author data for 3D visualization");
      allAuthorData = window.dataCache.authorData;
      displayAuthorData3D(filterDataForStep("the-secret"), "the-secret"); // Default to the-secret step
    } else {
      // Try loading data directly if not preloaded
      d3.csv("data/sh_0415_author/author.csv")
        .then((data) => {
          allAuthorData = data;
          displayAuthorData3D(filterDataForStep("the-secret"), "the-secret");
        })
        .catch(() => {
          // Rest of your existing fetch fallback code
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
              allAuthorData = parsedData;
              displayAuthorData3D(
                filterDataForStep("the-secret"),
                "the-secret"
              );
            })
            .catch(useHardcodedData);
        });
    }
  } catch (error) {
    useHardcodedData();
  }
})();
