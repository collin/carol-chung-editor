## Toy Editor (Canvas)

The purpose of the editor is to allow drawing shapes using HTML canvas and modifying shape properties from the editor.

## About the App

**Dependencies**

* Create React App, uuid, node v14+

**Caveats**

A few items are not working correctly:

* Currently multiple shapes can be highlighted simultaneously. Initially I designed the feature this way and then saw in the specs it should be changed. I ran out of time to fix this.

* Currently the only way to deselect shapes is to click outside of any shapes. The requirement to click a selected shape to deselect it is not implemented. Initially I forgot about the click to deselect requirement but when I implemented it and started to test the feature, it felt weird. Such as in this use case: 

1 Select multiple shapes. 

2 Then click on a selected shape to drag the group. 

3 The shape is getting deselected when that was not the intention.

4 It would be better to add a key press requirement to deselect a currently selected shape. For ex, you need to press Ctrl and click on a selected shape in order to deselect it. This seems more functional but I ran out of time to implement it.

* Currently the max height of the Shape Editor section is hard-coded to 500px. Otherwise the canvas was getting stretched out vertically resulting in shape height distortions. When more than 2 shapes are selected, you need to scroll down to view all the property editors.

* Also I ran out of time to refactor the code. I tried to clean up basic console statements and comments but there are sections where the code could be more DRY.


### Part 2 Requirements

**Write out a short plan for what you would need to change / add to your program to support the following features**

* localStorage based persistence

  * In the UI, this should require a button, 'Save Snapshot' because there is no current control for capturing the x and y positions of the shapes.

  * In localStorage, the history could be saved as an array of the shapesObj data. There should be a limited number of snapshots that can be saved, like 10-15.

  * When the button is clicked, the current shapesObj (state) data should be appended to the localStorage array, shapesHistory.

* undo/redo

  * In the UI, this should require two buttons, 'Undo' and 'Redo'. 

  * In the app state, this should require tracking the current index of state history (`historyIndex`) which is being rendered. The default should be the last index of the shapesHistory array from localStorage.

  * Clicking the 'Undo' button should result in decrementing the `historyIndex` value from state, getting the shape object from localStorage (`shapesHistory`) at the index from historyIndex and replacing the `shapesObj` with the new shape object from localStorage.

  * Clicking the 'Redo' button should result in incrementing the `historyIndex` value from state, getting the shape object from localStorage (`shapesHistory`) at the index from historyIndex and replacing the `shapesObj` with the new shape object from localStorage.

* save to image

  * In the UI, this should require a button, 'Save to image'.

  * When the button is clicked, the handler should get a data url using the method from https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL . The resulting data url should be stored (in app or localStorage) with description for retrieval.

### Part 3 Code decisions

**App State**

* Debated whether to use React vs vanilla JavaScript. Vanilla JS would have worked fine too for this scope but I thought since Angular was in use maybe React would be interesting for comparison.

* Decided to store the state of which shapes should display on the canvas as an object for faster editing.

* I separated a lot of logic for rendering square vs rendering circle. It would have been possible to create one draw function with conditions for what to draw for which shape but I felt like it was more organized to keep that separate.

* Similarly I separated logic for handling events into two sections, like handle mouse movement for rectangle vs handle mouse movement for circle.

* Also for the Shape editor section, I defined two subcomponents for the Circle properties editor vs Rectangle properties editor. Although there was some overlap in properties, it seemed a little clearer to separate the property editors.

* Other decisions were included in the caveats section.

## Using the App

### To install files

Clone the repo.

From the root folder of the repo, run the install command.

`npm install`

### To run the app

From the root folder of the repo, run the start command.

`npm start`

------

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`


