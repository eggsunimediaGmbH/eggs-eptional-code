import {createVideo, isVideoLink} from "../../scripts/video-support";
import {getDeviceType} from "../../scripts/funcs/storageUtils";

const blockName = 'article-parallax';
let isVideo;

export default async function decorate(block: HTMLElement): Promise<void> {
    const [
        backgroundImageWrapper,
        firstHeadingWrapper,
        firstSubheadingWrapper,
        firstTextWrapper,
        firstButtonLinkWrapper,
        firstImageWrapper,
        secondHeadingWrapper,
        secondSubheadingWrapper,
        secondTextWrapper,
        secondButtonLinkWrapper,
        secondImageWrapper
    ] = Array.from(block.children) as HTMLElement[];

    /* DOM Manipulations */

    // Create the Content container (left)
    const contentContainer = document.createElement('div');
    contentContainer.classList.add(`${blockName}__content-container`);
    const firstTextContainer = document.createElement('div');
    firstTextContainer.classList.add(`${blockName}__text-container`, 'first-text-container');

    const firstHeading = firstHeadingWrapper.querySelector('div') as HTMLElement | null;
    const firstSubheading = firstSubheadingWrapper.querySelector('div') as HTMLElement | null;
    const firstText = firstTextWrapper.querySelector('div, h1, h2, h3, h4, h5, p') as HTMLElement | null;
    const firstButtonLink = firstButtonLinkWrapper.querySelector('div') as HTMLElement | null;

    firstHeading?.classList.add(`${blockName}__heading`);
    firstSubheading?.classList.add(`${blockName}__subheading`);
    firstText?.classList.add(`${blockName}__text`);

    // Append elements if they are not empty
    appendIfNotEmpty(firstTextContainer, firstHeading);
    appendIfNotEmpty(firstTextContainer, firstSubheading);
    appendIfNotEmpty(firstTextContainer, firstText);

    appendIfNotEmpty(contentContainer, firstTextContainer);

    // Create a button container for the first button link
    const firstButtonContainer = document.createElement('p');
    firstButtonContainer.classList.add('button-container');
    createButton(firstButtonLink, firstButtonContainer, firstTextContainer, blockName);

    // First image container
    const firstImageContainer = document.createElement('div');
    firstImageContainer.classList.add(`${blockName}__image-container`);

    const firstImage = firstImageWrapper.querySelector('img') as HTMLElement | null;
    if (firstImage) {
        firstImage.classList.add(`${blockName}__firstImage`);
        firstImageContainer.appendChild(firstImage);
    }

    appendIfNotEmpty(contentContainer, firstImageContainer);

    // Second text container
    const secondTextContainer = document.createElement('div');
    secondTextContainer.classList.add(`${blockName}__text-container`, 'second-text-container');

    const secondHeading = secondHeadingWrapper.querySelector('div') as HTMLElement | null;
    const secondSubheading = secondSubheadingWrapper.querySelector('div') as HTMLElement | null;
    const secondText = secondTextWrapper.querySelector('div, h1, h2, h3, h4, h5, p') as HTMLElement | null;
    const secondButtonLink = secondButtonLinkWrapper.querySelector('div') as HTMLElement | null;

    secondHeading?.classList.add(`${blockName}__heading`);
    secondSubheading?.classList.add(`${blockName}__subheading`);
    secondText?.classList.add(`${blockName}__text`);
    appendIfNotEmpty(secondTextContainer, secondHeading);
    appendIfNotEmpty(secondTextContainer, secondSubheading);
    appendIfNotEmpty(secondTextContainer, secondText);
    appendIfNotEmpty(contentContainer, secondTextContainer);

    // Button container for the second button link
    const secondButtonContainer = document.createElement('p');
    secondButtonContainer.classList.add('button-container');
    createButton(secondButtonLink, secondButtonContainer, secondTextContainer, blockName);

    // Second image container
    const secondImageContainer = document.createElement('div');
    secondImageContainer.classList.add(`${blockName}__image-container`);

    const secondImage = secondImageWrapper.querySelector('img') as HTMLElement | null;
    if (secondImage) {
        secondImage.classList.add(`${blockName}__secondImage`);
        secondImageContainer.appendChild(secondImage);
    }
    appendIfNotEmpty(contentContainer, secondImageContainer);

    // Create the parallax container (right)
    const backgroundImageContainer = document.createElement('div');
    backgroundImageContainer.classList.add(`${blockName}__parallax-container`);
    let backgroundWrapper: HTMLElement;

    // Background image/video handling
    const videoUrl = backgroundImageWrapper.querySelector('a');
    isVideo = videoUrl ? isVideoLink(videoUrl) : false;

    // Remove the button-container if it exists
    const buttonContainer = backgroundImageWrapper.querySelector('.button-container');
    if (buttonContainer) {
        buttonContainer.remove();
    }

    if (isVideo) {
        backgroundWrapper = backgroundImageWrapper || document.createElement('div');
        backgroundWrapper.classList.add(`${blockName}__video-container`);
        // Cast backgroundImageWrapper to HTMLElement
        backgroundWrapper = await createVideo(
            videoUrl.title.split('/').pop().split('.mp4')[0],
            backgroundImageWrapper as HTMLElement,
            `video-container`
        ) as HTMLDivElement;
            videoUrl.remove();
    } else {
        // Handle image as background
        const backgroundImage = backgroundImageWrapper.querySelector('picture');
        backgroundImage.classList.add(`${blockName}__background-image--picture`);
        const backgroundImageElement = backgroundImage.querySelector('img');
        backgroundImageElement.classList.add(`${blockName}__background-image--img`);
        backgroundWrapper = document.createElement('div');
        backgroundWrapper.classList.add(`${blockName}__background-image`);

        backgroundWrapper.style.transform = 'translate3d(0px, 0px, 0px)';
        backgroundWrapper.style.scrollBehavior = 'smooth';
        backgroundWrapper.style.perspective = '10000px';
        backgroundWrapper.style.backfaceVisibility = 'hidden';
        backgroundWrapper.appendChild(backgroundImage);
    }

    const videoContainerDiv = document.querySelector(`.video-container`);
    if (videoContainerDiv) {
        const previewImage = videoContainerDiv.querySelector('img');
        if (previewImage) {
            previewImage.classList.add(`video-container__image--img`);

            const imgParentDiv = previewImage.parentElement;
            if (imgParentDiv) {
                imgParentDiv.classList.add('video-container__image');
            }
        }
    }


    // Icon container
    const iconContainer = document.createElement('div');
    iconContainer.classList.add(`${blockName}__icon-container`);

    const icon = document.createElement('img');
    icon.src = 'dist/icons/smile.svg';
    icon.alt = 'Icon';
    icon.classList.add(`${blockName}__icon`);

    if (!backgroundWrapper) {
        backgroundWrapper = document.createElement('div');
        backgroundWrapper.classList.add(`${blockName}__background-image`);
    }

    iconContainer.appendChild(icon);
    backgroundWrapper.appendChild(iconContainer);
    backgroundImageContainer.appendChild(backgroundWrapper);

    // Clear the block and append the structured content
    block.textContent = '';
    appendIfNotEmpty(block, contentContainer);
    appendIfNotEmpty(block, backgroundImageContainer);



    /* Desktop-specific PARALLAX EFFECT function */
    function adjustParallaxEffect(): void {
        const parallaxContainer = document.querySelector(`.${blockName}__parallax-container`) as HTMLElement;
        const parallaxImage = parallaxContainer.querySelector(`.${blockName}__background-image`) as HTMLElement;
        const parallaxVideo = parallaxContainer.querySelector(`.video-container`) as HTMLElement;
        const parallaxElement = parallaxImage || parallaxVideo;
        const parallaxIcon = parallaxContainer.querySelector(`.${blockName}__icon-container`) as HTMLElement;
        if (!parallaxElement) {
            parallaxContainer.style.display = 'block';
            return;
        }

        const containerRect = parallaxContainer.getBoundingClientRect();
        const scrollY = window.scrollY;
        const containerTop = containerRect.top + scrollY;
        const containerHeight = parallaxContainer.offsetHeight;
        const viewportHeight = window.innerHeight;

        const offset = Math.max(0, Math.min(scrollY - containerTop, containerHeight - viewportHeight));
        const roundedOffset = Math.round(offset);

        parallaxContainer.style.minHeight = '400px';
        // Apply parallax transformation
        parallaxElement.style.transform = `translate3D(0, ${roundedOffset}px, 0)`;
        parallaxElement.style.scrollBehavior = `smooth`;
        parallaxElement.style.perspective = '10000px';
        parallaxElement.style.backfaceVisibility = 'hidden';

        parallaxIcon.style.transform = `translate3D(0, ${roundedOffset}px, 0)`;
        parallaxIcon.style.scrollBehavior = `smooth`;
        parallaxIcon.style.perspective = '10000px';
        parallaxIcon.style.backfaceVisibility = 'hidden';
    }

    // Initialize parallax effects based on device type
    function initializeParallaxEffect() {
        if (getDeviceType() !== 'mobile') {
            window.addEventListener('scroll', adjustParallaxEffect);
            adjustParallaxEffect();
        }
    }

    const AEM_UNIVERSAL_EDITOR_DOMAIN = 'adobeaemcloud.com';
    function isAEMUniversalEditor() {
        return window.location.origin.includes(AEM_UNIVERSAL_EDITOR_DOMAIN);
    }

    if (!isAEMUniversalEditor()) {
        initializeParallaxEffect();
        console.log('Not inside AEM Universal Editor, initializing parallax effect');
    }
}

function createButton (
    buttonLink: HTMLElement | null,
    buttonContainer: HTMLElement,
    textContainer: HTMLElement,
    blockName: string
) {
    if (!isEmptyElement(buttonLink) && buttonLink?.textContent?.trim()) {
        const buttonAnchor = document.createElement('a');
        buttonAnchor.href = buttonLink.textContent || '#';
        buttonAnchor.classList.add('button', 'primary', `${blockName}__button`);
        buttonAnchor.textContent = 'Read more';
        buttonContainer.appendChild(buttonAnchor);
        textContainer.appendChild(buttonContainer);
    }
}

// Function to append elements only if they are not empty
function appendIfNotEmpty(parent: HTMLElement, child: HTMLElement | null) {
    if (!isEmptyElement(child)) {
        parent.appendChild(child!);
    }
}

// Check if the element exists and has either text content or child elements
function isEmptyElement(element: HTMLElement | null): boolean {
    if (!element) return true;

    if (element.textContent?.trim() === '' && element.children.length === 0) {
        return true;
    }

    if (element.querySelector('img') || element.querySelector('video') || element.querySelector('iframe')) {
        return false;
    }

    return false;
}
