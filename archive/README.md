# Fear, Read, Repeat: A Self-Help Book Data Story

A scrollytelling data visualization project exploring patterns and insights from self-help books.

## Project Overview

This project presents a data-driven exploration of self-help literature through an interactive scrollytelling experience. The narrative unfolds across six main sections:

1. **Introduction** - Setting up the argument
2. **Preface** - Customizing the user's journey based on their interests
3. **Chapter 1** - First data visualization exploration
4. **Chapter 2** - Second data visualization exploration
5. **Chapter 3** - Third data visualization exploration
6. **Epilogue** - Concluding thoughts and reflections

## Technical Structure

The project is built using:

- **Scrollama** - For scroll-based interactions and storytelling
- **D3.js** - For data processing and visualization
- **WebGL** - For future advanced visualizations
- **p5.js** - For creative coding integrations

## Project Structure

```
├── index.html          # Main HTML entry point
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── main.js         # Main JavaScript for scrollama and interactions
├── data/
│   └── sample-books.json # Sample dataset (placeholder)
├── lib/
│   ├── d3.v7.min.js    # D3.js library
│   ├── scrollama.min.js # Scrollama library
│   └── p5.min.js       # p5.js library
└── assets/             # For future images, videos, etc.
```

## Local Development

To run this project locally:

1. Clone the repository
2. Navigate to the project directory
3. Start a local server:

Using Python:

```
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

Using Node.js:

```
# If you have npm installed
npx serve
```

4. Open your browser and navigate to `http://localhost:8000` (or whatever port your server is using)

## Future Development

- Integration of complete datasets
- Implementation of D3.js visualizations
- Addition of WebGL-based visualizations
- Enhanced interactive elements for user customization
- Responsive design optimizations

## Notes for Developers

- The project is structured to allow easy addition of new scrollama "storybeats"
- Visualization placeholders are set up in the HTML with clear comments
- The CSS uses a minimal design approach with monospace typography and grayscale colors
- Mobile responsiveness is built into the design but may need refinement as visualizations are added
