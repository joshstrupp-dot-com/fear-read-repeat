/**
 * Steps Configuration
 * Each step has:
 * - id: unique identifier
 * - text: what appears in the step
 * - render: function to update the figure when this step is active
 * - fullwidth: boolean to determine if figure spans full viewport width
 * - visualizationId: identifies which visualization this step belongs to (steps with same ID share/reuse the same visualization)
 */
const stepsConfig = [
  {
    id: "chapter-1",
    text: "Chapter 1",
    fullwidth: true,
    customClass: "header",
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
    },
  },
  {
    id: "intro",
    text: "Life can really suck. Advice can help. And there is no shortage of advice.",
    fullwidth: true,
    customClass: "statement",
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
    },
  },
  {
    id: "quick-fixes",
    text: "You're a few keystrokes from fixing your marriage. You're one Amazon order from never aging again. You're 8 minutes from knowing all of Wall Street's secrets (or 4 minutes if you watch on 2x).",
    fullwidth: false,
    fadeIn: true,
    fadeOut: true,
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");

      // Add scrolling words animation container
      const container = figure
        .append("div")
        .style("height", "100%")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center");

      // Create a search bar container
      const searchBarContainer = container
        .append("div")
        .style("border", "1px solid black")
        .style("border-radius", "100px")
        .style("margin-left", "10em")
        .style("margin-right", "6em")
        .style("display", "flex")
        .style("align-items", "center")
        .style("padding", "8px 12px")
        .style("box-shadow", "0px 0px 20px rgba(0, 0, 0, 0.1)");
      // Add the search icon
      searchBarContainer
        .append("img")
        .attr("src", "assets/search-icon.svg")
        .style("height", "26px")
        .style("padding-left", "10px")
        .style("margin-right", "20px");

      // Create the scrolling words container
      const scrollingContainer = searchBarContainer
        .append("div")
        .attr("class", "scrolling-words-container")
        .style("display", "flex")
        .style("align-items", "center")
        .style("font-size", "1.5rem")
        .style("font-weight", "600")
        .style("font-family", "Andale Mono, monospace");

      // Create the scrolling words box
      const scrollingBox = scrollingContainer
        .append("div")
        .attr("class", "scrolling-words-box")
        .style("height", "3rem") // Increased height by 10px (from 3rem to 3.625rem)
        .style("margin", "auto")
        .style("overflow", "hidden");
      // .style("border", "1px solid black")
      // .style("border-radius", "100px");

      // Create the list of scrolling words
      const wordsList = scrollingBox
        .append("ul")
        .style("margin", "0 0.625rem")
        .style("padding", "0")
        .style("animation", "scrollUp 40s infinite"); // Doubled the animation duration to slow it down

      // Add the scrolling words
      const words = [
        { text: "why do I feel stuck", color: "#000" },
        { text: "how to stop overthinking", color: "#000" },
        { text: "can people really change?", color: "#000" },
        {
          text: "how to be more confident",
          color: "#000",
        },
        { text: "fix my relationship", color: "#000" },
        { text: "IM SO ANXIOUS HALP", color: "#000" },
        {
          text: "I hate my job, now what?",
          color: "#000",
        },
        {
          text: "why am I always tired + unmotivated",
          color: "#000",
        },
        { text: "make friends as an adult", color: "#000" },
        {
          text: "how to forgive someone who hurt me",
          color: "#000",
        },
        { text: "best way to build new habits", color: "#000" },
        { text: "how to stop comparing myself", color: "#000" },
        { text: "what to do with my life", color: "#000" },
        {
          text: "how to believe in myself again",
          color: "#000",
        },
        { text: "is therapy worth it", color: "#000" },
        {
          text: "how 2 stop being a people pleaser",
          color: "#000",
        },
        {
          text: "how to set boundaries without feeling guilty",
          color: "#000",
        },
        { text: "how to start over in life", color: "#000" },
        {
          text: "how to heal from childhood trauma",
          color: "#000",
        },
        { text: "how to stop self-sabotaging", color: "#000" },
      ];

      words.forEach((word) => {
        wordsList
          .append("li")
          .style("display", "flex")
          .style("align-items", "center")
          .style("justify-content", "flex-start")
          .style("height", "3rem")
          .style("list-style", "none")
          .style("color", word.color)
          .text(word.text);
      });

      // Add the static text
      // scrollingContainer
      //   .append("span")
      //   .style("color", "#5f6368")
      //   .text("in just minutes");

      // Add the keyframes for the scrolling animation
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        @keyframes scrollUp {
          0%, 8% {
            transform: translateY(0%);
          }
          10%, 18% {
            transform: translateY(-5%);
          }
          20%, 28% {
            transform: translateY(-10%);
          }
          30%, 38% {
            transform: translateY(-15%);
          }
          40%, 48% {
            transform: translateY(-20%);
          }
          50%, 58% {
            transform: translateY(-25%);
          }
          60%, 68% {
            transform: translateY(-30%);
          }
          70%, 78% {
            transform: translateY(-35%);
          }
          80%, 88% {
            transform: translateY(-40%);
          }
          90%, 98% {
            transform: translateY(-45%);
          }
          100% {
            transform: translateY(0%);
          }
        }
      `;
      document.head.appendChild(styleSheet);
    },
  },
  {
    id: "self-help",
    text: "This advice is called self-help. Like it or not, realize it or not — you're probably a consumer of self-help. <br><br> Today we will be focusing on self help <i>literature</i>.",
    text: "This advice is called <span style='color: var(--color-purple); font-family: \"Libre Franklin\", sans-serif; font-size: 15px;'>self-help</span>. Like it or not, realize it or not — you're probably a consumer of self-help. <br><br> Today we will be focusing on self help <i>literature</i>.",
    customClass: "statement",
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
    },
  },
  {
    id: "self-help-growth",
    text: "Self-help literature, a product born out of and almost entirely consumed in the United States, is the fastest growing nonfiction genre since 2013.",
    fullwidth: true,
    fadeIn: true,
    fadeOut: true,
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");

      // Create SVG for the exponential growth line
      const width = figure.node().getBoundingClientRect().width;
      const height = figure.node().getBoundingClientRect().height;
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };

      const svg = figure
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "visible");

      // Create the exponential curve path
      const generateExponentialPoints = () => {
        const points = [];
        const numPoints = 100;
        for (let i = 0; i < numPoints; i++) {
          const x = i / (numPoints - 1);
          // Exponential function: y = e^(ax) - 1 (normalized)
          const y = Math.exp(3 * x) - 1;
          points.push([
            margin.left + x * (width - margin.left - margin.right),
            height -
              margin.bottom -
              (y * (height - margin.top - margin.bottom)) / (Math.exp(3) - 1),
          ]);
        }
        return points;
      };

      const points = generateExponentialPoints();
      const lineGenerator = d3.line();

      // Create path element
      const path = svg
        .append("path")
        .attr("d", lineGenerator(points))
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", function () {
          return this.getTotalLength();
        })
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        });

      // Animate the path drawing
      path
        .transition()
        .duration(2000)
        .ease(d3.easeQuadInOut)
        .attr("stroke-dashoffset", 0);

      // Get the total length of the path for animation calculations
      const pathLength = path.node().getTotalLength();

      // Create a second path for the text to follow, offset from the main path
      const generateOffsetPoints = () => {
        const offsetPoints = [];
        const numPoints = 100;
        for (let i = 0; i < numPoints; i++) {
          const x = i / (numPoints - 1);
          // Exponential function: y = e^(ax) - 1 (normalized)
          const y = Math.exp(3 * x) - 1;
          offsetPoints.push([
            margin.left + x * (width - margin.left - margin.right) - 5, // 5 pixels to the left
            height -
              margin.bottom -
              (y * (height - margin.top - margin.bottom)) / (Math.exp(3) - 1) -
              20, // 20 pixels higher
          ]);
        }
        return offsetPoints;
      };

      const offsetPoints = generateOffsetPoints();

      // Create marquee text effect along the path (only on one side)
      // Create a defs element for the path
      const defs = svg.append("defs");

      // Create a path for the text to follow
      const textPath = defs
        .append("path")
        .attr("id", "textPath-marquee")
        .attr("d", lineGenerator(offsetPoints));

      // Load self-help book titles from CSV
      d3.csv("data/sh_0415_time/sh_0415_time.csv")
        .then((data) => {
          // Take the first 50 book titles
          const bookTitles = data.slice(0, 20).map((d) => d.name);

          // Create a text element
          const text = svg
            .append("text")
            .attr("font-family", "Andale Mono, monospace")
            .attr("font-size", "12px")
            .attr("fill", "#333");

          // Join all titles with a separator
          const allTitlesText = bookTitles.join(" • ");
          const textWidth = allTitlesText.length * 5; // Approximate width in pixels

          // Create textPath for the titles
          const textPath = text
            .append("textPath")
            .attr("href", "#textPath-marquee")
            .attr("startOffset", "0%")
            .text(allTitlesText);

          // Animate the text element - moving along the path
          function animateMarquee() {
            text
              .attr("data-offset", 0)
              .transition()
              .duration(50000) // Longer duration for the longer text
              .ease(d3.easeLinear)
              .attrTween("data-offset", function () {
                return function (t) {
                  // Calculate the offset to create a continuous scrolling effect
                  const offset = (100 * t) % 100;
                  textPath.attr("startOffset", `${-offset}%`);
                  return t * 100;
                };
              })
              .on("end", animateMarquee);
          }

          animateMarquee();
        })
        .catch((error) => {
          console.error("Error loading CSV file:", error);

          // Fallback in case the CSV fails to load
          const text = svg
            .append("text")
            .attr("font-family", "Andale Mono, monospace")
            .attr("font-size", "12px")
            .attr("fill", "#333");

          text
            .append("textPath")
            .attr("href", "#textPath-marquee")
            .attr("startOffset", "0%")
            .text("Self-help literature growth");
        });
    },
  },
  {
    id: "blame-game",
    text: "There are titles that claim your dead-end job is your fault and yours to fix; that you're depressed because you're not doing enough squat jumps; that you can't connect with your child unless you follow these \"ten steps to tame your teen.\"",
    fullwidth: true,
    render: () => {
      // Clear existing content
      const figure = d3.select("#figure-container");
      figure.html("");

      // Create a container for the grid visualization
      const vizContainer = figure
        .append("div")
        .attr("id", "chapter-1-grid")
        .style("width", "100%")
        .style("height", "100%");

      // Load and execute chapter-1-grid.js
      const script = document.createElement("script");
      script.src = "chapter-1-grid.js";
      document.body.appendChild(script);

      // Dispatch an initialization event
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("gridVisualizationUpdate", {
            detail: { step: "blame-game" },
          })
        );
      }, 500);
    },
  },

  {
    id: "systemic-problems",
    text: "So much of self-help suggests you're not doing enough, which, in my opinion, isn't cool. Our anxieties are often the result of events outside of our control and some authors efforts to, in the words of scholar Beth Blum in her book The Self-Help Compulsion, \"privatize solutions to systemic problems.\"",
    fullwidth: true,
    fadeOut: true,
    render: () => {
      // Update the existing grid visualization
      document.dispatchEvent(
        new CustomEvent("gridVisualizationUpdate", {
          detail: { step: "systemic-problems" },
        })
      );
    },
  },
  {
    id: "fastest-growing",
    text: "Today we'll focus on the 20,000 most read books on Goodreads dating back to 1859.",
    fullwidth: true,
    render: () => {
      // Clear existing content
      const figure = d3.select("#figure-container");
      figure.html("");

      // Create a container for the chapter-1 visualization
      const vizContainer = figure
        .append("div")
        .attr("id", "chapter-1")
        .style("width", "100%")
        .style("height", "100%");

      // Load and execute chapter-1-dev.js
      const script = document.createElement("script");
      script.src = "chapter-1-dev.js";
      document.body.appendChild(script);

      // Dispatch an initialization event
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("visualizationUpdate", {
            detail: { step: "intro" },
          })
        );
      }, 500);
    },
  },

  {
    id: "two-analyses",
    text: "What follows are two analyses. The first will explore how the self help industry took advantage of neoliberal shifts in self care and how (western) world events — not our inability to pray more or take ashwaganda — are at the root of our fears. The second covers which authors may be cashing in.",
    fullwidth: true,
    customClass: "statement",
    render: () => {
      // Keep the existing visualization in its intro state
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "book-emphasis-closed" },
        })
      );
    },
  },

  {
    id: "ml-categories",
    text: "For the first, we'll use machine learning to classify every book into 10 categories that designate what problem they aim to address.",
    fullwidth: true,
    render: () => {
      // Update to intro-2 step
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "intro-2" },
        })
      );
    },
  },
  {
    id: "external-internal",
    text: 'As we explore trends across time, we\'ll explore the progression of self help books through two categories — <span style="color: var(--color-teal);">internal</span>, books that explore anxieties stemming from within <span style="color: var(--color-teal);">you</span> (self-esteem, willpower, internalized doubt); and <span style="color: var(--color-orange);">external</span>, or books that explore struggles that originate outside of the self or from <span style="color: var(--color-orange);">the world</span> (society, politics, family, metaphysics).',
    fullwidth: true,
    fadeOut: true,
    render: () => {
      // Empty placeholder for this step
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "external-internal" },
        })
      );
    },
  },
  {
    id: "chapter-2",
    text: "Chapter 2",
    fullwidth: true,
    fadeIn: true,
    fadeOut: true,
    customClass: "header",
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
    },
  },
  {
    id: "samuel-smiles",
    text: 'The father of self-help is Samuel Smiles. His book—fittingly titled Self Help—was published in 1859 and led with a maxim borrowed from Benjamin Franklin: "Heaven helps those that help themselves."',
    fullwidth: true,
    render: () => {
      // Clear existing content
      const figure = d3.select("#figure-container");
      figure.html("");

      // Create a container for the chapter-2 visualization
      const vizContainer = figure
        .append("div")
        .attr("id", "chapter-2")
        .style("width", "100%")
        .style("height", "100%");

      // Load and execute chapter-2-dev.js
      const script = document.createElement("script");
      script.src = "chapter-2-dev.js";
      document.body.appendChild(script);

      // Dispatch an initialization event
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("visualizationUpdate", {
            detail: { step: "samuel-smiles" },
          })
        );
      }, 100);
    },
  },
  {
    id: "smiles-context",
    text: "In Smiles' day, many had moved from farms to factories, where they found themselves diseased and exploited. The rich grew richer while social mobility for the working class was nearly impossible. It makes sense, then, that the Protestant values of hard work, thrift, and personal responsibility seemed virtuous when investment in society was failing.",
    fullwidth: true,
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "samuel-smiles" },
        })
      );
    },
  },
  {
    id: "turn-of-century",
    text: 'At the turn of the century, some scholars referred to these emergent self help books as "success gospel," which, if you ask me, is prophetic. The self help market blossomed into a genre that towed the line between moral uplift and material gain.',
    fullwidth: true,
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "turn-of-century" },
        })
      );
    },
  },
  {
    id: "through-ww1",
    text: "Books about finding spiritual and religious meaning begin to rise in the wake of war. Why wouldn’t they? Your neighbor may be a German spy or worse: a communist. Like Smiles’ readers, these Americans, rightfully so, hope to find some semblance of control when your fate is oversees in the hands of 4.7 million young privates.",
    fullwidth: true,
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "through-ww1" },
        })
      );
    },
  },
  {
    id: "post-20s",
    text: "Then prosperity reigned. The post-war pre-roaring 20s saw that familiar “can-do” attitude encourage individuals take their lives and finances by the horns. You can be as great as Gatsby if you read this book! <br><br>The Great Depression gave rise to entirely new sub-genres of self help as people literally and figuratively hungered for help. It is no coincidence that some of the best-known self-help classics emerged in the 1930s. It was these best-sellers — with their folksy promises that empathic listening and ‘the power of the mind’ can make you rich and successful.",
    fullwidth: true,
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "post-20s" },
        })
      );
    },
  },
  {
    id: "post-20s",
    text: "This is the moment where American self help books begin to emphesize the power of the mind; the inward shift from life's unpredictability to the control we have over it.",
    fullwidth: true,
    customClass: "emphasis-step",
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "post-20s" },
        })
      );
    },
  },
  {
    id: "post-ww2",
    text: "Despite selling millions, the books that indicate your problems come from<span style='color: var(--color-teal);'>you</span> were no match for those that blame <span style='color: var(--color-orange);'>the world</span> books that, once again, reflected the powerlessness that comes from genocide and nuclear doom. <br><br>We look to God. We find meaning in our relationships. We don't focus on ourselves, we focus on our community and our country.",

    fullwidth: true,
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "post-ww2" },
        })
      );
    },
  },
  {
    id: "neoliberal-shift",
    text: "Then came the Vietnam War. The Age of Aquarius. The new age movement. The (perfect for my story arc) “Me Decade.” At the same time flower power blossomed and Watergate sowed doubt in institutions, Raegan Era neoliberalism was on the rise. Neoliberalism, by the way, is mostly a fancy poli-sci way of saying “people (and businesses) can take care of themselves!”  As the promises of the collective fell flat, eyes turned inward. Bookstore shelves reflected the shift: fewer guides to changing the world, more manuals for fixing yourself.",
    fullwidth: true,
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "neoliberal-shift" },
        })
      );
    },
  },
  {
    id: "self-as-battlefield",
    text: 'People no longer saw their suffering as something society could heal.\nThey began to ask "What\'s wrong with me?" instead of "What\'s wrong with us?"\nAnd the American psyche—once aimed outward at enemies, causes, or institutions—started treating the self as both battlefield and solution.',
    fullwidth: true,
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "neoliberal-shift" },
        })
      );
    },
  },
  {
    id: "all-years",
    text: "Most of you reading this are familiar with what happened next.\nEntering the 21st century, self-help pivoted toward coping and resilience. Between economic crashes, pandemics, and and digital overload, anxiety became the new normal. \nUnfortunately, ideas about how to address and cope with that anxiety still tend to blame you instead of the many forces surrounding us. For example, an overworked employee is told to practice mindfulness and productivity hacks, rather than question labor policies or burnout culture. A chronically anxious individual might be guided to optimize their morning routine instead of also recognizing the role of societal instability or lack of healthcare in their distress.",
    fullwidth: true,
    fadeOut: true,
    render: () => {
      // Just update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "all-years" },
        })
      );
    },
  },
  {
    id: "chapter-3",
    text: "Chapter 3",
    fullwidth: true,
    fadeIn: true,
    fadeOut: true,
    customClass: "header",
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
    },
  },
  {
    id: "celebrity-authors",
    text: "Turns out the barrier to entry in self help publishing is low. Hence celebrity authors. \nThis is a natural place to begin, because what is a celebrity if not someone who profits from their personal brand. \nNo, that doesn't mean they're praying on your low self esteem. But...",
    fullwidth: true,
    fadeIn: true,
    render: () => {
      // Clear existing content
      const figure = d3.select("#figure-container");
      figure.html("");

      // Create a container for the chapter-3 visualization
      const vizContainer = figure
        .append("div")
        .attr("id", "chapter-3")
        .style("width", "100%")
        .style("height", "100%");

      // Load and execute chapter-3-dev.js
      const script = document.createElement("script");
      script.src = "chapter-3-dev.js";
      document.body.appendChild(script);

      // Dispatch an initialization event
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("visualizationUpdate", {
            detail: { step: "celebrity-authors" },
          })
        );
      }, 100);
    },
  },
  {
    id: "celebrity-authors-2",
    text: "There are some who publish an appropriate number of books. A number that indicates less ghost writing and more research.",
    fullwidth: true,
    render: () => {
      // Update the existing visualization with the new step
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "celebrity-authors-2" },
        })
      );
    },
  },
  {
    id: "quality-authors",
    text: "There are some who are beloved, with ratings in the top 10% of all authors.",
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "quality-authors" },
        })
      );
    },
  },
  {
    id: "pusher-authors",
    text: "And there are some who have neither. Let's call them pushers. No, they're not selling drugs. But look at these titles and tell me you don't want a taste.",
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "pusher-authors" },
        })
      );
    },
  },
  {
    id: "credibility-score",
    text: "What really makes a pusher, beyond their pump-and-dump books, is their lack of credibility.",
    fullwidth: true,

    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "credibility-score" },
        })
      );
    },
  },
  {
    id: "the-secret",
    text: "A notorious example is The Secret, which became a cultural phenomenon by promising that mere thoughts can change reality. The book asserts that if you visualize events \"exactly as you want\" them, you will \"emit a new signal and frequency for tomorrow\" that causes the universe to deliver your desired outcomes. Before publishing The Secret, Rhonda Byrnes produced 'Oz Encounters: UFO's in Australia' and 'The World's Greatest Commercials.' So when this person publishes a best selling books that promises to transform your psychology, I would classify them as a pusher. It's worth noting — people loved The Secret. In my opinion, however, if you're going to speak about something like it's true, have more proof it's true. See: Australian UFOs.",
    fullwidth: true,
    fadeIn: true,
    fadeOut: true,
    render: () => {
      // Clear existing content
      const figure = d3.select("#figure-container");
      figure.html("");

      // Create a container for the chapter-3-3d visualization
      const vizContainer = figure
        .append("div")
        .attr("id", "chapter-3-3d")
        .style("width", "100%")
        .style("height", "100%");

      // Load and execute chapter-3-3d.js
      const script = document.createElement("script");
      script.src = "chapter-3-3d.js";
      document.body.appendChild(script);

      // Dispatch an initialization event
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("visualizationUpdate", {
            detail: { step: "the-secret" },
          })
        );
      }, 100);
    },
  },
  {
    id: "earned-credibility",
    text: "By contrast, there's a category of self-help authors who've earned their keep the hard way: through research, clinical work, and long hours in the company of real human struggle.",
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "earned-credibility" },
        })
      );
    },
  },
  {
    id: "kubler-ross",
    text: "Elisabeth Kübler-Ross gave the world the Five Stages of Grief—not as a catchphrase, but as a way to humanize the experience of dying, backed by her work with the terminally ill.",
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "earned-credibility" },
        })
      );
    },
  },
  {
    id: "gabor-mate",
    text: "And Dr. Gabor Maté, whose writing on trauma and addiction blends neuroscience with real compassion, has become a north star for people trying to understand suffering without stigma.",
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "earned-credibility" },
        })
      );
    },
  },
  {
    id: "l-ron-hubbard",
    text: 'On the other hand, authors like L. Ron Hubbard, science fiction writer turned self-styled Scientology prophet, managed to churn out books that pegged your depression as evidence of "low thetans." I\'ll never go clear. I\'ve already been labeled a "suppressive person" because of this. Oh well.',
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "low-credibility" },
        })
      );
    },
  },
  {
    id: "kevin-trudeau",
    text: "Kevin Trudeau (an actual convicted felon) constantly claimed to have \"secrets they don't want you to know about.\" Who is they? No matter. Because, and this is not a joke, if you pay a monthly fee those secrets to weight loss and dementia are yours. Better yet, if you get others to join the movement, you can have secrets and make money! Yes. Kevin Trudeau made self help into a pyramid scheme. He's not the only one.",
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "low-credibility" },
        })
      );
    },
  },
  {
    id: "barnum",
    text: "And when the same guy who sewed a monkey torso to a fish tail and convinced audiences it was a mermaid sells a book about personal finance, reconsider. Please.",
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "low-credibility" },
        })
      );
    },
  },
  {
    id: "bibliotherapy",
    text: 'In the UK, the "Reading Well: Books on Prescription" program has transformed the way mental health support is delivered by allowing healthcare professionals to literally prescribe self-help books. These books fall into the category of bibliotherapy, or as I like to call it: Self Help Plus Max. With over 3.8 million books borrowed and 92% of readers finding them helpful, the program underscores the therapeutic potential of reading.',
    fullwidth: true,
    fadeOut: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "bibliotherapy" },
        })
      );
    },
  },
  {
    id: "conclusion-header",
    text: "Conclusion",
    fullwidth: true,
    fadeIn: true,
    fadeOut: true,
    customClass: "header",
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
    },
  },
  {
    id: "conclusion",
    text: "Self-help books can be valuable tools for personal growth, but they should be approached with critical thinking. The best advice acknowledges both individual agency and systemic factors, offering compassionate guidance rather than quick fixes or blame. As readers, we have the power to choose wisdom that truly helps rather than exploits.",
    fullwidth: true,
    customClass: "statement",
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
    },
  },
];

// Make steps available globally
window.stepsConfig = stepsConfig;
