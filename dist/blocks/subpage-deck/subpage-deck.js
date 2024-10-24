import { generateCardDom } from "../../scripts/funcs/itemUtils.js";
import { isEmptyCard } from "../../scripts/funcs/itemUtils.js";
const blockName = 'subpage-deck';
export default async function decorate(block) {
    //create card dom
    [...block.children].forEach((item) => {
        if (!isEmptyCard(item)) {
            item.className = `${blockName}__card-item`;
            item.innerHTML = generateCardDom(Array.from(item.children), blockName);
        }
    });
    //add special class to first button for styling
    const cardCtaList = block.getElementsByClassName(`${blockName}__card-cta`);
    const firstCta = cardCtaList[0];
    firstCta.classList.add('hover');
    const cardDescriptionList = Array.from(block.getElementsByClassName(`${blockName}__card-description`));
    // TODO: Calling turnCateTextWithEllipsis only when component is visible, or after some time as it does nothing right now as there is no height set on the descriptions yet
    cardDescriptionList.forEach((item) => {
        truncateTextWithEllipsis(item);
    });
    // TODO: Adjust the height of the component in Author as vh is used in scss
}
//function to be called on the card descriptions to add Ellipsis
function truncateTextWithEllipsis(element) {
    let currentText = element.innerText;
    while (element.scrollHeight > element.clientHeight && currentText.length > 0) {
        currentText = currentText.slice(0, -1);
        element.innerText = currentText + '...';
    }
}
