// Reveal logic------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {
    const revealButton = document.getElementById("revealAnswer");
    const categoryInputs = document.querySelectorAll(".category input[type='radio']");
    const generateButton = document.getElementById("generateRandom");
    const mainContent = document.getElementById("main-content");

    // Initially set the main-content to be faded out and non-interactable
    mainContent.style.opacity = "0.2";
    mainContent.style.pointerEvents = "none";

    function checkSelections() {
        const structureSelected = document.querySelector(".structure input[type='radio']:checked");
        const facadeSelected = document.querySelector(".facade input[type='radio']:checked");
        const sustainabilitySelected = document.querySelector(".sustainability input[type='radio']:checked");

        if (structureSelected && facadeSelected && sustainabilitySelected) {
            revealButton.classList.remove("inactive");
            revealButton.disabled = false;
        } else {
            revealButton.classList.add("inactive");
            revealButton.disabled = true;
        }
    }

    // Add event listeners to all radio buttons
    categoryInputs.forEach(input => {
        input.addEventListener("change", checkSelections);
    });

    // Initially disable the button
    checkSelections();

    // Reveal logic------------------------------------------------
    revealButton.addEventListener("click", function() {
        const resultsBox = document.querySelector(".results-box");

        if (resultsBox) {
            resultsBox.style.maxHeight = resultsBox.scrollHeight + "px";
            revealButton.style.display = "none"; // Hide button when revealed
        }
    });

    // Hide answer, reset selections, and disable revealAnswer when generateRandom is clicked
    generateButton.addEventListener("click", function() {
        const resultsBox = document.querySelector(".results-box");

        if (resultsBox) {
            resultsBox.style.maxHeight = "0"; // Collapse results box
            revealButton.style.display = "block"; // Ensure revealAnswer is shown
        }

        // Deselect all radio buttons
        categoryInputs.forEach(input => input.checked = false);

        // Recheck if button should be enabled (it will be disabled)
        checkSelections();

        // Fade in main-content and restore interactivity
        mainContent.style.transition = "opacity 0.3s ease-in-out"; // Smooth transition
        mainContent.style.opacity = "1";
        mainContent.style.pointerEvents = "auto";
    });
});








// Quiz logic------------------------------------------------
// Embodied carbon emissions
const embodiedCarbon = {
    concrete: 45,
    steel: 70,
    shippingContainer: 36,
    curtainWall: 49,
    compositePanel: 30,
    corkCladding: 21,
    awningShutter: 32,
    greenRoof: 37,
    carbonCapture: 164
};
// Budget levels
const budgetLevels = {
    concrete: 5,
    steel: 5,
    shippingContainer: 5,
    curtainWall: 5,
    compositePanel: 5,
    corkCladding: 5,
    awningShutter: 5,
    greenRoof: 5,
    carbonCapture: 5
};
// Global variable to store random years
let randomYears = null;
// Generate random years
function getRandomYears() {
    return Math.floor(Math.random() * (150 - 20 + 1)) + 20; // Random from 20 to 100 years
}


// Function to calculate operational carbon (for emission materials) based on years of operation
function calculateOperationalCarbon(material, years) {
    // Define decay factors for each material type (adjust as necessary)
    const decayFactor = 
        material === 'concrete' ? 1.5 :
        material === 'steel' ? 0.2 :
        material === 'shippingContainer' ? 6.6 :
        material === 'curtainWall' ? 0.02 : 
        material === 'compositePanel' ? 0.10 :  
        material === 'corkCladding' ? 0.51 :  
        0; // Default to 0 if material doesn't match any listed

    // Use logarithmic growth to model the operational carbon increase
    const operationalCarbon = embodiedCarbon[material] * Math.log1p(decayFactor * years); // Math.log1p(x) is the natural log of (1 + x)

    return operationalCarbon;
}



// Function to calculate absorption for sustainability features, with initial emissions
function calculateAbsorption(material, years) {
    const initialEmissions = embodiedCarbon[material]; // Initial emissions for installation
    
    // Adjust growth factor based on material and nerfing by a factor of 10
    const growthFactor = 
        material === 'carbonCapture' ? 0.08 / 10 :  // Carbon capture has the highest priority
        material === 'greenRoof' ? 0.07 / 10 :  // Green roof has second priority
        material === 'awningShutter' ? 0.06 / 10 :  // Solar panels have third priority
        0; // Default case for unrecognized materials

    // Absorption starts positive, then shifts to negative over time
    const absorption = initialEmissions * (Math.exp(growthFactor * years) - 1);
    return absorption;
}


// Function to calculate total carbon emissions (embodied + operational)
function calculateTotalCarbon(material, years) {
    const embodied = embodiedCarbon[material];
    const operational = calculateOperationalCarbon(material, years);
    return embodied + operational;
}

