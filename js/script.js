async function loadJSON(path) {
    const response = await fetch(path);
    return await response.json();
}

async function renderHeader() {
    const data = await loadJSON("data/header.json");

    document.querySelector(".header h1").textContent = data.name;
    document.querySelector(".header h2").textContent = data.title;
    document.querySelector(".header p").textContent = data.description;

    const nav = document.querySelector(".nav");
    nav.innerHTML = "";

    data.nav.forEach(item => {
        nav.innerHTML += `<a href="#${item}">${item.charAt(0).toUpperCase() + item.slice(1)}</a>`;
    });

    const socials = document.querySelector(".social-links");
    socials.innerHTML = "";

    data.social.forEach(s => {
        let iconClass = "";

        const name = s.label.toLowerCase();
        if (name.includes("github")) iconClass = "fa-brands fa-github";
        else if (name.includes("linkedin")) iconClass = "fa-brands fa-linkedin";
        else if (name.includes("twitter")) iconClass = "fa-brands fa-twitter";
        else iconClass = "fa-solid fa-link";

        socials.innerHTML += `
            <a href="${s.url}" target="_blank">
                <i class="${iconClass}"></i> ${s.label}
            </a>
        `;
    });
}

async function renderAbout() {
    const data = await loadJSON("data/about.json");
    const container = document.querySelector("#about div");
    container.innerHTML = "";
    data.paragraphs.forEach(p => {
        container.innerHTML += `<p style="margin-bottom:16px; ">${p}</p>`;
    });
}

async function renderExperience() {
    const data = await loadJSON("data/experience.json");
    const section = document.querySelector("#experience");
    section.innerHTML = "<h3>Experience</h3>";

    data.experience.forEach(exp => {
        section.innerHTML += `
            <div class="card">
                <div class="card-header">
                    <div class="card-time">${exp.year}</div>
                    <div class="card-content">
                        <div class="card-title">${exp.title} <span class="link-icon">↗</span></div>
                        <div class="card-description">${exp.description}</div>
                        <div class="tags">
                            ${exp.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

async function renderProjects() {
    const data = await loadJSON("data/projects.json");
    const section = document.querySelector("#projects");
    section.innerHTML = "<h3>Projects</h3>";

    data.projects.forEach((pro, index) => {
        section.innerHTML += `
    <div class="card project-card" data-index="${index}">
        <div class="card-header">
            <div class="project-image">
                <img src="${pro.image}" alt="${pro.title}">
            </div>
            <div class="card-content">
                <div class="card-title">${pro.title}</div>
                <div class="card-description">${pro.description}</div>
                <div class="tags">
                    ${pro.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
                </div>
            </div>
        </div>
    </div>`;
    });

}

async function enableProjectPopup() {
    const projectData = await loadJSON("data/projects.json");
    const blogData = await loadJSON("data/blogs.json");

    const popup = document.getElementById("project-popup");
    const popupTitle = document.getElementById("popup-title");
    const popupImage = document.getElementById("popup-image");
    const popupBody = document.getElementById("popup-body");
    const closeBtn = document.querySelector(".popup-close");

    document.querySelectorAll(".project-card").forEach((card, index) => {
        card.addEventListener("click", () => {
            const project = projectData.projects[index];
            const blog = blogData.blogs.find(b => b.id === project.blogId); 

            if (!blog) return;

            popupTitle.textContent = blog.title;
            popupImage.src = project.image;
            popupBody.innerHTML = marked.parse(blog.content);

            popup.style.display = "flex";
        });
    });

    closeBtn.onclick = () => (popup.style.display = "none");
    window.onclick = (e) => {
        if (e.target === popup) popup.style.display = "none";
    };
}


renderHeader();
renderAbout();
renderExperience();
renderProjects().then(enableProjectPopup);

const contactBtn = document.getElementById('contactBtn');
const contactDropdown = document.getElementById('contactDropdown');

contactBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    contactDropdown.classList.toggle('show');
    contactBtn.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!contactBtn.contains(e.target) && !contactDropdown.contains(e.target)) {
        contactDropdown.classList.remove('show');
        contactBtn.classList.remove('active');
    }
});

document.querySelectorAll('.contact-option').forEach(option => {
    option.addEventListener('click', () => {
        contactDropdown.classList.remove('show');
        contactBtn.classList.remove('active');
    });
});
