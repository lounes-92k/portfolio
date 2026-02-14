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
// VEILLE TECHNO - FLUX RSS IA RÉCENTS (2026)
// ==========================

function loadRSSFeed() {
    const rssContainer = document.getElementById("rss-feed");

    // Afficher le loader pendant le chargement
    rssContainer.innerHTML = `
        <div class="loading">
            <span class="material-icons rotating">refresh</span>
            <p>Chargement des dernières actualités IA...</p>
        </div>
    `;

    // ✅ FLUX RSS ACTIFS ET RÉCENTS SUR L'IA (2026)
    const rssSources = [
        {
            url: "https://www.lemondeinformatique.fr/flux-rss/intelligence-artificielle/rss.xml",
            name: "Le Monde Informatique"
        },
        {
            url: "https://www.blogdumoderateur.com/feed/",
            name: "Blog du Modérateur",
            filter: true // On va filtrer les articles IA
        },
        {
            url: "https://www.usine-digitale.fr/intelligence-artificielle/rss",
            name: "Usine Digitale"
        },
        {
            url: "https://www.journaldunet.com/intelligence-artificielle/rss",
            name: "Journal du Net"
        }
    ];

    // Mots-clés pour filtrer les articles sur l'IA
    const aiKeywords = [
        'intelligence artificielle',
        'ia',
        'ai',
        'chatgpt',
        'openai',
        'deepmind',
        'machine learning',
        'deep learning',
        'algorithme',
        'llm',
        'gpt',
        'claude',
        'gemini',
        'copilot',
        'automatisation'
    ];

    // Fonction pour vérifier si un article parle d'IA
    function isAIRelated(item) {
        const text = (item.title + ' ' + item.description).toLowerCase();
        return aiKeywords.some(keyword => text.includes(keyword));
    }

    // Charger tous les flux en parallèle
    const fetchPromises = rssSources.map(source => 
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`)
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    let items = data.items;
                    
                    // Si on doit filtrer (Blog du Modérateur), ne garder que les articles IA
                    if (source.filter) {
                        items = items.filter(item => isAIRelated(item));
                    }
                    
                    // Ajouter le nom de la source à chaque article
                    return items.slice(0, 3).map(item => ({
                        ...item,
                        sourceName: source.name
                    }));
                }
                return [];
            })
            .catch(error => {
                console.error(`Erreur lors du chargement de ${source.name}:`, error);
                return [];
            })
    );

    // Attendre que tous les flux soient chargés
    Promise.all(fetchPromises)
        .then(results => {
            // Fusionner tous les articles
            const allArticles = results.flat();

            if (allArticles.length === 0) {
                throw new Error("Aucun article trouvé");
            }

            // Trier par date (plus récent en premier)
            allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

            // Prendre les 9 articles les plus récents
            const recentArticles = allArticles.slice(0, 9);

            displayRSSItems(recentArticles);
        })
        .catch(error => {
            rssContainer.innerHTML = `
                <div class="rss-error">
                    <span class="material-icons">error</span>
                    <p>Impossible de charger les actualités IA pour le moment.</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Veuillez réessayer plus tard.</p>
                </div>
            `;
            console.error("Erreur RSS :", error);
        });
}

function displayRSSItems(items) {
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
                    <div class="rss-source">${item.sourceName}</div>
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