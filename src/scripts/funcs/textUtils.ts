
/**
 * Highlights text wrapped in specified tags within the entire document or specific parent elements by applying a specified class.
 * @param {string} tagName - The name of the tag to look for (without angle brackets).
 * @param {string} newClass - The class to apply to the highlighted text.
 * @param {Element} [parentElement] - The parent element to scan for the specified tags, defaults to document body if not provided
 */
function highlightTextInDocument(tagName: string, newClass: string, parentElement?: Element) {
    const givenParentElement = parentElement || document.body;

    // Function to replace tags within a given element's innerHTML
    function replaceTagsInElement(element) {
        const content = element.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

        // Create regex for the custom tag
        const tagPattern = new RegExp(`<${tagName}>(.*?)</${tagName}>`, 'gi');

        // Check if there is any match for the custom tag
        const matches = content.match(tagPattern);
        if (matches) {
            // Replace all matches
            const newHTML = content.replace(tagPattern, (_, matchContent) => {
                return `<span class="${newClass}">${matchContent}</span>`;
            });

            // Update the element's HTML if any changes were made
            if (newHTML !== content) {
                element.innerHTML = newHTML;
            }
        }
    }

    // Replace custom tags in the parent element itself
    replaceTagsInElement(givenParentElement);

    // Recursively apply the same replacement to child elements
    givenParentElement.querySelectorAll('*').forEach((childElement) => {
        replaceTagsInElement(childElement);
    });
}

export { highlightTextInDocument };
