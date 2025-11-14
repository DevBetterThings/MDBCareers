// MDB job data
let jobs = [
    {
        id: 1,
        title: "Senior Economist - Climate Finance",
        company: "World Bank",
        mdbCode: "wb",
        location: "Washington, DC",
        type: "Full-time",
        salary: "$120k - $180k",
        description: "Lead analytical work on climate finance mechanisms and policy design. Provide technical expertise to member countries on green finance strategies and contribute to flagship publications.",
        effect: "new"
    },
    {
        id: 2,
        title: "Infrastructure Investment Officer",
        company: "Asian Development Bank",
        mdbCode: "adb",
        location: "Manila, Philippines",
        type: "Full-time",
        salary: "$110k - $160k",
        description: "Evaluate and structure infrastructure investments across Southeast Asia. Work with governments to develop sustainable transport, energy, and water projects.",
        effect: "expiring"
    },
    {
        id: 3,
        title: "Financial Sector Specialist",
        company: "International Monetary Fund",
        mdbCode: "imf",
        location: "Washington, DC",
        type: "Full-time",
        salary: "$130k - $190k",
        description: "Conduct financial sector assessments and provide policy advice to member countries. Expertise in banking regulation, financial stability, and macroprudential policy required.",
        effect: "gem"
    },
    {
        id: 4,
        title: "Gender and Development Advisor",
        company: "African Development Bank",
        mdbCode: "afdb",
        location: "Abidjan, Côte d'Ivoire",
        type: "Full-time",
        salary: "$95k - $140k",
        description: "Design and implement gender mainstreaming strategies across project portfolios. Provide technical assistance to regional member countries on gender-inclusive development policies.",
        effect: "hot"
    },
    {
        id: 5,
        title: "Social Development Consultant",
        company: "Inter-American Development Bank",
        mdbCode: "idb",
        location: "Remote",
        type: "Contract",
        salary: "$85k - $120k",
        description: "Support the design and monitoring of social inclusion programs in Latin America. Experience in education, health, or labor market interventions required.",
        effect: "new"
    },
    {
        id: 6,
        title: "Environmental Safeguards Specialist",
        company: "European Bank for Reconstruction and Development",
        mdbCode: "ebrd",
        location: "London, UK",
        type: "Full-time",
        salary: "$100k - $145k",
        description: "Ensure compliance with environmental and social policies across investment projects. Conduct environmental due diligence and stakeholder engagement.",
        effect: "gem"
    },
    {
        id: 7,
        title: "Private Sector Development Officer",
        company: "Islamic Development Bank",
        mdbCode: "isdb",
        location: "Jeddah, Saudi Arabia",
        type: "Full-time",
        salary: "$105k - $155k",
        description: "Design and implement programs to strengthen private sector competitiveness in member countries. Focus on SME development and entrepreneurship ecosystems.",
        effect: "hot"
    },
    {
        id: 8,
        title: "Senior Data Scientist",
        company: "World Bank",
        mdbCode: "wb",
        location: "Washington, DC",
        type: "Full-time",
        salary: "$125k - $175k",
        description: "Apply machine learning and advanced analytics to development challenges. Build predictive models for poverty mapping, agricultural yields, and economic forecasting.",
        effect: "expiring"
    },
    {
        id: 9,
        title: "Energy Transition Specialist",
        company: "Asian Development Bank",
        mdbCode: "adb",
        location: "Bangkok, Thailand",
        type: "Full-time",
        salary: "$100k - $150k",
        description: "Support member countries in transitioning to renewable energy. Design technical assistance programs for policy reform, capacity building, and investment mobilization.",
        effect: "gem"
    },
    {
        id: 10,
        title: "Operations Analyst",
        company: "Inter-American Development Bank",
        mdbCode: "idb",
        location: "Washington, DC",
        type: "Full-time",
        salary: "$75k - $110k",
        description: "Provide analytical support to project teams across various sectors. Conduct economic and financial analysis, prepare project documentation, and monitor implementation.",
        effect: "new"
    },
    {
        id: 11,
        title: "Country Economist",
        company: "International Monetary Fund",
        mdbCode: "imf",
        location: "Remote",
        type: "Remote",
        salary: "$115k - $165k",
        description: "Lead macroeconomic surveillance and policy dialogue with assigned country authorities. Prepare country reports and contribute to multilateral surveillance initiatives.",
        effect: "hot"
    },
    {
        id: 12,
        title: "Urban Development Specialist",
        company: "African Development Bank",
        mdbCode: "afdb",
        location: "Nairobi, Kenya",
        type: "Full-time",
        salary: "$90k - $135k",
        description: "Design and supervise urban infrastructure and municipal development projects. Work with cities on sustainable urbanization strategies and smart city initiatives.",
        effect: "expiring"
    }
];

