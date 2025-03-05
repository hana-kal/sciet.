// to fetch and display entries
async function loadEntries() {
    try {
        const response = await fetch('data.json');
        const entries = await response.json();
        window.allEntries = entries.sort((a, b) => a.term.localeCompare(b.term)); // store globally for filtering
        updateSearchPlaceholder(entries.length); // update search bar with entry count
        displayEntries(entries);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// to update search bar placeholder with entry count
function updateSearchPlaceholder(count) {
    const searchInput = document.getElementById('searchInput');
    searchInput.placeholder = `Search ${count} terms...`;
}

// to display entries
function displayEntries(entries) {
    const container = document.getElementById('entriesContainer');
    container.innerHTML = '';

    if (entries.length === 0) {
        container.innerHTML = '<p>No entries found.</p>';
        updateSearchPlaceholder(0);
        return;
    }

    updateSearchPlaceholder(entries.length);

    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('entry');

        // google search redirect
        entryDiv.addEventListener('click', () => {
            const searchQuery = `${entry.term} ${entry.origin} ${entry.category}`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        });

        entryDiv.innerHTML = `
            <h2>${entry.term}</h2>
            <p><strong>Category:</strong> <span class="category ${entry.category}">${entry.category}</span></p>
            <p><strong>Origin:</strong> ${entry.origin}</p>
            <p><strong>Meaning:</strong> ${entry.meaning}</p>
            <p><strong>Usage Examples:</strong> ${entry.usage_examples.join(', ')}</p>
        `;
        container.appendChild(entryDiv);
    });
}

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

// to remove hyphens from term prefixes and suffixes for searching
function cleanTerm(term) {
    return term.replace(/^-+|-+$/g, ''); 
}

// filter entries based on search 
function filterEntries(query) {
    if (!query.trim()) {
        displayEntries(window.allEntries);
        return;
    }

    // 1. to find direct matches
    let filtered = window.allEntries.filter(entry =>
        entry.term.toLowerCase().includes(query.toLowerCase()) ||
        entry.meaning.toLowerCase().includes(query.toLowerCase())
    );

    // 2. to find prefixes, roots, and suffixes within the searched term
    let matchedTerms = new Set(filtered.map(entry => cleanTerm(entry.term.toLowerCase())));

    window.allEntries.forEach(entry => {
        const cleanEntryTerm = cleanTerm(entry.term.toLowerCase());
        if (query.toLowerCase().includes(cleanEntryTerm)) {
            matchedTerms.add(cleanEntryTerm);
        }
    });

    // 3. to filter the Entries Based on Found Terms
    filtered = window.allEntries.filter(entry => matchedTerms.has(cleanTerm(entry.term.toLowerCase())));

    displayEntries(filtered);
}

// for search input
document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value;
    filterEntries(query);
});

// load entries when the page loads
window.addEventListener('DOMContentLoaded', loadEntries);