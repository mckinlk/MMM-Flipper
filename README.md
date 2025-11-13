# MMM-Flipper

A MagicMirror² module for tracking rotating task assignments. Perfect for household chores like dishes, litter box, garbage, and more!

## Features

- 🔄 **Task Rotation**: Automatically cycle through team members for each task
- 📅 **Last Assignment Tracking**: See who did the task last and when
- 🎨 **Beautiful UI**: Clean, modern cards with smooth flip animations
- 💫 **PQINA Flip Integration**: Professional flip-board animations powered by @pqina/flip v1.8.4
- ✨ **Character-by-Character Animation**: Names flip letter by letter with staggered timing
- 💾 **Persistent Storage**: Remembers task assignments across restarts
- ⚙️ **Highly Configurable**: Support for multiple tasks with different team members
- 📱 **Responsive Design**: Works on all screen sizes
- 🎯 **Compact Mode**: Optional smaller cards for tight spaces

## Screenshot

The module displays each task as a card showing:
- Task name (e.g., "Dishes", "Litter Box")
- Current person assigned with professional flip-board animation (large, highlighted, **clickable** text)
- Last assignment info (who and when)

**Click on the person's name** to rotate to the next person with a smooth character-by-character flip animation powered by PQINA Flip library!

## Installation

1. Navigate to your MagicMirror's `modules` folder:
```bash
cd ~/MagicMirror/modules
```

2. Clone this repository:
```bash
git clone https://github.com/yourusername/MMM-Flipper.git
```

3. Navigate to the module folder:
```bash
cd MMM-Flipper
```

4. Add the module to your `config/config.js` file (see configuration below)

## Configuration

Add the following to your `config/config.js` file:

```javascript
{
    module: "MMM-Flipper",
    position: "top_center", // Choose your preferred position
    config: {
        tasks: [
            {
                name: "Dishes",
                people: ["Alice", "Bob", "Charlie"],
                colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"]  // Optional: custom color for each person
            },
            {
                name: "Litter Box",
                people: ["Alice", "Bob"],
                colors: ["#FF6B6B", "#4ECDC4"]  // Red for Alice, Teal for Bob
            },
            {
                name: "Garbage",
                people: ["Charlie", "Bob", "Alice"]
                // No colors specified - will use defaultColor
            }
        ],
        defaultColor: "#4CAF50",  // Default green color if no colors array specified
        animationSpeed: 1000,
        showLastFlip: true,
        compactMode: false,  // Use smaller cards for tight spaces
        maxCardWidth: "auto"  // Override max card width (e.g., "120px", "auto")
    }
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tasks` | Array | See example | Array of task objects, each with `name`, `people`, and optional `colors` properties |
| `defaultColor` | String | `"#4CAF50"` | Default color for person names if no colors array is specified (hex color code) |
| `animationSpeed` | Number | `1000` | Speed of DOM update animations (in milliseconds) |
| `showLastFlip` | Boolean | `true` | Whether to show "Last: Person on Date" information |
| `compactMode` | Boolean | `false` | Use smaller cards for tight spaces |
| `maxCardWidth` | String | `"auto"` | Override max card width (e.g., "120px", "auto") |

### Task Configuration

Each task object should have:
- `name` (String): The name of the task (e.g., "Dishes", "Garbage")
- `people` (Array): List of names to rotate through for this task
- `colors` (Array, optional): List of hex color codes for each person (must match the number of people)

**Example:**
```javascript
{
    name: "Dishes",
    people: ["Alice", "Bob", "Charlie", "David"],
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]  // Red, Teal, Blue, Salmon
}
```

