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
    text: "You’re a few keystrokes from fixing your marriage. You’re one Amazon order from never aging again. You’re 8 minutes from knowing all of Wall Street’s secrets (or 4 minutes if you watch on 2x).",
    fullwidth: false,
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");

      // Add the image to the figure (no need for manual fade handling)
      figure
        .append("img")
        .attr("src", "../assets/keystrokes-placeholder.png")
        .attr("alt", "Quick fixes illustration")
        .style("width", "100%")
        .style("height", "100%")
        .style("object-fit", "contain")
        .style("display", "block")
        .style("margin", "0 auto");
    },
  },
  {
    id: "self-help",
    text: "This advice is called self-help. Like it or not, realize it or not — you're probably a consumer of self-help.",
    fullwidth: true,
    customClass: "statement",
    render: () => {
      const figure = d3.select("#figure-container");
      figure.html("");
    },
  },
  {
    id: "fastest-growing",
    text: "Self-help literature, a product born out of and almost entirely consumed in the United States, is the fastest growing nonfiction genre since 2013. There are millions of books out there, but today we'll focus on the 20,000 most read books on Goodreads.",
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
      }, 100);
    },
  },
  {
    id: "blame-game",
    text: "There are titles that claim your dead-end job is your fault and yours to fix; that you're depressed because you're not doing enough squat jumps; that you can't connect with your child unless you follow these \"ten steps to tame your teen.\"",
    fullwidth: true,
    render: () => {
      // Keep the existing visualization but trigger the zoom update
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "intro-2" },
        })
      );
    },
  },

  {
    id: "systemic-problems",
    text: "So much of self-help suggests you're not doing enough, which, in my opinion, isn't cool. Our anxieties are often the result of events outside of our control and some authors efforts to, in the words of scholar Beth Blum in her book The Self-Help Compulsion, \"privatize solutions to systemic problems.\"",
    fullwidth: true,
    render: () => {
      // Keep the existing visualization in its zoomed state
      // No need to dispatch a new event as we want to maintain the same view as "blame-game"
    },
  },

  {
    id: "two-analyses",
    text: "What follows are two analyses. The first wil explore how the self help industry took advantage of neoliberal shifts in self care and how (western) world events — not our inability to pray more or take ashwaganda — are at the root of our fears. The second covers which authors may be cashing in.",
    fullwidth: true,
    render: () => {
      // Empty placeholder for this step
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "two-analyses" },
        })
      );
    },
  },
  {
    id: "ml-categories",
    text: "Using machine learning, every self help book was classified into 10 categories that designate what problem they aim to address.",
    fullwidth: true,
    render: () => {
      // Empty placeholder for this step
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "ml-categories" },
        })
      );
    },
  },
  {
    id: "external-internal",
    text: "As we explore trends across time, we'll explore the progression of self help books through two categories — EXTERNAL, books that explore struggles that originate outside of the self (society, politics, family, metaphysics); and INTERNAL,or books that explore anxieties stemming from within the self (self-esteem, willpower, internalized doubt).",
    fullwidth: true,
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
    text: "Then prosperity reigned. The post-war pre-roaring 20s saw that familiar “can-do” attitude encourage individuals take their lives and finances by the horns. You can be as great as Gatsby if you read this book! The Great Depression gave rise to entirely new sub-genres of self help as people literally and figuratively hungered for help. It is no coincidence that some of the best-known self-help classics emerged in the 1930s. It was these best-sellers — with their folksy promises that empathic listening and ‘the power of the mind’ can make you rich and successful.",
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
    id: "post-ww2",
    text: "Despite selling millions, these prototypical ‘internal’ books were no match for those ‘external’ books that, once again, reflected the powerlessness that comes from genocide and nuclear doom. We look to God. We find meaning in our relationships. We don’t focus on ourselves, we focus on our community and our country.",
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
    id: "celebrity-authors",
    text: "Turns out the barrier to entry in self help publishing is low. Hence celebrity authors. \nThis is a natural place to begin, because what is a celebrity if not someone who profits from their personal brand. \nNo, that doesn't mean they're praying on your low self esteem. But...",
    fullwidth: true,
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
          detail: { step: "all-authors" },
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
          detail: { step: "all-authors" },
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
          detail: { step: "all-authors" },
        })
      );
    },
  },
  {
    id: "the-secret",
    text: "A notorious example is The Secret, which became a cultural phenomenon by promising that mere thoughts can change reality. The book asserts that if you visualize events \"exactly as you want\" them, you will \"emit a new signal and frequency for tomorrow\" that causes the universe to deliver your desired outcomes. Before publishing The Secret, Rhonda Byrnes produced 'Oz Encounters: UFO's in Australia' and 'The World's Greatest Commercials.' So when this person publishes a best selling books that promises to transform your psychology, I would classify them as a pusher. It's worth noting — people loved The Secret. In my opinion, however, if you're going to speak about something like it's true, have more proof it's true. See: Australian UFOs.",
    fullwidth: true,
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
          detail: { step: "the-secret" },
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
          detail: { step: "the-secret" },
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
          detail: { step: "the-secret" },
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
          detail: { step: "the-secret" },
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
          detail: { step: "the-secret" },
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
          detail: { step: "the-secret" },
        })
      );
    },
  },
  {
    id: "bibliotherapy",
    text: 'In the UK, the "Reading Well: Books on Prescription" program has transformed the way mental health support is delivered by allowing healthcare professionals to literally prescribe self-help books. These books fall into the category of bibliotherapy, or as I like to call it: Self Help Plus Max. With over 3.8 million books borrowed and 92% of readers finding them helpful, the program underscores the therapeutic potential of reading.',
    fullwidth: true,
    render: () => {
      // Update the existing visualization
      document.dispatchEvent(
        new CustomEvent("visualizationUpdate", {
          detail: { step: "the-secret" },
        })
      );
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
