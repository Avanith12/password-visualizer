# Password Visualizer

A modern, interactive web application that visualizes password strength using entropy calculations and real-time feedback. Built with vanilla JavaScript, Tailwind CSS, and the zxcvbn library.

## Features

- 🔒 **Real-time Password Strength Analysis** - Instant feedback as you type
- 📊 **Entropy Visualization** - Mathematical strength calculation in bits
- ⏱️ **Crack Time Estimates** - See how long it would take to crack your password under different attack scenarios:
  - Throttled Online Attacks
  - Fast GPU Hashing
  - Global Botnet Attacks
- 🎨 **Visual Effects** - Dynamic animations based on password strength (cracked, melting, or glowing effects)
- 💡 **Smart Feedback** - Helpful suggestions and warnings based on password patterns
- 😄 **Meme Integration** - Fun memes that change based on your password strength

## How to Use

1. Open `index.html` in a web browser
2. Start typing a password in the input field
3. Watch the real-time analysis and visual feedback

## Technologies Used

- **HTML5** - Structure
- **Tailwind CSS** - Styling and responsive design
- **JavaScript (ES6+)** - Core functionality
- **zxcvbn** - Password strength estimation library
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Inter, JetBrains Mono)

## Project Structure

```
password-visualizer/
├── index.html      # Main HTML file
├── script.js       # JavaScript logic
├── style.css       # Custom CSS styles
└── README.md       # This file
```

## Live Demo

Simply open `index.html` in your browser to use the application. No build process or dependencies required!

## License

This project is open source and available for personal and educational use.