// Function to calculate total carbon absorption (if the material absorbs carbon)
function calculateTotalAbsorption(material, years) {
    return calculateAbsorption(material, years);
}





// Function to update all values at once
function updateAllValues() {
    const randomYears = getRandomYears(); // Generate random years of operation

    // Calculate the carbon emissions for each material
    const concreteTotal = calculateTotalCarbon('concrete', randomYears);
    const steelTotal = calculateTotalCarbon('steel', randomYears);
    const shippingContainerTotal = calculateTotalCarbon('shippingContainer', randomYears);
    const curtainWallTotal = calculateTotalCarbon('curtainWall', randomYears);
    const compositePanelTotal = calculateTotalCarbon('compositePanel', randomYears);
    const corkCladdingTotal = calculateTotalCarbon('corkCladding', randomYears);

    // Calculate the carbon absorption for sustainability materials
    const awningShutterAbsorption = calculateTotalAbsorption('awningShutter', randomYears);
    const greenRoofAbsorption = calculateTotalAbsorption('greenRoof', randomYears);
    const carbonCaptureAbsorption = calculateTotalAbsorption('carbonCapture', randomYears);

    // Display the random years of operation
    document.getElementById("randomValue").innerText = `Projected Building Lifecycle: ${randomYears} years`;

    // Display the material carbon emissions
    document.getElementById("concreteValue").innerText = `Reinforced Concrete Carbon Emissions: ${concreteTotal.toFixed(2)} tons`;
    document.getElementById("steelValue").innerText = `Steel Carbon Emissions: ${steelTotal.toFixed(2)} tons`;
    document.getElementById("shippingContainerValue").innerText = `shippingContainer Carbon Emissions: ${shippingContainerTotal.toFixed(2)} tons`;
    document.getElementById("curtainWallValue").innerText = `Curtain Wall Carbon Emissions: ${curtainWallTotal.toFixed(2)} tons`;
    document.getElementById("compositePanelValue").innerText = `Brick Facade Carbon Emissions: ${compositePanelTotal.toFixed(2)} tons`;
    document.getElementById("corkCladdingValue").innerText = `Wooden Facade Carbon Emissions: ${corkCladdingTotal.toFixed(2)} tons`;

    // Display the sustainability carbon absorption
    document.getElementById("awningShutterValue").innerText = `Solar Panels Carbon Absorption: ${awningShutterAbsorption.toFixed(2)} tons`;
    document.getElementById("greenRoofValue").innerText = `Green Roofs Carbon Absorption: ${greenRoofAbsorption.toFixed(2)} tons`;
    document.getElementById("carbonCaptureValue").innerText = `Carbon Capture Systems Carbon Absorption: ${carbonCaptureAbsorption.toFixed(2)} tons`;

    // Display all elements' values for the selected year
    displayAllElementsValues(randomYears, concreteTotal, steelTotal, shippingContainerTotal, curtainWallTotal, compositePanelTotal, corkCladdingTotal, awningShutterAbsorption, greenRoofAbsorption, carbonCaptureAbsorption);

    // Update the total emission and budget after the random generation
    updateTotalEmissionAndBudget(randomYears);
}






// Function to display all the elements' values for the year
function displayAllElementsValues(years, concreteTotal, steelTotal, shippingContainerTotal, curtainWallTotal, compositePanelTotal, corkCladdingTotal, awningShutterAbsorption, greenRoofAbsorption, carbonCaptureAbsorption) {
    // Structure values display
    document.getElementById("structureValues").innerHTML = `
        <br>
        <p><strong>Structure:</strong></p>
        <ul>
            <li>Shipping Container: ${shippingContainerTotal.toFixed(2)} tons</li>
            <li>Concrete: ${concreteTotal.toFixed(2)} tons</li>
            <li>Steel: ${steelTotal.toFixed(2)} tons</li>
        </ul>
        <br>
    `;
    // Facade values display
    document.getElementById("facadeValues").innerHTML = `
        <p><strong>Facade:</strong></p>
        <ul>
            <li>Cork Cladding: ${corkCladdingTotal.toFixed(2)} tons</li>
            <li>Composite Panels: ${compositePanelTotal.toFixed(2)} tons</li>
            <li>Curtain Wall: ${curtainWallTotal.toFixed(2)} tons</li>
        </ul>
        <br>
    `;
    // Sustainability values display
    document.getElementById("sustainabilityValues").innerHTML = `
        <p><strong>Sustainability:</strong></p>
        <ul>
            <li>Awnings & Shutters: (32 -${awningShutterAbsorption.toFixed(2)}) = ${(32-awningShutterAbsorption).toFixed(2)} tons</li>
            <li>Green Roof: (37 - ${greenRoofAbsorption.toFixed(2)}) = ${(37-greenRoofAbsorption).toFixed(2)} tons</li>
            <li>Carbon Capture: (164 -${carbonCaptureAbsorption.toFixed(2)}) = ${(164-carbonCaptureAbsorption).toFixed(2)} tons</li>
        </ul>
    `;
}

