document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLevel = document.getElementById("easy-label");
  const mediumLevel = document.getElementById("medium-label");
  const hardLevel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  async function fetchUserDetails(username) {
    const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const data = await response.json();
      console.log("API DATA:", data);

      // Safe mapping (handles undefined API fields)
      const easy = Number(data.easySolved ?? 0);
      const medium = Number(data.mediumSolved ?? 0);
      const hard = Number(data.hardSolved ?? 0);

      const totalSolved = easy + medium + hard;

      // Hardcoded totals (stable for UI)
      const EASY_MAX = 800;
      const MEDIUM_MAX = 1600;
      const HARD_MAX = 600;

      // Safe percent calculation
      const easyPercent = Math.min((easy / EASY_MAX) * 100, 100);
      const mediumPercent = Math.min((medium / MEDIUM_MAX) * 100, 100);
      const hardPercent = Math.min((hard / HARD_MAX) * 100, 100);

      // UI updates
      easyLevel.textContent = easy;
      mediumLevel.textContent = medium;
      hardLevel.textContent = hard;

      if (cardStatsContainer) {
        cardStatsContainer.innerHTML = `
        <div class="card">
            <h4>Total Solved</h4>
            ${totalSolved}
        </div>
    `;
      }

      // Circle fill updates
      easyProgressCircle.style.setProperty("--progress", `${easyPercent}%`);
      mediumProgressCircle.style.setProperty("--progress", `${mediumPercent}%`);
      hardProgressCircle.style.setProperty("--progress", `${hardPercent}%`);
    } catch (error) {
      console.error("ERROR:", error);
      statsContainer.innerHTML = `<p>Failed to load data</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("logggin username: ", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
