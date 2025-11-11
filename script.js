// MDB job data
const jobs = [
    {
        id: 1,
        title: "Senior Economist - Climate Finance",
        company: "World Bank",
        location: "Washington, DC",
        type: "Full-time",
        salary: "$120k - $180k",
        description: "Lead analytical work on climate finance mechanisms and policy design. Provide technical expertise to member countries on green finance strategies and contribute to flagship publications."
    },
    {
        id: 2,
        title: "Infrastructure Investment Officer",
        company: "Asian Development Bank",
        location: "Manila, Philippines",
        type: "Full-time",
        salary: "$110k - $160k",
        description: "Evaluate and structure infrastructure investments across Southeast Asia. Work with governments to develop sustainable transport, energy, and water projects."
    },
    {
        id: 3,
        title: "Financial Sector Specialist",
        company: "International Monetary Fund",
        location: "Washington, DC",
        type: "Full-time",
        salary: "$130k - $190k",
        description: "Conduct financial sector assessments and provide policy advice to member countries. Expertise in banking regulation, financial stability, and macroprudential policy required."
    },
    {
        id: 4,
        title: "Gender and Development Advisor",
        company: "African Development Bank",
        location: "Abidjan, Côte d'Ivoire",
        type: "Full-time",
        salary: "$95k - $140k",
        description: "Design and implement gender mainstreaming strategies across project portfolios. Provide technical assistance to regional member countries on gender-inclusive development policies."
    },
    {
        id: 5,
        title: "Social Development Consultant",
        company: "Inter-American Development Bank",
        location: "Remote",
        type: "Contract",
        salary: "$85k - $120k",
        description: "Support the design and monitoring of social inclusion programs in Latin America. Experience in education, health, or labor market interventions required."
    },
    {
        id: 6,
        title: "Environmental Safeguards Specialist",
        company: "European Bank for Reconstruction and Development",
        location: "London, UK",
        type: "Full-time",
        salary: "$100k - $145k",
        description: "Ensure compliance with environmental and social policies across investment projects. Conduct environmental due diligence and stakeholder engagement."
    },
    {
        id: 7,
        title: "Private Sector Development Officer",
        company: "Islamic Development Bank",
        location: "Jeddah, Saudi Arabia",
        type: "Full-time",
        salary: "$105k - $155k",
        description: "Design and implement programs to strengthen private sector competitiveness in member countries. Focus on SME development and entrepreneurship ecosystems."
    },
    {
        id: 8,
        title: "Senior Data Scientist",
        company: "World Bank",
        location: "Washington, DC",
        type: "Full-time",
        salary: "$125k - $175k",
        description: "Apply machine learning and advanced analytics to development challenges. Build predictive models for poverty mapping, agricultural yields, and economic forecasting."
    },
    {
        id: 9,
        title: "Energy Transition Specialist",
        company: "Asian Development Bank",
        location: "Bangkok, Thailand",
        type: "Full-time",
        salary: "$100k - $150k",
        description: "Support member countries in transitioning to renewable energy. Design technical assistance programs for policy reform, capacity building, and investment mobilization."
    },
    {
        id: 10,
        title: "Operations Analyst",
        company: "Inter-American Development Bank",
        location: "Washington, DC",
        type: "Full-time",
        salary: "$75k - $110k",
        description: "Provide analytical support to project teams across various sectors. Conduct economic and financial analysis, prepare project documentation, and monitor implementation."
    },
    {
        id: 11,
        title: "Country Economist",
        company: "International Monetary Fund",
        location: "Remote",
        type: "Remote",
        salary: "$115k - $165k",
        description: "Lead macroeconomic surveillance and policy dialogue with assigned country authorities. Prepare country reports and contribute to multilateral surveillance initiatives."
    },
    {
        id: 12,
        title: "Urban Development Specialist",
        company: "African Development Bank",
        location: "Nairobi, Kenya",
        type: "Full-time",
        salary: "$90k - $135k",
        description: "Design and supervise urban infrastructure and municipal development projects. Work with cities on sustainable urbanization strategies and smart city initiatives."
    }
];

// Saved jobs from localStorage
let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];

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
    
    if (jobsToRender.length === 0) {
        jobListings.innerHTML = '<div class="no-results">No jobs found matching your criteria.</div>';
        updateStats([]);
        return;
    }
    
    jobListings.innerHTML = jobsToRender.map(job => {
        const isSaved = savedJobs.includes(job.id);
        return `
        <div class="job-card" data-id="${job.id}">
            <div class="job-header">
                <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveJob(${job.id}, event)">
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
    `}).join('');
    
    updateStats(jobsToRender);
}

// Toggle save/favorite job
function toggleSaveJob(jobId, event) {
    event.stopPropagation();
    
    const index = savedJobs.indexOf(jobId);
    if (index > -1) {
        savedJobs.splice(index, 1);
    } else {
        savedJobs.push(jobId);
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    
    // Update button
    const btn = event.target;
    btn.classList.toggle('saved');
    btn.textContent = btn.classList.contains('saved') ? '❤️' : '🤍';
    
    updateStats(getCurrentFilteredJobs());
}

// Get currently filtered jobs
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
        
        return matchesSearch && matchesType;
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

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Event listeners
document.getElementById('searchInput').addEventListener('input', filterJobs);
document.getElementById('filterType').addEventListener('change', filterJobs);
document.getElementById('clearFilters').addEventListener('click', clearFilters);

// Initial render
renderJobs(jobs);
