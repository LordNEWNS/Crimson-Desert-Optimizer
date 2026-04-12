const critLevelIncreasePerGem = 3;
const attackLevelIncreasePerGem = 3;
const speedLevelIncreasePerGem = 3;
const BaseCrit = 0.05
const CritChanceIncreasePerLevel = 0.02

const SpeedLevelMultiplier = [
    1.0,
    1.018,
    1.0357,
    1.053,
    1.07,
    1.087,
    1.103,
    1.119,
    1.135,
    1.151,
    1.166,
    1.181,
    1.196,
    1.210,
    1.2245,
    1.2385,
]

// select on click for input fields
document.querySelectorAll(".input-field").forEach((inputField) => {
    inputField.addEventListener("focus", function() {
        inputField.select();
    });
});

/*function DamageCalc() {
    
    // gets variables from user input
    
    let CritMultiplier = parseInt(document.getElementById("Crit-Multiplier").value);
    let AttackBase = parseInt(document.getElementById("Attack-level").value);
    let CritBaselevel = parseInt(document.getElementById("Crit-level").value);
    let SpeedBaselevel = parseInt(document.getElementById("Attack-Speed-level").value);
    let AvailGemSlots = parseInt(document.getElementById("Avail-Gem-Slots").value);

    //this needs to find the highest vallue by running through every combination of gems with the formula
    // ((attack + NumOfAttackgems * attackLevelIncreasePerGem) * (1 + ((BaseCrit + CritBaseLevel * CritChanceIncreasePerLevel + NumOfCritGems * CritChanceIncreasePerLevel) * (CritMultiplier - 1)) * SpeedLevelMultiplier[(SpeedBaselevel + NumOfSpeedGems * speedLevelIncreasePerGem)]
    // it needs to do this for every single combination of gems, max amount of gems is dictacted by the AvailGemslot Vairiable. then it needs to find the combination that resaults in the highest number. crit and speed level caps at 15. 
    // these will be updated as we find better combinations
    let bestDamage = 0;
    let bestCombo = { attackGems: 0, critGems: 0, speedGems: 0 };

    // loop through every possible number of attack gems
    for (let attackGems = 0; attackGems <= availGemSlots; attackGems++) {

        // loop through every possible number of crit gems given remaining slots
        for (let critGems = 0; critGems <= availGemSlots - attackGems; critGems++) {

            // speed gems get whatever slots are left over
            let speedGems = availGemSlots - attackGems - critGems;

            // calculate effective levels, capped at 15
            let effectiveCritLevel = Math.min(critBaseLevel + critGems * critLevelIncreasePerGem, 15);
            let effectiveSpeedLevel = Math.min(speedBaseLevel + speedGems * speedLevelIncreasePerGem, 15);

            // run the damage formula for this gem combination
            let damage = (attackBase + attackGems * attackLevelIncreasePerGem)
                * (1 + (BaseCrit + effectiveCritLevel * CritChanceIncreasePerLevel) * (critMultiplier - 1))
                * SpeedLevelMultiplier[effectiveSpeedLevel];

            // if this combo beats the current best, save it
            if (damage > bestDamage) {
                bestDamage = damage;
                // save the gem counts that produced this result
                bestCombo = { attackGems, critGems, speedGems };
            }
        }
    }

    // temporary output to console so we can verify the results
    return ("Best combo:" + bestCombo, "Best damage:" + bestDamage);
    
}*/

