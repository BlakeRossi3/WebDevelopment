// Import functions from api.js and ui.js

  import { getData } from "./api.js";
  import { renderResults, showError, clearError } from "./ui.js";

// Get references to the dropdown and button
const creatureTypeSelect = document.querySelector("#creatureType");
const getDataButton = document.querySelector("#getDataButton");

// Set up event listener for the "Get Data" button
getDataButton.addEventListener("click", () => {
  const selectedType = creatureTypeSelect.value; // Get the selected type
  clearError(); // Clear any existing error messages

  // Fetch data for the selected type
  getData(
    selectedType,
    (data) => {
      renderResults(data); // Render the results on success
    },
    (errorMessage) => {
      showError(errorMessage); // Show an error message on failure
    }
  );
});
