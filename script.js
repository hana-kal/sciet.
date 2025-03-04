// fetch and display entries
async function loadEntries() {
    try {
        const response = await fetch('data.json');
        const entries = await response.json();
        window.allEntries = entries; // store globally for filtering
        displayEntries(entries);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// display entries in the container
function displayEntries(entries) {
    const container = document.getElementById('entriesContainer');
    container.innerHTML = '';

    if (entries.length === 0) {
        container.innerHTML = '<p>No entries found.</p>';
        return;
    }

    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');
        entryDiv.setAttribute('data-category', entry.category);
        
        // google search redirection 
        entryDiv.addEventListener('click', () => {
            const searchQuery = `${entry.term} ${entry.origin} ${entry.category}`;
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            window.open(googleSearchUrl, '_blank');
        });

        entryDiv.innerHTML = `
            <h2>${entry.term}</h2>
            <p><strong>Category:</strong> ${entry.category}</p>
            <p><strong>Origin:</strong> ${entry.origin}</p>
            <p><strong>Meaning:</strong> ${entry.meaning}</p>
            <p><strong>Usage Examples:</strong> ${entry.usage_examples.join(', ')}</p>
        `;
        container.appendChild(entryDiv);
    });
}

// filter entries based on search
function filterEntries(query) {
    const filtered = window.allEntries.filter(entry =>
        entry.term.toLowerCase().includes(query.toLowerCase()) ||
        entry.meaning.toLowerCase().includes(query.toLowerCase())
    );
    displayEntries(filtered);
}

// event listener for search input
document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value;
    filterEntries(query);
});

// filter entries by category 
function filterByCategory(category) {
    if (!window.allEntries) return;

    const filteredEntries = window.allEntries.filter(entry => entry.category.toLowerCase() === category.toLowerCase());
    displayEntries(filteredEntries);
}

// category tabs
document.getElementById('tab-roots').addEventListener('click', () => filterByCategory('Root'));
document.getElementById('tab-prefixes').addEventListener('click', () => filterByCategory('Prefix'));
document.getElementById('tab-suffixes').addEventListener('click', () => filterByCategory('Suffix'));

// copy email to clipboard
function copyEmail() {
    const email = "hana@kaloudis.net"; 
    navigator.clipboard.writeText(email).then(() => {
        const button = document.getElementById('emailButton');
        button.innerText = "Copied! Now shoot me an email.";
        setTimeout(() => {
            button.innerText = "Something missing?";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy email: ", err);
    });
}

// load entries when the page loads
window.addEventListener('DOMContentLoaded', loadEntries);