import { loadFragment } from '../blocks/fragment/fragment.js';
import { getMetadata } from './aem.js';
async function loadAndParseFragment(url, classes) {
    const contentStore = document.createElement('navstore');
    const navMeta = getMetadata(url.slice(1));
    const navPath = navMeta ? new URL(navMeta).pathname : url;
    const fragment = await loadFragment(navPath);
    while (fragment.firstElementChild) {
        contentStore.appendChild(fragment.firstElementChild);
    }
    classes.forEach((className, index) => {
        const section = contentStore.children[index];
        if (section)
            section.classList.add(`nav-${className}`);
    });
    return contentStore;
}
export default loadAndParseFragment;
