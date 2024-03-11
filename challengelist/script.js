document.addEventListener('DOMContentLoaded', async function () {
  const app = document.getElementById('app');

  async function fetchJsonData(url) {
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      return [];
    }
  }

  function getYouTubeThumbnail(videoUrl) {
    const videoId = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  function createLevelCard(level) {
    const card = document.createElement('div');
    card.className = 'level-card';

    const thumbnailLink = document.createElement('a');
    thumbnailLink.href = level.video;
    thumbnailLink.target = '_blank'; // Open link in a new tab
    thumbnailLink.className = 'thumbnail';

    const thumbnailImg = document.createElement('img');
    thumbnailImg.src = getYouTubeThumbnail(level.video);
    thumbnailLink.appendChild(thumbnailImg);

    const details = document.createElement('div');
    details.className = 'details';

    const h2 = document.createElement('h2');
    h2.innerHTML = `#${level.place} - ${level.name} <span style="color: #1b1b1b;">(${level.id})</span>`;
    h2.style.color = '#1b1b1b';
    h2.style.cursor = 'pointer';

    // Add event listener to copy level ID to clipboard
    h2.addEventListener('click', () => {
      copyToClipboard(level.id);
      alert(`Level ID ${level.id} copied to clipboard!`);
    });

    const creatorsParagraph = document.createElement('p');
    creatorsParagraph.innerHTML = `<span style="color: #3c3c3c; font-weight: bold;">Created by: ${level.creators}</span>`;

    const verifierParagraph = document.createElement('p');
    verifierParagraph.innerHTML = `<span style="color: #3c3c3c; font-weight: bold;">Verified by: ${level.verifier}</span>`;

    const victorsParagraph = document.createElement('p');
    victorsParagraph.innerHTML = `Victors: ${level.victors.length - 1} • List Points: ${Math.round(250 / ((parseInt(level.place) + 4) * 0.2))}`;

    const victorsList = document.createElement('ul');
    victorsList.style.display = 'none';

    level.victors.forEach((victor) => {
      if (victor != level.verifier) {
        const victorItem = document.createElement('li');
        victorItem.textContent = victor;
        victorsList.appendChild(victorItem);
      }
    });

    victorsParagraph.addEventListener('click', () => {
      if (victorsList.style.display === 'none' && level.victors.length > 1) {
        victorsList.style.display = 'block';
      } else {
        victorsList.style.display = 'none';
      }
    });

    details.appendChild(h2);
    details.appendChild(creatorsParagraph);
    details.appendChild(verifierParagraph);
    details.appendChild(victorsParagraph);
    details.appendChild(victorsList);

    card.appendChild(thumbnailLink);
    card.appendChild(details);

    return card;
  }

  function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  async function renderLevels(url) {
    const jsonData = await fetchJsonData(url);
    const container = document.createElement('div');
    container.className = 'container';

    jsonData.sort((a, b) => a.place - b.place);

    jsonData.forEach((level) => {
      level.points = Math.round(250 / ((parseInt(level.place) + 4) * 0.2));
      const card = createLevelCard(level);
      container.appendChild(card);
    });

    // Clear existing content in app before appending the new levels
    app.innerHTML = '';
    app.appendChild(container);
  }

  async function updateLevels(url) {
    await renderLevels(url);
  }

  // Initial render with default URL
  await updateLevels('https://raw.githubusercontent.com/Hykre/Challengelist/main/data/list.json');
});