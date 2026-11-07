"use strict";

const resultBtn = document.querySelector(".result");
const restartBtn = document.querySelector(".restart");
const resultText = document.querySelector(".result-text");
const spectrumText = document.querySelector(".spectrum-text");
const testHeader = document.querySelector(".section-test-h2");
const sectionTest = document.querySelector(".section-test");
const spectrumIMG = document.querySelector(".spectrum");
const versionToggles = document.querySelector(".version-toggles");

// Question files for the alternate versions, keyed by the ?version= param.
const versionFiles = {
    "claude": "new-design.md"
};

let scoreCount = 0;
let totalCount = 0;
let spectrum = "";
let scorePercentage = 0;

resultBtn.addEventListener("click", function (e)
{
    e.preventDefault();
    totalCount = 0;
    scoreCount = 0;
    document.querySelectorAll(".q").forEach(function (element)
    {
        totalCount++;
        if (!element.checked)
        {
            scoreCount++;
        }
        element.style.display = "none";
    });
    document.querySelectorAll(".q2").forEach(function (element)
    {
        totalCount++;
        if (element.checked)
        {
            scoreCount++;
        }
        element.style.display = "none";
    });
    scorePercentage = Math.floor(((totalCount - scoreCount) / totalCount) * 100);
    spectrum = calcSpectrum(scorePercentage);

    testHeader.textContent = "Your Results";
    spectrumText.style.display = "block";
    resultText.style.display = "block";
    resultBtn.style.display = "none";
    restartBtn.style.display = "block";
    versionToggles.style.display = "none";
    document.querySelector(".claude-disclaimer").style.display = "none";
    spectrumIMG.style.display = "block";
    resultText.textContent = "Final Score: " + (totalCount - scoreCount) + "/" + totalCount + " (" + scorePercentage + "%) ";
    spectrumText.textContent = "You are " + spectrum.toUpperCase() + ".";
    deleteQuestions();
});

restartBtn.addEventListener("click", function ()
{
    location.reload();
});

function deleteQuestions()
{
    document.querySelectorAll(".qt").forEach(function (element)
    {
        element.style.display = "none";
    });
    document.querySelectorAll(".test-title").forEach(function (element)
    {
        element.style.display = "none";
    });

}

let version = new URLSearchParams(location.search).get("version");
if (!versionFiles.hasOwnProperty(version))
{
    version = "original";
}
document.querySelector('.version-toggle[data-version="' + version + '"]').style.display = "none";
if (version !== "original")
{
    document.querySelector(".claude-disclaimer").style.display = "block";
    loadQuestions(versionFiles[version]);
}

// Swaps the original questions for the ones in a version's .md file
// ("## Category" headings and "N. [good|bad] Question" lines).
function loadQuestions(file)
{
    fetch(file)
        .then(function (res)
        {
            return res.text();
        })
        .then(function (md)
        {
            const resultRow = resultBtn.parentElement;
            sectionTest.querySelectorAll(".test-title, input[type=checkbox]").forEach(function (element)
            {
                element.parentElement.remove();
            });

            md.split("\n").forEach(function (line)
            {
                const heading = line.match(/^##\s+(.+)$/);
                const question = line.match(/^(\d+)\.\s+\[(good|bad)\]\s+(.+)$/);
                const row = document.createElement("div");
                row.className = "row";
                if (heading)
                {
                    row.innerHTML = '<h3 class="test-title"></h3>';
                    row.firstChild.textContent = heading[1];
                }
                else if (question)
                {
                    const number = Number(question[1]);
                    row.innerHTML = '<p class="qt"></p><input type="checkbox"><p class="qt"></p>';
                    row.children[0].textContent = number + ".\u00a0";
                    if (number < 10)
                    {
                        row.children[0].classList.add("tab");
                    }
                    row.children[1].className = question[2] === "good" ? "q" : "q2";
                    row.children[2].textContent = question[3];
                }
                else
                {
                    return;
                }
                sectionTest.insertBefore(row, resultRow);
            });
        });
}

function calcSpectrum(sp)
{
    if (sp >= 90)
    {
        resultText.style.backgroundColor = "#99D9EA";
        spectrumText.style.backgroundColor = "#99D9EA";
        return "not down bad";
    }
    else if (sp >= 80)
    {
        resultText.style.backgroundColor = "#00A3E8";
        spectrumText.style.backgroundColor = "#00A3E8";
        return "down bad";
    }
    else if (sp >= 70)
    {
        resultText.style.backgroundColor = "#23B14D";
        spectrumText.style.backgroundColor = "#23B14D";
        return "down terrible";
    }
    else if (sp >= 60)
    {
        resultText.style.backgroundColor = "#B5E51D";
        spectrumText.style.backgroundColor = "#B5E51D";
        return "down horrendous";
    }
    else if (sp >= 50)
    {
        resultText.style.backgroundColor = "#FEF200";
        spectrumText.style.backgroundColor = "#FEF200";
        return "down hideous";
    }
    else if (sp >= 40)
    {
        resultText.style.backgroundColor = "#FF7F26";
        spectrumText.style.backgroundColor = "#FF7F26";
        return "down monumental";
    }
    else if (sp >= 30)
    {
        resultText.style.backgroundColor = "#ED1B24";
        spectrumText.style.backgroundColor = "#ED1B24";
        return "down defecient";
    }
    else if (sp >= 20)
    {
        resultText.style.backgroundColor = "#A349A3";
        spectrumText.style.backgroundColor = "#A349A3";
        return "down pathetic";
    }
    else if (sp >= 10)
    {
        resultText.style.backgroundColor = "#7F7F7F";
        spectrumText.style.backgroundColor = "#7F7F7F";
        return "down despicable";
    }
    else if (sp >= 0)
    {
        resultText.style.backgroundColor = "#000000";
        spectrumText.style.backgroundColor = "#000000";
        resultText.style.color = "#fff";
        spectrumText.style.color = "#fff";
        return "down astronomical";
    }
}
