// Sample podcast data
const podcastData = [
    {
        id: 1,
        title: "What is GPT 5.0 in Azure?",
        description: "Explore how Azure GPT 5.0 is revolutionizing The future of AI apps and agents for Microsoft partners.",
        category: "ai",
        host: "Goutham Upadhyaya",
        duration: "07:30",
        date: "2025-08-05",
    audioUrl: "gpt5v2.mp3", // Place gpt5v2.mp3 in the same Podcast folder as index.html
        thumbnail: "https://via.placeholder.com/300x200/0078d4/ffffff?text=Azure+AI"
    },
    {
        id: 2,
        title: "Microsoft 365 Copilot: Boosting Productivity",
        description: "Discover how Microsoft 365 Copilot is enhancing productivity across organizations and driving partner success.",
        category: "business",
        host: "Ratnesh Pandey",
        duration: "32:15",
        date: "2025-08-03",
        audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
        thumbnail: "https://via.placeholder.com/300x200/106ebe/ffffff?text=M365+Copilot"
    },
    {
        id: 3,
        title: "Zero Trust Security Architecture with Azure",
        description: "Learn about implementing Zero Trust security models using Azure security services and best practices.",
        category: "security",
        host: "Khushal Waghela",
        duration: "28:45",
        date: "2025-08-01",
        audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
        thumbnail: "https://via.placeholder.com/300x200/40e0d0/ffffff?text=Zero+Trust"
    },
    {
        id: 4,
        title: "Partner Success Story: Digital Transformation Journey",
        description: "A comprehensive case study of how a Microsoft partner helped a Fortune 500 company modernize their infrastructure.",
        category: "partner",
        host: "Amit Dixit",
        duration: "35:20",
        date: "2025-07-30",
        audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
        thumbnail: "https://via.placeholder.com/300x200/0078d4/ffffff?text=Success+Story"
    },
    {
        id: 5,
        title: "Building Modern Applications with .NET 8",
        description: "Deep dive into .NET 8 features and how to build scalable, modern applications for the cloud.",
        category: "development",
        host: "Krishnaveni Poluru",
        duration: "41:10",
        date: "2025-07-28",
        audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
        thumbnail: "https://via.placeholder.com/300x200/106ebe/ffffff?text=.NET+8"
    },
    {
        id: 6,
        title: "Azure DevOps: Streamlining CI/CD Pipelines",
        description: "Master Azure DevOps for continuous integration and deployment in enterprise environments.",
        category: "development",
        host: "Shikha Bhatia",
        duration: "29:55",
        date: "2025-07-26",
        audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
        thumbnail: "https://via.placeholder.com/300x200/40e0d0/ffffff?text=Azure+DevOps"
    },
    {
        id: 7,
        title: "Power Platform: Low-Code Revolution",
        description: "How Power Platform is enabling citizen developers and transforming business processes.",
        category: "business",
        host: "Ratnesh Pandey",
        duration: "26:40",
        date: "2025-07-24",
        audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
        thumbnail: "https://via.placeholder.com/300x200/0078d4/ffffff?text=Power+Platform"
    },
    {
        id: 8,
        title: "Azure Machine Learning: From Model to Production",
        description: "Complete guide to building, training, and deploying ML models using Azure Machine Learning.",
        category: "ai",
        host: "Arun Prakash Mishra",
        duration: "38:25",
        date: "2025-07-22",
        audioUrl: "https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav",
        thumbnail: "https://via.placeholder.com/300x200/106ebe/ffffff?text=Azure+ML"
    }
];

// Global variables
let currentEpisode = null;
let currentEpisodeIndex = -1;
let filteredEpisodes = [...podcastData];
let audioElement = null;
let isPlaying = false;
let currentTime = 0;
let duration = 0;
let playbackSpeed = 1;

// DOM elements
const episodesGrid = document.getElementById('episodes-grid');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressSlider = document.getElementById('progressSlider');
const volumeSlider = document.getElementById('volumeSlider');
const speedBtn = document.getElementById('speedBtn');
const closePlayerBtn = document.getElementById('closePlayer');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const progressEl = document.getElementById('progress');
const playerTitle = document.getElementById('playerTitle');
const playerHost = document.getElementById('playerHost');
const playerThumbnail = document.getElementById('playerThumbnail');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    audioElement = document.getElementById('audioElement');
    setupEventListeners();
    renderEpisodes(podcastData);
    setupCategoryFilters();
    setupNavigation();
}

function setupEventListeners() {
    // Audio player controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPreviousEpisode);
    nextBtn.addEventListener('click', playNextEpisode);
    closePlayerBtn.addEventListener('click', closePlayer);
    speedBtn.addEventListener('click', togglePlaybackSpeed);
    
    // Progress and volume controls
    progressSlider.addEventListener('input', seekAudio);
    volumeSlider.addEventListener('input', adjustVolume);
    
    // Audio element events
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', playNextEpisode);
    audioElement.addEventListener('canplay', () => {
        if (isPlaying) {
            audioElement.play();
        }
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterEpisodes(btn.dataset.filter);
        });
    });
    
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterEpisodes(category);
            scrollToSection('episodes');
        });
    });
}

function renderEpisodes(episodes) {
    episodesGrid.innerHTML = '';
    
    episodes.forEach((episode, index) => {
        const episodeCard = createEpisodeCard(episode, index);
        episodesGrid.appendChild(episodeCard);
    });
}

