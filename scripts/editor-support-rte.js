/* eslint-disable no-console */
/* eslint-disable no-cond-assign */
/* eslint-disable import/prefer-default-export */

// group editable texts in single wrappers if applicable.
// this script should execute after script.js but before the the universal editor cors script
// and any block being loaded

export function decorateRichtext(container = document) {
  console.log("CONTAINER IS:", container);
  function deleteInstrumentation(element) {
    delete element.dataset.richtextResource;
    delete element.dataset.richtextProp;
    delete element.dataset.richtextFilter;
    delete element.dataset.richtextLabel;
  }

  let element;
  while (element = container.querySelector('[data-richtext-prop]:not(div)')) {
    const {
      richtextResource,
      richtextProp,
      richtextFilter,
      richtextLabel,
    } = element.dataset;
    deleteInstrumentation(element);
    const siblings = [];
    let sibling = element;
    while (sibling = sibling.nextElementSibling) {
      if (sibling.dataset.richtextResource === richtextResource
        && sibling.dataset.richtextProp === richtextProp) {
        deleteInstrumentation(sibling);
        siblings.push(sibling);
      } else break;
    }

    let orphanElements;
    if (richtextResource && richtextProp) {
      orphanElements = document.querySelectorAll(`[data-richtext-id="${richtextResource}"][data-richtext-prop="${richtextProp}"]`);
    } else {
      const editable = element.closest('[data-aue-resource]');
      if (editable) {
        orphanElements = editable.querySelectorAll(`:scope > :not([data-aue-resource]) [data-richtext-prop="${richtextProp}"]`);
      } else {
        console.warn(`Editable parent not found or richtext property ${richtextProp}`);
        return;
      }
    }

    if (orphanElements.length) {
      console.warn('Found orphan elements of a richtext, that were not consecutive siblings of '
        + 'the first paragraph', orphanElements);
      orphanElements.forEach((orphanElement) => deleteInstrumentation(orphanElement));
    } else {
      const group = document.createElement('div');
      if (richtextResource) {
        group.dataset.aueResource = richtextResource;
        group.dataset.aueBehavior = 'component';
      }
      if (richtextProp) group.dataset.aueProp = richtextProp;
      if (richtextLabel) group.dataset.aueLabel = richtextLabel;
      if (richtextFilter) group.dataset.aueFilter = richtextFilter;
      group.dataset.aueType = 'richtext';
      element.replaceWith(group);
      group.append(element, ...siblings);
    }
  }
}

// in cases where the block decoration is not done in one synchronous iteration we need to listen
// for new richtext-instrumented elements
const observer = new MutationObserver(() => decorateRichtext());
observer.observe(document, { attributeFilter: ['data-richtext-prop'], subtree: true });



(function() {
  // Ensure we're in the correct context
  if (window.parent && window.parent.document) {
    // Get the top-level document from the parent window
    const parentDocument = window.parent.document;

    // Create a MutationObserver to monitor changes
    const observerToolbar = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // Search for the toolbar in the parent document, including nested iframes
          const toolbars = findAllToolbars(parentDocument);

          toolbars.forEach(toolbar => {
            // Ensure the button isn't added multiple times
            if (!toolbar.querySelector('.yellow-button-class')) {
              const buttonHTML = yellowButton();

              // Convert the HTML string into a DOM element
              const tempDiv = parentDocument.createElement('div');
              tempDiv.innerHTML = buttonHTML;
              const buttonElement = tempDiv.firstElementChild;

              // Add a class to the button to avoid duplicates
              buttonElement.classList.add('yellow-button-class');

              // Append the new button to the toolbar
              toolbar.appendChild(buttonElement);

              // Attach the event listener to the button
              buttonElement.addEventListener('click', () => {
                const selection = toolbar.ownerDocument.getSelection();
                console.log("Button clicked in :");
                console.log("", buttonElement);
                if(selection){
                  console.log("Selection is:", selection);
                }else{
                  console.log("No selection :( ");
                }
                if (!selection.rangeCount) return;
                // Get the selected text range
                const range = selection.getRangeAt(0);

                // Create a new span element to wrap the selection
                const span = toolbar.ownerDocument.createElement('span');
                span.style.backgroundColor = 'yellow';

                // Wrap the selected text with the span element
                range.surroundContents(span);
              });
            }
          });
        }
      }
    });

    // Start observing the parent document for changes
    observerToolbar.observe(parentDocument.documentElement, { childList: true, subtree: true, attributes: true });

    // Function to find all instances of div.tox-toolbar__primary, including inside iframes
    function findAllToolbars(doc) {
      let toolbars = [...doc.querySelectorAll('div.tox-toolbar__primary')];

      // Check inside iframes
      const iframes = doc.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          toolbars = toolbars.concat(findAllToolbars(iframeDoc));
        } catch (e) {
          console.warn("Cross-origin iframe, cannot access:", iframe);
        }
      });

      return toolbars;
    }

  } else {
    console.error("Unable to access parent document.");
  }
})();


decorateRichtext();

const yellowButton = () => {
  return `<div title="" role="toolbar" data-alloy-tabstop="true" tabindex="-1" class="tox-toolbar__group">
            <button aria-label="YELLOW BUTTON" title="Yellow Button" type="button" tabindex="-1" class="tox-tbtn" aria-disabled="false" style="width: 32px;">
              <span class="tox-icon tox-tbtn__icon-wrap">
                <svg height="18" viewBox="0 0 48 48" width="18" focusable="false">
                  <path d="M20 38V10h10v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v7a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-5h10v28h-3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h10a8.3 8.3 0 0 1-1-4Z"></path>
                  <path d="M36 24.1A11.9 11.9 0 1 0 47.9 36 11.9 11.9 0 0 0 36 24.1ZM45 36a8.9 8.9 0 0 1-1.7 5.2L30.8 28.7A8.9 8.9 0 0 1 45 36Zm-18 0a8.9 8.9 0 0 1 1.7-5.2l12.5 12.5A8.9 8.9 0 0 1 27 36Z"></path>
                </svg>
              </span>
            </button>
          </div>`;
};

