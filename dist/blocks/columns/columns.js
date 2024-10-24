import { FadeInOnScroll } from "../../scripts/funcs/storageUtils.js";
const blockName = 'columns';
export default async function decorate(block) {
    const invertedParent = hasInvertedParent(block);
    // Get the first-level child inside the block & replace it
    const emptyDiv = block.querySelector(`.${blockName} > div`);
    if (emptyDiv) {
        const parentElement = emptyDiv.parentElement;
        if (parentElement) {
            while (emptyDiv.firstChild) {
                parentElement.insertBefore(emptyDiv.firstChild, emptyDiv);
            }
            emptyDiv.remove();
        }
    }
    const containers = block.querySelectorAll(`.${blockName} > div`);
    containers.forEach((container) => {
        container.classList.add(`${blockName}__item`);
        if (invertedParent) {
            container.classList.add('inverted');
        }
        const paragraphs = container.querySelectorAll('p');
        paragraphs.forEach((paragraph) => {
            const pictureElement = paragraph.querySelector('picture');
            const imgElement = pictureElement === null || pictureElement === void 0 ? void 0 : pictureElement.querySelector('img');
            if (pictureElement && imgElement) {
                pictureElement.classList.add(`${blockName}__item-picture`);
                imgElement.classList.add(`${blockName}__item-picture--img`);
                paragraph.classList.add(`${blockName}__item-icon`);
            }
            else {
                paragraph.classList.add(`${blockName}__item-text`);
            }
        });
        const headingElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headingElements.forEach((hElement) => {
            if (invertedParent) {
                hElement.classList.add('inverted');
            }
            else {
                hElement.classList.add(`${blockName}__item-headline`);
            }
        });
    });
    // Apply the fade-in effect on scroll
    const wrapper = block.closest('.columns-wrapper');
    if (wrapper) {
        new FadeInOnScroll(wrapper, {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.3,
            delay: 400, // Initial delay for the first child
            childSelector: `.${blockName}__item`,
        });
    }
}
function hasInvertedParent(element) {
    return element.closest('div.inverted') !== null;
}
