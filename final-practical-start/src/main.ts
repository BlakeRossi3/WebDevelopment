// Import functions from api.js and ui.js\
interface Creature {
  name: string;
  breed: string;
  location: string;
  picture: string;
}
  import { getData } from "./api";
  import { renderResults, showError, clearError } from "./ui";

// Get references to the dropdown and button
const creatureTypeSelect = document.querySelector("#creatureType") as HTMLSelectElement;
const getDataButton = document.querySelector("#getDataButton") as HTMLButtonElement;

// Set up event listener for the "Get Data" button
getDataButton.addEventListener("click", () => {
  const selectedType = creatureTypeSelect.value; // Get the selected type
  clearError(); // Clear any existing error messages

  // Fetch data for the selected type
  getData(
    selectedType,
    (data: Creature[]) => { 
      renderResults(data); // Render the results on success
    },
    (errorMessage) => {
      showError(errorMessage); // Show an error message on failure
    }
  );
});
