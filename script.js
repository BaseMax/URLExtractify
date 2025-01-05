const input = document.getElementById('input');
const outputContainer = document.getElementById('output-container');
const output = document.getElementById('output');
const copyButton = document.getElementById('copy-button');
const defaultCheckbox = document.getElementById('defaultCheckbox');
const removeDuplicatesCheckbox = document.getElementById('removeDuplicatesCheckbox');
const sortURLsCheckbox = document.getElementById('sortURLsCheckbox');

const extractURLs = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return Array.from(doc.links)
        .map(link => link.href)
        .filter(url => {
            if (defaultCheckbox.checked) {
                return /^https?:\/\//.test(url);
            }
            return true;
        });
};

const processURLs = (urls) => {
    let processedURLs = [...urls];

    if (removeDuplicatesCheckbox.checked) {
        processedURLs = [...new Set(processedURLs)];
    }

    if (sortURLsCheckbox.checked) {
        processedURLs.sort();
    }

    return processedURLs;
};

input.addEventListener('paste', (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedHTML = clipboardData.getData('text/html') || clipboardData.getData('text/plain');
    const urls = extractURLs(pastedHTML);

    if (urls.length > 0) {
        const finalURLs = processURLs(urls);
        output.value = finalURLs.join('\n');
        outputContainer.classList.remove('d-none');
        input.innerHTML = '<span class="text-success">Content processed. URLs have been extracted.</span>';
    } else {
        outputContainer.classList.add('d-none');
        input.innerHTML = '<span class="text-danger">No valid URLs found. Please try again.</span>';
    }
});

input.addEventListener('focus', () => {
    if (input.textContent.includes('Content processed') || input.textContent.includes('No valid URLs found')) {
        input.innerHTML = '';
    } else if (input.querySelector('.placeholder')) {
        input.textContent = '';
    }
});

copyButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        copyButton.textContent = 'Copied!';
        setTimeout(() => (copyButton.textContent = 'Copy URLs to Clipboard'), 1500);
    } catch {
        alert('Failed to copy URLs. Please try again.');
    }
});

input.addEventListener('blur', () => {
    if (!input.textContent.trim()) {
        input.innerHTML = '<span class="placeholder">Paste your content here...</span>';
    }
});

removeDuplicatesCheckbox.addEventListener('change', () => {
    console.log('Remove Duplicates:', removeDuplicatesCheckbox.checked);
});

sortURLsCheckbox.addEventListener('change', () => {
    console.log('Sort URLs:', sortURLsCheckbox.checked);
});