// Saved jobs from localStorage
let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
let dislikedJobs = JSON.parse(localStorage.getItem('dislikedJobs')) || [];

// Touch/swipe tracking
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let currentSwipeCard = null;
let hasInteracted = localStorage.getItem('hasInteracted') === 'true';
const SWIPE_THRESHOLD = 110;
const DRAG_ACTIVATION_DISTANCE = 12;
let swipeDeltaX = 0;
let isHorizontalDrag = false;
let swipeAnimationFrame = null;

// Update statistics
function updateStats(displayedJobs = jobs) {
    const totalJobsEl = document.getElementById('totalJobs');
    const savedJobsEl = document.getElementById('savedJobs');
    
    // Animate counter
    animateValue(totalJobsEl, parseInt(totalJobsEl.textContent) || 0, displayedJobs.length, 500);
    animateValue(savedJobsEl, parseInt(savedJobsEl.textContent) || 0, savedJobs.length, 500);
}

// Animate number counting
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Render jobs to the page
function renderJobs(jobsToRender) {
    const jobListings = document.getElementById('jobListings');
    
    // Filter out disliked jobs
    const visibleJobs = jobsToRender.filter(job => !dislikedJobs.includes(job.id));
    
    if (visibleJobs.length === 0) {
        jobListings.innerHTML = '<div class="no-results">No jobs found matching your criteria.</div>';
        updateStats([]);
        return;
    }
    
    jobListings.innerHTML = visibleJobs.map(job => {
        const isSaved = savedJobs.includes(job.id);
        const wasRemoved = dislikedJobs.includes(job.id);
        const iconPath = `mdb-icons/${job.mdbCode}.svg`;
        
        // Effect badges
        const effectConfig = {
            'new': { emoji: '✨', label: 'New', class: 'effect-new' },
            'expiring': { emoji: '⏰', label: 'Expiring Soon', class: 'effect-expiring' },
            'gem': { emoji: '💎', label: 'Hidden Gem', class: 'effect-gem' },
            'hot': { emoji: '🔥', label: 'Hot', class: 'effect-hot' }
        };
        
        const effectInfo = effectConfig[job.effect] || null;
        const effectBadge = effectInfo 
            ? `<div class="effect-badge ${effectInfo.class}">
                   <span class="effect-emoji">${effectInfo.emoji}</span>
               </div>` 
            : '';
        
        // Show status badge if card was previously removed
        const statusBadge = wasRemoved 
            ? `<div class="card-status-badge ${isSaved ? 'liked' : 'disliked'}">${isSaved ? '❤️ Liked' : '✕ Disliked'}</div>` 
            : '';
        
        return `
        <div class="job-card-wrapper">
            ${effectBadge}
            <div class="job-card ${effectInfo ? effectInfo.class : ''}" data-id="${job.id}" style="--mdb-icon: url('${iconPath}')">
                ${statusBadge}
                <div class="job-header">
                    <button class="dislike-btn" onclick="dislikeJob(${job.id}, event)" title="Dislike">
                        ✕
                    </button>
                    <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveJob(${job.id}, event)" title="Like">
                        ${isSaved ? '❤️' : '🤍'}
                    </button>
                    <h2 class="job-title">${job.title}</h2>
                    <div class="company">${job.company}</div>
                </div>
                <div class="job-details">
                    <div class="job-meta">
                        <span class="tag type">${job.type}</span>
                        <span class="tag location">📍 ${job.location}</span>
                        <span class="tag salary">💰 ${job.salary}</span>
                    </div>
                    <p class="job-description">${job.description}</p>
                </div>
                <button class="view-details-btn" onclick="openJobModal(${job.id})"><span>View Details</span></button>
                <button class="apply-btn" onclick="applyForJob(${job.id}, event)">Quick Apply</button>
            </div>
        </div>
    `}).join('');
    
    // Attach swipe listeners to all cards
    attachSwipeListeners();
    
    // Clear animation property after initial fade-in completes to avoid conflicts
    setTimeout(() => {
        const cards = document.querySelectorAll('.job-card');
        cards.forEach(card => {
            card.style.animation = 'none';
            card.style.opacity = '1'; // Ensure cards stay visible
            card.style.transform = 'none'; // Clear any lingering transforms
        });
        const wrappers = document.querySelectorAll('.job-card-wrapper');
        wrappers.forEach(wrapper => {
            wrapper.style.transform = 'none';
            wrapper.style.opacity = '1';
        });
    }, 2000);
    
    updateStats(visibleJobs);
}

