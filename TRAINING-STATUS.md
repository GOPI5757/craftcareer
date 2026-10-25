# Recognition and training status — 1.5.1

This release improves the local recognition pipeline. It does **not** contain a newly trained screenshot-to-website model. No deep-learning training run was performed, no new model weights are shipped, and no claim of 99.9% visual accuracy is made.

## What changed

- Dark artwork and low-contrast filled controls receive better candidate detection. Thin decorative lines no longer determine an artwork crop's whole bounds.
- Low-confidence words stay with their complete line for review instead of silently dropping half a name.
- The reviewer can keep uncertain lettering as editable text (correct spelling and choose a font) or preserve its appearance as a movable image component. An image choice is **not** editable text.
- Repeated buttons with compatible alignment, size and spacing become one ordinary CraftCareer list. Each item retains its own label, image, action and optional style override.
- Screenshot-based layouts use proportional reference measurements, including list gaps. Tablet/mobile configurations remain independent, editable layouts.
- Decorative screenshot backgrounds are a review choice. Hidden artwork behind foreground content is still only approximated; supplying the original background asset gives a cleaner result.
- Region identifiers stay stable when review answers change, preserving replacement-image associations.

## Saving examples for actual training

After completing the review, open **Review regions → Save reviewed example**. The download contains:

- `reference.png`: the image used for analysis, at the bounded working resolution.
- `annotation.json`: versioned, normalized region data and recorded review decisions, with a SHA-256 source hash.
- `README.md`: the data's scope and limitations.

This operation saves a local file. It sends nothing to a training service and does not update a model. Annotations are labelled `human-reviewed-proposal`, not independently verified ground truth. Check spelling, missing content, element grouping, geometry and actions before accepting an example into a dataset. Use only images you own or are licensed to use. Never put credentials or private material in a shared dataset.

## Why collecting screenshots is not enough

[WebSight](https://huggingface.co/datasets/HuggingFaceM4/WebSight) provides about two million synthetic screenshot/HTML pairs and declares CC BY 4.0. Its labels are HTML, not CraftCareer grids, lists, actions and configuration files. Adapting such data requires a translation/annotation stage and license attribution. [Design2Code](https://github.com/NoviScl/Design2Code) provides a real-webpage evaluation benchmark; its data terms should be reviewed separately from its code license. A test benchmark must remain outside training.

A bounded WebSight download was attempted during this update, but the dataset endpoint failed verified TLS connections in the local download tools. Certificate validation was not disabled. No external screenshot corpus was downloaded or represented as training data.

The added 2,000 generated cases are **geometry/configuration regression tests**, not 2,000 website screenshots and not training examples used to fit model weights.

## A practical next training stage

1. Collect licensed, diverse screenshot/annotation pairs: light/dark pages, different scripts/fonts, navigation, card grids, image-heavy portfolios, repeated controls and multiple resolutions. Correct them using the reviewer and inspect the exported configurations.
2. Split by source website/design family into training, validation and a locked test set. Use source hashes to remove duplicates; keep variants of the same page in one split.
3. Adapt a suitable existing vision-language model to predict the versioned region schema. Choose model, license, compute and memory requirements before running training. A local GPU still has hardware, power and training-time costs; there is no promised free unlimited hosted inference here.
4. Validate generated plans with the compiler and render them. Measure missing/extra regions, word accuracy, box overlap, list grouping, perceptual image differences, overflow at multiple widths, and configuration round trips separately. A single pixel-error percentage does not measure editing correctness.
5. Compare the trained model with the current baseline on held-out designs. Only ship it if it improves the measured result, keeps uncertain decisions in review, and fits the deployment constraints.

A screenshot does not disclose original fonts, hidden image pixels, destination URLs, hover states or responsive behavior. Neither this pipeline nor a trained model can promise exact recovery of those unknowns for every design.
