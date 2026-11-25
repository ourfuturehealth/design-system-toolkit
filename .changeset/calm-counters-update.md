---
"@ourfuturehealth/toolkit": minor
"@ourfuturehealth/react-components": minor
---

Add a `showCountOnEdit` character-count option to the toolkit and React component, and prevent conditional radio content, including textareas, from flashing before JavaScript initialises.

## Consumer action
Action required

## Migration notes
Set `showCountOnEdit: true` on toolkit or React character counts that should keep their static limit visible until the user edits the field. Toolkit character counts now update on the `input` event, covering paste, cut, drag-and-drop and assistive input as well as typing. Conditional radio content is now hidden from the first render when its radio is unchecked, preventing conditional textareas from flickering on navigation or reload. Test conditional radio groups and character counts after updating.
