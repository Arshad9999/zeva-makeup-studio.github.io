# Image layout audit

The image dimensions below were checked against the current files with `sips`. The original files remain in place. Images are illustrative; their provenance and portrayal as actual client work were not independently verified.

| File (dimensions) | Use and important area | Before | Updated desktop and mobile treatment |
| --- | --- | --- | --- |
| `hero/hero-bride.jpg` (1600×724, 2.21:1) | Both heroes; face and jewellery at right | Home: contained inside a tall frame, with bands. Services: natural wide frame but incorrect 1200×800 HTML dimensions. | Home: cover at 78% horizontal focus; mobile retains the face in a shorter frame. Services: natural ratio, correct intrinsic dimensions, no distortion. |
| `bridal/bridal-green.jpg` (1500×884, 1.70:1) | Both makeup category cards, HD Bridal, Instagram; face and jewellery right of centre | Categories: desktop 190px high or 42% side panel and contained, with bands; featured: 210px contained. Social: portrait cover. | Categories: 3:2 cover at 63%/45%; featured: 3:2 cover; social unchanged. |
| `bridal/bridal-detail.jpg` (1500×886, 1.69:1) | Both threading cards, Air Brush Bridal, YouTube; eye and brush on right | Categories and featured: contained in inconsistent rectangles; social: portrait cover. | Categories: 3:2 cover at 75%/45%; featured: 3:2 cover; social unchanged. Source itself is a close-up. |
| `bridal/bridal-pink.jpg` (1200×1513, 0.79:1) | Engagement Makeup featured card; face, hair and necklace | Portrait contained in a shallow landscape frame with large flat bands. | Complete portrait contained within a 3:2 frame, using the same photo darkened as a background. No new image or distortion. |
| `services/facial-care.jpg` (1500×889, 1.69:1) | Both skin category cards; face and treatment | Contained in differently shaped category frames with blank bands. | Shared 3:2 cover at 45%/48% across breakpoints. |
| `services/hair-care.jpg` (1500×889, 1.69:1) | Both hair categories and Hair Spa; hair and stylist's hands | Contained, often in a narrow side panel. | Categories: 3:2 cover at 52%/48%; featured: 3:2 cover. |
| `studio/studio-welcome.jpg` (1500×890, 1.69:1) | Waxing categories, about section, WhatsApp social card; person at right | Category contain caused bands; about used square cover; social used portrait cover. | Categories: 3:2 cover at 64%/40%; about/social unchanged. |
| `studio/studio-interior.jpg` (1600×945, 1.69:1) | Home studio section; room | 1.4:1 cover with hover scaling. | Existing 1.4:1 cover retained; hover scaling removed so framing stays stable. |
| `social/makeup-kit-dark.jpg` (1500×881, 1.70:1) | Facebook portrait social link; products | Portrait cover and gradient with hover scaling. | Existing crop retained; hover scaling removed. |
| `social/makeup-kit-light.jpg` (1500×885, 1.69:1) | LinkedIn portrait social link; products | Portrait cover and gradient with hover scaling. | Existing crop retained; hover scaling removed. |

Category cards now use the same 3:2 media and card CSS on both pages, with three cards followed by a centred pair at wide widths, two columns at tablet widths, and one at small widths. The featured section uses a shared 3:2 frame and aligned footer. No source image was replaced or re-encoded; source data transfer is unchanged except for a small shared CSS file. Some cropping is unavoidable in fixed frames; final subject framing should still be reviewed on actual devices and against the client's preferences.
