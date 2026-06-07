import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user }  = useAuth();
  const socketRef = useRef(null);
  const [liveFeed,    setLiveFeed]    = useState([]);   // real-time donation feed
  const [milestones,  setMilestones]  = useState([]);   // milestone events
  const [goalReached, setGoalReached] = useState(null); // goal-reached event
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    socketRef.current = io('/', { transports: ['websocket', 'polling'] });
    const sock = socketRef.current;

    // Join user room for private notifications
    if (user?.id) sock.emit('join-user', user.id);

    sock.on('new-donation', (data) => {
      setLiveFeed(prev => [{ ...data, id: Date.now() }, ...prev].slice(0, 20));
    });

    sock.on('campaign-milestone', (data) => {
      setMilestones(prev => [{ ...data, id: Date.now() }, ...prev].slice(0, 5));
      setTimeout(() => setMilestones(prev => prev.filter(m => m.id !== data.id)), 6000);
    });

    sock.on('goal-reached', (data) => {
      setGoalReached(data);
      setTimeout(() => setGoalReached(null), 8000);
    });

    sock.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnread(n => n + 1);
    });

    return () => { sock.disconnect(); };
  }, [user?.id]);

  const clearGoal = () => setGoalReached(null);
  const markAllRead = () => setUnread(0);

  return (
    <SocketContext.Provider value={{ liveFeed, milestones, goalReached, clearGoal, notifications, unread, markAllRead, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
