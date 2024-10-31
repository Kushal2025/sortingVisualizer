// script.js

let array = [];
let arraySize = 5; // Default number of bars

// Update array size from the slider and generate a new array
function updateArraySize(newSize) {
    arraySize = parseInt(newSize);
    document.getElementById("arraySizeLabel").innerText = arraySize;
    generateArray();
}

// Function to generate a random array
function generateArray() {
    array = [];
    for (let i = 0; i < arraySize; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    displayArray();
}

// Function to display the array as bars
function displayArray() {
    const arrayContainer = document.getElementById("array-container");
    arrayContainer.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("array-bar");
        bar.style.height = `${array[i] * 4}px`;
        bar.style.width = `${100 / arraySize}%`;
        bar.style.transform = `translateY(0)`;
        arrayContainer.appendChild(bar);
    }
}

// Delay function for visualization
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Set a delay of 800 ms for slower animations
const delay = 800; // Slower speed for better visualization

// Helper functions to set classes for visual effects
function activateBars(index1, index2) {
    const bars = document.getElementsByClassName("array-bar");
    bars[index1].classList.add("active");
    bars[index2].classList.add("active");
}

function deactivateBars(index1, index2) {
    const bars = document.getElementsByClassName("array-bar");
    bars[index1].classList.remove("active");
    bars[index2].classList.remove("active");
}

function markAsSorted(index) {
    const bars = document.getElementsByClassName("array-bar");
    bars[index].classList.add("sorted");
}

// Move function with animation
async function moveBars(index1, index2) {
    const bars = document.getElementsByClassName("array-bar");
    const bar1 = bars[index1];
    const bar2 = bars[index2];
    bar1.classList.add("swap");
    bar2.classList.add("swap");
    bar1.style.transform = `translateX(${(index2 - index1) * (100 / arraySize)}%)`;
    bar2.style.transform = `translateX(${(index1 - index2) * (100 / arraySize)}%)`;
    await sleep(delay);
    // Swap values in the array
    [array[index1], array[index2]] = [array[index2], array[index1]];
    displayArray();
    await sleep(delay);
    bar1.style.transform = `translateX(0)`;
    bar2.style.transform = `translateX(0)`;
    bar1.classList.remove("swap");
    bar2.classList.remove("swap");
}

// Bubble Sort with enhanced visualization
async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            activateBars(j, j + 1);
            if (array[j] > array[j + 1]) {
                await moveBars(j, j + 1);
            }
            deactivateBars(j, j + 1);
        }
        markAsSorted(array.length - 1 - i);
    }
    markAsSorted(0);
}

// Selection Sort with enhanced visualization
async function selectionSort() {
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            activateBars(minIndex, j);
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            deactivateBars(minIndex, j);
        }
        if (minIndex !== i) {
            await moveBars(i, minIndex);
        }
        markAsSorted(i);
    }
}

// Insertion Sort with enhanced visualization
async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let key = array[i]; // The card we are currently trying to place
        let j = i - 1; // The last index of the sorted portion
        
        // Visualization: Highlight the key being placed
        const bars = document.getElementsByClassName("array-bar");
        bars[i].classList.add("active");

        // Shift elements of the sorted portion to make space for the key
        while (j >= 0 && array[j] > key) {
            activateBars(j, j + 1);
            array[j + 1] = array[j]; // Move the larger element to the right
            j--;

            displayArray(); // Update the display
            await sleep(delay); // Delay for visualization
            deactivateBars(j + 1, j + 2); // Deactivate highlighting for the current comparison
        }

        array[j + 1] = key; // Place the key in the correct position

        // Update the display to reflect the new insertion
        displayArray();
        markAsSorted(i); // Mark the current index as sorted
        await sleep(delay); // Delay for visualization
        
        // Visualization: Remove the highlight from the key
        bars[i].classList.remove("active");
    }
    markAsSorted(0); // Finally mark the first element as sorted
}

// Initialize array on load
window.onload = generateArray;