// Toggle save/favorite job (like action) - now removes card
function toggleSaveJob(jobId, event) {
    event.stopPropagation();
    
    const card = event.target.closest('.job-card');
    if (!card) return;
    
    const index = savedJobs.indexOf(jobId);
    if (index > -1) {
        // Already saved, unsave it
        savedJobs.splice(index, 1);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        
        // Update button without removing card
        const btn = event.target;
        btn.classList.remove('saved');
        btn.textContent = '🤍';
        updateStats(getCurrentFilteredJobs());
    } else {
        // Save and remove card with animation
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        
        // Mark as interacted to hide hints
        if (!hasInteracted) {
            hasInteracted = true;
            localStorage.setItem('hasInteracted', 'true');
            hideAllSwipeHints();
        }
        
        // Add to disliked list so it doesn't show up again
        if (pushUnique(dislikedJobs, jobId)) {
            localStorage.setItem('dislikedJobs', JSON.stringify(dislikedJobs));
        }
        
        // Animate card away
        card.classList.add('liked-away');
        
        setTimeout(() => {
            removeCardSmoothly(card);
            updateStats(getCurrentFilteredJobs());
        }, 400);
    }
}

// Dislike/remove job with animation
function dislikeJob(jobId, event) {
    if (event) event.stopPropagation();
    
    const card = document.querySelector(`.job-card[data-id="${jobId}"]`);
    if (!card) return;
    
    // Mark as interacted to hide hints
    if (!hasInteracted) {
        hasInteracted = true;
        localStorage.setItem('hasInteracted', 'true');
        hideAllSwipeHints();
    }
    
    // Add shatter animation
    card.classList.add('disliked-shatter');
    
    // Wait for animation to complete, then remove from DOM and update storage
    setTimeout(() => {
        if (pushUnique(dislikedJobs, jobId)) {
            localStorage.setItem('dislikedJobs', JSON.stringify(dislikedJobs));
        }
        
        // Remove from saved if it was saved
        const savedIndex = savedJobs.indexOf(jobId);
        if (savedIndex > -1) {
            savedJobs.splice(savedIndex, 1);
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        }
        
        // Remove card smoothly
        removeCardSmoothly(card);
        updateStats(getCurrentFilteredJobs());
    }, 600);
}

