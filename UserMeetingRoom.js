import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';

const UserMeetingRoom = ({ adminId, userId }) => {
  const jitsiContainer = useRef(null);
  const [roomName, setRoomName] = useState('');
  const [meetingStarted, setMeetingStarted] = useState(false);
  const domain = 'meet.jit.si';

  const fetchRoomName = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/meetings/room/${adminId}-${userId}`);
      setRoomName(response.data.roomName);
      setMeetingStarted(true);
    } catch (error) {
      console.error("Error fetching room name:", error);
    }
  }, [adminId, userId]);

  useEffect(() => {
    if (meetingStarted && window.JitsiMeetExternalAPI) {
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
      const api = new window.JitsiMeetExternalAPI(domain, options);

      return () => api.dispose();
    }
  }, [roomName, meetingStarted, domain]);

  useEffect(() => {
    fetchRoomName(); // ✅ Safe to use now
  }, [fetchRoomName]);

  return (
    <div className="container py-4">
      <div className="glass-card p-4 text-center ">
        <h2 className="mb-3 fw-bold">🤝User Meeting Room</h2>
        {meetingStarted ? (
          <div ref={jitsiContainer} style={{ height: "700px" }} />
        ) : (
          <p>Loading the meeting...</p>
        )}
      </div>
    </div>
  );
};

export default UserMeetingRoom;
