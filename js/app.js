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
