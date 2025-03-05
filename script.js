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

// to update search bar with entry count
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
            const searchQuery = `${entry.term} ${entry.category}`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        });

        entryDiv.innerHTML = `
            <h2>${entry.term}</h2>
            <p><strong>Category:</strong> <span class="category ${entry.category}">${entry.category}</span></p>
            <p><strong>Meaning:</strong> ${entry.meaning}</p>
            <p><strong>Usage Examples:</strong> ${entry.usage_examples.join(', ')}</p>
        `;
        container.appendChild(entryDiv);
    });
}

// to filter entries by category
function filterByCategory(category) {
    if (!window.allEntries) return;
    const filteredEntries = window.allEntries.filter(entry => entry.category.toLowerCase() === category.toLowerCase());
    displayEntries(filteredEntries);
}

// category tabs event listeners
document.getElementById('tab-roots').addEventListener('click', () => filterByCategory('Root'));
document.getElementById('tab-prefixes').addEventListener('click', () => filterByCategory('Prefix'));
document.getElementById('tab-suffixes').addEventListener('click', () => filterByCategory('Suffix'));

// to remove leading hyphens from suffixes and trailing hyphens from prefixes
function cleanTerm(term) {
    return term.replace(/^-+|-+$/g, '');
}

// to filter entries based on search
function filterEntries(query) {
    if (!query.trim()) {
        displayEntries(window.allEntries);
        return;
    }

    // clean search (remove hyphens)
    const cleanQuery = query.toLowerCase().trim().replace(/^-+|-+$/g, '');

    // 1. direct matches 
    let filtered = window.allEntries.filter(entry =>
        cleanTerm(entry.term.toLowerCase()).includes(cleanQuery) ||
        entry.meaning.toLowerCase().includes(cleanQuery) ||
        entry.usage_examples.some(example => example.toLowerCase().includes(cleanQuery))
    );

    // 2. related roots, prefixes, and suffixes in the searched term
    let matchedTerms = new Set(filtered.map(entry => cleanTerm(entry.term.toLowerCase())));

    window.allEntries.forEach(entry => {
        const cleanEntryTerm = cleanTerm(entry.term.toLowerCase());
        if (cleanQuery.includes(cleanEntryTerm)) {
            matchedTerms.add(cleanEntryTerm);
        }
    });

    // 3. filter entries based on identified related terms
    filtered = window.allEntries.filter(entry => matchedTerms.has(cleanTerm(entry.term.toLowerCase())));

    displayEntries(filtered);
}

// for search input
document.getElementById('searchInput').addEventListener('input', function () {
    const query = this.value;
    filterEntries(query);
});

// to copy email to clipboard
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
