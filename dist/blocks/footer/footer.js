const blockName = 'eggs-footer';
function createListItem({ href, text, className }) {
    const listItemElement = document.createElement('li');
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    if (className)
        anchorElement.className = className;
    if (text)
        anchorElement.textContent = text;
    listItemElement.appendChild(anchorElement);
    return listItemElement;
}
async function fetchAndProcessData(url, callback) {
    try {
        const response = await fetch(url);
        const links = [];
        if (response.ok) {
            const json = await response.json();
            for (const entry of json.data) {
                links.push(callback(entry));
            }
        }
        return links;
    }
    catch (error) {
        console.error(`Failed to fetch data from ${url}:`, error);
        return [];
    }
}
export default async function decorate(block) {
    block.textContent = '';
    const footer = document.createElement('div');
    footer.className = `${blockName}`;
    const socialLinks = await fetchAndProcessData('/social-media-icons.json', (entry) => {
        const cssClass = entry.Text.includes('Facebook') ? `${blockName}__social-item--facebook` : entry.Text.includes('Instagram') ? `${blockName}__social-item--instagram` : `${blockName}__social-item--linkedin`;
        return { href: entry.Link, className: cssClass };
    });
    const menuLinks = await fetchAndProcessData('/menu-links.json', (entry) => {
        const href = entry.Link.startsWith('https://') ? entry.Link : 'http://' + entry.Link;
        return { href: href, text: entry.Text };
    });
    const imprintLinks = await fetchAndProcessData('/imprint-links.json', (entry) => {
        const href = entry.Link.startsWith('https://') ? entry.Link : 'http://' + entry.Link;
        return { href: href, text: entry.Text };
    });
    const footerContent = document.createElement('div');
    footerContent.className = `${blockName}__content`;
    footer.appendChild(footerContent);
    const footerLegal = document.createElement('div');
    footerLegal.className = `${blockName}__legal`;
    footer.appendChild(footerLegal);
    const ulSocial = document.createElement('ul');
    ulSocial.className = `${blockName}__social-list`;
    socialLinks.map(createListItem).forEach(li => ulSocial.appendChild(li));
    footerContent.appendChild(ulSocial);
    const footerText = document.createElement('h3');
    footerText.className = `${blockName}__text`;
    footerText.textContent = 'Unleash Digital Eggscellence - Your Journey, Our Expertise. Together, We Shine';
    footerContent.appendChild(footerText);
    const footerNav = document.createElement('div');
    footerNav.className = `${blockName}__nav`;
    footerContent.appendChild(footerNav);
    const footerHeadline = document.createElement('h4');
    footerHeadline.className = `${blockName}__nav-headline`;
    footerHeadline.textContent = 'Get started';
    footerNav.appendChild(footerHeadline);
    const ulNav = document.createElement('ul');
    ulNav.className = `${blockName}__nav-links`;
    menuLinks.map(createListItem).forEach(li => ulNav.appendChild(li));
    footerNav.appendChild(ulNav);
    const ulImprint = document.createElement('ul');
    ulImprint.className = `${blockName}__nav-imprint`;
    imprintLinks.map(createListItem).forEach(li => ulImprint.appendChild(li));
    footerLegal.appendChild(ulImprint);
    const divCopyright = document.createElement('div');
    divCopyright.className = `${blockName}__copyright`;
    divCopyright.textContent = '©2024 eggs unimedia';
    footerLegal.appendChild(divCopyright);
    block.append(footer);
}