// Update the total emission and budget based on selection changes
function updateTotalEmissionAndBudget() {
    const randomYears = window.currentRandomYears || getRandomYears(); // Use previously set random years or generate new
    const structure = document.querySelector('input[name="structure"]:checked');
    const facade = document.querySelector('input[name="facade"]:checked');
    const sustainability = document.querySelector('input[name="sustainability"]:checked');

    let totalCarbon = 0;
    let totalBudget = 0;

    // Calculate carbon emissions for selected structure and facade
    if (structure) {
        totalCarbon += calculateTotalCarbon(structure.value, randomYears); // Adding emissions
        totalBudget += budgetLevels[structure.value];
    }

    if (facade) {
        totalCarbon += calculateTotalCarbon(facade.value, randomYears); // Adding emissions
        totalBudget += budgetLevels[facade.value];
    }

    // Calculate carbon absorption and emissions for selected sustainability options
    if (sustainability) {
        const sustainabilityEmissions = calculateTotalCarbon(sustainability.value, randomYears);
        const sustainabilityAbsorption = calculateTotalAbsorption(sustainability.value, randomYears);

        totalCarbon += sustainabilityEmissions; // Add the carbon emissions of sustainability
        totalCarbon -= sustainabilityAbsorption; // Subtract the absorption
        totalBudget += budgetLevels[sustainability.value]; // Add to the total budget
    }


    // Display total carbon and budget
    document.getElementById("totalCarbon").innerHTML = `
    <p><strong>Net Carbon:</strong> ${totalCarbon.toFixed(2)} tons</p>
    `;
}

// Function to update all values at once (from the "random generation" button)
function updateAllValues() {
    const randomYears = getRandomYears(); // Generate random years of operation
    window.currentRandomYears = randomYears; // Store the random years in a global variable

    // Calculate the carbon emissions for each material
    const concreteTotal = calculateTotalCarbon('concrete', randomYears);
    const steelTotal = calculateTotalCarbon('steel', randomYears);
    const shippingContainerTotal = calculateTotalCarbon('shippingContainer', randomYears);
    const curtainWallTotal = calculateTotalCarbon('curtainWall', randomYears);
    const compositePanelTotal = calculateTotalCarbon('compositePanel', randomYears);
    const corkCladdingTotal = calculateTotalCarbon('corkCladding', randomYears);

    // Calculate the carbon absorption for sustainability materials
    const awningShutterAbsorption = calculateTotalAbsorption('awningShutter', randomYears);
    const greenRoofAbsorption = calculateTotalAbsorption('greenRoof', randomYears);
    const carbonCaptureAbsorption = calculateTotalAbsorption('carbonCapture', randomYears);

    // Display the random years of operation
    document.getElementById("randomValue").innerText = `Projected Building Lifecycle: ${randomYears} years`;

    // // Display the material carbon emissions
    // document.getElementById("concreteValue").innerText = `Reinforced Concrete Carbon Emissions: ${concreteTotal.toFixed(2)} tons`;
    // document.getElementById("steelValue").innerText = `Steel Carbon Emissions: ${steelTotal.toFixed(2)} tons`;
    // document.getElementById("shippingContainerValue").innerText = `shippingContainer Carbon Emissions: ${shippingContainerTotal.toFixed(2)} tons`;
    // document.getElementById("curtainWallValue").innerText = `Curtain Wall Carbon Emissions: ${curtainWallTotal.toFixed(2)} tons`;
    // document.getElementById("compositePanelValue").innerText = `Brick Facade Carbon Emissions: ${compositePanelTotal.toFixed(2)} tons`;
    // document.getElementById("corkCladdingValue").innerText = `Wooden Facade Carbon Emissions: ${corkCladdingTotal.toFixed(2)} tons`;

    // // Display the sustainability carbon absorption
    // document.getElementById("awningShutterValue").innerText = `Solar Panels Carbon Absorption: ${awningShutterAbsorption.toFixed(2)} tons`;
    // document.getElementById("greenRoofValue").innerText = `Green Roofs Carbon Absorption: ${greenRoofAbsorption.toFixed(2)} tons`;
    // document.getElementById("carbonCaptureValue").innerText = `Carbon Capture Systems Carbon Absorption: ${carbonCaptureAbsorption.toFixed(2)} tons`;

    // Display all elements' values for the selected year
    displayAllElementsValues(randomYears, concreteTotal, steelTotal, shippingContainerTotal, curtainWallTotal, compositePanelTotal, corkCladdingTotal, awningShutterAbsorption, greenRoofAbsorption, carbonCaptureAbsorption);

    // Update the total emission and budget after the random generation
    updateTotalEmissionAndBudget();

    // Now, call the function to find the lowest carbon combination within the current budget and random years
    const budgetLevel = 16; // Set the budget level for the calculation, replace as needed
    const bestCombination = findLowestCarbonCombination(randomYears, budgetLevel);
}

