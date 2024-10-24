import { setCookie } from "../../scripts/funcs/storageUtils.js";
const blockName = 'navigation-menu';
let overlay = null;
export default async function attachNavigation(block) {
    const burgerIcon = block.querySelector('.header__burger-icon');
    const navigationMenu = await createNavigationMenu();
    const headerWrapper = document.querySelector('.header-wrapper');
    if (headerWrapper) {
        headerWrapper.insertAdjacentElement('afterend', navigationMenu);
    }
    burgerIcon === null || burgerIcon === void 0 ? void 0 : burgerIcon.addEventListener('click', () => {
        navigationMenu.style.display = 'block';
        overlay.style.display = 'block';
        navigationMenu.classList.add('navigation-menu--active');
        overlay.classList.add('navigation-menu__overlay--active');
        document.body.classList.add('no-scroll');
    });
    overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener('click', () => {
        navigationMenu.classList.remove('navigation-menu--active');
        overlay.classList.remove('navigation-menu__overlay--active');
        document.body.classList.remove('no-scroll');
    });
    overlay === null || overlay === void 0 ? void 0 : overlay.addEventListener('transitionend', () => {
        if (overlay.classList.length === 1 && overlay.classList.contains('navigation-menu__overlay')) {
            overlay.style.display = 'none';
        }
    });
}
const createGetInTouch = async () => {
    const getInTouch = document.createElement('div');
    getInTouch.className = `${blockName}__get-in-touch`;
    const mailElement = document.createElement('div');
    const svgElement = await generateSVG(getIconPath('message', 'header'));
    const getInTouchText = document.createElement('h3');
    getInTouchText.textContent = 'Get in touch';
    if (svgElement) {
        mailElement.appendChild(svgElement);
    }
    getInTouch.appendChild(mailElement);
    getInTouch.appendChild(getInTouchText);
    return getInTouch;
};
const generateSocialIcons = async () => {
    const socialIcons = document.createElement('ul');
    socialIcons.className = `${blockName}__social-icons`;
    const iconsSrc = ["facebook", "linkedin", "instagram"];
    for (const icon of iconsSrc) {
        const li = document.createElement('li');
        li.className = `social-icon__${icon}`;
        const svgElement = await generateSVG(getIconPath(icon, 'social-icons'));
        if (svgElement) {
            li.appendChild(svgElement);
            socialIcons.appendChild(li);
        }
    }
    return socialIcons;
};
async function createNavigationMenu() {
    const menu = document.createElement('div');
    menu.className = `${blockName}`;
    overlay = document.createElement('div');
    overlay.className = `${blockName}__overlay`;
    document.body.appendChild(overlay);
    const navigationItems = document.createElement('div');
    navigationItems.className = `${blockName}__items`;
    const topText = document.createElement('h3');
    topText.className = `${blockName}__top-text`;
    topText.textContent = 'Menu';
    const socialBottomText = document.createElement('h3');
    socialBottomText.className = `${blockName}__social-bottom-text`;
    socialBottomText.textContent = 'Social';
    menu.appendChild(await topItems());
    menu.appendChild(topText);
    menu.appendChild(attachMenuItems());
    menu.appendChild(socialBottomText);
    menu.appendChild(await generateSocialIcons());
    menu.appendChild(await createGetInTouch());
    return menu;
}
const topItems = async () => {
    const iconsSrc = ["light", "search", "person", "close"];
    const menuList = document.createElement('ul');
    menuList.className = `${blockName}__top-items`;
    for (const icon of iconsSrc) {
        const li = document.createElement('li');
        li.className = `top-item__${icon}`;
        const svgElement = await generateSVG(getIconPath(icon, 'header'));
        if (svgElement) {
            li.appendChild(svgElement);
            if (icon === 'light') {
                const svgDark = await generateSVG(getIconPath("moon", 'header'));
                svgDark.classList.add('search-icon');
                li.appendChild(svgDark);
            }
        }
        if (icon === 'close') {
            li.addEventListener('click', () => {
                const navigationMenu = document.querySelector(`.${blockName}`);
                if (navigationMenu) {
                    navigationMenu.classList.remove('navigation-menu--active');
                    overlay.classList.remove('navigation-menu__overlay--active');
                    document.body.classList.remove('no-scroll');
                }
            });
        }
        if (icon === 'light') {
            const lightSwitch = document.querySelector('.top-item__light');
            const svgMoonElement = await generateSVG(getIconPath('moon', 'header'));
            if (svgMoonElement && lightSwitch) {
                lightSwitch.appendChild(svgMoonElement);
            }
            li.addEventListener('click', (event) => {
                event.stopPropagation();
                const themeIsBlack = document.body.classList.contains('dark-mode');
                if (themeIsBlack) {
                    document.body.classList.remove('dark-mode');
                    setCookie('theme', 'light-mode', 365);
                }
                else {
                    document.body.classList.add('dark-mode');
                    setCookie('theme', 'dark-mode', 365);
                }
            });
        }
        menuList.appendChild(li);
    }
    await attachLanguageDropdown(menuList);
    return menuList;
};
const attachLanguageDropdown = async (menu) => {
    const languageDropdown = document.createElement('div');
    languageDropdown.className = 'top-item__language-dropdown';
    languageDropdown.innerHTML = `<div class="top-item__language-dropdown__current">EN</div>
    <div class="top-item__language-dropdown__options">
<!--        <div class="top-item__language-dropdown__option">EN</div>-->
<!--        <div class="top-item__language-dropdown__option">FR</div>-->
    </div>`;
    const closeItem = menu.querySelector('li.top-item__close');
    const imgArrow = document.createElement('div');
    imgArrow.className = 'top-item__language-dropdown__arrow';
    const imgArrowSvg = await generateSVG(getIconPath('arrowdown', 'header'));
    if (imgArrowSvg) {
        imgArrow.appendChild(imgArrowSvg);
        languageDropdown.appendChild(imgArrowSvg);
        if (closeItem) {
            menu.insertBefore(languageDropdown, closeItem);
        }
    }
};
const getIconPath = (icon, folder) => {
    let path = `${window.hlx.codeBasePath}/icons`;
    if (folder) {
        path += `/${folder}`;
    }
    path += `/${icon}.svg`;
    return path;
};
const generateSVG = async (path) => {
    try {
        const response = await fetch(path);
        const svg = await response.text();
        const div = document.createElement('div');
        div.innerHTML = svg;
        return div.querySelector('svg');
    }
    catch (error) {
        console.error(`Error fetching SVG for icon ${path}:`, error);
        return null;
    }
};
const attachMenuItems = () => {
    const menuList = document.createElement('ul');
    menuList.className = `${blockName}__menu-items`;
    const menuItems = ["Services", "Industries", "Insights", "We are eggs"];
    menuItems.forEach(item => {
        const li = document.createElement('li');
        li.className = `${blockName}-menu__menu-item__${item.toLowerCase().replace(' ', '-')}`;
        li.textContent = item;
        menuList.appendChild(li);
    });
    return menuList;
};
