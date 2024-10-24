import { createVideo } from "../video-support.js";
function getCookie(name) {
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.indexOf(`${name}=`) === 0) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;Secure;SameSite=Lax`;
}
function getDeviceType() {
    const bodyClasses = document.body.classList;
    if (bodyClasses.contains('desktop'))
        return 'desktop';
    if (bodyClasses.contains('tablet'))
        return 'tablet';
    if (bodyClasses.contains('mobile'))
        return 'mobile';
    return 'unknown';
}
/**
 * FadeInOnScroll class applies a fade-in animation to a target element
 * when it comes into view. The animation is triggered using the
 * Intersection Observer API and only occurs once per element.
 */
export class FadeInOnScroll {
    /**
     * Constructor for the FadeInOnScroll class.
     * @param element - The target HTML element to observe and animate.
     * @param options - Optional configuration object for the IntersectionObserver.
     *     *   - rootMargin: Margin around the root. Default is '0px 0px -100px 0px'.
     *      *   - threshold: Percentage of the element's visibility to trigger the animation. Default is 0.3 (30%).
     *      *   - delay: Delay before applying the animation to the children in milliseconds.
     *      *   - childSelector: The selector for the child elements to apply the delay and animation.
     *      *   - fadeInClass: The class to add for the fade-in effect.
     */
    constructor(element, options = {}) {
        this.element = element;
        this.options = options;
        this.animated = false; // Tracks if the animation has already occurred
        const isAEMUniversalEditor = window.location.origin.includes('adobeaemcloud.com');
        if (isAEMUniversalEditor) {
            // Skip initialization if inside AEM Universal Editor
            return;
        }
        const { rootMargin = '0px 0px -100px 0px', threshold = 0.3, delay = 0, childSelector = '' } = options;
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            root: null,
            rootMargin,
            threshold,
        });
        this.observeElement(delay, childSelector);
    }
    observeElement(delay, childSelector) {
        this.observer.observe(this.element);
        if (childSelector) {
            const children = this.element.querySelectorAll(childSelector);
            children.forEach((child, index) => {
                //delay between each child
                child.style.transitionDelay = `${delay + index * 400}ms`;
            });
        }
    }
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.animated) {
                this.element.classList.add('fade-in');
                if (this.options.childSelector) {
                    const children = this.element.querySelectorAll(this.options.childSelector);
                    children.forEach((child) => {
                        child.classList.add('fade-in');
                    });
                }
                this.animated = true;
                this.observer.unobserve(this.element);
            }
        });
    }
}
function changeHeightAndPositionInEditor(className) {
    const isAEMUniversalEditor = window.location.origin.includes('adobeaemcloud.com');
    const element = document.querySelector(className);
    if (isAEMUniversalEditor && element) {
        element.style.height = 'auto';
        element.style.position = 'relative';
    }
}
function addEditorModeClass() {
    const isAEMUniversalEditor = window.location.origin.includes('adobeaemcloud.com');
    if (isAEMUniversalEditor) {
        document.body.classList.add('editor-mode');
    }
}
addEditorModeClass();
function createParallaxTextContainer(heading, subheading, text, button, blockName, containerClass) {
    const textContainer = document.createElement('div');
    textContainer.classList.add(`${blockName}__text-container`, containerClass);
    if (heading != null) {
        const headingElement = heading.querySelector('div');
        headingElement === null || headingElement === void 0 ? void 0 : headingElement.classList.add(`${blockName}__heading`);
        textContainer.appendChild(headingElement);
    }
    if (subheading != null) {
        const subheadingElement = document.createElement('div');
        subheadingElement.classList.add(`${blockName}__subheading`);
        subheadingElement.textContent = subheading.textContent;
        textContainer.appendChild(subheadingElement);
    }
    if (text != null) {
        const textElement = document.createElement('div');
        textElement.classList.add(`${blockName}__text`);
        textElement.textContent = text.textContent;
        textContainer.appendChild(textElement);
    }
    if (button != null) {
        const newButtonContainer = document.createElement('p');
        newButtonContainer.className = 'button-container';
        const newButtonElementLink = document.createElement('a');
        newButtonElementLink.href = button.textContent;
        newButtonElementLink.classList.add('button', 'primary');
        newButtonElementLink.textContent = "Read more";
        newButtonElementLink.classList.add(`${blockName}__button`);
        newButtonContainer.appendChild(newButtonElementLink);
        textContainer.appendChild(newButtonContainer);
    }
    return textContainer;
}
async function createBackgroundImageWrapper(backgroundImageElement, blockName, videoUrl, isVideo) {
    let backgroundImageWrapper = document.createElement('div');
    backgroundImageWrapper.classList.add(`${blockName}__background-image`);
    let imgElementPicture;
    if (isVideo) {
        backgroundImageWrapper = await createVideo(videoUrl.title.split('/').pop().split('.mp4')[0], backgroundImageWrapper, `${blockName}__background-image--picture`);
        videoUrl.remove();
    }
    else {
        imgElementPicture = backgroundImageElement.querySelector('picture');
        imgElementPicture.className = `${blockName}__background-image--picture`;
        backgroundImageWrapper.appendChild(imgElementPicture);
        const imgElementImage = imgElementPicture.querySelector('img');
        imgElementImage.className = `${blockName}__background-image--img`;
    }
    return backgroundImageWrapper;
}
/**
 * Creates a debounced function that delays the invocation of the provided `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was called.
 *
 * @param {() => void} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {() => void} - A new debounced function.
 */
function debounce(func, wait) {
    // Variable to keep track of the timeout ID
    let timeout;
    // The debounced function
    return () => {
        // Clear the previous timeout, if any
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        // Set a new timeout to call the function after the specified wait time
        timeout = window.setTimeout(() => {
            func();
        }, wait);
    };
}
export { getCookie, setCookie, getDeviceType, changeHeightAndPositionInEditor, createParallaxTextContainer, createBackgroundImageWrapper, debounce };
