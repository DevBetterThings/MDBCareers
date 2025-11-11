# MDB Careers

A professional job board featuring opportunities at Multilateral Development Banks, built with HTML, CSS, and JavaScript.

## Features

- 🏛️ Professional, institutional design
- 🔍 Real-time search functionality
- 🏷️ Filter jobs by type (Full-time, Part-time, Contract, Remote)
- 📱 Fully responsive design
- 🌍 12 MDB job listings from major institutions

## How to Run Locally

### Option 1: Open Directly in Browser (Simplest)
1. Navigate to the project folder
2. Double-click on `index.html`
3. The website will open in your default browser

### Option 2: Using Python (Recommended for Development)
If you have Python installed:

```bash
# Python 3
python -m http.server 8000

# Then open your browser and go to:
# http://localhost:8000
```

### Option 3: Using Node.js
If you have Node.js installed:

```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Run the server
http-server

# Then open your browser and go to:
# http://localhost:8080
```

### Option 4: Using VS Code
If you have VS Code with the Live Server extension:
1. Right-click on `index.html`
2. Select "Open with Live Server"

## File Structure

```
Website/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # JavaScript for interactivity
└── README.md       # This file
```

## Featured Institutions

This job board includes opportunities from:
- World Bank
- International Monetary Fund (IMF)
- Asian Development Bank (ADB)
- African Development Bank (AfDB)
- Inter-American Development Bank (IDB)
- European Bank for Reconstruction and Development (EBRD)
- Islamic Development Bank (IsDB)

## Customization

### Adding More Jobs
Edit the `jobs` array in `script.js`:

```javascript
const jobs = [
    {
        id: 1,
        title: "Job Title",
        company: "Multilateral Development Bank Name",
        location: "Location",
        type: "Full-time", // or Part-time, Contract, Remote
        salary: "$XX,XXXk - $XX,XXXk",
        description: "Job description here"
    },
    // Add more jobs...
];
```

### Changing Colors
The main color scheme uses professional MDB blue tones in `styles.css`:
- Header gradient: Lines 10-11
- Primary color: `#003d82` (MDB Blue)
- Secondary color: `#0a5fa5` (Light Blue)

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## License

Free to use and modify for personal and commercial projects.