// Smoothly remove a card from the grid using FLIP animation
function removeCardSmoothly(card) {
    // Find the wrapper that contains this card
    const wrapper = card.closest('.job-card-wrapper');
    if (!wrapper) {
        card.remove();
        return;
    }
    
    // Get all wrappers except the one being removed
    const allWrappers = Array.from(document.querySelectorAll('.job-card-wrapper')).filter(w => w !== wrapper);
    
    // FLIP: First - Record initial positions
    const firstPositions = new Map();
    allWrappers.forEach(w => {
        const rect = w.getBoundingClientRect();
        firstPositions.set(w, { top: rect.top, left: rect.left });
    });
    
    // Remove the wrapper from DOM
    wrapper.remove();
    
    // Force immediate layout recalculation
    document.body.offsetHeight;
    
    // FLIP: Last - Get final positions after removal
    const remainingWrappers = document.querySelectorAll('.job-card-wrapper');
    
    remainingWrappers.forEach(w => {
        if (firstPositions.has(w)) {
            const first = firstPositions.get(w);
            const last = w.getBoundingClientRect();
            
            // FLIP: Invert - Calculate the difference
            const deltaX = first.left - last.left;
            const deltaY = first.top - last.top;
            
            // Only animate if position actually changed
            if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
                // Move wrapper back to its original position instantly (without transition)
                w.style.transition = 'none';
                w.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                w.style.opacity = '1'; // Ensure visible
                
                // Force reflow
                w.offsetHeight;
                
                // FLIP: Play - Animate to final position
                requestAnimationFrame(() => {
                    w.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    w.style.transform = 'translate(0, 0)';
                    
                    // Clean up this specific wrapper after animation
                    setTimeout(() => {
                        w.style.transition = '';
                        w.style.transform = '';
                    }, 550);
                });
            }
        }
    });
}

function pushUnique(array, value) {
    if (!array.includes(value)) {
        array.push(value);
        return true;
    }
    return false;
}

// Get currently filtered jobs (excluding disliked)
function getCurrentFilteredJobs() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterType = document.getElementById('filterType').value;
    
    return jobs.filter(job => {
        const matchesSearch = 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.location.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm);
        
        const matchesType = !filterType || job.type === filterType;
        const notDisliked = !dislikedJobs.includes(job.id);
        
        return matchesSearch && matchesType && notDisliked;
    });
}

// Filter jobs based on search and type
function filterJobs() {
    const filtered = getCurrentFilteredJobs();
    renderJobs(filtered);
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterType').value = '';
    renderJobs(jobs);
}

// Reset all cards - bring back removed ones with their status
function resetAllCards() {
    const previouslyDisliked = [...dislikedJobs];
    
    // Clear disliked jobs but keep saved jobs
    dislikedJobs = [];
    localStorage.setItem('dislikedJobs', JSON.stringify(dislikedJobs));
    
    // Re-render with all jobs (they'll show status badges)
    filterJobs();
    
    // Show confirmation
    const btn = document.getElementById('resetCards');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ All Cards Restored!';
    btn.style.background = '#27ae60';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
    }, 2000);
}

