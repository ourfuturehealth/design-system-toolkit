import { useId, useState } from 'react';
import {
  Button,
  Card,
  CardCallout,
  CardDoDont,
  Checkboxes,
  ErrorSummary,
  Icon,
  Radios,
  Select,
  Tag,
  TextInput,
  Textarea,
} from '@ourfuturehealth/react-components';
import './App.css';

const serviceItems = [
  { text: 'Choose a support topic', value: '' },
  { text: 'Participant support', value: 'participant-support' },
  { text: 'Appointments and logistics', value: 'appointments' },
  { text: 'Results and follow-up', value: 'results' },
];

const contactMethodItems = [
  {
    value: 'email',
    label: 'Email',
    hint: 'Best when you want a written response with links and next steps.',
  },
  {
    value: 'phone',
    label: 'Phone call',
    hint: 'Useful for time-sensitive requests or more complex questions.',
  },
];

const updatePreferenceItems = [
  {
    value: 'appointments',
    label: 'Appointment reminders',
    hint: 'Get reminders before booked research visits.',
  },
  {
    value: 'results',
    label: 'Results updates',
    hint: 'Hear when new information is available in your OFH account.',
  },
  {
    value: 'research',
    label: 'Research opportunities',
    hint: 'Receive invitations to relevant studies and follow-up surveys.',
  },
];

const iconExamples = [
  { name: 'UnfoldMore', label: 'Select affordance' },
  { name: 'CalendarOutline', label: 'Scheduling' },
  { name: 'CheckCircle', label: 'Success state' },
] as const;

type ErrorSummaryItem = {
  href: string;
  text: string;
};