// Event listeners for the selection buttons (no random year change here)
document.querySelectorAll('input[name="structure"]').forEach(input => {
    input.addEventListener("change", () => updateTotalEmissionAndBudget());
});

document.querySelectorAll('input[name="facade"]').forEach(input => {
    input.addEventListener("change", () => updateTotalEmissionAndBudget());
});

document.querySelectorAll('input[name="sustainability"]').forEach(input => {
    input.addEventListener("change", () => updateTotalEmissionAndBudget());
});

// Event listener for random generation
document.getElementById("generateRandom").addEventListener("click", updateAllValues);






// Function to calculate the lowest carbon combination for structure, facade, and sustainability within the budget level
function findLowestCarbonCombination(years, budgetLevel) {
    let lowestCarbon = Infinity;
    let bestCombination = { structure: null, facade: null, sustainability: null };

    const materials = {
        structure: ['concrete', 'steel', 'shippingContainer'],
        facade: ['curtainWall', 'compositePanel', 'corkCladding'],
        sustainability: ['awningShutter', 'greenRoof', 'carbonCapture']
    };

    // Iterate through each combination of materials
    for (let structure of materials.structure) {
        for (let facade of materials.facade) {
            for (let sustainability of materials.sustainability) {
                // Calculate the total cost for this combination
                const totalCost = budgetLevels[structure] + budgetLevels[facade] + budgetLevels[sustainability];
                
                // Check if the total cost is within the budget (allow for small margin for floating-point precision)
                if (totalCost <= budgetLevel + 0.01) {  // Small tolerance for rounding errors
                    // Calculate total carbon emissions for the combination
                    const totalCarbon = calculateTotalCarbon(structure, years) + 
                                        calculateTotalCarbon(facade, years) + 
                                        calculateTotalCarbon(sustainability, years);

                    // Calculate total carbon absorption for sustainability features
                    const totalAbsorption = calculateTotalAbsorption(sustainability, years);

                    // Net carbon = total emissions - absorption
                    const netCarbon = totalCarbon - totalAbsorption;

                    // If this combination results in lower carbon, update the bestCombination
                    if (netCarbon < lowestCarbon) {
                        lowestCarbon = netCarbon;
                        bestCombination = { structure, facade, sustainability };
                    }
                }
            }
        }
    }

    // Update the HTML div with the result
    const resultDiv = document.getElementById("lowestCarbonResult");

    const structureEmissions = calculateTotalCarbon(bestCombination.structure, years).toFixed(2);
    const facadeEmissions = calculateTotalCarbon(bestCombination.facade, years).toFixed(2);
    const sustainabilityEmissions = calculateTotalCarbon(bestCombination.sustainability, years).toFixed(2);
    const sustainabilityAbsorption = calculateTotalAbsorption(bestCombination.sustainability, years).toFixed(2);
    const totalEmissions = (parseFloat(structureEmissions) + parseFloat(facadeEmissions) + parseFloat(sustainabilityEmissions)).toFixed(2);
    const netCarbon = (parseFloat(totalEmissions) - parseFloat(sustainabilityAbsorption)).toFixed(2);
    const totalCost = (budgetLevels[bestCombination.structure] + budgetLevels[bestCombination.facade] + budgetLevels[bestCombination.sustainability]).toFixed(2);

    resultDiv.innerHTML = ` 
        <div class="results-header">
            <h3>Best Combination</h3>
            <p class="results-total"><strong>Net Carbon:</strong> ${netCarbon} tons</p><br>
        </div>
        <br>
        <div id="category-container" style="flex-direction: column; gap: 6px;">
            <div class="category structure category-row">
                <h3>Structure: </h3>
                <div class="option option-row">
                    ${bestCombination.structure}: ${structureEmissions} tons
                </div>
            </div>
            <div class="category facade category-row">
                <h3>Facade: </h3>
                <div class="option option-row">
                    ${bestCombination.facade}: ${facadeEmissions} tons
                </div>
            </div>
            <div class="category sustainability category-row">
                <h3>Sustainability: </h3>
                <div class="option option-row">
                    ${bestCombination.sustainability}: (${sustainabilityEmissions} - ${sustainabilityAbsorption}) = ${(sustainabilityEmissions - sustainabilityAbsorption).toFixed(2)} tons
                </div>
            </div>
        </div>
    `;
}
