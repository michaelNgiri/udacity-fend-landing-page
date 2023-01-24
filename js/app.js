(function(global) {
  const pageSections = Array.from(
    document.querySelectorAll("section[data-nav]")
  );
  const navItemsContainer = document.querySelector("#navbar-list");
  const navAnchors = navItemsContainer.getElementsByTagName("a");
  let clickActive = false;


  const removeClass = (klass, elems) => {
    Array.from(elems).forEach(elem => elem.classList.remove(klass));
  };

  /* 
    Event handlers
   =======================================
  */

  const handleScroll = () => {
    /* 
      Do not run scroll handler when user is navigating by clicking
      through nav sections. This is to prevent janky transitions
      on the nav anchors
    */
    if (clickActive) return;

    const activePageSection = pageSections.find(section => {
      const lowerRange = section.offsetTop;
      const upperRange = section.offsetTop + section.offsetHeight;
      const scrollPos = global.pageYOffset + 250;

      return scrollPos >= lowerRange && scrollPos <= upperRange;
    });
    let activeNavAnchor;

    removeClass("active-section", pageSections);
    removeClass("active", navAnchors);

    if (activePageSection) {
      activeNavAnchor = Array.from(navAnchors).find(
        anchor => anchor.getAttribute("href").slice(1) === activePageSection.id
      );

      activePageSection.classList.add("active-section");
      activeNavAnchor.classList.add("active");
    }
  };

  // this listens for and handles click events
  const handleClick = e => {
    e.preventDefault();
    clickActive = true;
    const targetElem = e.target;

    if (targetElem.nodeName === "A") {
      const target = targetElem.getAttribute("href").slice(1);
      const requestedPageSection = pageSections.find(
        section => section.id === target
      );

      removeClass("active-section", pageSections);
      removeClass("active", navAnchors);

      targetElem.classList.add("active");
      requestedPageSection.scrollIntoView({ behavior: "smooth" });
      requestedPageSection.classList.add("active-section");

      setTimeout(() => (clickActive = !clickActive), 2000);
    }
  };


  // dynamically create menu items
  const buildNavigationMenu = () => {
    const navItemsFragment = document.createDocumentFragment();

    pageSections.forEach(section => {
      const navItem = document.createElement("li");
      const linkItem = document.createElement("a");
      const sectionId = section.id;

      linkItem.textContent = section.dataset.nav;
      linkItem.classList.add("menu-link");
      linkItem.setAttribute("href", `#${sectionId}`);

      navItem.append(linkItem);
      navItemsFragment.append(navItem);
    });

    navItemsContainer.append(navItemsFragment);
  };

  const attachEventListeners = () => {
    navItemsContainer.addEventListener("click", handleClick);
    global.addEventListener("scroll", handleScroll);
  };

  /* 
    Initialize main functions
    =======================================
  */

  buildNavigationMenu();
  attachEventListeners();
})(window);
