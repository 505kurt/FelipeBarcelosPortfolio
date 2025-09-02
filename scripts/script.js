const sections = document.querySelectorAll("section");
const icons = document.querySelectorAll(".menu-icon");

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  setSectionIcon();
});

function loadProjects() {
  const container = document.querySelector('.projects-grid');
  container.innerHTML = '';

  fetch('https://api.github.com/users/505kurt/repos?sort=updated&direction=desc')
    .then(response => {
      if (!response.ok) throw new Error('Erro ao carregar projects.json');
      return response.json();
    })
    .then(projects => {
      container.innerHTML = '';

      const exclude = ["505kurt", "FelipeBarcelosPortfolio"];
      const select = [];

      let index = 0;
      while (select.length < 5 && index < projects.length) {
        const p = projects[index];
        if (!exclude.includes(p.name)) {
          select.push(p);
        }
        index++;
      }

      while (select.length < 5 && index < projects.length) {
        const p = projects[index];
        if (!exclude.includes(p.name) && !select.some(s => s.name === p.name)) {
          select.push(p);
        }
        index++;
      }

      select.slice(0, 6).forEach((p, index) => {
        const card = document.createElement('a');
        card.className = 'project-card';
        card.setAttribute("href", p.html_url);
        card.setAttribute("target", "_blank");

        const title = document.createElement('span');
        title.className = 'project-title';
        title.textContent = p.name;

        const rawDate = p.updated_at;
        let formattedDate = new Date(rawDate);
        formattedDate = formattedDate.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }).replace(" de ", " ").replace(".", "");
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

        const info = document.createElement('span');
        info.className = 'project-info';
        info.textContent = `${formattedDate} > Dev`;

        const desc = document.createElement('a');
        desc.className = 'project-text';
        desc.textContent = p.description;

        card.appendChild(title);
        card.appendChild(document.createElement('br'));
        card.appendChild(info);
        card.appendChild(document.createElement('br'));
        card.appendChild(desc);

        if (index % 2 == 0) {
            card.setAttribute("data-aos", "fade-right");
        } else {
            card.setAttribute("data-aos", "fade-left");
        }

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar projetos:', err);
    });
}

window.addEventListener("scroll", () => {
    setSectionIcon();
});

function setSectionIcon() {
    let currentSectionId = "";

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;

        if (sectionTop <= window.innerHeight / 2 && sectionTop + sectionHeight > window.innerHeight / 2) {
            currentSectionId = section.id;
        }
    });

    if (currentSectionId == "about") {
        icons.forEach(i => {
            i.classList.remove("active");
        });
        const activeIcon = document.getElementById("about-icon")
        activeIcon.classList.add("active");
    } else if (currentSectionId == "projects") {
        icons.forEach(i => {
            i.classList.remove("active");
        });
        const activeIcon = document.getElementById("projects-icon")
        activeIcon.classList.add("active");
    } else if (currentSectionId == "contact") {
        icons.forEach(i => {
            i.classList.remove("active");
        });
        const activeIcon = document.getElementById("contact-icon")
        activeIcon.classList.add("active");
    } else if (currentSectionId == "links") {
        icons.forEach(i => {
            i.classList.remove("active");
        });
        const activeIcon = document.getElementById("links-icon")
        activeIcon.classList.add("active");
    } else {
        const anyActive = Array.from(icons).some(i => i.classList.contains("active"));

        if (!anyActive) {
            const activeIcon = document.getElementById("about-icon");
            activeIcon.classList.add("active");
        }
    }
}