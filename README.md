# MMM-Flipper

A MagicMirror² module for tracking rotating task assignments. Perfect for household chores like dishes, litter box, garbage, and more!

## Features

- 🔄 **Task Rotation**: Automatically cycle through team members for each task
- 📅 **Last Assignment Tracking**: See who did the task last and when
- 🎨 **Beautiful UI**: Clean, modern cards with smooth animations
- 💾 **Persistent Storage**: Remembers task assignments across restarts
- ⚙️ **Highly Configurable**: Support for multiple tasks with different team members
- 📱 **Responsive Design**: Works on all screen sizes

## Screenshot

The module displays each task as a card showing:
- Task name (e.g., "Dishes", "Litter Box")
- Current person assigned (large, highlighted, **clickable** text)
- Last assignment info (who and when)

**Click on the person's name** to rotate to the next person!

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
        showLastFlip: true
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
  4. Saves all data to `task_states.json` for persistence

- Task states are automatically saved and will persist even if you restart MagicMirror

## File Structure

```
MMM-Flipper/
├── MMM-Flipper.js          # MagicMirror module wrapper
├── MMM-Flipper.css         # Module styling
├── flipper-core.js         # Shared core logic (DOM & state management)
├── node_helper.js          # Backend helper for data persistence
├── task_states.json        # Auto-generated data file (created on first flip)
├── test.html               # Standalone HTML tester (uses actual module files)
└── README.md               # This file
```

## Testing the Module

Before installing in MagicMirror, you can test the module locally:

1. Open `test.html` in your web browser
2. Click on person names to test task rotation
3. Test the save/load functionality
4. Verify the styling and behavior

The test page uses the **actual module CSS and JavaScript**, so what you see is exactly what will appear in MagicMirror!

## Customization

### Styling

You can customize the appearance by editing `MMM-Flipper.css`. The module includes:
- Card backgrounds and borders
- Button colors and hover effects
- Text colors and sizes
- Responsive breakpoints
- Dark/light theme support

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

### Flips don't persist after restart
- Check that the module has write permissions in its directory
- Look for a `task_states.json` file in the module folder
- Check the console for any file system errors

### Button doesn't work
- Make sure you're running MagicMirror in server mode with a browser
- Check browser console for JavaScript errors
- Verify the module loaded correctly

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

### Version 1.0.0 (2025-11-12)
- Initial release
- Task rotation functionality
- Multiple task support
- Persistent storage
- Last assignment tracking
- Responsive design

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

## Author

Created with ❤️ for the MagicMirror² community
