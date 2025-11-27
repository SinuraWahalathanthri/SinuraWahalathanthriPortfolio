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

const easterEggImages = {
    'nasa': 'https://cdn-icons-png.flaticon.com/512/124/124555.png',
    'rocket': 'https://cdn-icons-png.flaticon.com/512/2949/2949347.png',
    'stars': 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    'confetti': 'https://cdn-icons-png.flaticon.com/512/5810/5810904.png'
};

async function renderAchievements() {
    const data = await loadJSON("data/achievements.json");
    const section = document.querySelector("#achievements");
    section.innerHTML = "<h3>Achievements</h3>";

    data.achievements.forEach(achievement => {
        section.innerHTML += `
            <div class="card achievement-card" 
                 data-easter-egg="${achievement.easterEgg}"
                 data-easter-image="${easterEggImages[achievement.easterEgg] || ''}"
                 data-achievement-image="${achievement.image || ''}">
                <div class="card-header">
                    <div class="card-time">${achievement.year}</div>
                    <div class="card-content">
                        <div class="card-title">${achievement.title} 
                            ${achievement.easterEgg === 'nasa' ? '🚀' : ''}
                            ${achievement.easterEgg === 'rocket' ? '🎯' : ''}
                            ${achievement.easterEgg === 'stars' ? '⭐' : ''}
                            ${achievement.easterEgg === 'confetti' ? '🎉' : ''}
                        </div>
                        <div class="card-description">${achievement.description}</div>
                        <div class="tags">
                            ${achievement.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
                        </div>
                    </div>
                </div>
            </div>`;
    });

    enableAchievementEasterEggs();
}

function enableAchievementEasterEggs() {
    const canvas = document.getElementById("easter-egg-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    let particles = [];

    const cursorImage = document.createElement('div');
    cursorImage.className = 'cursor-image';
    cursorImage.innerHTML = '<img src="" alt="easter egg">';
    document.body.appendChild(cursorImage);

    let currentCard = null;
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (currentCard) {
            cursorImage.style.left = mouseX + 'px';
            cursorImage.style.top = mouseY + 'px';
        }
    });

    class Particle {
        constructor(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.vx = (Math.random() - 0.5) * 5;
            this.vy = (Math.random() - 0.5) * 5;
            this.life = 120;
            this.size = Math.random() * 4 + 2;

            if (type === 'nasa') {
                this.color = `rgba(94, 234, 212, ${Math.random() * 0.8 + 0.2})`;
                this.vy -= 3;
                this.size = Math.random() * 5 + 3;
            } else if (type === 'rocket') {
                this.color = `rgba(255, ${Math.random() * 100 + 50}, ${Math.random() * 50}, ${Math.random() * 0.8 + 0.2})`;
                this.size = Math.random() * 3 + 2;
                this.trail = [];
            } else if (type === 'stars') {
                this.color = `rgba(255, 215, ${Math.random() * 100 + 155}, ${Math.random() * 0.8 + 0.2})`;
                this.sparkle = Math.random() * Math.PI * 2;
                this.size = Math.random() * 4 + 2;
            } else if (type === 'confetti') {
                const colors = [
                    'rgba(94, 234, 212',
                    'rgba(56, 189, 248',
                    'rgba(251, 146, 60',
                    'rgba(244, 114, 182',
                    'rgba(167, 139, 250'
                ];
                this.baseColor = colors[Math.floor(Math.random() * colors.length)];
                this.color = `${this.baseColor}, ${Math.random() * 0.8 + 0.2})`;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 6 + 3;
            }
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15;
            this.life -= 1.5;

            if (this.type === 'stars') {
                this.sparkle += 0.15;
                this.vx *= 0.98;
                this.vy *= 0.98;
            }
            if (this.type === 'confetti') {
                this.rotation += this.rotationSpeed;
                this.vx *= 0.99;
            }
            if (this.type === 'rocket' && this.life > 80) {
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > 8) this.trail.shift();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life / 120;

            if (this.type === 'stars') {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (Math.PI * 2 * i) / 5 + this.sparkle;
                    const outerRadius = this.size;
                    const innerRadius = this.size / 2;

                    let x = this.x + Math.cos(angle) * outerRadius;
                    let y = this.y + Math.sin(angle) * outerRadius;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);

                    angle += Math.PI / 5;
                    x = this.x + Math.cos(angle) * innerRadius;
                    y = this.y + Math.sin(angle) * innerRadius;
                    ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
            } else if (this.type === 'confetti') {
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fillRect(-this.size / 2, -this.size, this.size, this.size * 2);
            } else if (this.type === 'rocket') {
                if (this.trail.length > 0) {
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = this.size;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(this.trail[0].x, this.trail[0].y);
                    this.trail.forEach(point => {
                        ctx.lineTo(point.x, point.y);
                    });
                    ctx.stroke();
                }
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles = particles.filter(p => p.life > 0);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();

    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const easterEgg = card.dataset.easterEgg;
            const achievementImage = card.dataset.achievementImage;

            currentCard = card;

            const imageUrl = achievementImage || card.dataset.easterImage;
            if (imageUrl) {
                cursorImage.querySelector('img').src = imageUrl;
                cursorImage.classList.add('active');
            }

            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const particleCount = easterEgg === 'confetti' ? 40 : 25;

            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const speed = Math.random() * 3 + 2;
                const offsetX = Math.cos(angle) * speed * 10;
                const offsetY = Math.sin(angle) * speed * 10;

                particles.push(new Particle(
                    centerX + offsetX,
                    centerY + offsetY,
                    easterEgg
                ));
            }
        });

        card.addEventListener('mousemove', (e) => {
            if (currentCard !== card) return;

            const easterEgg = card.dataset.easterEgg;

            if (Math.random() > 0.7) {
                const rect = card.getBoundingClientRect();
                const offsetX = (Math.random() - 0.5) * rect.width * 0.8;
                const offsetY = (Math.random() - 0.5) * rect.height * 0.8;
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                particles.push(new Particle(
                    centerX + offsetX,
                    centerY + offsetY,
                    easterEgg
                ));
            }
        });

        card.addEventListener('mouseleave', () => {
            currentCard = null;
            cursorImage.classList.remove('active');
        });
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
renderAchievements();
renderProjects().then(enableProjectPopup);

const contactBtn = document.getElementById('contactBtn');
const contactDropdown = document.getElementById('contactDropdown');

if (contactBtn && contactDropdown) {
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
}