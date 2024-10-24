import { debounce, getDeviceType, changeHeightAndPositionInEditor } from "../../scripts/funcs/storageUtils.js";
import { isVideoLink, createVideo } from "../../scripts/video-support.js";
import { observeElement } from "../../scripts/aem.js";
import { isSafariUserAgent } from "../../scripts/funcs/editorUtils.js";
const blockName = 'hero';
export default async function decorate(block) {
    const [videoContainer, firstHeadlineContainer, secondHeadlineContainer, heroDescriptionContainer, bannerContainer] = Array.from(block.children);
    const heroVideoContainer = videoContainer;
    heroVideoContainer.classList.add(`${blockName}__video`);
    let heroContainer = videoContainer.querySelector('div');
    heroContainer === null || heroContainer === void 0 ? void 0 : heroContainer.classList.add(`${blockName}__video-container`);
    heroContainer.style.height = '100%';
    heroContainer.style.width = '100%';
    if (heroContainer) {
        removeButtonContainerClass(heroContainer);
    }
    const firstHeadline = firstHeadlineContainer.querySelector('div');
    firstHeadline === null || firstHeadline === void 0 ? void 0 : firstHeadline.classList.add(`xl-headline`, `${blockName}__xl-headline--yellow`);
    const secondHeadline = secondHeadlineContainer.querySelector('div');
    secondHeadline === null || secondHeadline === void 0 ? void 0 : secondHeadline.classList.add(`${blockName}__intro-headline`);
    const descriptionText = heroDescriptionContainer.querySelector('div');
    descriptionText === null || descriptionText === void 0 ? void 0 : descriptionText.classList.add(`${blockName}__description`);
    const bannerContainerMobile = bannerContainer;
    bannerContainerMobile === null || bannerContainerMobile === void 0 ? void 0 : bannerContainerMobile.classList.add(`${blockName}__banner-container`);
    const bannerTextMobile = bannerContainer.querySelector('div');
    bannerTextMobile === null || bannerTextMobile === void 0 ? void 0 : bannerTextMobile.classList.add(`${blockName}__banner-text`);
    setupBannerContainer(bannerContainerMobile, true);
    const bannerContainerDesktop = bannerContainerMobile.cloneNode(true);
    bannerContainerDesktop.className = `${blockName}__banner-container--desktop`;
    setupBannerContainer(bannerContainerDesktop, false);
    const videoUrl = heroContainer.querySelector('a');
    const isVideo = videoUrl ? isVideoLink(videoUrl) : false;
    if (isVideo) {
        heroContainer = await createVideo(videoUrl.title.split('/').pop().split('.mp4')[0], heroContainer, `${blockName}__video-element`);
        videoUrl.remove();
    }
    else {
        const videoElement = heroContainer.querySelector('picture');
        videoElement.className = `${blockName}__video-element`;
        heroContainer.appendChild(videoElement);
    }
    // Create the divs for the video's rounded corners
    const cornersDiv = document.createElement('div');
    cornersDiv.className = `${blockName}__video-cutout--container`;
    heroVideoContainer.appendChild(cornersDiv);
    const cutoutClasses = [
        'bottom-left',
        'top-right',
        'bottom-left-top',
        'bottom-left-bottom',
        'top-right-bottom',
        'top-left-top'
    ];
    cutoutClasses.forEach(cutoutClass => {
        const cutout = document.createElement('div');
        cutout.className = `${blockName}__video-cutout ${cutoutClass}`;
        cornersDiv.appendChild(cutout);
    });
    const iconsContainer = document.createElement('div');
    iconsContainer.className = `${blockName}__video-icons--container`;
    cornersDiv.appendChild(iconsContainer);
    const iconDiv1 = document.createElement('div');
    iconDiv1.className = `${blockName}__video-icon arrow-icon`;
    iconsContainer.appendChild(iconDiv1);
    const iconDiv2 = document.createElement('div');
    iconDiv2.className = `${blockName}__video-icon yellow-circle-icon`;
    iconsContainer.appendChild(iconDiv2);
    const leftContainer = document.createElement('div');
    leftContainer.className = `${blockName}__left-container`;
    const rightContainer = document.createElement('div');
    rightContainer.className = `${blockName}__right-container`;
    let lastDeviceType = getDeviceType();
    window.addEventListener('resize', () => {
        if (lastDeviceType !== getDeviceType()) {
            lastDeviceType = getDeviceType();
            populateContainers();
        }
    });
    const populateContainers = () => {
        block.innerHTML = '';
        if (getDeviceType() === 'desktop') {
            leftContainer.appendChild(firstHeadline);
            leftContainer.appendChild(secondHeadline);
            leftContainer.appendChild(descriptionText);
            heroVideoContainer.appendChild(bannerContainerDesktop);
            rightContainer.appendChild(heroVideoContainer);
            block.appendChild(leftContainer);
            block.appendChild(rightContainer);
            moveDefaultContentWrapper('left');
        }
        else {
            leftContainer.appendChild(firstHeadline);
            leftContainer.appendChild(secondHeadline);
            rightContainer.appendChild(heroVideoContainer);
            rightContainer.appendChild(bannerContainerMobile);
            rightContainer.appendChild(descriptionText);
            block.appendChild(leftContainer);
            block.appendChild(rightContainer);
            moveDefaultContentWrapper('right');
        }
    };
    populateContainers();
    changeHeightAndPositionInEditor('.hero-container');
    changeHeightAndPositionInEditor('.hero__video-container');
}
function moveDefaultContentWrapper(direction) {
    const defaultContentWrapper = document.querySelector('.default-content-wrapper');
    const heroWrapper = document.querySelector('.hero-wrapper > div');
    const heroLeftContainer = heroWrapper.querySelector(`.hero__${direction}-container`);
    if (defaultContentWrapper && heroLeftContainer) {
        heroLeftContainer.appendChild(defaultContentWrapper);
    }
}
function setupBannerContainer(bannerContainer, isMobile) {
    const bannerText = bannerContainer.querySelector('div');
    if (bannerText) {
        bannerText.className = `${blockName}__banner-text`;
    }
    // Display none if we don't add text for banner
    const hasContent = bannerText.textContent.trim().length > 0;
    if (!hasContent) {
        bannerContainer.style.display = 'none';
    }
    let bannerProp = bannerContainer.querySelector('[data-aue-prop="bannertext"]');
    if (!bannerProp) {
        bannerProp = bannerContainer.querySelector(`.${blockName}__banner-text`);
    }
    if (!bannerProp)
        return;
    if (bannerProp.hasAttribute('data-aue-prop')) {
        bannerProp.classList.add(`${blockName}__banner-text`);
    }
    const paragraphs = bannerProp.querySelectorAll('p');
    let currentIndex = 0;
    const showNextParagraph = () => {
        paragraphs[currentIndex].classList.remove('show');
        currentIndex = (currentIndex + 1) % paragraphs.length;
        paragraphs[currentIndex].classList.add('show');
    };
    // Initialize: show only the first paragraph
    if (paragraphs.length > 0) {
        paragraphs.forEach((p, index) => {
            p.classList.remove('show');
            if (index === 0)
                p.classList.add('show');
        });
    }
    // Add event listeners for mouseOver and mouseOut
    bannerContainer.addEventListener('mouseover', () => {
        if (paragraphs.length > 1) {
            paragraphs[0].classList.remove('show');
            paragraphs[1].classList.add('show');
        }
    });
    bannerContainer.addEventListener('mouseout', () => {
        if (paragraphs.length > 1) {
            paragraphs[1].classList.remove('show');
            paragraphs[0].classList.add('show');
        }
    });
    setTimeout(() => {
        bannerProp.classList.add('show');
        bannerText.classList.add('show');
        if ((isMobile && paragraphs.length > 1) || bannerProp.classList.contains('editor')) {
            setInterval(showNextParagraph, 3000);
        }
    }, 800);
}
// Function to remove the "button-container" class from videos
function removeButtonContainerClass(element) {
    element.classList.remove('button-container');
}
function matchContainerHeights() {
    const leftContainer = document.querySelector('.hero__left-container');
    const rightContainer = document.querySelector('.hero__right-container');
    const video = rightContainer === null || rightContainer === void 0 ? void 0 : rightContainer.querySelector('.hero__video');
    const isSafari = isSafariUserAgent();
    const isLargeScreen = window.innerWidth > 2560;
    if (!leftContainer || !rightContainer) {
        console.error("One or both containers are missing. Check the class selectors.");
        return;
    }
    // Reset height to auto before measuring
    leftContainer.style.height = 'auto';
    video.style.height = 'auto';
    // Ensure left container height is not more than right container height
    const leftHeight = leftContainer.offsetHeight;
    const rightHeight = rightContainer.offsetHeight;
    if (leftHeight > rightHeight) {
        leftContainer.style.height = `${rightHeight}px`;
    }
    // Right container's height to be 1.5 the left container's height
    let increasedHeight = leftHeight * 1.2;
    // Adjust the value for Safari
    if (isSafari) {
        increasedHeight = leftHeight * 1.1;
    }
    else if (isLargeScreen) {
        increasedHeight = leftHeight * 1.4;
    }
    if (rightContainer.offsetHeight !== increasedHeight) {
        requestAnimationFrame(() => {
            rightContainer.style.setProperty('height', `${increasedHeight}px`, 'important');
            video.style.setProperty('height', `${increasedHeight}px`, 'important');
        });
    }
}
function checkContainers() {
    const leftContainer = document.querySelector('.hero__left-container');
    const rightContainer = document.querySelector('.hero__right-container');
    if (!leftContainer || !rightContainer) {
        console.error("One or both containers are missing.");
        return;
    }
    if (getDeviceType() === 'desktop') {
        matchContainerHeights();
    }
}
function waitForElements(selectors, callback, timeout = 5000) {
    // measure how long the function has been checking for the elements
    const startTime = new Date().getTime();
    // Sets how frequently the function checks for the presence of the el
    const checkInterval = 50;
    function checkElements() {
        // loops over each selector array - tries to find the corresponding DOM el
        const elements = selectors.map(selector => document.querySelector(selector));
        // checks if all the el are found
        if (elements.every(element => element !== null)) {
            // all elements are found
            callback();
            // timeout check - if not all el are found
            // difference by comparing the current time to the startTime
        }
        else if (new Date().getTime() - startTime < timeout) {
            // if the elapsed time < than the timeout, sets another check after checkInterval(50ms)
            setTimeout(checkElements, checkInterval);
        }
        else {
            console.error("Timed out waiting for elements: ", selectors);
        }
    }
    checkElements();
}
function init() {
    const isAEMUniversalEditor = window.location.origin.includes('adobeaemcloud.com');
    if (getDeviceType() === 'desktop' && !isAEMUniversalEditor) {
        waitForElements(['.hero__left-container', '.hero__right-container'], () => {
            checkContainers();
            observeElement('.hero__left-container', checkContainers);
            observeElement('.hero__right-container', checkContainers);
            window.addEventListener('resize', debounce(() => {
                if (getDeviceType() === 'desktop') {
                    requestAnimationFrame(() => {
                        matchContainerHeights();
                    });
                }
            }, 250));
        });
    }
}
init();
