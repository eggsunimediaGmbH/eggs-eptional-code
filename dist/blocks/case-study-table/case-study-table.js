import { getDeviceType } from "../../scripts/funcs/storageUtils.js";
import { observeVisibility } from "../../scripts/aem.js";
import { isAdobeCloud } from "../../scripts/video-support.js";
const blockName = 'case-study-table';
export default function decorate(block) {
    const dataContainers = Array.from(block.children);
    // Dynamic selectors object
    console.log('DATA CONTAINERS:', dataContainers[0], dataContainers[1], dataContainers[2], dataContainers[3]);
    const selectors = {
        title: {
            element: createElementWithClass('h2', `${blockName}__title`),
            contentText: searchNestedContent(dataContainers[0])
        },
        button: {
            element: createElementWithClass('a', `${blockName}__button button primary`),
            contentText: searchNestedContent(dataContainers[1]),
            linkHref: searchNestedContent(dataContainers[2])
        },
        imageContainer: {
            element: createElementWithClass('div', `${blockName}__image-wrapper`),
            pictureHtml: searchNestedPicture(dataContainers[3], `${blockName}__picture`),
        },
        cardsContainer: {
            element: createElementWithClass('div', `${blockName}__items-wrapper`),
            itemsOfChildren: Array.from(dataContainers).slice(4).map((container) => {
                return {
                    upperText: searchNestedContent(container.children[0]), // First item
                    itemTitle: searchNestedContent(container.children[1]), // Second item
                    itemLink: searchNestedHref(container.children[2]), // Third item
                };
            })
        }
    };
    console.log('searchNestedPicture(dataContainers[3], `${blockName}__picture`),', searchNestedPicture(dataContainers[3], `${blockName}__picture`));
    //We are moving the content/element
    selectors.title.element.textContent = selectors.title.contentText;
    selectors.button.element.textContent = selectors.button.contentText;
    selectors.button.element.href = selectors.button.linkHref;
    console.log('The image is', selectors.imageContainer.pictureHtml);
    safelyAppendTheItem(selectors.imageContainer.element, selectors.imageContainer.pictureHtml, HTMLPictureElement);
    const decoratedItems = Array.from(selectors.cardsContainer.itemsOfChildren).map((itemChildren) => {
        const elementObject = createElementWithClass('a', `${blockName}__link-wrapper`);
        elementObject.href = itemChildren.itemLink;
        const upperText = createElementWithClass('p', `${blockName}__link-wrapper--upper-text`);
        const title = createElementWithClass('h4', `${blockName}__link-wrapper--title-item`);
        upperText.textContent = itemChildren.upperText;
        title.textContent = itemChildren.itemTitle;
        elementObject && elementObject.appendChild(upperText);
        elementObject && elementObject.appendChild(title);
        return elementObject;
    });
    decoratedItems.forEach(item => {
        selectors.cardsContainer.element.appendChild(item);
    });
    let lastDeviceType = getDeviceType();
    if (isAdobeCloud()) {
        const children = block.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].tagName.toLowerCase() === 'div') {
                children[i].style.display = 'none';
            }
        }
    }
    else {
        block.innerHTML = '';
    }
    const leftContainer = document.createElement('div');
    leftContainer.classList.add(`${blockName}__left-container`);
    const rightContainer = document.createElement('div');
    rightContainer.classList.add(`${blockName}__right-container`);
    window.addEventListener('resize', () => {
        if (lastDeviceType !== getDeviceType()) {
            lastDeviceType = getDeviceType();
            arrangeContainers();
        }
    });
    const arrangeContainers = () => {
        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';
        if (getDeviceType() === 'mobile') {
            appendElementsTo(leftContainer, [selectors.title, selectors.imageContainer, selectors.cardsContainer, selectors.button]);
            leftContainer && block.appendChild(leftContainer);
        }
        else {
            appendElementsTo(leftContainer, [selectors.title, selectors.cardsContainer]);
            appendElementsTo(rightContainer, [selectors.button, selectors.imageContainer]);
            leftContainer && block.appendChild(leftContainer);
            rightContainer && block.appendChild(rightContainer);
        }
    };
    arrangeContainers();
}
observeVisibility('.case-study-table', function (element) {
    const linkWrappers = element.querySelectorAll('.case-study-table--link-wrapper');
    if (linkWrappers.length >= 4) {
        const heightOfImage = computeTotalHeight(linkWrappers);
        const imageRight = element.querySelector('.case-study-table__picture');
        imageRight.style.height = `${heightOfImage}px`;
    }
});
function computeTotalHeight(linkWrappers) {
    // Select all link-wrapper elements
    let totalHeight = 0;
    linkWrappers.forEach((linkWrapper) => {
        // Get the computed styles for each element
        const computedStyle = window.getComputedStyle(linkWrapper);
        // Parse the height, margin-top, and margin-bottom from the computed style
        const height = parseFloat(computedStyle.height);
        const marginTop = parseFloat(computedStyle.marginTop);
        const marginBottom = parseFloat(computedStyle.marginBottom);
        // Calculate the total height including margins
        const totalElementHeight = height + marginTop + marginBottom;
        totalHeight += totalElementHeight;
    });
    return totalHeight;
}
function searchNestedContent(element) {
    if (!element)
        return null;
    // Recursive function to find the deepest text content
    function findTextContent(el) {
        var _a;
        if (el instanceof HTMLElement) {
            // If the element has text content directly, return it
            const textContent = (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim();
            if (textContent)
                return textContent;
            for (let i = 0; i < el.children.length; i++) {
                const content = findTextContent(el.children[i]);
                if (content)
                    return content;
            }
        }
        return null;
    }
    // Start recursive search from the provided element
    return findTextContent(element);
}
/**
 * Recursively searches for a <picture> element inside the given HTMLElement.
 *
 * @param element - The HTMLElement to start searching from.
 * @param classNames
 * @returns The <picture> element if found, otherwise null.
 */
function searchNestedPicture(element, classNames) {
    if (!element)
        return null;
    // Recursive function to find a <picture> element
    function findPictureElement(el) {
        if (el instanceof HTMLPictureElement) {
            // If a <picture> element is found and classNames is provided, add the classes
            if (classNames) {
                if (Array.isArray(classNames)) {
                    el.classList.add(...classNames); // Spread the array of class names
                }
                else {
                    el.classList.add(...classNames.split(' ')); // Split space-separated class names
                }
            }
            return el; // Return the <picture> tag
        }
        // Search recursively through its children
        for (let i = 0; i < el.children.length; i++) {
            const foundPicture = findPictureElement(el.children[i]);
            if (foundPicture)
                return foundPicture; // Return if a <picture> tag is found
        }
        return null;
    }
    // Start recursive search from the provided element
    return findPictureElement(element);
}
function searchNestedHref(element) {
    if (!element)
        return ''; // Return empty string if element is null
    const anchor = element.querySelector('a'); // Search for the first <a> tag inside the element
    if (anchor) {
        return anchor.getAttribute('href') || ''; // Return href or empty string if not found
    }
    // If no <a> tag found, recursively search deeper into the children
    const children = Array.from(element.children);
    for (const child of children) {
        const nestedHref = searchNestedHref(child); // Recursively call on children
        if (nestedHref)
            return nestedHref; // Return the href if found
    }
    return ''; // Return empty string if no href found
}
// Helper function to create elements
function createElementWithClass(tag, classNames) {
    const element = document.createElement(tag);
    // Split the classNames string by spaces and add each class
    element.classList.add(...classNames.split(' '));
    return element;
}
function appendElementsTo(container, elementsObj) {
    Object.values(elementsObj).forEach((item) => {
        if (item && item.element instanceof HTMLElement) {
            container.appendChild(item.element);
        }
        else {
            console.warn('Invalid or non-HTMLElement found:', item);
        }
    });
}
function safelyAppendTheItem(container, element, expectedType) {
    // Check if the element is not null and is of the expected type
    if (element && element instanceof expectedType) {
        container.appendChild(element);
    }
    else {
        console.warn('Failed to append: Element is either null or not an instance of the expected type.');
    }
}
