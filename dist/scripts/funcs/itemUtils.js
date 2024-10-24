/**
 * Generates the DOM structure for a card element based on provided elements and block name.
 *
 * @param elements - An array containing the elements for image, darkImage, title, description, button, and link.
 * @param blockName - The name of the block to be used as a BEM modifier.
 * @returns A string representing the HTML structure of the card.
 */
function generateCardDom(elements, blockName) {
    const [image, darkImage, title, description, button, link] = elements;
    const buttonLink = document.createElement('a');
    if (link && link.textContent.trim() !== '') {
        buttonLink.classList.add('button', 'primary', `${blockName}__card-cta`);
        buttonLink.href = link.textContent.trim() !== '' ? link.textContent : '#';
        buttonLink.textContent = button.textContent.trim() !== '' ? button.textContent : 'Read more';
    }
    if (blockName.match('case-study')) {
        const darkImageHtml = darkImage ? `<div class="${blockName}__card-image--dark">${darkImage.innerHTML}</div>` : '';
        const imageHtml = image ? `<div class="${blockName}__card-image">${image.innerHTML}</div>` : '';
        return `
          ${imageHtml}
          ${darkImageHtml}
          <div class="${blockName}__card-body">
            ${title ? `<h3 class="${blockName}__card-title">${title.textContent}</h3>` : ''}
            ${description ? `<p class="${blockName}__card-description">${description.innerHTML}</p>` : ''}
            ${buttonLink.outerHTML ? buttonLink.outerHTML : ''}
          </div>
        `;
    }
    if (blockName.match('subpage-deck')) {
        return `
        <h3 class='${blockName}__card-title'>
            ${title ? title.textContent : ''}
        </h3>
        <div class='${blockName}__card-image'>
          ${image ? image.innerHTML : ''}
        </div>
        <div class='${blockName}__card-description'>
          ${description ? description.innerHTML : ''}
        </div>
        <div class='${blockName}__card-button'>
            ${buttonLink.outerHTML || ''}
        </div>
        `;
    }
    else {
        return `
        <div class='${blockName}__card-image'>
          ${image ? image.innerHTML : ''}
        </div>
        <div class='${blockName}__card-body'>
          ${title ? `<h3 class='${blockName}__card-title'>${title.textContent}</h3>` : ''}
          ${description ? `<p class='${blockName}__card-description'>${description.innerHTML}</p>` : ''}
          ${buttonLink.outerHTML ? buttonLink.outerHTML : ''}
        </div>
        `;
    }
}
//check if all child elements inside the card are empty
function isEmptyCard(card) {
    return Array.from(card.children).every(child => child.innerHTML.trim() === '');
}
export { generateCardDom, isEmptyCard };
