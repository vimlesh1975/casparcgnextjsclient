'use client';

import { useState } from 'react';

export default function Home() {
  const [command, setCommand] = useState('play 1-1 blue');
  const endpoint = async (str) => {
    const postData = {
      action: 'endpoint',
      command: str,
    };
    // Configuration for the fetch request
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
        // You may include other headers as needed
      },
      body: JSON.stringify(postData), // Convert the data to JSON format
    };
    fetch('/api', requestOptions);
  };

  return (
    <div>
      <h1>This is Casparcg Next Js Client</h1>
      <button onClick={() => endpoint('play 1-1 red')}>Play red color</button>
      <div>
        <span>Command:</span>
        <input value={command} onChange={(e) => setCommand(e.target.value)} />
        <button onClick={() => endpoint(command)}>Play Command</button>
      </div>
    </div>
  );
}
