const blockName = 'gallery';
function hasClass(el) {
    return el.classList.length > 0;
}
export default function decorate(block) {
    const [galleryHeadline, galleryDescription] = Array.from(block.children);
    galleryHeadline.className = `${blockName}__intro`;
    galleryDescription.className = `${blockName}__description`;
    // manipulate the headline and description in DOM
    const headline = document.createElement('h3');
    headline.classList.add(`${blockName}__headline`);
    headline.textContent = galleryHeadline.firstElementChild.textContent;
    galleryHeadline.appendChild(headline);
    const text = document.createElement('p');
    text.classList.add(`${blockName}__description`);
    text.textContent = galleryDescription.firstElementChild.textContent;
    galleryHeadline.appendChild(text);
    // remove not needed (empty) divs
    galleryHeadline.firstElementChild.remove();
    galleryDescription.remove();
    const galleryCarousel = document.createElement('div');
    galleryCarousel.classList.add(`${blockName}__carousel`);
    block.appendChild(galleryCarousel);
    const isDesktop = window.innerWidth >= 1024;
    [...block.children].forEach((item) => {
        // manipulate gallery items
        if (!hasClass(item)) {
            item.className = `${blockName}__carousel-item`;
            const picdiv = item.children[0];
            const textdiv = item.children[1];
            const hrefdiv = item.children[2];
            picdiv.classList.add(`${blockName}__img`);
            const button = document.createElement('div');
            button.classList.add(`${blockName}__button`);
            const buttonText = document.createElement('a');
            buttonText.classList.add(`${blockName}__button-text`);
            buttonText.textContent = textdiv.textContent;
            const buttonArrow = document.createElement('a');
            buttonArrow.classList.add('button', 'primary', `${blockName}__button-arrow`);
            buttonText.href = hrefdiv.textContent || '';
            buttonArrow.href = hrefdiv.textContent || '';
            button.appendChild(buttonText);
            button.appendChild(buttonArrow);
            item.appendChild(button);
            if (isDesktop) {
                const itemLink = document.createElement('a');
                itemLink.href = hrefdiv.textContent || '';
                itemLink.classList.add(`${blockName}__item-link`);
                itemLink.appendChild(item);
                galleryCarousel.appendChild(itemLink);
            }
            else {
                galleryCarousel.appendChild(item);
            }
            textdiv.remove();
            hrefdiv.remove();
        }
    });
    const scrollSpeedMultiplier = 100;
    galleryCarousel.addEventListener('wheel', (event) => {
        const atEnd = galleryCarousel.scrollLeft + galleryCarousel.clientWidth >= galleryCarousel.scrollWidth;
        const atStart = galleryCarousel.scrollLeft <= 0;
        if ((event.deltaY > 0 && !atEnd) || (event.deltaY < 0 && !atStart)) {
            event.preventDefault();
            galleryCarousel.scrollLeft += event.deltaY * scrollSpeedMultiplier;
        }
    }, { passive: false });
}
