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
  const [audio1, setAudio1] = useState(0);
  const [audio2, setAudio2] = useState(0);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // const socket = io('http://localhost:3000');
    const socket = io();
    socket.on('connect', () => {
      console.log('SOCKET CONNECTED!', socket.id);
    });

    socket.on('ServerConnectionStatus', (msg) => {
      console.log(msg)
      setConnected(msg);
    });

    socket.on('FromAPI', (data) => {
      settime(
        sectohmsm(
          parseFloat(data?.args[1]?.value - data?.args[0]?.value)?.toFixed(2)
        )
      );
    });

    socket.on('Audio', (data) => {
      var value = 20 * Math.log10(data.args[0].value / 2147483648)
      if ((value === -Infinity)) {
        setAudio1(-192);
      }
      else {
        setAudio1(parseInt(value));
      }
      if ((value === -Infinity)) {
        setAudio2(-192);
      }
      else {
        setAudio2(parseInt(value));
      }
    });

    socket.on('Audio1', (data) => {
      setAudio1(parseInt(data.args[0].value));
    });
    socket.on('Audio2', (data) => {
      setAudio2(parseInt(data.args[0].value));
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
        <button
          onClick={() =>
            endpoint({
              action: 'disconnect',
            })
          }
        >
          DisConnect
        </button>
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
        <button
          onClick={() =>
            endpoint({
              action: 'endpoint',
              command: 'play 1-1 go1080p25 loop',
            })
          }
        >
          Play go1080p25
        </button>
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
      <h2>{connected && time}</h2>
      <div style={{ display: 'flex' }}>
        <div>
          <svg width="20" height="200">
            <rect x="0" y="0" width="15" height="200" fill="green" />
            <rect x="0" y={-192 - audio1} width="15" height="200" fill="grey" />
          </svg>
        </div>
        <div>
          <svg width="20" height="200">
            <rect x="0" y="0" width="15" height="200" fill="green" />
            <rect x="0" y={-192 - audio2} width="15" height="200" fill="grey" />
          </svg>
        </div>
      </div>

     
    </div>
  );
}
