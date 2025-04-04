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

  sideElementsAnimation();
  booksAnimation();
});

switchLanguageButton.addEventListener('click', () => {
  loader.style.display = 'flex';

  // Change Language
  setLanguage(html);

  updateDesign(mqlMobile.matches).then((result) => {
    checkLoaded(result.timestamp, loader);
  });

  sideElementsAnimation();
  booksAnimation();
});

mqlMobile.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  updateDesign(event.matches).then((result) => {
    checkLoaded(result.timestamp, loader);
  });

  sideElementsAnimation();
  booksAnimation();

  /* loader.style.display = 'none'; */
});

mqlDefault.addEventListener('change', (event) => {
  if (!event.matches) return;
  loader.style.display = 'flex';

  updateDesign(event.matches).then((result) => {
    checkLoaded(result.timestamp, loader);
  });

  sideElementsAnimation();
  booksAnimation();
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

function resetAnimationClass() {
  const brunch1 = document.querySelector('.brunch1-container');
  const brunch2 = document.querySelector('.brunch2-container');

  if (mqlMobile.matches) {
    brunch1.classList.remove('scroll-action-left');
    brunch1.classList.add('scroll-action');

    brunch2.classList.remove('scroll-action');
    brunch2.classList.add('scroll-action-left');

    return;
  }

  brunch1.classList.remove('scroll-action');
  brunch1.classList.add('scroll-action-left');

  brunch2.classList.remove('scroll-action-left');
  brunch2.classList.add('scroll-action');
}

function sideElementsAnimation() {
  resetAnimationClass();

  resetAnimation([
    { selector: '.scroll-action', animationClass: 'scroll-active-right' },
    { selector: '.scroll-action-left', animationClass: 'scroll-active-left' },
  ]);

  const elementsToAnimate = [
    { selector: '.scroll-action', side: 'right' },
    { selector: '.scroll-action-left', side: 'left' },
  ];

  elementsToAnimate.forEach(({ selector, side }) => {
    document.querySelectorAll(selector).forEach((item) => {
      initScrollAnimationObserver(item, side);
    });
  });
}

function initScrollAnimationObserver(item, side) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(`scroll-active-${side}`);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px',
      threshold: 0, // trigger when 0% of the element is visible
    }
  );

  observer.observe(item);
}
