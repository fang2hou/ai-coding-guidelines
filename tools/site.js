(function () {
  "use strict";

  var THEME_KEY = "theme";
  var themeOrder = ["auto", "light", "dark"];
  var root = document.documentElement;
  root.classList.add("js");
  var scheme = window.matchMedia("(prefers-color-scheme: dark)");

  function readPreference() {
    try {
      var stored = localStorage.getItem(THEME_KEY);
      return stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto";
    } catch {
      return "auto";
    }
  }

  var mode = readPreference();
  var refreshPageScroll = function () {};
  var refreshSidebar = function () {};
  var refreshTocSpy = function () {};

  function resolvedTheme() {
    if (mode === "auto") return scheme.matches ? "dark" : "light";
    return mode;
  }

  function applyTheme() {
    var theme = resolvedTheme();
    root.dataset.theme = theme;
    root.dataset.themeMode = mode;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#282828" : "#fbf1c7");
  }

  function syncThemeButtons() {
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      var suffix = mode.charAt(0).toUpperCase() + mode.slice(1);
      var stateLabel = button.dataset["label" + suffix];
      var prefix = button.dataset.labelTheme;
      button.dataset.mode = mode;
      if (stateLabel && prefix) {
        var label = prefix + ": " + stateLabel;
        button.setAttribute("aria-label", label);
        button.title = label;
      }
    }
  }

  function commitTheme() {
    applyTheme();
    syncThemeButtons();
  }

  function initThemeButtons() {
    syncThemeButtons();
    var buttons = document.querySelectorAll(".theme-toggle");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        var next = (themeOrder.indexOf(mode) + 1) % themeOrder.length;
        mode = themeOrder[next];
        try {
          localStorage.setItem(THEME_KEY, mode);
        } catch {
          // Storage can be unavailable in private or file contexts.
        }
        commitTheme();
      });
    }
  }

  function initPageScroll() {
    var rail = document.querySelector(".page-scroll");
    var thumb = rail && rail.querySelector(".page-scroll-thumb");
    if (!rail || !thumb) return;
    var frame = 0;

    function update() {
      frame = 0;
      var max = root.scrollHeight - window.innerHeight;
      if (max <= 1) {
        rail.hidden = true;
        return;
      }
      rail.hidden = false;
      var height = Math.max(36, (window.innerHeight / root.scrollHeight) * window.innerHeight);
      var travel = window.innerHeight - height;
      var offset = (window.scrollY / max) * travel;
      thumb.style.height = height + "px";
      thumb.style.transform = "translateY(" + offset + "px)";
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    window.addEventListener("load", update);
    refreshPageScroll = schedule;
  }

  function initSidebar() {
    var shell = document.querySelector(".sidebar-shell");
    var aside = document.querySelector(".sidebar");
    if (!shell || !aside) return;
    var frame = 0;

    function update() {
      frame = 0;
      shell.classList.toggle("can-scroll-up", aside.scrollTop > 4);
      shell.classList.toggle(
        "can-scroll-down",
        aside.scrollTop + aside.clientHeight < aside.scrollHeight - 4,
      );
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    aside.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", update);
    var toggle = document.querySelector("#nav-toggle");
    if (toggle)
      toggle.addEventListener("change", function () {
        window.setTimeout(update, 0);
      });
    update();
    refreshSidebar = update;
  }

  function absoluteHref(href, base) {
    try {
      return new URL(href, base).href;
    } catch {
      return href;
    }
  }

  function copyAttribute(next, selector, attribute) {
    var current = document.querySelector(selector);
    var replacement = next.querySelector(selector);
    if (current && replacement && replacement.hasAttribute(attribute)) {
      current.setAttribute(attribute, replacement.getAttribute(attribute));
    }
  }

  function updateHead(next) {
    document.title = next.title;
    var metaSelectors = [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[property="og:locale"]',
    ];
    for (var i = 0; i < metaSelectors.length; i++) {
      var current = document.querySelector(metaSelectors[i]);
      var replacement = next.querySelector(metaSelectors[i]);
      if (current && replacement) {
        current.setAttribute("content", replacement.getAttribute("content") || "");
      }
    }
    var currentCanonical = document.querySelector('link[rel="canonical"]');
    var nextCanonical = next.querySelector('link[rel="canonical"]');
    if (currentCanonical && nextCanonical) {
      currentCanonical.setAttribute("href", nextCanonical.getAttribute("href") || "");
    }
    var oldAlternates = document.querySelectorAll('link[rel="alternate"]');
    for (var j = 0; j < oldAlternates.length; j++) oldAlternates[j].remove();
    var freshAlternates = next.querySelectorAll('link[rel="alternate"]');
    for (var k = 0; k < freshAlternates.length; k++) {
      document.head.appendChild(freshAlternates[k].cloneNode(true));
    }
  }

  function updateHeader(next, targetUrl) {
    root.lang = next.documentElement.lang;

    var currentTitle = document.querySelector(".site-title");
    var nextTitle = next.querySelector(".site-title");
    if (currentTitle && nextTitle) {
      currentTitle.setAttribute("href", absoluteHref(nextTitle.getAttribute("href"), targetUrl));
      currentTitle.setAttribute("aria-label", nextTitle.getAttribute("aria-label") || "");
      var currentText = currentTitle.querySelector(".site-title-text");
      var nextText = nextTitle.querySelector(".site-title-text");
      if (currentText && nextText) currentText.textContent = nextText.textContent;
    }

    var currentLangNav = document.querySelector(".lang-nav");
    var nextLangNav = next.querySelector(".lang-nav");
    if (currentLangNav && nextLangNav) {
      currentLangNav.setAttribute("aria-label", nextLangNav.getAttribute("aria-label") || "");
      var currentLinks = currentLangNav.querySelectorAll("a");
      var nextLinks = nextLangNav.querySelectorAll("a");
      for (var i = 0; i < currentLinks.length; i++) {
        var currentLink = currentLinks[i];
        var nextLink = nextLinks[i];
        if (!nextLink) continue;
        currentLink.setAttribute("href", absoluteHref(nextLink.getAttribute("href"), targetUrl));
      }
    }

    var currentTheme = document.querySelector(".theme-toggle");
    var nextTheme = next.querySelector(".theme-toggle");
    if (currentTheme && nextTheme) {
      var themeAttributes = [
        "data-label-theme",
        "data-label-auto",
        "data-label-light",
        "data-label-dark",
      ];
      for (var j = 0; j < themeAttributes.length; j++) {
        var value = nextTheme.getAttribute(themeAttributes[j]);
        if (value !== null) currentTheme.setAttribute(themeAttributes[j], value);
      }
    }

    copyAttribute(next, ".nav-toggle-label", "aria-label");
    copyAttribute(next, "#nav-toggle", "aria-label");
    copyAttribute(next, ".repo-link", "aria-label");

    var currentSkip = document.querySelector(".skip-link");
    var nextSkip = next.querySelector(".skip-link");
    if (currentSkip && nextSkip) currentSkip.textContent = nextSkip.textContent;

    syncThemeButtons();
  }

  function updateLangCurrent(next) {
    var currentLangNav = document.querySelector(".lang-nav");
    var nextLangNav = next.querySelector(".lang-nav");
    if (!currentLangNav || !nextLangNav) return;
    var currentLinks = currentLangNav.querySelectorAll("a");
    var nextLinks = nextLangNav.querySelectorAll("a");
    for (var i = 0; i < currentLinks.length; i++) {
      var currentLink = currentLinks[i];
      var nextLink = nextLinks[i];
      if (!nextLink) continue;
      currentLink.classList.toggle("current", nextLink.classList.contains("current"));
      if (nextLink.hasAttribute("aria-current")) {
        currentLink.setAttribute("aria-current", nextLink.getAttribute("aria-current"));
      } else {
        currentLink.removeAttribute("aria-current");
      }
    }
  }

  function updateSidebar(next) {
    var current = document.querySelector(".sidebar");
    var replacement = next.querySelector(".sidebar");
    if (!current || !replacement) return;
    var top = current.scrollTop;
    current.innerHTML = replacement.innerHTML;
    current.scrollTop = top;
  }

  function updateContent(next) {
    var currentMain = document.querySelector(".main");
    var replacementMain = next.querySelector(".main");
    if (!currentMain || !replacementMain) return false;
    currentMain.innerHTML = replacementMain.innerHTML;

    var layout = document.querySelector(".layout");
    var nextLayout = next.querySelector(".layout");
    if (layout && nextLayout) layout.className = nextLayout.className;

    var currentToc = document.querySelector(".page-toc");
    var nextToc = next.querySelector(".page-toc");
    if (nextToc) {
      if (currentToc) currentToc.replaceWith(nextToc);
      else if (layout) layout.appendChild(nextToc);
    } else if (currentToc) {
      currentToc.remove();
    }
    return true;
  }

  function scrollToTarget(targetUrl) {
    if (targetUrl.hash) {
      var id = decodeURIComponent(targetUrl.hash.slice(1));
      var target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  var navigationController = null;
  var currentPath = window.location.pathname + window.location.search;

  function navigate(targetUrl, push) {
    if (navigationController) navigationController.abort();
    navigationController = typeof AbortController === "function" ? new AbortController() : null;
    var signal = navigationController ? navigationController.signal : undefined;

    fetch(targetUrl.href, { credentials: "same-origin", signal: signal })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.text();
      })
      .then(function (html) {
        var next = new DOMParser().parseFromString(html, "text/html");
        if (!next.querySelector(".main") || !next.querySelector(".sidebar-shell")) {
          window.location.assign(targetUrl.href);
          return;
        }

        function swap() {
          updateHead(next);
          updateHeader(next, targetUrl.href);
          updateSidebar(next);
          if (!updateContent(next)) {
            window.location.assign(targetUrl.href);
            return;
          }
          if (push) history.pushState({ partial: true }, "", targetUrl.href);
          currentPath = targetUrl.pathname + targetUrl.search;
          scrollToTarget(targetUrl);
          refreshPageScroll();
          refreshSidebar();
          refreshTocSpy();
          updateLangCurrent(next);
        }

        swap();
      })
      .catch(function (error) {
        if (error && error.name === "AbortError") return;
        window.location.assign(targetUrl.href);
      });
  }

  function handleClick(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    var link = event.target.closest ? event.target.closest("a[href]") : null;
    if (!link || link.target || link.hasAttribute("download")) return;

    var target;
    try {
      target = new URL(link.href, window.location.href);
    } catch {
      return;
    }
    if (target.origin !== window.location.origin) return;
    if (target.pathname === window.location.pathname && target.search === window.location.search) {
      if (target.hash) {
        var heading;
        try {
          heading = document.getElementById(decodeURIComponent(target.hash.slice(1)));
        } catch {
          return;
        }
        if (heading) {
          event.preventDefault();
          if (navigationController) navigationController.abort();
          if (target.href !== window.location.href) history.pushState(null, "", target.href);
          heading.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
            block: "start",
          });
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
      }
      return;
    }
    if (target.pathname === "/") return;
    if (!target.pathname.endsWith(".html") && !target.pathname.endsWith("/")) return;

    event.preventDefault();
    navigate(target, true);
  }

  function initTocSpy() {
    var headings = [];
    var links = [];
    var frame = 0;

    function collect() {
      headings = Array.prototype.slice.call(document.querySelectorAll(".doc h2[id]"));
      links = Array.prototype.slice.call(
        document.querySelectorAll(".toc-inner a[href^='#'], .page-toc-inline a[href^='#']"),
      );
    }

    function update() {
      frame = 0;
      if (headings.length === 0) {
        for (var i = 0; i < links.length; i++) {
          links[i].classList.remove("is-active");
          links[i].removeAttribute("aria-current");
        }
        return;
      }
      var header = document.querySelector(".site-header");
      var offset = (header ? header.getBoundingClientRect().height : 0) + 24;
      var probe = window.scrollY + offset;
      var current = null;
      for (var j = 0; j < headings.length; j++) {
        var top = headings[j].getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = headings[j];
      }
      if (!current) current = headings[0];
      if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
        current = headings[headings.length - 1];
      }
      for (var k = 0; k < links.length; k++) {
        var active = !!current && links[k].getAttribute("href") === "#" + current.id;
        links[k].classList.toggle("is-active", active);
        if (active) links[k].setAttribute("aria-current", "location");
        else links[k].removeAttribute("aria-current");
      }
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    function refresh() {
      collect();
      schedule();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    refreshTocSpy = refresh;
    refresh();
  }

  function initNavigation() {
    if (!document.querySelector(".main")) return;
    if (!window.fetch || !window.history || !window.DOMParser) return;
    document.addEventListener("click", handleClick);
    window.addEventListener("popstate", function () {
      var target = new URL(window.location.href);
      if (target.pathname + target.search === currentPath) {
        if (navigationController) navigationController.abort();
        return;
      }
      if (target.origin === window.location.origin) navigate(target, false);
    });
  }

  applyTheme();
  if (scheme.addEventListener)
    scheme.addEventListener("change", function () {
      if (mode === "auto") applyTheme();
    });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initThemeButtons();
      initPageScroll();
      initSidebar();
      initTocSpy();
      initNavigation();
    });
  } else {
    initThemeButtons();
    initPageScroll();
    initSidebar();
    initTocSpy();
    initNavigation();
  }
})();
