// Fetches data from the Adoptable Creatures API
// - type: The type of creature to fetch (e.g., "cats", "dogs", "dragons")
// - callback: Function to run with the fetched data if successful
// - errorCallback: Function to run with an error message if the request fails
// Define the type for the callback parameters
type SuccessCallback = (param: object[]) => void; // Callback for successful data retrieval
type ErrorCallback = (param: string) => void; // Callback for error handling

export function getData(type: string, callback: SuccessCallback, errorCallback: ErrorCallback) {
    const API_URL = "https://people.rit.edu/anwigm/330/practical/api.php";

  fetch(`${API_URL}?type=${type}`)
      .then((response) => {
          if (!response.ok) {
              throw new Error("Error fetching data from the server.");
          }
          return response.json();
      })
      .then((data) => {
          callback(data);
      })
      .catch((error) => {
          errorCallback(error.message);        
      });
}

  

  
  