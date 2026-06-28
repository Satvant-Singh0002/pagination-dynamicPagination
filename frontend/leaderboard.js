window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await axios.get('http://localhost:4000/premium/leaderboard', {
      headers: { Authorization: token }
    });
    renderLeaderboard(response.data);
  } catch (error) {
    console.log(error);
    document.getElementById('leaderboardList').innerHTML =
      '<p class="error">Failed to load leaderboard.</p>';
  }
});

function renderLeaderboard(data) {
  const list = document.getElementById('leaderboardList');

  if (!data.length) {
    list.innerHTML = '<p class="empty">No data available yet.</p>';
    return;
  }

  list.innerHTML = '';

  data.forEach((user, index) => {
    const rank = index + 1;
    const medal =
      rank === 1 ? '🥇' :
      rank === 2 ? '🥈' :
      rank === 3 ? '🥉' : `#${rank}`;

    const card = document.createElement('div');
    card.className = `leaderboard-card ${rank <= 3 ? 'top-' + rank : ''}`;

    card.innerHTML = `
      <span class="rank">${medal}</span>
      <span class="username">${user.name}</span>
      <span class="amount">₹${Number(user.totalExpense).toLocaleString('en-IN')}</span>
    `;

    list.appendChild(card);
  });
}