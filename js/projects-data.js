/**
 * PROJECTS DATA — Single source of truth for all projects.
 * 
 * To add a new project:
 *   1. Create projects/projectN.html
 *   2. Add images to images/projects/projectN/
 *   3. Add an entry to the TOP of the PROJECTS array below
 *   4. Done — projects.html, index.html featured & stats, and hero collage all update automatically.
 * 
 * Fields:
 *   id        — Project number (used for paths: projects/project{id}.html, images/projects/project{id}/)
 *   title     — Display title on the card
 *   subtitle  — Short description paragraph
 *   tag       — Genre/style tag shown on the card
 *   badge     — Badge text ("Latest" for newest, "Featured" for highlighted, or any custom text)
 *   image     — Thumbnail filename WITHOUT extension (e.g. "image11"). WebP + PNG versions must exist.
 *   youtubeId — YouTube video ID (the part after watch?v= in the URL)
 */

const PROJECTS = [
    {
        id: 10,
        title: "Kathandare (Tokyo Legend)",
        subtitle: "A dramatic Japanese ancient romance where love transcends war, betrayal, and fate.",
        tag: "Arcane × Historical",
        badge: "Latest",
        image: "image10",
        youtubeId: "lrLXToiFsVw"
    },
    {
        id: 9,
        title: "Rosalina (Global Club Mix)",
        subtitle: "A Puerto Rican narrative of guilt, transformation, and colorful redemption through dance.",
        tag: "Cultural Drama",
        badge: "Featured",
        image: "image9",
        youtubeId: "6Kkd3FxtHhM"
    },
    {
        id: 8,
        title: "Kalu Kella Mamai (Dark Beauty)",
        subtitle: "When the music drops and the lights collide, one presence rises above the crowd.",
        tag: "Neon Dance",
        badge: "Featured",
        image: "image8",
        youtubeId: "qg1WRX4tOLE"
    },
    {
        id: 7,
        title: "Mewila Penevi (Visions Made)",
        subtitle: "Sometimes love doesn't end with a storm… it fades quietly, like footprints beneath the tide.",
        tag: "Romantic Drama",
        badge: "Project 7",
        image: "image7",
        youtubeId: "bHKD0xGFJ3A"
    },
    {
        id: 6,
        title: "Dasama Riddana (Arabian Heat)",
        subtitle: "In the heart of the silent dunes, a queen of light rises and the desert remembers her name.",
        tag: "Arabian Fantasy",
        badge: "Project 6",
        image: "image6",
        youtubeId: "hGzRDIapU40"
    },
    {
        id: 5,
        title: "Nil Desin (Blue Eyes) [Extended Club Mix]",
        subtitle: "Where the past and present collide in a fiery dance of culture, rhythm, and timeless energy.",
        tag: "Urban Fantasy",
        badge: "Project 5",
        image: "image5",
        youtubeId: "kfnX66HhwdI"
    },
    {
        id: 4,
        title: "The Train Song (Elephant Pass Edit)",
        subtitle: "Some journeys take you places, others bring you home. Where the rails meet the sunset.",
        tag: "Dreamy Anime",
        badge: "Project 4",
        image: "image4",
        youtubeId: "1TvsqxpVQdI"
    },
    {
        id: 3,
        title: "Mathakada Handawe (Do You Remember?)",
        subtitle: "A rain-soaked promise, a red umbrella, and the silence between two hearts.",
        tag: "Cinematic Romance",
        badge: "Project 3",
        image: "image3",
        youtubeId: "0I3Cm0k2OpU"
    },
    {
        id: 2,
        title: "Pandama (The Happy Devil)",
        subtitle: "Where the past and present collide in a fiery dance of culture, rhythm, and timeless energy.",
        tag: "Dark Fantasy",
        badge: "Project 2",
        image: "image2",
        youtubeId: "pY25tXNK5uM"
    },
    {
        id: 1,
        title: "Jeewana Me Gamana (The Light)",
        subtitle: "A visual symphony of divine power and electric synthesis: where myth meets energy.",
        tag: "Ethereal Fantasy",
        badge: "Project 1",
        image: "image1",
        youtubeId: "ZpYoE54rmpI"
    }
];

