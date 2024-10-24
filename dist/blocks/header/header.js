import attachNavigation from './navigation.js';
const blockName = 'header';
export default async function decorate(block) {
    const fragment = await loadFragment('/header');
    const fragmentHeaderData = fragment.querySelector(`.${blockName}`);
    const headerBlock = document.querySelector(`.${blockName}.block`);
    const logoLink = fragmentHeaderData.children[0].textContent;
    const logo = fragmentHeaderData.getElementsByTagName('img')[0].src;
    headerBlock.innerHTML = logoContainer(logo, logoLink);
    const videoTextHeroIsPresent = document.getElementsByClassName('video-text-hero').length != 0;
    if (videoTextHeroIsPresent) {
        headerBlock.classList.add('header--transparent');
    }
    headerBlock.innerHTML += prepareTheBurger();
    await attachNavigation(block);
}
async function loadFragment(path) {
    if (path && path.startsWith('/')) {
        const response = await fetch(`${path}.plain.html`);
        if (response.ok) {
            const main = document.createElement('main');
            main.innerHTML = await response.text();
            // Reset base path for media to fragment base
            const resetAttributeBase = (tag, attr) => {
                main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((element) => {
                    const originalAttribute = element.getAttribute(attr);
                    if (originalAttribute) {
                        element[attr] = new URL(originalAttribute, new URL(path, window.location.href)).href;
                    }
                });
            };
            resetAttributeBase('img', 'src');
            resetAttributeBase('source', 'srcset');
            return main;
        }
    }
    return null;
}
const prepareTheBurger = () => {
    return `<div class="${blockName}__burger-icon">
    <div class="${blockName}__line"></div>
    <div class="${blockName}__line"></div>
    <div class="${blockName}__line"></div>
  </div>`;
};
const logoContainer = (logo, logoLink) => {
    return `<div class="${blockName}__logo-container">
        <a href="${logoLink}" class="${blockName}__logo-link">
            <img class="${blockName}__logo--img" src="${logo}" alt="Logo"/>
        </a>
          </div>`;
};
