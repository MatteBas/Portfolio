document.addEventListener('DOMContentLoaded', function () {
    // Global modal functions
    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Global slider functions for modals
    window.nextSlideModal = function(button) {
        const slider = button.closest('.slider');
        const slides = slider.querySelectorAll('.slide');
        let currentIndex = 0;
        
        // Find currently displayed slide
        slides.forEach((slide, index) => {
            const isVisible = slide.style.display === 'block' || 
                             (slide.style.display === '' && index === 0);
            if (isVisible) {
                currentIndex = index;
            }
        });
        
        // Hide current slide
        slides[currentIndex].style.display = 'none';
        
        // Show next slide
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].style.display = 'block';
    }

    window.prevSlideModal = function(button) {
        const slider = button.closest('.slider');
        const slides = slider.querySelectorAll('.slide');
        let currentIndex = 0;
        
        // Find currently displayed slide
        slides.forEach((slide, index) => {
            const isVisible = slide.style.display === 'block' || 
                             (slide.style.display === '' && index === 0);
            if (isVisible) {
                currentIndex = index;
            }
        });
        
        // Hide current slide
        slides[currentIndex].style.display = 'none';
        
        // Show previous slide
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        slides[currentIndex].style.display = 'block';
    }

    // URL parameter function
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Handle skill highlighting from URL
    const skillFromUrl = getUrlParameter('skill');
    const projects = document.querySelectorAll('.project-card');

    if (skillFromUrl) {
        projects.forEach(project => {
            const projectSkills = project.getAttribute('data-skills');
            if (projectSkills) {
                const skillsArray = projectSkills.split(',');
                
                if (skillsArray.some(skill => skill.trim().toLowerCase() === skillFromUrl.toLowerCase())) {
                    project.classList.add('highlight');
                } else {
                    project.classList.remove('highlight');
                }
            }
        });
    }

    // Slider functionality - VERSION UNIFIÉE
    const sliders = document.querySelectorAll('.slider');

    sliders.forEach((slider) => {
        let currentIndex = 0;
        const slides = slider.querySelectorAll('.slide');
        const totalSlides = slides.length;
        let autoSlideInterval;

        // Ne pas initialiser si pas de slides
        if (totalSlides === 0) return;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            showSlide(currentIndex);
            // Redémarrer l'auto-slide après navigation manuelle
            startAutoSlide();
        }

        function startAutoSlide() {
            stopAutoSlide(); 
            autoSlideInterval = setInterval(nextSlide, 10000); 
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }

        // Initialize slider
        showSlide(currentIndex);
        startAutoSlide();

        // Button event listeners
        const prevButton = slider.querySelector('.prev');
        const nextButton = slider.querySelector('.next');

        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                // Redémarrer l'auto-slide après un délai
                setTimeout(startAutoSlide, 3000);
            });
        }

        // Auto-slide controls
        slider.addEventListener('mouseleave', startAutoSlide);
        slider.addEventListener('mouseenter', stopAutoSlide);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease-out';
        observer.observe(section);
    });

    // Parallax effect for floating elements
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.floating');
        
        parallax.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Add hover effect to skill cards
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    // Fonction pour aller aux projets avec filtre
function goToProjectsWithFilter(skillType) {
    console.log('🎯 Navigation vers projets avec filtre:', skillType);
    
    // Si on est sur la même page et qu'il y a une section projets
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
        // Défiler vers les projets
        projectsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Appliquer le filtre après un délai
        setTimeout(() => {
            if (typeof filterProjects === 'function') {
                filterProjects(skillType);
            }
        }, 500);
    } else {
        // Rediriger vers la page projets avec paramètre
        if (window.location.pathname.includes('index') || window.location.pathname === '/') {
            // Si on est sur l'accueil, aller à la page projets
            window.location.href = './projets.html#projects?filter=' + skillType;
        } else {
            // Si on est déjà ailleurs, essayer de trouver la page projets
            window.location.href = '#projects?filter=' + skillType;
        }
    }
}

// Fonction alternative si vous avez des liens directs
function goToProjectsPage(skillType) {
    // Remplacez 'projets.html' par le nom réel de votre page projets
    window.location.href = 'projets.html?filter=' + skillType + '#projects';
}
});

// Mapping des compétences vers les tags de projets (basé sur vos vrais data-skills)
const skillToTagMapping = {
    'Java & JavaFX': ['java', 'javafx'],
    'HTML/CSS': ['html', 'css'],
    'JavaScript/TypeScript': ['javascript', 'typescript'],
    'PHP': ['php'],
    'SQL': ['sql', 'mysql', 'postgresql'],
    'C/C++': ['c', 'cpp'],
};

// Fonction pour normaliser les noms de compétences/tags
function normalizeSkillName(skillName) {
    return skillName.toLowerCase()
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
        .replace(/\s+/g, '-');
}

