export default function decorate(block: HTMLElement): void {

  const createNewUl = () => {
    const ul = document.createElement('ul');
    ul.classList.add('cards-row');
    return ul;
  };

  let ul = createNewUl();
  let liCount = 0;

  Array.from(block.children).forEach((row) => {
    if (row.children.length === 0 && row.textContent.trim() === '') {
      return;
    }

    const li = document.createElement('li');

    while (row.firstElementChild) {
      const child = row.firstElementChild;
      if (child.textContent.trim() !== '' || child.children.length > 0) {
        li.append(child);
      } else {
        row.removeChild(child);
      }
    }

    if (li.children.length > 0) {
      li.innerHTML = generateCardDom(Array.from(li.children));
      ul.append(li);
      liCount++;
    }

    if (liCount === 3) {
      block.append(ul);
      ul = createNewUl();
      liCount = 0;
    }
  });

  if (ul.children.length > 0) {
    block.append(ul);
  }

  Array.from(block.children).forEach((child) => {
    if (child.tagName.toLowerCase() !== 'ul' && child.textContent.trim() === '') {
      block.removeChild(child);
    }
  });
}

function generateCardDom(elements): string {
  const [image, title, description, cta] = elements;
  const button = document.createElement('a');
  button.classList.add('button', 'primary', 'cards-card-body__cta');
  button.href = cta ? cta.textContent : '#';
  button.textContent = 'Read more';

  return `
    <div class='cards-card-image'>
      ${image ? image.outerHTML : ''}
    </div>
    <div class='cards-card-body'>
      ${title ? `<div class='cards-card-body__title'>${title.textContent}</div>` : ''}
      ${description ? `<div class='cards-card-body__description'>${description.textContent}</div>` : ''}
      ${cta ? button.outerHTML : ''}
    </div>
  `;
}
