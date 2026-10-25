# Private visual regression fixture

The `/fidelity.html` harness runs real local OCR against the user-supplied 2557 × 1351 artist-portfolio screenshot (black navigation header, orange landscape, GAME ARTIST / Portfolio hero). Place that exact file here as `artist-reference.png`, then run the local browser test server.

The original screenshot is not included in the distributed creator package. The synthetic image tests at `/verification/design.html` run without it. `fidelity.html` assertions check this particular reference, not universal reconstruction accuracy.