/**
 * Render a project card HTML string.
 * @param {Object} project — project entry from PROJECTS array
 * @param {string} pathPrefix — path prefix for links/images (e.g. "" for root, "../" for subdir)
 * @returns {string} HTML string for the project card
 */
function renderProjectCard(project, pathPrefix = '') {
    return `
        <div class="project-card fade-in">
            <div class="card-image">
                <picture>
                    <source srcset="${pathPrefix}images/projects/project${project.id}/${project.image}.webp" type="image/webp">
                    <img src="${pathPrefix}images/projects/project${project.id}/${project.image}.png" alt="${project.title}" loading="lazy">
                </picture>
                <span class="project-badge">${project.badge}</span>
                <span class="project-tag">${project.tag}</span>
            </div>
            <div class="card-content">
                <h3>${project.title}</h3>
                <p>${project.subtitle}</p>
                <a href="${pathPrefix}projects/project${project.id}.html" class="card-link">View Details →</a>
            </div>
        </div>`;
}

/**
 * Render all project cards into a container.
 * @param {string} containerId — DOM id of the grid container
 * @param {string} pathPrefix — path prefix for links/images
 * @param {number} limit — optional, max number of projects to show (default: all)
 */
function renderProjectGrid(containerId, pathPrefix = '', limit = 0) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const projectsToRender = limit > 0 ? PROJECTS.slice(0, limit) : PROJECTS;
    container.innerHTML = projectsToRender.map(p => renderProjectCard(p, pathPrefix)).join('');

    // Re-observe fade-in elements if the observer exists
    container.querySelectorAll('.fade-in').forEach(el => {
        if (typeof fadeObserver !== 'undefined') {
            fadeObserver.observe(el);
        } else {
            // Fallback: make visible immediately
            el.classList.add('visible');
        }
    });
}

/**
 * Update the stats counter on the homepage.
 */
function updateProjectStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        const label = el.nextElementSibling;
        if (label && label.textContent.trim() === 'Projects') {
            el.textContent = PROJECTS.length;
        }
    });
}

/**
 * Get all project collage image paths (WebP).
 * @param {string} pathPrefix — path prefix
 * @returns {string[]} array of image paths
 */
function getProjectImagePaths(pathPrefix = '') {
    return PROJECTS.map(p => `${pathPrefix}images/projects/project${p.id}/${p.image}.webp`);
}

/**
 * Fetch YouTube view counts and render featured projects sorted by most viewed.
 * Falls back to default order (newest first) if the API is unavailable.
 * @param {string} containerId — DOM id of the grid container
 * @param {string} pathPrefix — path prefix for links/images
 * @param {number} limit — max number of featured projects (default: 3)
 */
async function renderFeaturedByViews(containerId, pathPrefix = '', limit = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Render default order immediately (no flash of empty content)
    renderProjectGrid(containerId, pathPrefix, limit);

    try {
        const response = await fetch('/api/youtube-views');
        if (!response.ok) throw new Error('API unavailable');

        const viewCounts = await response.json();

        // Sort projects by view count (descending)
        const sorted = [...PROJECTS].sort((a, b) => {
            const viewsA = viewCounts[a.youtubeId] || 0;
            const viewsB = viewCounts[b.youtubeId] || 0;
            return viewsB - viewsA;
        });

        // Take top N and mark as "Most Viewed" / "Popular"
        const featured = sorted.slice(0, limit).map((p, i) => ({
            ...p,
            badge: i === 0 ? '🔥 Most Viewed' : '⭐ Popular'
        }));

        // Re-render with sorted order
        container.innerHTML = featured.map(p => renderProjectCard(p, pathPrefix)).join('');

        // Re-observe fade-in elements
        container.querySelectorAll('.fade-in').forEach(el => {
            if (typeof fadeObserver !== 'undefined') {
                fadeObserver.observe(el);
            } else {
                el.classList.add('visible');
            }
        });
    } catch (err) {
        // Silently fall back to default order (already rendered above)
        console.log('Featured by views: using default order (API unavailable)');
    }
}
