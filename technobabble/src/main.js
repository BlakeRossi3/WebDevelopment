import {randomElement} from "./utils.js";

let words1 = [];
let words2 = [];
let words3 = [];

const loadBabble = () => {
    const data = new XMLHttpRequest();
    data.open("GET", "data/babble-data.json", true);
    data.onload = () => {
        babbleLoaded(data);
    };
   
    data.send();
};

const babbleLoaded = (data) => {
    let parsedData = JSON.parse(data.responseText);
    words1 = parsedData.words1 || [];
    words2 = parsedData.words2 || [];
    words3 = parsedData.words3 || [];

    init();
    generate(1);
};

const init = ()=>{
    document.querySelector("#btn-gen-1").addEventListener("click", () => generate(1));
    document.querySelector("#btn-gen-5").addEventListener("click", () => generate(5));
}

const generate = (numOfBabble = 1) => {
    let str ="";
    for(let i = 0; i < numOfBabble; i++)
    {
        str += `${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)}!<br>`;
    }
        
    document.querySelector("#output").innerHTML = str;
}   

window.onload = loadBabble;

    