// Open job modal
function openJobModal(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('modalBody');
    const isSaved = savedJobs.includes(jobId);
    
    modalBody.innerHTML = `
        <h2 class="modal-job-title">${job.title}</h2>
        <div class="modal-company">${job.company}</div>
        <div class="modal-meta">
            <span class="tag type">${job.type}</span>
            <span class="tag location">📍 ${job.location}</span>
            <span class="tag salary">💰 ${job.salary}</span>
        </div>
        <div class="modal-description">
            <h3 style="color: #003d82; margin-bottom: 1rem;">About this Position</h3>
            <p>${job.description}</p>
            
            <h3 style="color: #003d82; margin: 2rem 0 1rem;">What We're Looking For</h3>
            <ul style="padding-left: 1.5rem; margin-bottom: 1rem;">
                <li>Advanced degree in relevant field (Master's or PhD preferred)</li>
                <li>Minimum 5-7 years of professional experience</li>
                <li>Strong analytical and communication skills</li>
                <li>Experience working in international development</li>
                <li>Fluency in English (additional languages a plus)</li>
            </ul>
            
            <h3 style="color: #003d82; margin: 2rem 0 1rem;">Benefits</h3>
            <ul style="padding-left: 1.5rem;">
                <li>Competitive salary and comprehensive benefits package</li>
                <li>International work environment</li>
                <li>Professional development opportunities</li>
                <li>Pension and healthcare coverage</li>
                <li>Work-life balance initiatives</li>
            </ul>
        </div>
        <div class="modal-actions">
            <button class="modal-apply-btn" onclick="applyForJob(${jobId}, event)">Apply Now</button>
            <button class="modal-save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveFromModal(${jobId}, event)">
                ${isSaved ? '❤️ Saved' : '🤍 Save Job'}
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('jobModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Toggle save from modal
function toggleSaveFromModal(jobId, event) {
    event.stopPropagation();
    
    const index = savedJobs.indexOf(jobId);
    if (index > -1) {
        savedJobs.splice(index, 1);
    } else {
        savedJobs.push(jobId);
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    
    // Update modal button
    const btn = event.target;
    btn.classList.toggle('saved');
    btn.textContent = btn.classList.contains('saved') ? '❤️ Saved' : '🤍 Save Job';
    
    // Re-render jobs to update the card save button
    filterJobs();
}

// Apply for job function
function applyForJob(jobId, event) {
    if (event) event.stopPropagation();
    
    const job = jobs.find(j => j.id === jobId);
    if (job) {
        // Show success animation
        const btn = event ? event.target : null;
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Application Submitted!';
            btn.style.background = '#27ae60';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
        
        setTimeout(() => {
            alert(`Thank you for your interest in the ${job.title} position at ${job.company}!\n\nYou will be redirected to ${job.company}'s official careers portal to complete your application.`);
        }, 100);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('jobModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Close modal with Escape key
    if (event.key === 'Escape') {
        closeModal();
        return;
    }
    
    // Don't trigger keyboard shortcuts if modal is open or user is typing
    const modal = document.getElementById('jobModal');
    if (modal.classList.contains('active') || 
        event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // Get the first visible job card
    const firstCard = document.querySelector('.job-card:not(.swiped-left):not(.swiped-right):not(.disliked-shatter)');
    if (!firstCard) return;
    
    const jobId = parseInt(firstCard.dataset.id);
    
    // Arrow Left or 'X' key = Dislike
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'x') {
        event.preventDefault();
        dislikeJob(jobId, { stopPropagation: () => {} });
    }
    
    // Arrow Right or 'L' key = Like and remove
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'l') {
        event.preventDefault();
        if (!savedJobs.includes(jobId)) {
            savedJobs.push(jobId);
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        }
        if (pushUnique(dislikedJobs, jobId)) {
            localStorage.setItem('dislikedJobs', JSON.stringify(dislikedJobs));
        }
        
        firstCard.classList.add('liked-away');
        setTimeout(() => {
            removeCardSmoothly(firstCard);
            updateStats(getCurrentFilteredJobs());
        }, 400);
    }
});

// Swipe functionality for mobile
function attachSwipeListeners() {
    const cards = document.querySelectorAll('.job-card');
    
    cards.forEach(card => {
        card.addEventListener('touchstart', handleTouchStart, { passive: true });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd, { passive: true });
        card.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    });
}

function handleTouchStart(e) {
    currentSwipeCard = e.currentTarget;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    swipeDeltaX = 0;
    isHorizontalDrag = false;
    cancelSwipeAnimation();
    if (currentSwipeCard) {
        currentSwipeCard.classList.add('dragging');
        currentSwipeCard.style.transition = 'none';
    }
}

function handleTouchMove(e) {
    if (!currentSwipeCard) return;
    
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (!isHorizontalDrag) {
        if (Math.abs(deltaX) > DRAG_ACTIVATION_DISTANCE && Math.abs(deltaX) > Math.abs(deltaY)) {
            isHorizontalDrag = true;
        } else {
            return;
        }
    }
    
    if (isHorizontalDrag) {
        e.preventDefault();
        swipeDeltaX = deltaX;
        queueSwipeTransform();
    }
}

function handleTouchEnd(e) {
    if (!currentSwipeCard) return;
    
    if (e.changedTouches && e.changedTouches[0]) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
    }
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const horizontalSwipe = isHorizontalDrag && Math.abs(deltaX) > Math.abs(deltaY);
    
    if (horizontalSwipe && Math.abs(deltaX) > SWIPE_THRESHOLD) {
        completeSwipe(currentSwipeCard, deltaX);
    } else {
        resetCardPosition(currentSwipeCard);
        cleanupSwipeTracking();
    }
}

