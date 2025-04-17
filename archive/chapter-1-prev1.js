// Chapter 1 - Simple Book Display
(function () {
  // Adjust the chapter-1 div to fill the viewport
  const chapter1Div = document.getElementById("chapter-1");
  chapter1Div.style.width = "100vw";
  chapter1Div.style.height = "100vh";
  chapter1Div.style.margin = "0";
  chapter1Div.style.padding = "0";
  chapter1Div.style.display = "flex";
  chapter1Div.style.justifyContent = "center";
  chapter1Div.style.alignItems = "center";
  chapter1Div.style.overflow = "hidden";
  chapter1Div.style.position = "relative";

  // Create the book container
  const bookContainer = document.createElement("div");
  bookContainer.style.width = "300px";
  bookContainer.style.height = "500px";
  bookContainer.style.border = "1px solid #D8D4D1";
  bookContainer.style.background =
    "linear-gradient(156deg, #171ED3 7.4%, #4C0994 51.02%, #54046D 93.91%)";
  bookContainer.style.display = "flex";
  bookContainer.style.justifyContent = "center";
  bookContainer.style.alignItems = "center";
  bookContainer.style.padding = "20px";
  bookContainer.style.boxSizing = "border-box";
  bookContainer.style.color = "white";
  bookContainer.style.fontFamily = "Libre Franklin, sans-serif";
  bookContainer.style.textAlign = "center";
  bookContainer.style.fontSize = "24px";
  bookContainer.style.fontWeight = "bold";

  // Add the container to the chapter div
  chapter1Div.appendChild(bookContainer);

  // Function to display the book title
  function displayBookTitle(data) {
    if (data && data.length > 0) {
      // Use the first book's name or a default
      const bookTitle = data[0].name || "Name of the book: It will go here.";
      bookContainer.textContent = bookTitle;
    } else {
      bookContainer.textContent = "Name of the book: It will go here.";
    }
  }

  // Try loading data
  try {
    d3.csv("data/sh_0415_time/sh_0415_time.csv")
      .then(displayBookTitle)
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
            displayBookTitle(parsedData);
          })
          .catch(useHardcodedData);
      });
  } catch (error) {
    useHardcodedData();
  }

  // Function to generate hard-coded data if CSV loading fails
  function useHardcodedData() {
    console.warn("Using hard-coded data as fallback");
    const fakeData = [{ name: "Name of the book: It will go here." }];
    displayBookTitle(fakeData);
  }

  // Event listener for visualization updates
  document.addEventListener("visualizationUpdate", (event) => {
    const stepId = event.detail.step;
    if (stepId === "goodreads-data") {
      // Remove our visualization when moving to the next section
      chapter1Div.innerHTML = "";
    }
  });
})();
