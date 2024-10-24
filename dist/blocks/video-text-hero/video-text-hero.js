import { isVideoLink } from "../../scripts/video-support.js";
import { changeHeightAndPositionInEditor, createBackgroundImageWrapper, createParallaxTextContainer } from "../../scripts/funcs/storageUtils.js";
const blockName = 'video-text-hero';
let isVideo;
export default async function decorate(block) {
    changeHeightAndPositionInEditor(`.${blockName}-container`);
    changeHeightAndPositionInEditor(`.${blockName}`);
    const [backgroundImageWrapper, firstHeading] = Array.from(block.children);
    const textContainer = document.createElement('div');
    textContainer.classList.add(`${blockName}__content-container`);
    const firstTextContainer = createParallaxTextContainer(firstHeading, null, null, null, `${blockName}`, 'first-text-container');
    textContainer.appendChild(firstTextContainer);
    const backgroundImageContainer = document.createElement('div');
    backgroundImageContainer.classList.add(`${blockName}__parallax-container`);
    const videoUrl = block.querySelector('a');
    isVideo = videoUrl ? isVideoLink(videoUrl) : false;
    const backgroundImage = createBackgroundImageWrapper(backgroundImageWrapper, `${blockName}`, videoUrl, isVideo);
    backgroundImageContainer.appendChild(await backgroundImage);
    block.textContent = '';
    block.appendChild(textContainer);
    block.appendChild(backgroundImageContainer);
    changeHeightAndPositionInEditor(`.${blockName}-container`);
    changeHeightAndPositionInEditor(`.${blockName}`);
    changeHeightAndPositionInEditor(`.${blockName}__background-image--picture`);
}
