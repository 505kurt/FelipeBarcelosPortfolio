document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-text");
  const mainContent = document.getElementById("main");
  const typing = document.querySelector(".typing-text");

  const navigationType = performance.getEntriesByType("navigation")[0]?.type;
  const isReload = navigationType === "reload";
  const isInitialLoad = !sessionStorage.getItem("visited");

  mainContent.classList.add("hidden-content");

  if (isReload || isInitialLoad) {
    sessionStorage.setItem("visited", "true");

    splash.addEventListener("animationend", () => {
      splash.classList.add("hidden");
      typing.classList.add("visited");
      mainContent.classList.remove("hidden-content");
    }, { once: true });

  } else {
    splash.classList.add("hidden");
    typing.classList.add("visited");
    mainContent.classList.remove("hidden-content");
  }

  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  if (isPortrait) {
    loadProjects();
    disableNavigation();
    showAllSections();
  } else {
    activatePage('index-body');
    loadProjects();
  }
});

function disableNavigation() {

  document.querySelectorAll('.menu-options').forEach(link => {
    link.onclick = null;
    link.style.display = 'none';
    link.style.pointerEvents = 'none';
    link.style.opacity = '0.5';
    link.style.cursor = 'default';
  });
}

function showAllSections() {
  document.querySelectorAll('.index-body, .projects-body, .contact-body, .links-body')
    .forEach(section => section.style.display = 'flex');
}

function loadProjects() {
  const container = document.querySelector('.projects-body');
  container.innerHTML = '';

  const loader = document.createElement('div');
  loader.className = 'loader';

  const loaderText = document.createElement('span');
  loaderText.textContent = 'Carregando';
  loaderText.className = 'loader-text';

  const loaderBox = document.createElement('div');
  loaderBox.className = 'loader-box';
  loaderBox.appendChild(loader);
  loaderBox.appendChild(loaderText);

  container.appendChild(loaderBox);

  fetch('https://felipebarcelosportfolio.onrender.com/fetch_projects')
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
        title.setAttribute("href", p.link);
        title.setAttribute("target", "_blank");

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
  if (window.matchMedia("(orientation: portrait)").matches) return; // bloqueia se vertical

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