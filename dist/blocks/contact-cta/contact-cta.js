import { isVideoLink } from "../../scripts/video-support.js";
import { createBackgroundImageWrapper } from "../../scripts/funcs/storageUtils.js";
const blockName = 'contact-cta';
export default async function decorate(block) {
    const elements = Array.from(block.children);
    const [heading, headingHover, bannerText, bannerTextHover, video1, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infoIcon, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infoText, buttonText, buttonLink] = elements;
    const contactCta = document.querySelector('.contact-cta');
    // Create the Button with text and link
    const newButtonContainer = document.createElement('p');
    newButtonContainer.classList.add('button-container', `${blockName}__button`);
    const newButtonElementLink = document.createElement('a');
    newButtonElementLink.href = buttonLink.textContent;
    newButtonElementLink.classList.add('button', 'primary', `${blockName}__link`);
    newButtonElementLink.textContent = buttonText.textContent;
    newButtonContainer.appendChild(newButtonElementLink);
    buttonText.replaceWith(newButtonContainer);
    buttonLink.replaceWith(newButtonContainer);
    contactCta.appendChild(newButtonContainer);
    const backgroundImageContainer = document.createElement('div');
    backgroundImageContainer.classList.add(`${blockName}__video-container`);
    const videoUrl = block.querySelector('a');
    const isVideo = videoUrl ? isVideoLink(videoUrl) : false;
    const backgroundImage = createBackgroundImageWrapper(video1, `${blockName}`, videoUrl, isVideo);
    backgroundImageContainer.appendChild(await backgroundImage);
    contactCta.appendChild(backgroundImageContainer);
    decorateTitleElement(heading, true, block);
    decorateTitleElement(headingHover, false, block);
    decorateTextElement(bannerText, false, block);
    decorateTextElement(bannerTextHover, true, block);
    //handleImage(block);
    handleContent(block);
    if (window.location.origin.includes('adobeaemcloud.com')) {
        console.log('AEM detected! Proceeding to adjust the height of the contact-cta block');
        block.style.height = '940px';
    }
}
function handleContent(block) {
    const contentWrapper = block.querySelector(':scope > div');
    contentWrapper.classList.add(`${blockName}__content-wrapper`);
    const content = block.querySelector(':scope > div > div');
    content.classList.add(`${blockName}__content`);
    // convert all headings to h1
    const headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    headings.forEach((heading) => {
        if (heading.tagName !== 'H1') {
            const h1 = createElement('h1', { classes: `${blockName}__title` });
            h1.setAttribute('id', heading.getAttribute('id'));
            h1.innerHTML = heading.innerHTML;
            heading.parentNode.replaceChild(h1, heading);
        }
        else {
            heading.classList.add(`${blockName}__title`);
        }
    });
    // render all paragraph as H6 with the class
    const paragraphs = Array.from(content.querySelectorAll('p'));
    paragraphs.forEach((paragraph) => paragraph.classList.add('h6'));
}
// This function creates an element with the given attributes
function createElement(tag, attributes) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach((key) => {
        element.setAttribute(key, String(attributes[key]));
    });
    return element;
}
function decorateTitleElement(htmlElement, hover, contactCta) {
    Array.from(htmlElement.children).forEach((child) => {
        const h3 = document.createElement('h3');
        h3.innerHTML = child.innerHTML;
        Array.from(child.attributes).forEach(attr => h3.setAttribute(attr.name, attr.value));
        htmlElement.replaceChild(h3, child);
        h3.classList.add(`${blockName}__title`);
        if (hover) {
            h3.classList.add(`${blockName}__title--hover`); // Add --hover class initially if hover is true
        }
        else {
            if (contactCta && h3) {
                h3.classList.add(`${blockName}__title-active`);
                h3.classList.remove(`${blockName}__title-disabled`);
            }
        }
        const h3Element = document.createElement('h3');
        h3Element.className = child.className;
        h3Element.innerHTML = child.innerHTML;
    });
    return htmlElement;
}
function decorateTextElement(htmlElement, hover, contactCta) {
    Array.from(htmlElement.children).forEach((child) => {
        const newPElement = createPElement(child);
        setElementActiveOnHover(newPElement, hover, contactCta);
        htmlElement.replaceChild(newPElement, child);
    });
    return htmlElement;
}
function createPElement(child) {
    const newPElement = document.createElement('p');
    newPElement.className = child.className;
    newPElement.innerHTML = child.innerHTML;
    newPElement.classList.add(`${blockName}__content`);
    return newPElement;
}
function setElementActiveOnHover(newPElement, hover, contactCta) {
    if (contactCta) {
        if (hover) {
            newPElement.classList.add(`${blockName}__content-active`);
        }
        else {
            newPElement.classList.add(`${blockName}__content--hover`);
        }
    }
}
