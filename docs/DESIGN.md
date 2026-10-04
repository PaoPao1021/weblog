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

## Desktop interaction refinements

`interactions.css`, `MotionButton`, and `AnimatedIcon` provide one desktop-only motion system. `useDesktopMotion` requires a fine pointer, hover, and no reduced-motion preference, including narrow desktop browser windows. The normal system cursor remains unchanged.

| Interaction | Response |
| --- | --- |
| Main entry buttons and search | Fixed hit area; pointer-following light, hover shadow, and pressed icon compression |
| Dock | Pointer-distance magnification capped at 14%, maximum 4px lift, stable layout boxes; soft recovery on pointer exit |
| Home / projects / notes | Slight lift, folder tilt, or independent leaf movement |
| About / terminal / code | Small portrait lift, single caret pulse, or bracket separation |
| Links and back actions | Directional arrows and a subtle underline reveal |
| Window controls and theme buttons | Small symbol-specific feedback, without moving the click target |

No icon animation loops while idle. Reduced-motion disables decorative transformations and leaves focus, color, and operational feedback available. Touch devices do not receive the new pointer effects. Desktop windows retain pointer feedback at any width. Primary button gradients remain unchanged across hover so they cannot snap to a solid fill.


## Brand mark

The header uses an original two-window SVG mark in a 38px glass tile, with a two-line wordmark. The rear frame represents the desktop; the foreground pane represents the work within it. The same geometry is used in `public/favicon.svg`. `Brand.tsx` owns the home action and accessible label, and `brand.css` owns its presentation. Hover moves only the inner pane by 1px, leaving the hit area stationary. Keyboard focus remains visible and reduced-motion disables the internal movement.
