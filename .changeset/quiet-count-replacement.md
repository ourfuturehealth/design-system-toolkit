---
"@ourfuturehealth/toolkit": patch
"@ourfuturehealth/react-components": patch
---

Replace the static character limit once the live count becomes visible after editing when `showCountOnEdit` is enabled.

## Consumer action
No consumer action required

## Migration notes
Consumers using `showCountOnEdit` will now see the static limit until the live count becomes visible after editing and reaching defined threshold.