// Fonction pour ajouter les événements de clic aux cartes de compétences
function addSkillClickEvents() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const skillName = this.querySelector('.skill-name').textContent.trim();
            
            // Stocker la compétence sélectionnée dans le localStorage
            localStorage.setItem('selectedSkill', skillName);
            
            // Rediriger vers la page projets
            window.location.href = 'projet.html';
        });
        
        // Ajouter un effet hover pour indiquer que c'est cliquable
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Fonction pour mettre en évidence les projets correspondants
function highlightMatchingProjects() {
    const selectedSkill = localStorage.getItem('selectedSkill');
    
    if (!selectedSkill) return;
    
    console.log('Compétence sélectionnée:', selectedSkill); // Debug
    
    const projectCards = document.querySelectorAll('.project-card');
    const tags = skillToTagMapping[selectedSkill] || [normalizeSkillName(selectedSkill)];
    
    console.log('Tags à rechercher:', tags); // Debug
    
    let matchingProjects = 0;
    
    projectCards.forEach(card => {
        const skillsData = card.getAttribute('data-skills');
        if (!skillsData) {
            console.log('Projet sans data-skills:', card); // Debug
            return;
        }
        
        console.log('Data-skills du projet:', skillsData); // Debug
        
        const projectSkills = skillsData.toLowerCase().split(',').map(s => s.trim());
        
        // Recherche EXACTE uniquement - pas de correspondance partielle
        const hasMatchingSkill = tags.some(tag => {
            const tagLower = tag.toLowerCase();
            return projectSkills.some(projectSkill => {
                const match = projectSkill === tagLower; // CORRESPONDANCE EXACTE SEULEMENT
                if (match) {
                    console.log(`Match trouvé: ${projectSkill} === ${tagLower}`); // Debug
                }
                return match;
            });
        });
        
        if (hasMatchingSkill) {
            matchingProjects++;
            // Effet de mise en évidence pour les projets correspondants
            card.classList.add('highlighted-project');
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 20px 50px rgba(74, 144, 226, 0.3)';
            card.style.border = '3px solid #4A90E2';
            card.style.background = 'linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(255, 255, 255, 0.9))';
            
            // Animation de pulsation
            card.style.animation = 'pulse-highlight 2s infinite';
        } else {
            // Atténuer les projets non correspondants
            card.style.opacity = '0.6';
            card.style.filter = 'grayscale(0.3)';
        }
    });
    
    console.log(`${matchingProjects} projets correspondent à la compétence "${selectedSkill}"`); // Debug
    
    // Ajouter un bouton pour effacer le filtre
    addClearFilterButton();
    
    // Supprimer la compétence sélectionnée après utilisation
    localStorage.removeItem('selectedSkill');
}

// Fonction pour ajouter un bouton "Effacer le filtre"
function addClearFilterButton() {
    const existingButton = document.querySelector('.clear-filter-btn');
    if (existingButton) return;
    
    const button = document.createElement('button');
    button.textContent = '✕ Afficher tous les projets';
    button.className = 'clear-filter-btn';
    button.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4A90E2;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(74, 144, 226, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    button.addEventListener('click', clearProjectFilter);
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 8px 25px rgba(74, 144, 226, 0.4)';
    });
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 5px 15px rgba(74, 144, 226, 0.3)';
    });
    
    document.body.appendChild(button);
}

// Fonction pour effacer le filtre
function clearProjectFilter() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.classList.remove('highlighted-project');
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.border = '';
        card.style.background = '';
        card.style.opacity = '';
        card.style.filter = '';
        card.style.animation = '';
    });
    
    const clearButton = document.querySelector('.clear-filter-btn');
    if (clearButton) {
        clearButton.remove();
    }
}

// Ajouter les styles CSS pour l'animation
function addHighlightStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-highlight {
            0%, 100% {
                box-shadow: 0 20px 50px rgba(74, 144, 226, 0.3);
            }
            50% {
                box-shadow: 0 25px 60px rgba(74, 144, 226, 0.5);
            }
        }
        
        .skill-card {
            transition: all 0.3s ease;
        }
        
        .project-card {
            transition: all 0.3s ease;
        }
        
        .highlighted-project {
            position: relative;
        }
        
        .highlighted-project::before {
            content: '✨';
            position: absolute;
            top: -10px;
            right: -10px;
            font-size: 20px;
            animation: sparkle 1.5s infinite;
        }
        
        @keyframes sparkle {
            0%, 100% { transform: scale(1) rotate(0deg); }
            50% { transform: scale(1.2) rotate(180deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    addHighlightStyles();
    
    // Si on est sur la page d'accueil
    if (document.querySelector('#home')) {
        addSkillClickEvents();
    }
    
    // Si on est sur la page projets
    if (document.querySelector('.project-card[data-skills]')) {
        highlightMatchingProjects();
    }
});
