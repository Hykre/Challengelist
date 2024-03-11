document.addEventListener('DOMContentLoaded', async function () {
  const app = document.getElementById('app');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const playerHeaderElement = document.getElementById('playerHeader')
  const playerDetailsElement = document.getElementById('playerDetails');
  const playerIconElement = document.getElementById('playerIcon');

  async function fetchLeaderboardData() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Hykre/Challengelist/main/data/leaderboard.json');
      const leaderboardData = await response.json();
      return leaderboardData;
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      return [];
    }
  }

  async function fetchCompletionsData() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Hykre/Challengelist/main/data/records.json');
      const completionsData = await response.json();
      return completionsData;
    } catch (error) {
      console.error('Error fetching completions data:', error);
      return [];
    }
  }

  async function renderPlayers() {
    const container = document.createElement('div');
    container.className = 'container';

    const leaderboardData = await fetchLeaderboardData();

    leaderboardData.forEach((player, index) => {
      const card = createPlayerCard(player, index);
      container.appendChild(card);
    });

    app.appendChild(container);
  }

  async function renderCompletions(playerName) {
    const completionsData = await fetchCompletionsData();
    const playerCompletions = completionsData.filter(completion => completion.player === playerName);

    const completionsList = document.createElement('ul');
    completionsList.className = 'completions-list';

    playerCompletions.forEach(completion => {
      const completionItem = document.createElement('li');
      completionItem.textContent = `${completion.level} | Place: ${completion.place} | Points: ${completion.points}`;
      completionsList.appendChild(completionItem);
    });

    playerDetailsElement.appendChild(completionsList);
  }

  function createPlayerCard(player, index) {
    const card = document.createElement('div');
    card.className = 'player-card';

    const iconImg = document.createElement('img');
    const iconUrl = `https://classidash.fun/icons/${player.player}.png`;
    iconImg.src = iconUrl;
    iconImg.alt = 'Player Icon';
    iconImg.className = 'player-icon';

    iconImg.onerror = function () {
      iconImg.src = 'https://classidash.fun/icons/Placeholder.png';
    };

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';

    const playerName = document.createElement('h2');
    playerName.textContent = `#${index + 1} - ${player.player}`;

    const playerPoints = document.createElement('span');
    playerPoints.textContent = `Points: ${player.points}`;

    detailsDiv.appendChild(playerName);
    detailsDiv.appendChild(playerPoints);

    card.appendChild(iconImg);
    card.appendChild(detailsDiv);

    card.addEventListener('click', () => {
      openModal(player);
    });

    return card;
  }

  function openModal(player) {
    playerDetailsElement.innerHTML = `Total Points: ${player.points}`;
    playerHeaderElement.textContent = player.player;
    playerIconElement.src = `https://classidash.fun/icons/${player.player}.png`;

    playerIconElement.onerror = function () {
      playerIconElement.src = 'https://classidash.fun/icons/Placeholder.png';
    };

    modalOverlay.style.display = 'block';
    modalContent.style.display = 'block';

    // Render completions for the current player
    renderCompletions(player.player);
  }

  function closeModal() {
    modalOverlay.style.display = 'none';
    modalContent.style.display = 'none';
  }

  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  // Initial render
  await renderPlayers();
});