# 3D Earth Visualization using Three.js

## Project Overview
This project is a 3D Earth visualization built using **Three.js**, a popular 3D rendering library in JavaScript. The Earth is rendered with day and night textures, cloud layers, and a glowing atmosphere. Users can interact with the Earth using **OrbitControls**, allowing them to rotate and zoom into the globe. Additionally, a starfield surrounds the Earth, giving it a space-like environment.

### Features:
- Realistic Earth with day and night textures.
- Cloud layer with transparency.
- Fresnel effect glow for the Earth’s atmosphere.
- Starfield background simulating outer space.
- User interaction with orbit controls to explore the 3D globe.

---

## Project Structure

---
.
- **index.html**          # Entry point for the application.
- **main.js**             # Main JavaScript file that initializes the scene.
- **getStarfield.js**     # Module for generating a starfield around the Earth.
- **getFresnelMat.js**   # Module to create a Fresnel material for the glow effect.
- **textures/**           # Folder containing Earth textures (day, night, clouds).
- **shaders/**            # Shader files for custom fragment and vertex shaders.
- **README.md**           # This file!


---

## Live Demo
You can see a live demo of this project [here](#) (link to the deployment if available).

---

## Getting Started

### Prerequisites:
Before running this project, you need to have:

- **Node.js** (for local development with npm)
- **A web browser** (latest versions of Chrome, Firefox, Edge, etc.)

### Installing the Dependencies
You need to install a local development server such as **http-server** or **lite-server**.

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/yourusername/3d-earth-visualization.git
    cd 3d-earth-visualization
    ```
2. **Install Dependencies:**
    ```bash
    npm install lite-server --save-dev
    ```
3. **Run the Project:**
    ```bash
    npm run start
    ```
4. Open the application in your web browser:
    ```bash
    http://localhost:3000
    ```

### Usage:
- **Camera Interaction:** You can rotate the Earth by dragging your mouse or using touch controls. Zoom in and out with the scroll wheel.
- **Day/Night Transition:** The Earth automatically transitions between day and night views as it rotates.
- **Cloud Layer:** The Earth is surrounded by a semi-transparent cloud layer that rotates independently.

---

## Customization

### Textures:
- **Day Texture:** Located in `./textures/00_earthmap1k.jpg`.
- **Night Texture:** Located in `./textures/earth_lights_lrg.jpg`.
- **Cloud Texture:** Located in `./textures/05_earthcloudmaptrans.jpg`.

### Starfield:
The starfield around the Earth can be customized by modifying the number of stars or their distribution. Check the `getStarfield.js` file to tweak the star generation parameters.

---

## Project Breakdown
1. **Scene Initialization (`initScene`):** Sets up the Three.js renderer, camera, and scene.
2. **Earth Creation (`createEarth`):** Loads the day and night textures and applies them using a custom shader. Adds the Earth to a group to allow for flexible rotation.
3. **Cloud Layer (`createClouds`):** Adds a transparent cloud layer using a standard material with additive blending.
4. **Glow Effect (`createGlow`):** Adds a Fresnel-based glow around the Earth to simulate the atmospheric effect.
5. **Starfield (`createStars`):** Creates a field of stars around the Earth using points with randomly generated positions.
6. **Orbit Controls:** Allows the user to rotate and zoom the Earth for exploration.

---

## Unit Testing
This project uses **Jest** for unit testing. Tests are located in the `__tests__` folder and cover the creation of the Earth, starfield, and materials.

### Running Tests
```bash
