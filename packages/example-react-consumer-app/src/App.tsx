import { useId, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardCallout,
  CardDoDont,
  ErrorSummary,
  Tag,
  TextInput,
} from '@ourfuturehealth/react-components';
import './App.css';

function App() {
  const nameId = useId();
  const emailId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const errors = useMemo(() => {
    const nextErrors = [];

    if (!name.trim()) {
      nextErrors.push({
        href: `#${nameId}`,
        text: 'Enter your full name',
      });
    }

    if (!email.trim()) {
      nextErrors.push({
        href: `#${emailId}`,
        text: 'Enter your email address',
      });
    }

    return nextErrors;
  }, [email, emailId, name, nameId]);

  const hasSubmissionErrors = showErrors && errors.length > 0;

  const handleSubmit = () => {
    setShowErrors(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setShowErrors(false);
  };

  return (
    <main className="consumer-app">
      <header className="consumer-app__hero">
        <Tag variant="brand">Published tarball consumer</Tag>
        <h1 className="consumer-app__title">React consumer example</h1>
        <p className="consumer-app__lede">
          This app demonstrates how an external React application consumes the
          published <code>@ourfuturehealth/react-components</code> package and
          one of its theme stylesheets.
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
            heading="Profile details"
            description="This section shows TextInput, ErrorSummary, Button, and Tag working together in a consumer app."
            helperText="The form is intentionally simple and is here to validate basic interactive states."
            tag={{ variant: 'blue', children: 'Interactive demo' }}
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
                error={hasSubmissionErrors && !name.trim() ? 'Enter your full name' : ''}
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
                error={hasSubmissionErrors && !email.trim() ? 'Enter your email address' : ''}
                width="three-quarters"
                required
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

          <CardDoDont
            type="do"
            items={[
              { item: 'Import one published theme stylesheet in your app entry point' },
              { item: 'Install the release tarball rather than using git subdirectory syntax' },
              { item: 'Keep React and React DOM aligned with the package peer dependencies' },
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
