// src/components/AdminMeetingRoom.js
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const AdminMeetingRoom = () => {
  const jitsiContainer = useRef(null);
  const [roomName, setRoomName] = useState('');
  const [meetingStarted, setMeetingStarted] = useState(false);
  const domain = 'meet.jit.si';

  const handleStartMeeting = async () => {
    const randomRoom = `zidio-room-${Date.now()}`;
    setRoomName(randomRoom);
    try {
      await axios.post("http://localhost:5000/api/meetings/start", { roomName: randomRoom });
      setMeetingStarted(true);
    } catch (error) {
      console.error("Meeting start error:", error);
    }
  };

  useEffect(() => {
    
    if (meetingStarted && window.JitsiMeetExternalAPI) {
      const domain = "meet.jit.si";
      const options = {
        roomName: roomName,
        parentNode: jitsiContainer.current,
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
        },
      };
      const api= new window.JitsiMeetExternalAPI(domain, { 
        roomName,
        options,
      } );

      return () => api.dispose();
    }
  }, [meetingStarted, roomName, domain]);

  return (
    <div className="container py-4">
      <div className="glass-card p-4 text-center" >
        <h2 className="mb-3">Admin Meeting Room</h2>
        <button className="btn btn-primary mb-3" onClick={handleStartMeeting}>
          Start Meeting
        </button>
        {meetingStarted && <div ref={jitsiContainer} style={{ height: "500px" }} />}
      </div>
    </div>
  );
};

export default AdminMeetingRoom;
