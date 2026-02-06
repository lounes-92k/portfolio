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

const reveals = document.querySelectorAll(".section");

window.addEventListener("scroll", () => {
    reveals.forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            section.classList.add("active");
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

async function loadRSSFeed() {
    const container = document.getElementById("rss-feed");

    try {
        const proxy = "https://api.allorigins.win/raw?url=";
        const response = await fetch(proxy + encodeURIComponent(RSS_URL));
        const text = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");

        const items = [...xml.querySelectorAll("item")].slice(0, 6);

        container.innerHTML = "";

        items.forEach(item => {
            const title = item.querySelector("title")?.textContent || "Sans titre";
            const link = item.querySelector("link")?.textContent || "#";
            const date = new Date(item.querySelector("pubDate")?.textContent);
            const description = item.querySelector("description")?.textContent
                .replace(/<[^>]*>/g, "")
                .substring(0, 150) + "...";

            const article = document.createElement("div");
            article.className = "rss-item reveal";

            article.innerHTML = `
                <div class="rss-source">Le Monde • Pixels</div>
                <h3>
                    <a href="${link}" target="_blank" rel="noopener">
                        ${title}
                    </a>
                </h3>
                <div class="rss-date">
                    <span class="material-icons">schedule</span>
                    ${date.toLocaleDateString("fr-FR")}
                </div>
                <p class="rss-description">${description}</p>
            `;

            container.appendChild(article);
        });

        // animation reveal
        setTimeout(() => {
            document.querySelectorAll(".rss-item").forEach(el => {
                el.classList.add("active");
            });
        }, 100);

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="rss-error">
                <span class="material-icons">error</span>
                <p>Impossible de charger la veille technologique</p>
            </div>
        `;
    }
}

// Chargement auto
document.addEventListener("DOMContentLoaded", loadRSSFeed);
