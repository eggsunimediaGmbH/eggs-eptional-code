import { generateCardDom } from "../../scripts/funcs/itemUtils";
import {observeElement} from './../../scripts/aem';
export default function decorate(block: HTMLElement): void {

    const blockName = 'case-study';

    if (block) {
        const childrenArray = Array.from(block.children);

        // Wrap every 3 children into a "row"
        for (let i = 0; i < childrenArray.length; i += 3) {
            const row = document.createElement('div');
            row.classList.add(`${blockName}__row`);

            // Grab the next 3 children and add them to the row
            childrenArray.slice(i, i + 3).forEach(child => {
                child.classList.add(`${blockName}__card-container`);
                child.innerHTML = generateCardDom(Array.from(child.children), blockName);
                row.appendChild(child);
            });

            // Append the row back to the block
            block.appendChild(row);
        }
    }
}

function equalizeHeights(element: HTMLElement) {
    console.log("Calling equalizer");

    // Select both descriptions and titles
    const descriptions = element.querySelectorAll('.case-study__card-description') as NodeListOf<HTMLElement>;
    const titles = element.querySelectorAll('.case-study__card-title') as NodeListOf<HTMLElement>;

    if (descriptions.length === 0 && titles.length === 0) {
        console.error('No descriptions or titles found!');
        return;
    }

    // Reset heights
    descriptions.forEach(description => {
        description.style.height = '100%';
    });

    titles.forEach(title => {
        title.style.height = '100%';
    });

    requestAnimationFrame(() => {
        if (document.body.classList.contains('desktop')) {
            let maxDescriptionHeight = 0;
            let maxTitleHeight = 0;

            // Find the tallest description
            descriptions.forEach(description => {
                const height = description.offsetHeight;
                if (height > maxDescriptionHeight) {
                    maxDescriptionHeight = height;
                }
            });

            // Find the tallest title
            titles.forEach(title => {
                const height = title.offsetHeight;
                if (height > maxTitleHeight) {
                    maxTitleHeight = height;
                }
            });

            // Set the height for all descriptions to the tallest height
            descriptions.forEach(description => {
                description.style.height = `${maxDescriptionHeight}px`;
                console.log("Setting:", maxDescriptionHeight);
            });

            // Set the height for all titles to the tallest height
            titles.forEach(title => {
                title.style.height = `${maxTitleHeight}px`;
            });
        }
    });
}


observeElement('.case-study.block', function(element: HTMLElement) {
    equalizeHeights(element);

});
