// Updates the DOM to display the fetched data
// - data: An array of objects containing creature details
interface Creature {
  name: string;
  breed: string;
  location: string;
  picture: string;
}
export function renderResults(data : Creature[]) {
  const resultsContainer = document.querySelector("#results") as HTMLDivElement
  resultsContainer.innerHTML = ""; // Clear existing results

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "result-card";

    // Add content to the card
    card.innerHTML = `
        <img src="${item.picture}" alt="${item.name}">
        <h2>${item.name}</h2>
        <p><strong>Breed:</strong> ${item.breed}</p>
        <p><strong>Location:</strong> ${item.location}</p>
      `;

    // ADD THE LINE OF CODE HERE THAT WILL ADD THE CARD 
    // TO END OF THE RESULTS CONTAINER
    resultsContainer.appendChild(card);

  });
}

// Displays an error message on the page
// - message: The error message to show
export function showError(message: string) {
  const errorMessage = document.querySelector("#errorMessage") as HTMLDivElement;
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden"); // Make the error visible
}

// Clears any visible error message from the page
export function clearError() {
  const errorMessage = document.querySelector("#errorMessage") as HTMLDivElement;
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden"); // Hide the error
}
