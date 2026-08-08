const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const cursor = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

async function loadGitHubProjects() {
  const container = document.getElementById('github-projects');
  try {
    const res = await fetch('https://api.github.com/users/Madeswaran2112/repos?sort=updated&per_page=12');
    if (!res.ok) throw new Error('GitHub API unavailable');
    const repos = (await res.json()).filter(r => !r.fork && !r.archived).slice(0, 6);

    if (!repos.length) {
      container.innerHTML = `<div class="repo-loading">No non-fork public repositories are available to show yet. <a href="https://github.com/Madeswaran2112?tab=repositories" target="_blank" rel="noopener">Open GitHub ↗</a></div>`;
      return;
    }

    container.innerHTML = repos.map(r => `
      <article class="repo-card reveal visible">
        <div class="repo-top"><span>${new Date(r.updated_at).toLocaleDateString()}</span><span>${r.visibility || 'public'}</span></div>
        <h4>${escapeHtml(r.name)}</h4>
        <p>${escapeHtml(r.description || 'Public repository by Madeswaran.')}</p>
        <div class="repo-bottom">
          <span class="repo-lang">${escapeHtml(r.language || 'Code')}</span>
          <span>★ ${r.stargazers_count} · ${r.forks_count} forks</span>
          <a href="${r.html_url}" target="_blank" rel="noopener">View ↗</a>
        </div>
      </article>
    `).join('');
  } catch (err) {
    container.innerHTML = `<div class="repo-loading">GitHub cards could not load right now. <a href="https://github.com/Madeswaran2112?tab=repositories" target="_blank" rel="noopener">View my repositories directly ↗</a></div>`;
  }
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
loadGitHubProjects();