function DamageCalc() {

    // read user inputs from the HTML fields and convert them to numbers
    let critMultiplier = parseFloat(document.getElementById("Crit-Multiplier").value)
    let attackBase = parseInt(document.getElementById("Attack-level").value)
    let critBaseLevel = parseInt(document.getElementById("Crit-level").value)
    let speedBaseLevel = parseInt(document.getElementById("Attack-Speed-level").value)
    let availGemSlots = parseInt(document.getElementById("Avail-Gem-Slots").value)

    // array to store every possible combination and its results
    let allResults = [];

    // loop through every possible number of attack gems
    for (let attackGems = 0; attackGems <= availGemSlots; attackGems++) {

        // loop through every possible number of crit gems given remaining slots
        for (let critGems = 0; critGems <= availGemSlots - attackGems; critGems++) {

            // speed gems get whatever slots are left over
            let speedGems = availGemSlots - attackGems - critGems;

            // calculate effective levels, capped at 15
            let effectiveCritLevel = Math.min(critBaseLevel + critGems * critLevelIncreasePerGem, 15);
            let effectiveSpeedLevel = Math.min(speedBaseLevel + speedGems * speedLevelIncreasePerGem, 15);

            // calculate final attack level for display
            let effectiveAttackLevel = attackBase + attackGems * attackLevelIncreasePerGem;

            // run the damage formula for this gem combination
            let damage = effectiveAttackLevel
                * (1 + (BaseCrit + effectiveCritLevel * CritChanceIncreasePerLevel) * (critMultiplier - 1))
                * SpeedLevelMultiplier[effectiveSpeedLevel];

            // store this combination and all its values in the results array
            allResults.push({
                attackGems,
                critGems,
                speedGems,
                effectiveAttackLevel,
                effectiveCritLevel,
                effectiveSpeedLevel,
                damage
            });
        }
    }

    // sort all results from highest damage to lowest
    // the sort compares two entries at a time, subtracting to determine order
    allResults.sort((firstResult, secondResult) => secondResult.damage - firstResult.damage);

    // take only the top 5 results
    let topFiveResults = allResults.slice(0, 5);
    return topFiveResults;
}

function displayResults() {

    // call DamageCalc and store the top 5 results
    let topFiveResults = DamageCalc();

    // grab the results container from the HTML
    let resultsContainer = document.getElementById("results-container");

    // build the best result card using the first entry in the array
    let bestResult = topFiveResults[0];

    // build a readable string describing the best gem combo
    let bestResultDescription = "";
    if (bestResult.attackGems > 0) bestResultDescription += bestResult.attackGems + " ATT ";
    if (bestResult.critGems > 0) bestResultDescription += bestResult.critGems + " CRT ";
    if (bestResult.speedGems > 0) bestResultDescription += bestResult.speedGems + " SPD ";
    bestResultDescription += "ABYSS";

    // build the gem tags for each row in the table
    function buildGemTags(attackGems, critGems, speedGems) {
        let gemTagsHTML = "";
        if (critGems > 0) gemTagsHTML += `<span class="gem-tag gem-tag-crit">${critGems}x CRT</span>`;
        if (attackGems > 0) gemTagsHTML += `<span class="gem-tag gem-tag-attack">${attackGems}x ATT</span>`;
        if (speedGems > 0) gemTagsHTML += `<span class="gem-tag gem-tag-speed">${speedGems}x SPD</span>`;
        return gemTagsHTML;
    }

    // build the table rows by looping through all 5 results
    let tableRowsHTML = "";
    topFiveResults.forEach((result) => {
        tableRowsHTML += `
            <tr>
                <td>${buildGemTags(result.attackGems, result.critGems, result.speedGems)}</td>
                <td>${result.effectiveAttackLevel}</td>
                <td>${result.effectiveCritLevel}</td>
                <td>${result.effectiveSpeedLevel}</td>
                <td>${result.damage.toFixed(2)}</td>
            </tr>
        `;
    });

    // inject everything into the results container
    resultsContainer.innerHTML = `
        <div id="best-result-card">
            <p id="best-result-label">✓ OPTIMAL SPLIT</p>
            <p id="best-result-gems">${bestResultDescription}</p>
            <p id="best-result-damage">damage output: ${bestResult.damage.toFixed(2)}</p>
        </div>

        <table id="results-table">
            <thead>
                <tr>
                    <th>ABYSS</th>
                    <th>FINAL ATT</th>
                    <th>FINAL CRT</th>
                    <th>FINAL SPD</th>
                    <th>DAMAGE</th>
                </tr>
            </thead>
            <tbody>
                ${tableRowsHTML}
            </tbody>
        </table>
    `;
}