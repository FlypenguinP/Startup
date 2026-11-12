/**
 * Entry point. Loaded as a module, so it runs after the DOM is parsed.
 */
import { initAxis } from "./modules/axis.js";
import { initNavSpy, initDock, initCopyEmail, initRuler, initMobileNav } from "./modules/page.js";

initAxis();
initNavSpy();
initMobileNav();
initDock();
initCopyEmail();
initRuler();