function App() {
  const nameId = useId();
  const emailId = useId();
  const serviceId = useId();
  const notesId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [contactMethod, setContactMethod] = useState('email');
  const [updatePreferences, setUpdatePreferences] = useState<string[]>([
    'appointments',
    'results',
  ]);
  const [showErrors, setShowErrors] = useState(false);

  const errors: ErrorSummaryItem[] = [];

  if (!name.trim()) {
    errors.push({
      href: `#${nameId}`,
      text: 'Enter your full name',
    });
  }

  if (!email.trim()) {
    errors.push({
      href: `#${emailId}`,
      text: 'Enter your email address',
    });
  }

  if (!service) {
    errors.push({
      href: `#${serviceId}`,
      text: 'Choose a support topic',
    });
  }

  const hasSubmissionErrors = showErrors && errors.length > 0;

  const handleSubmit = () => {
    setShowErrors(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setService('');
    setNotes('');
    setContactMethod('email');
    setUpdatePreferences(['appointments', 'results']);
    setShowErrors(false);
  };

  return (
    <main className="consumer-app">
      <header className="consumer-app__hero">
        <div className="consumer-app__tag-row">
          <Tag variant="brand">Published tarball consumer</Tag>
        </div>
        <h1 className="consumer-app__title">React consumer example</h1>
        <p className="consumer-app__lede">
          This app demonstrates how an external React application consumes the
          published <code>@ourfuturehealth/react-components</code> package and
          one of its theme stylesheets. It now exercises direct icons, icon-led
          cards, selection controls, and the input family more thoroughly.
        </p>
      </header>

      {hasSubmissionErrors ? (
        <ErrorSummary
          titleText="There is a problem"
          descriptionText="Fix the following errors before continuing."
          errorList={errors}
        />
      ) : null}

      <section className="consumer-app__grid">
        <div className="consumer-app__stack">
          <Card
            heading="Support request"
            description="This card validates icon rendering, metadata icons, tags, and action-link treatment in a published-consumer setup."
            helperText="Use the form below to exercise current input and selection states."
            tag={{ variant: 'blue', children: 'Smoke test' }}
            icon={{
              name: 'CalendarOutline',
              title: 'Scheduling icon',
            }}
            metadataItems={[
              { icon: 'ClockOutline', text: 'Approx. 3 minute completion' },
              { icon: 'LocationOutline', text: 'Participant services team' },
            ]}
          />

          <section className="consumer-app__panel">
            <h2 className="consumer-app__section-title">Form example</h2>

            <div className="consumer-app__field">
              <TextInput
                id={nameId}
                label="Full name"
                hint="Enter the name that appears on your OFH account"
                value={name}
                onChange={(event) => setName(event.target.value)}
                errorMessage={hasSubmissionErrors && !name.trim() ? 'Enter your full name' : ''}
                required
              />
            </div>

            <div className="consumer-app__field">
              <TextInput
                id={emailId}
                label="Email address"
                hint="We will only use this for important account updates"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                errorMessage={
                  hasSubmissionErrors && !email.trim() ? 'Enter your email address' : ''
                }
                width="three-quarters"
                required
              />
            </div>

            <div className="consumer-app__field">
              <Select
                id={serviceId}
                label="Support topic"
                hint="Select shows the published Select chevron and current option styling."
                items={serviceItems}
                value={service}
                onChange={(event) => setService(String(event.target.value))}
                errorMessage={hasSubmissionErrors && !service ? 'Choose a support topic' : ''}
              />
            </div>

            <div className="consumer-app__field">
              <Textarea
                id={notesId}
                label="Additional notes"
                hint="Textarea is included here as another current input-family component."
                rows={5}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            <div className="consumer-app__actions">
              <Button onClick={handleSubmit}>Validate form</Button>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </div>

            {!hasSubmissionErrors && showErrors ? (
              <p className="consumer-app__status">
                Inputs passed validation and are ready to submit.
              </p>
            ) : null}
          </section>
        </div>

        <div className="consumer-app__stack">
          <CardCallout
            heading="Install contract"
            variant="info"
            text="This example is intended to mirror an external consumer using the published release tarball, not a workspace dependency."
          />

          <section className="consumer-app__panel">
            <h2 className="consumer-app__section-title">Selection controls</h2>

            <Radios
              name="contact-method"
              legend="Preferred contact method"
              hint="This validates radio inputs and legend support in the published app."
              value={contactMethod}
              onChange={(value) => setContactMethod(String(value))}
              items={contactMethodItems}
            />

            <div className="consumer-app__field">
              <Checkboxes
                name="updates"
                legend="Updates you would like to receive"
                hint="Checkboxes exercise another icon-bearing control because the check mark uses the shared React Icon."
                value={updatePreferences}
                onChange={(values) =>
                  setUpdatePreferences(values.map((value) => String(value)))
                }
                items={updatePreferenceItems}
              />
            </div>
          </section>

          <section className="consumer-app__panel">
            <h2 className="consumer-app__section-title">Icon showcase</h2>
            <div className="consumer-app__icon-row">
              {iconExamples.map((iconExample) => (
                <div className="consumer-app__icon-swatch" key={iconExample.name}>
                  <Icon
                    name={iconExample.name}
                    title={iconExample.label}
                    responsiveSize={24}
                  />
                  <span className="consumer-app__icon-label">{iconExample.label}</span>
                </div>
              ))}
            </div>
          </section>

          <CardDoDont
            type="do"
            items={[
              { item: 'Import one published theme stylesheet in your app entry point' },
              { item: 'Install the release tarball rather than using a workspace dependency' },
              { item: 'Exercise at least one icon-bearing component when smoke testing a release' },
            ]}
          />
        </div>
      </section>

      <section className="consumer-app__panel">
        <h2 className="consumer-app__section-title">Buttons and tags</h2>
        <div className="consumer-app__button-row">
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost-inverted">Ghost inverted</Button>
          <Button variant="text">Text</Button>
          <Button variant="text-inverted">Text inverted</Button>
        </div>
        <div className="consumer-app__tag-row">
          <Tag variant="neutral">Neutral</Tag>
          <Tag variant="brand">Brand</Tag>
          <Tag variant="green">Green</Tag>
          <Tag variant="yellow">Yellow</Tag>
        </div>
      </section>
    </main>
  );
}

export default App;
