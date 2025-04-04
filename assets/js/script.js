import { EnText, RuText } from './constant.js';
import { updateImages } from './image.js';
import {
  resetAnimation,
  setLanguage,
  initLanguage,
  checkLoaded,
  getLanguage,
} from './util.js';

const switchLanguageButton = document.getElementById('language-selector');
const html = document.querySelector('html');

const localizedText = {
  ru: {
    texts: RuText,
  },
  en: {
    texts: EnText,
  },
};

// Set media queries
const mqlMobile = window.matchMedia('(max-width: 800px)');
const mqlDefault = window.matchMedia('(min-width: 801px)');

// Set the loader element
const loader = document.querySelector('.loader');

// Set Language
/* html.lang = 'ru'; */
initLanguage(html);

const startLoadingTime = Date.now();
window.addEventListener('load', () => {
  checkLoaded(startLoadingTime, loader, true);
});

window.addEventListener('DOMContentLoaded', () => {
  updateDesign(mqlMobile.matches);
  booksAnimation();
});

switchLanguageButton.addEventListener('click', () => {
  loader.style.display = 'flex';

  // Change Language
  setLanguage(html);

  updateDesign(mqlMobile.matches).then((result) => {
    checkLoaded(result.timestamp, loader, true);
  });
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  booksAnimation();

  updateDesign(event.matches).then((result) => {
    checkLoaded(result.timestamp, loader, true);
  });

  /* loader.style.display = 'none'; */
});

mqlDefault.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  booksAnimation();

  updateDesign(event.matches).then((result) => {
    checkLoaded(result.timestamp, loader, true);
  });
});

/* Update Design */
async function updateDesign(isMobile = false) {
  try {
    // Get current language
    const currentLanguage = getLanguage();
    updateText(currentLanguage);

    const result = await updateImages(currentLanguage);

    if (!result.success) {
      console.warm(
        `Some images failed to load (${result.imagesLoaded}/${result.totalImages})`
      );
    }

    return result;
  } catch (error) {
    console.error('Failed to update images:', error);
    throw error;
  }
}

function updateText(language) {
  const textElements = document.querySelectorAll('.changeable-txt');
  //const deviceType = isMobile ? 'mobile' : 'default';
  const currentResource = localizedText[language].texts;

  // Update Text
  textElements.forEach((text, index) => {
    text.innerHTML = currentResource[index];
  });
}

function booksAnimation() {
  resetAnimation([{ selector: '.menu', animationClass: 'menu-active' }]);

  const footer = document.querySelector('.section-navbook');
  const books = document.querySelector('.menu');
  const booksObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          books.classList.add('menu-active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px',
      threshold: 0.6,
    }
  );

  booksObserver.observe(footer);
}
