import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  updateBreakpoints,
  observeElement, setSectionsIndex
} from './aem.js';
const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 * @param attributes
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
      from,
      to,
      [...from.attributes]
          .map(({ nodeName }) => nodeName)
          .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = getLanguageFromUrl();
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  sampleRUM.enhance();

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
  import('./sidekick.js').then(({ initSidekick }) => initSidekick());
}

async function loadPage() {
  window.addEventListener('resize', updateBreakpoints);
  updateBreakpoints();

  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

observeElement('.header-wrapper', function(element) {
  setSectionsIndex(() => {
    const header = document.querySelector('.header-wrapper');
    let headerZIndex;

    if (header) {
      // Step 1: Get the computed z-index of the header
      const zIndexString = window.getComputedStyle(header).zIndex;
      headerZIndex = parseInt(zIndexString, 10);

      // Check if the z-index is a valid number
      if (isNaN(headerZIndex)) {
        console.error('Invalid z-index for header.');
        return;
      }

      console.log('Header Z Index after stylesheet is loaded:', headerZIndex);
    } else {
      console.error('Header element not found.');
      return;
    }

    // Step 2: Retrieve all div elements with the class 'section'
    const sectionDivs = document.querySelectorAll('div.section');

    if (sectionDivs.length > 0) {
      const firstSection = sectionDivs[0];

      // If the first section doesn't have 'parallax', set .header-wrapper position to relative
      if (!firstSection.classList.contains('parallax')) {
        header.style.position = 'relative';
      }

      // Adjust zIndex for sections (skip the first one if necessary)
      sectionDivs.forEach((div, index) => {
        if (index > 0) {
          div.style.zIndex = (headerZIndex + 1).toString();
        }
      });
    } else {
      console.error('No section elements found.');
    }
  });
});

function getLanguageFromUrl() {
  const url = window.location.pathname;
  const languageCode = url.split('/')[2];
  const validLanguageCodes = ['de', 'en'];

  if (validLanguageCodes.includes(languageCode)) {
    return languageCode;
  } else {
    return "de";
  }
}

loadPage();
