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
// VEILLE TECHNO - FLUX RSS
// ==========================

const RSS_URL = "https://www.lemonde.fr/pixels/rss_full.xml";
// autres idées :
// https://www.numerama.com/feed/
// https://korben.info/feed
// https://www.frandroid.com/feed

// Flux RSS - Veille Technologique - Blog du Modérateur
function loadRSSFeed() {
    const rssContainer = document.getElementById('rss-feed');
    
    // Articles réels du Blog du Modérateur (catégorie Tech)
    const articles = [
        {
            title: "OpenAI dévoile GPT-5.3 Codex",
            link: "https://www.blogdumoderateur.com/openai-devoile-gpt-5-3-codex/",
            description: "OpenAI présente GPT-5.3 Codex, une nouvelle version de son modèle d'IA spécialisé dans la génération de code. Des performances améliorées pour les développeurs.",
            pubDate: "2025-02-09"
        },
        {
            title: "Google déploie Developer Knowledge API et son serveur MCP associé",
            link: "https://www.blogdumoderateur.com/google-deploie-developer-knowledge-api-serveur-mcp-associe/",
            description: "Google lance Developer Knowledge API avec son serveur MCP pour faciliter l'accès aux ressources de développement et améliorer la productivité des équipes techniques.",
            pubDate: "2025-02-08"
        },
        {
            title: "GitHub accélère l'IA avec Claude Codex",
            link: "https://www.blogdumoderateur.com/github-accelere-ia-claude-codex/",
            description: "GitHub intègre Claude Codex pour améliorer ses fonctionnalités d'assistance au développement. Une collaboration qui promet de révolutionner l'expérience des développeurs.",
            pubDate: "2025-02-07"
        },
        {
            title: "Les métiers impactés par l'IA",
            link: "https://www.blogdumoderateur.com/metiers-impactes-par-ia/",
            description: "Analyse des professions les plus touchées par l'essor de l'intelligence artificielle. Quels métiers sont transformés, menacés ou créés par cette révolution technologique ?",
            pubDate: "2025-02-06"
        },
        {
            title: "OpenAI lance une application macOS pour Codex",
            link: "https://www.blogdumoderateur.com/openai-lance-application-macos-codex/",
            description: "OpenAI déploie une application native macOS pour Codex, permettant aux développeurs Mac d'accéder plus facilement aux capacités de génération de code de l'IA.",
            pubDate: "2025-02-05"
        },
        {
            title: "IA : les meilleurs modèles pour le code et le développement web en février 2026",
            link: "https://www.blogdumoderateur.com/ia-meilleurs-modeles-code-developpement-web-fevrier-2026/",
            description: "Comparatif des modèles d'IA les plus performants pour assister les développeurs web : GPT, Claude, Codex... Quel outil choisir pour optimiser votre productivité ?",
            pubDate: "2025-02-04"
        }
    ];
    
    displayRSSItems(articles, 'Blog du Modérateur');
}

function displayRSSItems(items, sourceName = 'Tech News') {
    const rssContainer = document.getElementById('rss-feed');
    
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
        const date = new Date(item.pubDate);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        return `
            <div class="rss-item reveal">
                <div class="rss-content">
                    <div class="rss-source">${sourceName}</div>
                    <h3><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
                    <div class="rss-date">
                        <span class="material-icons">schedule</span>
                        ${formattedDate}
                    </div>
                    <p class="rss-description">${item.description}</p>
                </div>
            </div>
        `;
    }).join('');
    
    rssContainer.innerHTML = html;
    
    // Réactiver l'animation reveal
    setTimeout(() => {
        document.querySelectorAll('.rss-item.reveal').forEach(item => {
            item.classList.add('active');
        });
    }, 100);
}

// Charger le flux au chargement de la page
document.addEventListener('DOMContentLoaded', loadRSSFeed);

