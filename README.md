# Pomodoro Timer

A web-based Pomodoro timer application to help manage productivity cycles.

## Features
- Customizable timer durations for Pomodoro, Short Break, and Long Break.
- Visual countdown display with progress bar.
- Selectable alert sounds.
- Tracks completed Pomodoros and progress.
- Pause, reset, and auto-cycle modes.

## Usage Instructions
1. Open `index.html` in your browser or access the live deployment.
2. Select a mode: Pomodoro, Short Break, or Long Break.
3. Adjust durations using the settings panel if needed.
4. Click **Start** to begin the timer.
5. Timer auto-switches between modes after completion.
6. Select an alert sound from the dropdown to get audio notifications.

## Deployment
- This application can be deployed via GitHub Pages:
  1. Push your repo to GitHub.
  2. Go to **Settings > Pages**.
  3. Select the **main branch** and `/root` folder as the source.
  4. Save and open the provided link.

## Known Issues
- Some browsers may block autoplay of alert sounds; user interaction may be required.
- Duplicate timer elements in HTML may cause confusion (ensure only one set is active).

## Tech Stack
- HTML, CSS, JavaScript (Vanilla)
- LocalStorage for tracking Pomodoro counts
