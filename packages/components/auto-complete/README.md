# Autocomplete

Helps users choose answers from a list you provide

## Guidance

Find out more about the autocomplete component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/auto-complete).

## Quick start examples

#### HTML markup

```html
<div class="ofh-js-autocomplete-element">
  <div class="ofh-form-group ofh-form-group--error">
    <label class="ofh-label" for="affiliation_organisation_name">
      Organisation name
    </label>
    <span class="ofh-error-message" id="affiliation_organisation_name-error">
      <span class="ofh-u-visually-hidden">Error:</span> Enter your organisation name
    </span>
    <input class="ofh-input ofh-input--error" id="affiliation_organisation_name" name="affiliation[organisation_name]" type="text" aria-describedby="affiliation_organisation_name-error">
  </div>

  <div class="ofh-js-autocomplete-element-suggestions" data-default-value="" data-field-name="affiliation[organisation_name]"></div>
  <script>
    window.affiliation_organisation_name_options = ["Cambrige", "Department of Health", "KCL", "OFH", "Oxford", "UCL", "University of York"]
  </script>
</div>
```

## Thanks to the Government Digital Service (GDS)

This component has been built using the [GOV.UK Accessible Autocomplete component](https://github.com/alphagov/accessible-autocomplete).