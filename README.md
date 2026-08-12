# Project

This is a tictactoe game with focus on creating separations of concern between application logic and UI. The UI should merely just update the state and invoke applicaiton logic and react upon it by reading f.e. state

# Mistakes

1. The UI behavior is coupled to the game logic, before I added game logic to the UI behavior (changing state with click handlers). This time, I let the game logic modify UI state but this shouldn't be done since it's not responsible for it. I should should give back a result from the game logic based on which the display class (which is responsible for handling events and updating the UI) will then display different UIs as a result.

# Implementation details

- Use of factory functions to create classes and encapsulation only exposing a public API
- Use of module pattern for the same purpose but to only create a single with which can be interacted

# Main Learnings

# Implementatio

# App views
