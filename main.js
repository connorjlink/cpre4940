const articleContent = document.querySelector("article");

function loadPage(url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newContent = doc.querySelector("article");
            articleContent.innerHTML = newContent.innerHTML;
            document.title = doc.title;
            document.querySelectorAll('link[data-page-style]').forEach(link => link.remove());

            doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                if (!link.href.includes('common.css')) {
                    const newLink = document.createElement('link');
                    newLink.rel = 'stylesheet';
                    newLink.href = link.href;
                    newLink.setAttribute('data-page-style', 'true');
                    document.head.appendChild(newLink);
                }
            });
        });
    console.log(`Loaded page: ${url}`);
}

function navigate(url) {
    console.log(`Navigating to ${url}`);
    const realUrl = url.substring(2); // Remove './' prefix;
    if (realUrl != "" && window.location.href.includes(realUrl)) {
        return;
    }
    history.pushState({ url }, "", url);
    loadPage(url);
}
window.navigate = navigate;

window.addEventListener("popstate", e => {
    if (e.state?.url) {
        loadPage(e.state.url);
    }
});

function parseUrlForNavbar() {
    const url = window.location.href;
    const page = url.split('/').pop() || "";

    const map = {
        experience: 'experience-radio',
        education: 'education-radio',
        portfolio: 'portfolio-radio',
        contact: 'contact-radio'
    };

    let found = false;
    for (const key in map) {
        if (page.includes(key)) {
            const button = document.getElementById(map[key]);
            if (button) {
                button.checked = true;
            }
            console.log(`Found ${key} in ${page}, setting ${map[key]} as checked.`);
            found = true;
            break;
        }
    }
    if (!found) {
        const homeRadio = document.getElementById('home-radio');
        if (homeRadio) {
            homeRadio.checked = true;
        }
    }
}

window.addEventListener('load', parseUrlForNavbar);

const nav = document.querySelector('nav');
document.getElementById('navbar-toggle').addEventListener('click', function() {
    nav.style.display = (nav.style.display === 'none') ? 'initial' : 'none';
});