function handleTouchCancel() {
    if (!currentSwipeCard) return;
    resetCardPosition(currentSwipeCard);
    cleanupSwipeTracking();
}

function queueSwipeTransform() {
    if (swipeAnimationFrame || !currentSwipeCard) return;
    swipeAnimationFrame = requestAnimationFrame(applySwipeTransform);
}

function applySwipeTransform() {
    if (!currentSwipeCard) {
        swipeAnimationFrame = null;
        return;
    }
    
    const rotation = swipeDeltaX / 18;
    const opacity = Math.max(0.35, 1 - Math.abs(swipeDeltaX) / 600);
    currentSwipeCard.style.transform = `translate3d(${swipeDeltaX}px, 0, 0) rotate(${rotation}deg)`;
    currentSwipeCard.style.opacity = opacity;
    
    if (swipeDeltaX > 50) {
        currentSwipeCard.classList.add('swipe-right-hint');
        currentSwipeCard.classList.remove('swipe-left-hint');
    } else if (swipeDeltaX < -50) {
        currentSwipeCard.classList.add('swipe-left-hint');
        currentSwipeCard.classList.remove('swipe-right-hint');
    } else {
        currentSwipeCard.classList.remove('swipe-right-hint', 'swipe-left-hint');
    }
    
    swipeAnimationFrame = null;
}

function cancelSwipeAnimation() {
    if (swipeAnimationFrame) {
        cancelAnimationFrame(swipeAnimationFrame);
        swipeAnimationFrame = null;
    }
}

function cleanupSwipeTracking() {
    cancelSwipeAnimation();
    if (currentSwipeCard) {
        currentSwipeCard.classList.remove('dragging');
    }
    currentSwipeCard = null;
    touchStartX = 0;
    touchStartY = 0;
    touchEndX = 0;
    touchEndY = 0;
    swipeDeltaX = 0;
    isHorizontalDrag = false;
}

function completeSwipe(card, deltaX) {
    const jobId = parseInt(card.dataset.id);
    if (Number.isNaN(jobId)) {
        resetCardPosition(card);
        cleanupSwipeTracking();
        return;
    }
    
    if (!hasInteracted) {
        hasInteracted = true;
        localStorage.setItem('hasInteracted', 'true');
        hideAllSwipeHints();
    }
    
    card.classList.remove('swipe-right-hint', 'swipe-left-hint');
    card.classList.remove('dragging');
    card.style.transition = '';
    
    const cardToRemove = card;
    
    if (deltaX > 0) {
        if (!savedJobs.includes(jobId)) {
            savedJobs.push(jobId);
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        }
        if (pushUnique(dislikedJobs, jobId)) {
            localStorage.setItem('dislikedJobs', JSON.stringify(dislikedJobs));
        }
        card.classList.add('swiped-right');
    } else {
        if (pushUnique(dislikedJobs, jobId)) {
            localStorage.setItem('dislikedJobs', JSON.stringify(dislikedJobs));
        }
        const savedIndex = savedJobs.indexOf(jobId);
        if (savedIndex > -1) {
            savedJobs.splice(savedIndex, 1);
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        }
        card.classList.add('swiped-left');
    }
    
    cleanupSwipeTracking();
    
    setTimeout(() => {
        removeCardSmoothly(cardToRemove);
        updateStats(getCurrentFilteredJobs());
    }, 400);
}

function hideAllSwipeHints() {
    const style = document.createElement('style');
    style.textContent = '.job-card::after { display: none !important; }';
    document.head.appendChild(style);
}

function resetCardPosition(card) {
    card.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    card.style.transform = '';
    card.style.opacity = '';
    card.classList.remove('swipe-right-hint', 'swipe-left-hint', 'dragging');
    setTimeout(() => {
        card.style.transition = '';
    }, 250);
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', filterJobs);
document.getElementById('filterType').addEventListener('change', filterJobs);
document.getElementById('clearFilters').addEventListener('click', clearFilters);
document.getElementById('resetCards').addEventListener('click', resetAllCards);

// Initial render
renderJobs(jobs);
