Drop real, client-supplied assets here to replace the generated scene art.

Each tour room / residence in src/data/*.ts has an optional `media` field.
Point it at a file in this folder, e.g.:

  media: "/assets/tour/living.jpg"     // photo
  media: "/assets/tour/exterior.mp4"   // video (set video={true} in the scene)

Recommended:
- Exterior / hero:  landscape 16:9 or 21:9, ~2400px wide
- Interiors:        landscape 3:2 or 16:9
- Collection cards: portrait 3:4
- og-image:         replace og-image.svg with a 1200x630 og-image.jpg and
                    update index.html if you change the filename

Until real assets are added, the site renders self-contained gradient/SVG
"scenes" so there are no missing-asset 404s.
