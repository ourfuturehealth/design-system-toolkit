# Task list

## Guidance

Use the task list to show a user the tasks they need to complete, along with a short status tag for each task and optional hint text.

## Quick start example

[Preview the task list component](https://ourfuturehealth.github.io/design-system-toolkit/components/task-list/index.html)

### HTML markup

```html
<ul class="ofh-task-list">
  <li class="ofh-task-list__item">
    <div class="ofh-task-list__name-and-hint">
      <a class="ofh-link ofh-task-list__link" href="#">
        Company directors
      </a>
      <div class="ofh-task-list__hint">Add the details for each director.</div>
    </div>
    <div class="ofh-task-list__status">
      <strong class="ofh-tag">Complete</strong>
    </div>
  </li>
</ul>
```

### Nunjucks macro

```njk
{% from 'components/task-list/macro.njk' import taskList %}

{{ taskList({
  idPrefix: "company-details",
  items: [
    {
      title: {
        text: "Company directors"
      },
      href: "#",
      hint: {
        text: "Add the details for each director."
      },
      status: {
        tag: {
          text: "Complete"
        }
      }
    }
  ]
}) }}
```

### Notes

- Use `status.tag` to render the existing Tag component inside each task row.
- The task title is linked when `href` is provided and the whole row remains clickable through the shared overlay.
- Use `hint` only when extra context will help users complete the task.
