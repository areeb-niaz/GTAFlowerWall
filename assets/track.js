/* ──────────────────────────────────────────────────────────
   Conversion tracking for GA4 (G-F6WPLRNJF5).

   Loaded in the <head> of every page, right after the gtag
   snippet, so window.gfwTrack exists before any page script
   runs. Everything here is delegated off `document`, so it
   picks up links and forms wherever they sit in the markup.

   Events sent from this file:
     phone_click          tap on any tel: link
     email_click          click on any mailto: link
     cta_click            click on any link pointing at #book
     booking_form_start   first time someone touches the form
     faq_open             an FAQ question is expanded

   The booking form fires generate_lead and booking_form_error
   from the page script, where the submit result is known.
────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  function send(name, params) {
    if (typeof window.gtag !== 'function') { return; }
    window.gtag('event', name, params || {});
  }

  // Page scripts call this for events only they can see.
  window.gfwTrack = send;

  /* Which part of the page a link sits in, so the reports can
     tell the header call button from the footer one. */
  function area(el) {
    var host = el.closest('[data-track-area], section[id], header, footer');
    if (!host) { return 'page'; }
    if (host.hasAttribute('data-track-area')) { return host.getAttribute('data-track-area'); }
    if (host.id) { return host.id; }
    return host.tagName.toLowerCase();
  }

  function label(el) {
    return (el.textContent || '').trim().slice(0, 60);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) { return; }
    var href = a.getAttribute('href') || '';

    if (href.indexOf('tel:') === 0) {
      send('phone_click', { link_area: area(a), link_text: label(a) });
    } else if (href.indexOf('mailto:') === 0) {
      send('email_click', { link_area: area(a), link_text: label(a) });
    } else if (href === '#book' || href.indexOf('#book') === href.length - 5) {
      send('cta_click', { link_area: area(a), link_text: label(a) });
    }
  });

  /* First touch of the booking form. Fires once per page view —
     the signal is "started filling it in", not every keystroke. */
  var started = false;
  document.addEventListener('focusin', function (e) {
    if (started || !e.target.closest) { return; }
    if (!e.target.closest('#bookingForm')) { return; }
    started = true;
    send('booking_form_start', {});
  });

  /* `toggle` does not bubble, so listen in the capture phase.
     A <details open> in the markup fires toggle as the page
     renders, so ignore anything before the document is parsed —
     otherwise every FAQ view logs an open nobody clicked. */
  var live = false;
  function goLive() { setTimeout(function () { live = true; }, 0); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', goLive);
  } else {
    goLive();
  }

  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (!live || !d || d.tagName !== 'DETAILS' || !d.open) { return; }
    var summary = d.querySelector('summary');
    send('faq_open', { question: summary ? label(summary) : '' });
  }, true);
})();
