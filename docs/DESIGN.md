# Material and interaction direction

The visual system translates Liquid Glass principles into a lightweight browser interface. This is a CSS interpretation, not Apple's native rendering engine or a physically accurate refraction shader.

## Reference decisions

- [Apple: Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass) and [adoption guidance](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass): keep navigation distinct from content; apply glass selectively; align nested radii; support contrast, transparency and motion preferences.
- [Liquid Glass UI gallery](https://liquidglassdesign.com/ui), including the [light/dark button study](https://liquidglassdesign.com/gallery/liquid-glass-button-ios-26-light-dark): study directional edge highlights, rounded silhouettes and background tint. No reference imagery or source code is copied into the project.
- [MockFlow's layered design approach](https://mockflow.com/blog/designing-ios-26-screens-with-liquid-glass-design): separate background atmosphere, interactive glass, readable content and temporary overlays.

## Web implementation

| Layer | Treatment |
| --- | --- |
| Environment | Slow blue-gray light fields, static noise, quiet grid |
| Navigation | Shared glass Dock capsule and restrained active lens |
| Window chrome | Translucent saturated background, thin directional edge light, soft contact shadow |
| Reading | More opaque calm surface, stable text contrast, no light overlay on text |
| Commands | Focused glass overlay with clear keyboard selection |

`tokens.css` defines separate chrome, control and reading densities. `liquid-glass.css` composes backdrop blur, saturation, gradient edge masks and inset highlights. The edge highlight follows a fine pointer through requestAnimationFrame; content itself never distorts. No WebGL, displacement filter or continuously animated blur is required.

The Dock uses one material container and a moving selected lens, rather than a stack of separately blurred icon tiles. Transitions respect reduced motion. Reduced-transparency and increased-contrast preferences use solid surfaces. Compact sheets use an opaque reading area; the bottom navigation remains a separate functional layer.

Cold gray-blue remains the project's chosen palette. Colorful wallpapers, oversized glow and ornamental glass cards from references are intentionally not adopted.

## Visual refinement — September 2026

- Keep the centered introduction, with a clear greeting/title/description hierarchy and balanced title wrapping. Move the work-in-progress signature below the links to let the name lead.
- Keep glass on navigation and window chrome. Project and note cards use a stable reading surface without their own backdrop blur. Dark edges use restrained highlights instead of bright outlines.
- The header offers a labelled System → Light → Dark → System theme cycle, alongside search. Both remain 44px touch targets on compact screens.
- Compact Dock icons and labels form one vertical group inside each button; the active lens supplies selection feedback without a second indicator beneath it.
- Use one transform owner for primary button feedback; preserve keyboard focus indicators and disable decorative displacement for reduced motion. Content is visible from the first frame.
- Reading links are underlined, card focus rings remain inside clipped surfaces, and compact filters/close controls have larger hit areas.
