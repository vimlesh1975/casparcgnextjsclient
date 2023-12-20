'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const sectohmsm = (totalSeconds) => {
  if (totalSeconds < 0) {
    totalSeconds = 0;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor((totalSeconds % 1) * 1000);
  const hmsms = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  return hmsms; // Output: "0:20:34.560"
};

export default function Home() {
  const [command, setCommand] = useState('play 1-1 amb loop');
  const [time, settime] = useState('');

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new io('/', {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });
    socket.on('connect', () => {
      console.log('SOCKET CONNECTED!', socket.id);
    });

    socket.on('FromAPI', (data) => {
      // dispatch({ type: 'CHANGE_OSCMESSAGES', payload: data })

      settime(
        sectohmsm(
          parseFloat(data?.args[1]?.value - data?.args[0]?.value)?.toFixed(2)
        )
      );
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endpoint = async (str) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
        // You may include other headers as needed
      },
      body: JSON.stringify(str), // Convert the data to JSON format
    };
    const aa = await fetch('/api', requestOptions);
    if (str.action === 'connect' || str.action === 'disconnect') {
      setConnected(await aa.json());
    }
  };

  return (
    <div>
      <h1>This is Casparcg Next Js Client</h1>
      <h2>{connected && time}</h2>
      <div>
        <button
          style={{ backgroundColor: connected ? 'green' : 'red' }}
          onClick={() =>
            endpoint({
              action: 'connect',
            })
          }
        >
          Connect
        </button>
      </div>
      <div>
        <button
          onClick={() =>
            endpoint({
              action: 'disconnect',
            })
          }
        >
          DisConnect
        </button>
      </div>
      <button
        onClick={() =>
          endpoint({
            action: 'endpoint',
            command: 'play 1-1 red',
          })
        }
      >
        Play red color
      </button>
      <div>
        <span>Command:</span>
        <input value={command} onChange={(e) => setCommand(e.target.value)} />
        <button
          onClick={() =>
            endpoint({
              action: 'endpoint',
              command: command,
            })
          }
        >
          Play Command
        </button>
      </div>
    </div>
  );
}