function createEpisodeCard(episode, index) {
    const card = document.createElement('div');
    card.className = 'episode-card';
    card.dataset.category = episode.category;
    
    card.innerHTML = `
        <div class="episode-thumbnail">
            <i class="fas fa-podcast"></i>
        </div>
        <div class="episode-content">
            <span class="episode-category">${getCategoryName(episode.category)}</span>
            <h3 class="episode-title">${episode.title}</h3>
            <p class="episode-description">${episode.description}</p>
            <div class="episode-meta">
                <span class="episode-host">by ${episode.host}</span>
                <span class="episode-duration">${episode.duration}</span>
            </div>
            <button class="play-btn" onclick="playEpisode(${episode.id})">
                <i class="fas fa-play"></i>
                Play Episode
            </button>
        </div>
    `;
    
    return card;
}

function getCategoryName(category) {
    const categoryNames = {
        'azure': 'Azure & Cloud',
        'ai': 'AI & Machine Learning',
        'development': 'Development',
        'security': 'Security',
        'business': 'Business Solutions',
        'partner': 'Partner Stories'
    };
    return categoryNames[category] || category;
}

function filterEpisodes(filter) {
    if (filter === 'all') {
        filteredEpisodes = [...podcastData];
    } else {
        filteredEpisodes = podcastData.filter(episode => episode.category === filter);
    }
    renderEpisodes(filteredEpisodes);
}

function playEpisode(episodeId) {
    const episode = podcastData.find(ep => ep.id === episodeId);
    if (!episode) return;
    
    currentEpisode = episode;
    currentEpisodeIndex = filteredEpisodes.findIndex(ep => ep.id === episodeId);
    
    // Update player UI
    playerTitle.textContent = episode.title;
    playerHost.textContent = `by ${episode.host}`;
    // Set thumbnail with fallback handling
    const fallbackThumb = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="12" fill="%230078d4"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI" font-size="18" fill="white">Podcast</text></svg>';
    playerThumbnail.onerror = () => { playerThumbnail.src = fallbackThumb; };
    playerThumbnail.src = episode.thumbnail || fallbackThumb;
    playerThumbnail.alt = episode.title;
    
    // Load and play audio
    audioElement.src = episode.audioUrl;
    audioElement.load();
    
    // Show player
    audioPlayer.classList.add('active');
    
    // Auto-play
    isPlaying = true;
    updatePlayPauseButton();
    audioElement.play().catch(e => {
        console.log('Auto-play prevented:', e);
        isPlaying = false;
        updatePlayPauseButton();
    });
}

function togglePlayPause() {
    if (!currentEpisode) return;
    
    if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
    } else {
        audioElement.play();
        isPlaying = true;
    }
    updatePlayPauseButton();
}

function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
    } else {
        icon.className = 'fas fa-play';
    }
}

function playPreviousEpisode() {
    if (currentEpisodeIndex > 0) {
        const prevEpisode = filteredEpisodes[currentEpisodeIndex - 1];
        playEpisode(prevEpisode.id);
    }
}

function playNextEpisode() {
    if (currentEpisodeIndex < filteredEpisodes.length - 1) {
        const nextEpisode = filteredEpisodes[currentEpisodeIndex + 1];
        playEpisode(nextEpisode.id);
    } else {
        // Auto-stop if it's the last episode
        isPlaying = false;
        updatePlayPauseButton();
    }
}

function closePlayer() {
    audioElement.pause();
    audioElement.src = '';
    isPlaying = false;
    currentEpisode = null;
    currentEpisodeIndex = -1;
    audioPlayer.classList.remove('active');
    updatePlayPauseButton();
}

function seekAudio() {
    if (!audioElement.duration) return;
    
    const seekTime = (progressSlider.value / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
}

function adjustVolume() {
    audioElement.volume = volumeSlider.value / 100;
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const volumeBtn = document.getElementById('volumeBtn');
    const icon = volumeBtn.querySelector('i');
    const volume = volumeSlider.value / 100;
    
    if (volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

function togglePlaybackSpeed() {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    playbackSpeed = speeds[nextIndex];
    audioElement.playbackRate = playbackSpeed;
    speedBtn.textContent = `${playbackSpeed}x`;
}

function updateDuration() {
    duration = audioElement.duration;
    totalTimeEl.textContent = formatTime(duration);
}

function updateProgress() {
    currentTime = audioElement.currentTime;
    currentTimeEl.textContent = formatTime(currentTime);
    
    if (duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        progressSlider.value = progressPercent;
        progressEl.style.width = `${progressPercent}%`;
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function setupCategoryFilters() {
    // Already handled in setupEventListeners
}

function setupNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

function updateActiveNavLink() {
    const sections = ['home', 'categories', 'episodes'];
    const navLinks = document.querySelectorAll('.nav-link');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentSection = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (!currentEpisode) return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
            break;
        case 'ArrowRight':
            e.preventDefault();
            audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 10);
            break;
        case 'ArrowUp':
            e.preventDefault();
            volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
            adjustVolume();
            break;
        case 'ArrowDown':
            e.preventDefault();
            volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
            adjustVolume();
            break;
    }
});

// Initialize volume
adjustVolume();
updateVolumeIcon();

