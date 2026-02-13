const sections = document.querySelectorAll("div[id]");
const navLinks = document.querySelectorAll(".header-menu a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

const burger = document.querySelector(".burger");
const menu = document.querySelector(".header-menu");

burger.addEventListener("click", () => {
    menu.classList.toggle("active");
});

const toggle = document.querySelector(".theme-toggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("darkmode");
});

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById("progress-bar").style.width = progress + "%";
});

// ==========================
// VEILLE TECHNO - FLUX RSS (AUTOMATIQUE)
// ==========================

function loadRSSFeed() {
    const rssContainer = document.getElementById("rss-feed");

    // Afficher le loader pendant le chargement
    rssContainer.innerHTML = `
        <div class="loading">
            <span class="material-icons rotating">refresh</span>
            <p>Chargement des articles...</p>
        </div>
    `;

    const rssUrl = "https://www.blogdumoderateur.com/feed/";
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur réseau");
            }
            return response.json();
        })
        .then(data => {
            if (!data.items || data.items.length === 0) {
                throw new Error("Flux vide");
            }

            const articles = data.items.slice(0, 6); // 6 derniers articles
            displayRSSItems(articles, "Blog du Modérateur");
        })
        .catch(error => {
            rssContainer.innerHTML = `
                <div class="rss-error">
                    <span class="material-icons">error</span>
                    <p>Impossible de charger les actualités pour le moment.</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Veuillez réessayer plus tard.</p>
                </div>
            `;
            console.error("Erreur RSS :", error);
        });
}

function displayRSSItems(items, sourceName = "Blog du Modérateur") {
    const rssContainer = document.getElementById("rss-feed");

    if (!items || items.length === 0) {
        rssContainer.innerHTML = `
            <div class="rss-error">
                <span class="material-icons">info</span>
                <p>Aucun article disponible pour le moment.</p>
            </div>
        `;
        return;
    }

    const html = items.map(item => {
        // Nettoyer la description (supprime le HTML)
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = item.description || "";
        const cleanDescription = tempDiv.textContent || tempDiv.innerText || "Pas de description disponible.";

        // Récupérer l'image si elle existe
        const imageHTML = item.thumbnail || item.enclosure?.link
            ? `
                <div class="rss-image">
                    <img src="${item.thumbnail || item.enclosure.link}" alt="${item.title}" onerror="this.parentElement.style.display='none'">
                </div>
            `
            : "";

        // Formater la date
        const date = new Date(item.pubDate);
        const formattedDate = date.toLocaleDateString("fr-FR", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        return `
            <div class="rss-item reveal">
                <div class="rss-content">
                    ${imageHTML}
                    <div class="rss-source">${sourceName}</div>
                    <h3>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                            ${item.title}
                        </a>
                    </h3>
                    <div class="rss-date">
                        <span class="material-icons">schedule</span>
                        ${formattedDate}
                    </div>
                    <p class="rss-description">${cleanDescription.substring(0, 150)}...</p>
                </div>
            </div>
        `;
    }).join("");

    rssContainer.innerHTML = html;

    // Animation d'apparition progressive
    setTimeout(() => {
        document.querySelectorAll(".rss-item.reveal").forEach((item, index) => {
            setTimeout(() => {
                item.classList.add("active");
            }, index * 100); // Décalage de 100ms entre chaque carte
        });
    }, 100);
}

// Charger automatiquement au démarrage
document.addEventListener("DOMContentLoaded", loadRSSFeed);