# Before audit — 15 November 2026

Checked the homepage and services source at commit 0754bdc. Both had titles and descriptions, but no canonical, Open Graph or JSON-LD tags; no robots.txt or sitemap was present. The booking dialog opened automatically on first load. Images and scripts were in the root. Reduced-motion handling did not cover smooth scrolling and all transitions. Core Web Vitals and indexing were not measured.

PageSpeed Insights mobile baseline (15 November 2026): no field data; lab performance 73, LCP 6.5 s, FCP 0.9 s, CLS 0 and total blocking time 0 ms. Image delivery was identified as an opportunity. Results are for the live site before this change.

Google Rich Results Test crawled the live homepage and found no supported rich-result items. Search Console opened on the Zeva account welcome screen; a verified property was not visible.
