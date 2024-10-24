import attachNavigation from './navigation';

const blockName = 'header';

export default async function decorate(block: HTMLElement): Promise<void> {
  const fragment: HTMLElement = await loadFragment('/header');
  const fragmentHeaderData: Element = fragment.querySelector(`.${blockName}`);
  const headerBlock: Element = document.querySelector(`.${blockName}.block`);
  const logoLink: string = fragmentHeaderData.children[0].textContent;
  const logo :string = fragmentHeaderData.getElementsByTagName('img')[0].src;

  headerBlock.innerHTML = logoContainer(logo, logoLink);

  const videoTextHeroIsPresent = document.getElementsByClassName('video-text-hero').length != 0;

  if(videoTextHeroIsPresent) {
    headerBlock.classList.add('header--transparent');
  }

  headerBlock.innerHTML += prepareTheBurger();
  await attachNavigation(block);

}


async function loadFragment(path: string): Promise<HTMLElement | null> {
  if (path && path.startsWith('/')) {
    const response = await fetch(`${path}.plain.html`);
    if (response.ok) {
      const main = document.createElement('main');
      main.innerHTML = await response.text();

      // Reset base path for media to fragment base
      const resetAttributeBase = (tag: string, attr: string) => {
        main.querySelectorAll<HTMLElement>(`${tag}[${attr}^="./media_"]`).forEach((element) => {
          const originalAttribute:string = element.getAttribute(attr);
          if (originalAttribute) {
            element[attr] = new URL(originalAttribute, new URL(path, window.location.href)).href as never;
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

const prepareTheBurger = ():string =>{
  return `<div class="${blockName}__burger-icon">
    <div class="${blockName}__line"></div>
    <div class="${blockName}__line"></div>
    <div class="${blockName}__line"></div>
  </div>`;
}

const logoContainer = (logo:string, logoLink:string) : string => {
  return `<div class="${blockName}__logo-container">
        <a href="${logoLink}" class="${blockName}__logo-link">
            <img class="${blockName}__logo--img" src="${logo}" alt="Logo"/>
        </a>
          </div>`;
}
