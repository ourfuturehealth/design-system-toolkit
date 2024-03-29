# Table

## Guidance

Find out more about the table component and when to use it in the [design system docs website](https://designsystem.ourfuturehealth.org.uk/design-system/components/table).

## Quick start examples

### Simple table

[Preview the table component](https://ourfuturehealth.github.io/design-system-toolkit/components/tables/index.html)

#### HTML markup

```html
<div class="ofh-table-container">
  <table class="ofh-table">
    <caption class="ofh-table__caption">Skin symptoms and possible causes</caption>
    <thead class="ofh-table__head">
      <tr class="ofh-table__row">
        <th class="ofh-table__header" scope="col">Skin symptoms</th>
        <th class="ofh-table__header" scope="col">Possible cause</th>
      </tr>
    </thead>
    <tbody class="ofh-table__body">
      <tr class="ofh-table__row">
        <td class="ofh-table__cell">Blisters on lips or around the mouth</td>
        <td class="ofh-table__cell ">cold sores</td>
      </tr>
      <tr class="ofh-table__row">
        <td class="ofh-table__cell">Itchy, dry, cracked, sore</td>
        <td class="ofh-table__cell ">eczema</td>
      </tr>
      <tr class="ofh-table__row">
        <td class="ofh-table__cell">Itchy blisters</td>
        <td class="ofh-table__cell ">shingles, chickenpox</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Nunjucks macro

```html
{% from 'components/tables/macro.njk' import table %}

{{ table({
  panel: false,
  caption: "Skin symptoms and possible causes",
  firstCellIsHeader: false,
  head: [
    {
      text: "Skin symptoms"
    },
    {
      text: "Possible cause"
    }
  ],
  rows: [
    [
      {
        text: "Blisters on lips or around the mouth"
      },
      {
        text: "cold sores"
      }
    ],
    [
      {
        text: "Itchy, dry, cracked, sore"
      },
      {
        text: "eczema"
      }
    ],
    [
      {
        text: "Itchy blisters"
      },
      {
        text: "shingles, chickenpox"
      }
    ]
  ]
}) }}
```

---

### Table panel

[Preview the table panel component](https://ourfuturehealth.github.io/design-system-toolkit/components/tables/tables-panel.html)

#### HTML markup

```html
<div class="ofh-table__panel-with-heading-tab">
  <h3 class="ofh-table__heading-tab">Conditions similar to impetigo</h3>
  <div class="ofh-table-container">
    <table class="ofh-table">
      <caption class="ofh-table__caption">Other possible causes of your symptoms</caption>
      <thead class="ofh-table__head">
        <tr class="ofh-table__row">
          <th class="ofh-table__header" scope="col">Symptoms</th>
          <th class="ofh-table__header" scope="col">Possible cause</th>
        </tr>
      </thead>
      <tbody class="ofh-table__body">
        <tr class="ofh-table__row">
          <td class="ofh-table__cell">Blisters on lips or around the mouth</td>
          <td class="ofh-table__cell ">cold sores</td>
        </tr>
        <tr class="ofh-table__row">
          <td class="ofh-table__cell">Itchy, dry, cracked, sore</td>
          <td class="ofh-table__cell ">eczema</td>
        </tr>
        <tr class="ofh-table__row">
          <td class="ofh-table__cell">Itchy blisters</td>
          <td class="ofh-table__cell ">shingles, chickenpox</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

#### Nunjucks macro

```html
{% from 'components/tables/macro.njk' import table %}

{{ table({
  panel: true,
  heading: "Conditions similar to impetigo",
  caption: "Other possible causes of your symptoms",
  firstCellIsHeader: false,
  head: [
    {
      text: "Symptoms"
    },
    {
      text: "Possible cause"
    }
  ],
  rows: [
    [
      {
        text: "Blisters on lips or around the mouth"
      },
      {
        text: "cold sores"
      }
    ],
    [
      {
        text: "Itchy, dry, cracked, sore"
      },
      {
        text: "eczema"
      }
    ],
    [
      {
        text: "Itchy blisters"
      },
      {
        text: "shingles, chickenpox"
      }
    ]
  ]
}) }}
```

---

### Responsive table

[Preview the responsive table component](https://ourfuturehealth.github.io/design-system-toolkit/components/tables/responsive-table.html)

#### HTML markup

```html
<table role="table" class="ofh-table-responsive">
  <caption class="ofh-table__caption">Ibuprofen syrup dosages for children</caption>
  <thead role="rowgroup" class="ofh-table__head">
    <tr role="row">
      <th role="columnheader" class="" scope="col">
        Age
      </th>
      <th role="columnheader" class="" scope="col">
        How much?
      </th>
      <th role="columnheader" class="" scope="col">
        How often?
      </th>
    </tr>
  </thead>
  <tbody class="ofh-table__body">
    <tr role="row" class="ofh-table__row" >
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">Age </span>3 to 5 months (weighing more than 5kg)
      </td>
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">How much? </span>2.5ml
      </td>
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">How often? </span>Max 3 times in 24 hours
      </td>
    </tr>
    <tr role="row" class="ofh-table__row" >
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">Age </span>6 to 11 months
      </td>
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">How much? </span>2.5l
      </td>
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">How often? </span>Max 3 to 4 times in 24 hours
      </td>
    </tr>
    <tr role="row" class="ofh-table__row" >
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">Age </span>1 to 3 years
      </td>
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">How much? </span>5ml
      </td>
      <td role="cell" class="ofh-table__cell">
        <span class="ofh-table-responsive__heading">How often? </span>Max 3 times in 24 hours
      </td>
    </tr>
  </tbody>
</table>
```

#### Nunjucks macro

```html
{% from 'components/tables/macro.njk' import table %}
{{ table({
  responsive: true,
  panel: false,
  caption: "Ibuprofen syrup dosages for children",
  firstCellIsHeader: false,
  head: [
    {
      text: "Age"
    },
    {
      text: "How much?"
    },
    {
      text: "How often?"
    }
  ],
  rows: [
    [
      {
        header: "Age",
        text: "3 to 5 months (weighing more than 5kg)"
      },
      {
        header: "How much?",
        text: "2.5ml"
      },
      {
        header: "How often?",
        text: "Max 3 times in 24 hours"
      }
    ],
    [
      {
        header: "Age",
        text: "6 to 11 months"
      },
      {
        header: "How much?",
        text: "2.5l"
      },
      {
        header: "How often?",
        text: "Max 3 to 4 times in 24 hours"
      }
    ],
    [
      {
        header: "Age",
        text: "1 to 3 years"
      },
      {
        header: "How much?",
        text: "5ml"
      },
      {
        header: "How often?",
        text: "Max 3 times in 24 hours"
      }
    ]
  ]
}) }}
```

---

### Nunjucks arguments

The table Nunjucks macro takes the following arguments:

| Name                   | Type       | Required  | Description  |
| -----------------------|------------|-----------|--------------|
| **rows**               | array      | Yes       | Array of table rows and cells. |
| **rows.[].text (or) rows.[].html**  | string | Yes  | Text or HTML for cells in table rows. If `html` is specified, the `text` argument will be ignored. |
| **rows.[].format**     | string     | No        | Specify format of a cell. Currently we only use "numeric". |
| **rows.[].colspan**    | number     | No        | Specify how many columns a cell extends. |
| **rows.[].rowspan**    | number     | No        | Specify how many rows a cell extends. |
| **panel**              | boolean    | No        | If set to true, the table is rendered inside a [panel with a label](https://ourfuturehealth.github.io/design-system-toolkit/components/panel-with-label.html). |
| **panelClasses**       | string     | No        | Optional additional classes to add to the panel containing the table. Separate each class with a space. |
| **heading**            | string     | No        | Heading/label of the panel if the panel argument is set to true. |
| **headingLevel** 	     | integer    | No 	      | Optional heading level for the heading. Default: 3. |
| **tableClasses**       | string     | No        | Optional additional classes to add to the table. Separate each class with a space. |
| **attributes**         | object     | No        | Any extra HTML attributes (for example data attributes) to add to the table. |
| **caption**            | string     | No        | Optional caption for the table. |
| **captionClasses**     | string     | No        | Optional additional classes to add to the table caption. Separate each class with a space. |
| **head**               | array      | No        | Optional array of table head cells. |
| **head.[].text or head.[].html**    | array  |  No  | Optional array of table head cells. If `html` is specified, the `text` argument will be ignored. |
| **head.[].colspan**    | number     | No        | Specify how many columns a cell extends. |
| **head.[].rowspan**    | number     | No        | Specify how many rows a cell extends. |
| **head.[].format**     | string     | No        | Specify format of a cell. Currently we only use "numeric". |
| **firstCellIsHeader**  | boolean    | No        | If set to true, first cell in table row will be a TH instead of a TD. |
| **responsive**         | boolean    | No        | If set to true, responsive table classes will be applied. |

If you are using Nunjucks macros in production be aware that using `html` arguments, or ones ending with `html` can be a [security risk](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting). Read more about this in the [Nunjucks documentation](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
