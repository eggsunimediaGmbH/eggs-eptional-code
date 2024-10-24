import { FadeInOnScroll } from "../../scripts/funcs/storageUtils.js";
export default async function decorate(block) {
    const blockName = 'one-column-text';
    let [
    // eslint-disable-next-line prefer-const
    headingType, headingText, 
    // eslint-disable-next-line prefer-const
    text] = Array.from(block.children); // fehlt picture
    Array.from(text.children).forEach((child) => {
        child.classList.add(`${blockName}__text`);
        const pElement = document.createElement('p');
        pElement.className = child.className;
        pElement.innerHTML = child.innerHTML;
    });
    const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    headingTags.some(tag => {
        if (headingType.textContent.includes(tag)) {
            const newElement = document.createElement(tag);
            newElement.textContent = headingText.textContent;
            headingText.parentNode.replaceChild(newElement, headingText);
            headingText.classList.forEach(cls => newElement.classList.add(cls));
            headingText = newElement;
            headingText.classList.add(`${blockName}__heading`);
        }
    });
    const videoTextHeroIsPresent = document.getElementsByClassName('video-text-hero').length != 0;
    if (!videoTextHeroIsPresent) {
        const containerList = document.getElementsByClassName('one-column-text-container');
        if (containerList.length != 0) {
            Array.from(containerList).forEach((container) => {
                if (container.classList != null) {
                    container.classList.add('one-column-text-container--standard-hero');
                }
            });
        }
    }
    headingType.parentNode.removeChild(headingType);
    // Create the scroll effect for the text
    const wrapper = document.querySelector('.one-column-text-wrapper');
    if (wrapper) {
        new FadeInOnScroll(wrapper, { rootMargin: '0px', threshold: 0.3 });
    }
}
