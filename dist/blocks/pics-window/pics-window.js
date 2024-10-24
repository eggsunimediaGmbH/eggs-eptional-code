export default function decorate(block) {
    const blockName = `pics-window`;
    // Check if in AEM Universal Editor
    const isAEMUniversalEditor = window.location.origin.includes('adobeaemcloud.com');
    if (isAEMUniversalEditor) {
        return;
    }
    const [verticalImageWrapper, topRight, bottomRight] = Array.from(block.children);
    const verticalImageContainer = document.createElement(`div`);
    verticalImageContainer.classList.add(`${blockName}__vertical-container`);
    const verticalImage = verticalImageWrapper.querySelector('picture');
    if (verticalImage) {
        verticalImage.classList.add(`${blockName}__vertical-image`);
        verticalImageContainer.appendChild(verticalImage);
    }
    const topRightContainer = document.createElement(`div`);
    topRightContainer.classList.add(`${blockName}__top-right-container`);
    const topRightImage = topRight.querySelector('picture');
    if (topRightImage) {
        topRightImage.classList.add(`${blockName}__top-right`);
        topRightContainer.appendChild(topRightImage);
    }
    const bottomRightContainer = document.createElement(`div`);
    bottomRightContainer.classList.add(`${blockName}__bottom-right-container`);
    const bottomRightImage = bottomRight.querySelector('picture');
    if (bottomRightImage) {
        bottomRightImage.classList.add(`${blockName}__bottom-right`);
        bottomRightContainer.appendChild(bottomRightImage);
    }
    block.appendChild(verticalImageContainer);
    block.appendChild(topRightContainer);
    block.appendChild(bottomRightContainer);
    if (!isAEMUniversalEditor) {
        removeEmptyDivs(block);
    }
}
function removeEmptyDivs(container) {
    const divs = container.querySelectorAll('div');
    divs.forEach((div) => {
        const hasNoClasses = div.classList.length === 0;
        const hasNoId = !div.id;
        if (hasNoClasses && hasNoId) {
            div.remove();
        }
    });
}
