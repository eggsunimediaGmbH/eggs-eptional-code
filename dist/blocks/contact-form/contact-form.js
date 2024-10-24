const blockName = 'contact-form';
export default async function decorate(block) {
    const contactForm = document.querySelector('.contact-form');
    const [contactFormHeadline, contactFormText, contactFormLink] = Array.from(block.children);
    const newHeadlineElement = document.createElement('h3');
    newHeadlineElement.textContent = contactFormHeadline.textContent;
    contactFormHeadline.replaceWith(newHeadlineElement);
    contactFormHeadline.classList.add(`${blockName}__headline`);
    const newTextElement = document.createElement('div');
    newTextElement.innerHTML = contactFormText.innerHTML;
    contactFormText.replaceWith(newTextElement);
    newTextElement.classList.add(`${blockName}__text`);
    const newEmailInputElement = document.createElement('input');
    newEmailInputElement.type = 'email';
    newEmailInputElement.placeholder = 'E-mail';
    newEmailInputElement.className = `${blockName}__email`;
    contactForm.appendChild(newEmailInputElement);
    const newButtonContainer = document.createElement('p');
    newButtonContainer.className = 'button-container';
    const newButtonElementLink = document.createElement('a');
    newButtonElementLink.href = contactFormLink.textContent;
    newButtonElementLink.classList.add('button');
    newButtonElementLink.classList.add('primary');
    newButtonElementLink.classList.add(`${blockName}__button`);
    newButtonElementLink.textContent = 'Subscribe';
    newButtonContainer.appendChild(newButtonElementLink);
    contactFormLink.replaceWith(newButtonContainer);
    contactForm.appendChild(newButtonContainer);
}
