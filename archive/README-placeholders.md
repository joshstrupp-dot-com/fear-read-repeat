# Visualization Placeholders

This document explains the temporary visualization placeholders that have been added to help you see how storybeats affect the visual canvas.

## What's Been Added

1. **Color-coded canvas areas**: Each section has its own color theme
2. **Dynamic SVG shapes**: The shapes change with each storybeat
3. **Visual indicators**: Step numbers appear to show which step is active
4. **Border highlighting**: Borders get thicker with each step
5. **Color coordination**: Progress indicator dots match section colors

## Color Scheme

- **Introduction**: Gray-blue (`#6c757d`)
- **Preface**: Green (`#4a7c59`)
- **Chapter 1**: Purple (`#8675a9`)
- **Chapter 2**: Red (`#c75146`)
- **Chapter 3**: Blue (`#41658a`)
- **Epilogue**: Brown (`#564d4a`)

## Shape Patterns

Each section has a unique visual pattern that evolves through the storybeats:

- **Introduction**: Concentric circles that grow larger
- **Preface**: Squares that expand with each step
- **Chapter 1**: Polygons with increasing sides and radius
- **Chapter 2**: Cross pattern with expanding center
- **Chapter 3**: Dual circles connected by a curve that shifts position
- **Epilogue**: Rounded rectangle with increasing corner radius

## How to Use These Placeholders

1. **Understanding Layout**: Use these placeholders to see how the visual space interacts with your scrolling text
2. **Planning Visualizations**: Consider how each storybeat could relate to a change in your actual data visualization
3. **Transitions**: Note the smooth transitions between steps to plan your animation strategy

## Replacing with Real Visualizations

When you're ready to implement your actual data visualizations:

1. Look for the `canvas-placeholder` elements in the HTML
2. Replace the SVG placeholder content with your D3, WebGL or p5.js visualizations
3. Implement your visualization update logic in the `handleStepEnter` function where indicated

## Customizing Further

If you want to adjust the placeholder styles:

- Edit the CSS variables in `:root` at the top of `style.css`
- Modify the SVG generation logic in `getPlaceholderSVG()` in `main.js`
- Adjust timing and animation in `updateVisualizationPlaceholder()`
