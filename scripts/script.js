document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-text");
  const typing = document.querySelector(".typing-text");

  const navigationType = performance.getEntriesByType("navigation")[0]?.type;
  const isReload = navigationType === "reload";
  const isInitialLoad = !sessionStorage.getItem("visited");

  if (isReload || isInitialLoad) {
    sessionStorage.setItem("visited", "true");
    setTimeout(() => {
      splash.classList.add("hidden");
      typing.classList.add("visited");
    }, 3500);
  } else {
    splash.classList.add("hidden");
    typing.classList.add("visited");
  }
});

function loadProjects() {
  const container = document.querySelector('.projects-body');

  fetch('data/projects.json')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar projects.json');
      return response.json();
    })
    .then(projects => {

      container.innerHTML = '';

      projects.slice(0, 5).forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const title = document.createElement('a');
        title.className = 'project-title';
        title.textContent = p.name;

        const info = document.createElement('span');
        info.className = 'project-info';
        info.textContent = `${p.created} > Dev`;

        const desc = document.createElement('a');
        desc.className = 'project-text';
        desc.textContent = p.description;

        card.appendChild(title);
        card.appendChild(document.createElement('br'));
        card.appendChild(info);
        card.appendChild(document.createElement('br'));
        card.appendChild(desc);

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar projetos:', err);
    });
}

function deactivateActive() {
  document.querySelectorAll('.active-option').forEach(el => {
    el.classList.remove('active-option');
    el.classList.add('inactive-options');
  });

  document.querySelectorAll('.active-icon').forEach(img => {
    img.classList.remove('active-icon');
    img.classList.add('goto-icon');
    img.src = 'images/arrow.png';
  });

  document.querySelectorAll('.active-page').forEach(div => {
    div.classList.remove('active-page');
    div.classList.add('inactive-page');
  });

  document.querySelectorAll('.index-body, .projects-body, .contact-body, .links-body').forEach(section => {
    section.style.display = 'none';
  });
}

function activatePage(newClass) {
  deactivateActive();

  const page = document.querySelector('.' + newClass);
  if (!page) return;

  page.style.display = 'flex';

  let buttonId = '';

  switch(newClass) {
    case 'index-body': buttonId = 'index-button'; break;
    case 'projects-body': buttonId = 'projects-button'; break;
    case 'contact-body': buttonId = 'contact-button'; break;
    case 'links-body': buttonId = 'links-button'; break;
    default: return;
  }

  const menuButton = document.getElementById(buttonId);
  if (!menuButton) return;

  menuButton.classList.remove('inactive-options');
  menuButton.classList.add('active-option');

  const container = menuButton.parentElement;
  container.classList.remove('inactive-page');
  container.classList.add('active-page');

  const icon = container.querySelector('img');
  if (icon) {
    icon.classList.remove('goto-icon');
    icon.classList.add('active-icon');
    icon.src = 'images/circle.png';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  activatePage('index-body');
});