**Popular Color Palettes:**
- **Vibrant**: `#FF6B6B` (Red), `#4ECDC4` (Teal), `#45B7D1` (Blue), `#FFA07A` (Salmon), `#98D8C8` (Mint)
- **Pastel**: `#FFB6C1` (Pink), `#B0E0E6` (Powder Blue), `#98FB98` (Pale Green), `#DDA0DD` (Plum)
- **Bold**: `#FF4500` (Orange Red), `#9370DB` (Purple), `#00CED1` (Dark Turquoise), `#FFD700` (Gold)
- **Nature**: `#228B22` (Forest Green), `#8B4513` (Saddle Brown), `#4682B4` (Steel Blue), `#DAA520` (Goldenrod)

## Usage

1. **View Current Assignments**: The module displays who is currently assigned to each task
2. **Flip to Next Person**: Click on the person's name to rotate to the next person
3. **Check Last Assignment**: See who did the task last and when (below the person's name)

## How It Works

- When you click on a person's name, the module:
  1. Records the current person as "last assigned"
  2. Saves the current timestamp
  3. Moves to the next person in the list (cycles back to the beginning after the last person)
  4. Triggers a smooth character-by-character flip animation using the PQINA Flip library
  5. Saves all data to `task_states.json` for persistence

- **Animation Details**: Each character in the person's name flips individually with staggered timing, creating a professional flip-board effect
- Task states are automatically saved and will persist even if you restart MagicMirror

## File Structure

```
MMM-Flipper/
├── MMM-Flipper.js          # MagicMirror module wrapper
├── MMM-Flipper.css         # Module styling
├── flipper-core.js         # Shared core logic (DOM & state management)
├── flip.min.js             # PQINA Flip animation library (v1.8.4)
├── flip.min.css            # PQINA Flip styles
├── node_helper.js          # Backend helper for data persistence
├── task_states.json        # Auto-generated data file (created on first flip)
├── test.html               # Standalone HTML tester (uses actual module files)
└── README.md               # This file
```

## Testing the Module

Before installing in MagicMirror, you can test the module locally:

1. Open `test.html` in your web browser
2. Click on person names to test task rotation and flip animations
3. Test the save/load functionality
4. Verify the styling, animations, and behavior

The test page uses the **actual module CSS, JavaScript, and PQINA Flip library**, so what you see is exactly what will appear in MagicMirror!

## Animation Technology

MMM-Flipper uses the professional **PQINA Flip library (v1.8.4)** for stunning visual effects:

### Flip Animation Features
- **Character-by-Character Flipping**: Each letter flips independently for a realistic flip-board effect
- **Staggered Timing**: Letters flip with random delays (50-100ms) creating dynamic motion
- **3D Perspective**: True 3D flip transformations with depth and shadows
- **Smooth Transitions**: Hardware-accelerated CSS transforms for 60fps animations
- **Professional Quality**: Same animation library used in commercial applications

### Animation Sequence
1. **Trigger**: User clicks on person name
2. **Preparation**: New name is padded to match longest name in task for consistent display
3. **Character Splitting**: Name is split into individual characters
4. **Staggered Animation**: Each character flips with a slight delay (50-100ms random)
5. **Completion**: All characters complete flip, showing new person name

### Performance
- Hardware-accelerated CSS transforms
- Optimized for smooth performance on Raspberry Pi
- Minimal CPU usage during animations
- No impact on other MagicMirror modules

## Customization

### Styling

You can customize the appearance by editing `MMM-Flipper.css`. The module includes:
- Card backgrounds and borders
- Button colors and hover effects
- Text colors and sizes
- Professional flip animations via PQINA Flip library
- Responsive breakpoints
- Dark/light theme support
- Compact mode for smaller displays

### Adding More Tasks

Simply add more task objects to the `tasks` array in your config:

```javascript
tasks: [
    { name: "Dishes", people: ["Alice", "Bob"] },
    { name: "Litter Box", people: ["Charlie", "David"] },
    { name: "Garbage", people: ["Alice", "Charlie"] },
    { name: "Laundry", people: ["Bob", "David"] },
    { name: "Cooking", people: ["Alice", "Bob", "Charlie", "David"] }
]
```

### Different People for Different Tasks

Each task can have its own list of people. This is useful if:
- Some people don't participate in certain tasks
- Tasks have different team sizes
- You want different rotation orders

## Troubleshooting

### Module doesn't appear
- Check your `config/config.js` for syntax errors
- Verify the module is in the correct `modules` folder
- Check the MagicMirror logs for error messages
- Ensure flip.min.js and flip.min.css files are present

### Flips don't persist after restart
- Check that the module has write permissions in its directory
- Look for a `task_states.json` file in the module folder
- Check the console for any file system errors

### Button doesn't work or animations don't show
- Make sure you're running MagicMirror in server mode with a browser
- Check browser console for JavaScript errors (especially flip.min.js loading)
- Verify the PQINA Flip library loaded correctly
- Check if FlipperCore is defined in console

### Animation issues
- Verify flip.min.js and flip.min.css are loading properly
- Check browser compatibility (modern browsers required for 3D transforms)
- Look for console errors related to Tick or Flip library
- Ensure sufficient space for flip animation (cards not too constrained)

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### Version 1.1.0 (2025-11-12)
- ✨ **NEW**: Integrated PQINA Flip library for professional flip-board animations
- ✨ **NEW**: Character-by-character flip animations with staggered timing
- ✨ **NEW**: 3D perspective flip effects with shadows and depth
- ✨ **NEW**: Compact mode for smaller displays (`compactMode: true`)
- ✨ **NEW**: Custom card width override (`maxCardWidth` option)
- 🔧 **IMPROVED**: Smoother animations and better performance
- 🔧 **IMPROVED**: Better name padding for consistent display widths
- 🔧 **IMPROVED**: Enhanced error handling and fallbacks
- 📚 **DOCS**: Updated README with animation details and troubleshooting

### Version 1.0.0 (2025-11-12)
- Initial release
- Task rotation functionality
- Multiple task support
- Persistent storage
- Last assignment tracking
- Responsive design

## Technical Implementation

### Core Components

1. **MMM-Flipper.js**: Main MagicMirror module wrapper
   - Handles MagicMirror lifecycle
   - Loads dependencies (flip.min.js, flipper-core.js)
   - Manages socket communications with node_helper

2. **flipper-core.js**: Shared business logic
   - Task state management
   - DOM manipulation
   - Flip animation integration
   - Used by both MagicMirror module and test.html

3. **PQINA Flip Library**: Professional animation engine
   - **flip.min.js**: Core flip animation logic (v1.8.4)
   - **flip.min.css**: Animation styles and 3D transforms
   - Provides Tick.DOM API for creating flip displays

### Animation Integration

The module integrates PQINA Flip through several key steps:

```javascript
// Create Tick instance for flip animation
const tick = Tick.DOM.create(tickElement);

// Configure for character splitting with staggered delays
tick.value = paddedName; // Triggers character-by-character flip

// Each character gets independent flip animation:
// - data-transform: "ascii -> arrive -> round -> char(a-zA-Z )"
// - data-layout: "horizontal fit" with "delay(random, 50, 100)"
```

### Performance Considerations

- **Lazy Loading**: PQINA Flip library loads only when needed
- **Efficient Updates**: Only specific task cards update, not entire DOM
- **Hardware Acceleration**: CSS transforms use GPU acceleration
- **Graceful Degradation**: Falls back to simple text if animations fail

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Author

Created with ❤️ for the MagicMirror² community

## Credits

- **Animation Engine**: [PQINA Flip v1.8.4](https://pqina.nl/flip/) - Professional flip-board animations
- **MagicMirror²**: [MagicMirror² Platform](https://magicmirror.builders/) - Smart mirror framework
- **Inspiration**: Household task rotation and beautiful animations

## License Attribution

This project uses the PQINA Flip library:
- **PQINA Flip**: Copyright (c) 2024 PQINA - https://pqina.nl/flip/
- **MMM-Flipper**: MIT Licensed (see LICENSE file)
