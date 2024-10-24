import { useState, useEffect, useCallback, useRef } from 'react';

class WebSocketManager {
    constructor(url) {
      this.url = url;
      this.ws = null;
    }
  
    connect(onOpen) {
      this.ws = new WebSocket(this.url);
      this.ws.onmessage = this.handleMessage;
    //   this.ws.onopen = () => this.dispatchEvent('wsOpen');
      this.ws.onopen = onOpen;
      this.ws.onclose = () => this.dispatchEvent('wsClose');
      this.ws.onerror = (error) => this.dispatchEvent('wsError', error);
    }
  
    handleMessage = (event) => {
        const jsonString = event.data.replace(/'/g, '"');

        const message = JSON.parse(jsonString);
        this.dispatchEvent('wsMessage', message);
    }
  
    send(message) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        if (message.id=='img'){
            this.ws.send(message.data);
        }else{
            // console.log(message)
            this.ws.send(JSON.stringify(message));
        }
      } else {
        console.error('WebSocket is not connected');
        this.disconnect();
      }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
  
    dispatchEvent(name, data) {
      window.dispatchEvent(new CustomEvent(name, { detail: data }));
    }
  
    // Additional methods for reconnection, etc.
  }
function useWebSocket(connection_url) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [lastError, setLastError] = useState(null);
  const wsManagerRef = useRef(null);

  useEffect(() => {
    wsManagerRef.current = new WebSocketManager(connection_url);//'https://hippo-funny-formerly.ngrok-free.app/');
    function handleOpen() {
        setIsConnected(true);
        const lobbyId=0;
        const message = lobbyId ? { lobby_id: parseInt(lobbyId) } : {};
        // wsManager.send(message)
    }
    const handleClose = () => setIsConnected(false);
    const handleMessage = (event) => setLastMessage(event.detail);

    window.addEventListener('wsOpen', handleOpen);
    window.addEventListener('wsClose', handleClose);
    window.addEventListener('wsMessage', handleMessage);

    return () => {
      window.removeEventListener('wsOpen', handleOpen);
      window.removeEventListener('wsClose', handleClose);
      window.removeEventListener('wsMessage', handleMessage);
    };
  }, []);
  
  const connect = useCallback((lobbyId = null) => {
    if (wsManagerRef.current) {
        const handleOpen = () => {
            setIsConnected(true);
            const message = lobbyId ? { lobby_id: parseInt(lobbyId) } : {};
            console.log("OPENING WITH SEND")
            wsManagerRef.current.send(message);
        };
        wsManagerRef.current.connect(handleOpen);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsManagerRef.current) {
        wsManagerRef.current.disconnect();
        setIsConnected(false);
    }
  }, []);

  const sendMessage = useCallback((message) => {
    wsManagerRef.current.send(message);
  }, []);

  return { isConnected, lastMessage, connect, disconnect, sendMessage };
}

export default useWebSocket;


































// import { useState, useEffect, useCallback, useRef } from 'react';

// class WebSocketManager {
//     constructor(url) {
//       this.url = url;
//       this.ws = null;
//     }
  
//     connect(onOpen) {
//       this.ws = new WebSocket(this.url);
//       this.ws.onmessage = this.handleMessage;
//       this.ws.onopen = onOpen;
//       this.ws.onclose = () => this.dispatchEvent('wsClose');
//       this.ws.onerror = (error) => this.dispatchEvent('wsError', error);
//     }
  
//     handleMessage = (event) => {
//         const jsonString = event.data.replace(/'/g, '"');
//         const message = JSON.parse(jsonString);
//         this.dispatchEvent('wsMessage', message);
//     }
  
//     send(message) {
//       if (this.ws && this.ws.readyState === WebSocket.OPEN) {
//         if (message.id === 'img') {
//             this.ws.send(message.data);
//         } else {
//             this.ws.send(JSON.stringify(message));
//         }
//       } else {
//         console.error('WebSocket is not connected');
//         this.disconnect();
//       }
//     }

//     disconnect() {
//         if (this.ws) {
//             this.ws.close();
//             this.ws = null;
//         }
//     }
  
//     dispatchEvent(name, data) {
//       window.dispatchEvent(new CustomEvent(name, { detail: data }));
//     }
// }

// function useWebSocket(connection_url) {
//   const [isConnected, setIsConnected] = useState(false);
//   const [lastMessage, setLastMessage] = useState(null);
//   const wsManagerRef = useRef(null);

//   const connect = useCallback((lobbyId = null) => {
//     if (wsManagerRef.current) {
//         const handleOpen = () => {
//             setIsConnected(true);
//             const message = lobbyId ? { lobby_id: parseInt(lobbyId) } : {};
//             console.log("OPENING WITH SEND");
//             wsManagerRef.current.send(message);
//         };
//         wsManagerRef.current.connect(handleOpen);
//     }
//   }, []);

//   useEffect(() => {
//     wsManagerRef.current = new WebSocketManager(connection_url);
    
//     const handleClose = () => setIsConnected(false);
//     const handleMessage = (event) => setLastMessage(event.detail);

//     window.addEventListener('wsClose', handleClose);
//     window.addEventListener('wsMessage', handleMessage);

//     // Connect when the component mounts
//     connect();

//     return () => {
//       window.removeEventListener('wsClose', handleClose);
//       window.removeEventListener('wsMessage', handleMessage);
//       if (wsManagerRef.current) {
//         wsManagerRef.current.disconnect();
//       }
//     };
//   }, [connect, connection_url]);

//   const disconnect = useCallback(() => {
//     if (wsManagerRef.current) {
//         wsManagerRef.current.disconnect();
//     }
//   }, []);

//   const sendMessage = useCallback((message) => {
//     if (wsManagerRef.current) {
//       wsManagerRef.current.send(message);
//     }
//   }, []);

//   return { isConnected, lastMessage, connect, disconnect, sendMessage };
// }

// export default useWebSocket;