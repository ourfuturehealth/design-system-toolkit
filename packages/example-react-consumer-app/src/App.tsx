import { useState } from 'react';
import { Button, TextInput } from '@ourfuturehealth/react-components';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name || !email) {
      setError('Please fill in all fields');
    } else {
      setError('');
      alert(`Hello ${name}! Email: ${email}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>OFH Design System React - Consumer Test</h1>

        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <h2>Test Form</h2>

          <TextInput
            label="Your name"
            hint="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: '1rem' }}
          />

          <TextInput
            label="Email address"
            type="email"
            hint="We'll never share your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="three-quarters"
            required
            error={error && !email ? 'Email is required' : ''}
            style={{ marginBottom: '1rem' }}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button onClick={handleSubmit}>Submit Form</Button>

            <Button
              variant="outlined"
              onClick={() => {
                setName('');
                setEmail('');
                setError('');
              }}
            >
              Clear
            </Button>
          </div>

          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2>Button Variants</h2>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Button variant="contained">Contained</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="ghost-inverted">Ghost Inverted</Button>
            <Button variant="text">Text</Button>
            <Button variant="text-inverted">Text Inverted</Button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
