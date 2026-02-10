import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.scss';
import { Button } from './components/Button';
import { TextInput } from './components/TextInput';

// This file is only for development - won't be included in build
function DevApp() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      <h1>Design System React - Development</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Buttons</h2>
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost-reverse">Ghost Reverse</Button>
          <Button variant="text">Text</Button>
          <Button variant="text-reverse">Text Reverse</Button>
        </div>
      </section>

      <section>
        <h2>Text Inputs</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <TextInput label="What is your name?" />

          <TextInput
            label="20 character width"
            maxLength={20}
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="10 character width"
            maxLength={10}
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="5 character width"
            maxLength={5}
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="4 character width"
            maxLength={4}
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="3 character width"
            maxLength={3}
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="2 character width"
            maxLength={2}
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="Full width"
            width="full"
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="Three quarters width"
            width="three-quarters"
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="Two thirds width"
            width="two-thirds"
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="One half width"
            width="one-half"
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="One third width"
            width="one-third"
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="One quarter width"
            width="one-quarter"
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="What is your NHS number?"
            hint="Your NHS number is a 10 digit number that you find on any letter the NHS has sent you. For example, 485 777 3456."
            style={{ marginTop: '1rem' }}
          />

          <TextInput
            label="Phone number"
            error="Enter a valid phone number"
            style={{ marginTop: '1rem' }}
          />
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevApp />
  </React.StrictMode>,
);
