import React, {useState, useRef, useEffect} from 'react';
function RedirectApp(){
    const [timeV,setTimeV] = useState(0);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    function handleVisibilityChange() {
        // if the state is hiiden navigate to the /goodbye page
        if (document.visibilityState === 'visible') {
            window.location.href = "/";
        }
    }

    // // set interval
    // let interval = setInterval(() => {
    //     // if (document.visibilityState === 'hidden') {
    //     //     window.location.href = "/goodbye";
    //     // } else {
    //     //     window.location.href = "/";
    //     // }
    //     setTimeV(timeV + 1);
    // }, 100);

    useEffect(() => {
        const interval = setInterval(() => {
            handleVisibilityChange();
        }, 250);
    
        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Redirecting</h1>
            <button onClick={() => window.location.href = "/"}>If not redirecting to game screen click this button.</button>
        </div>
    )
}

export default RedirectApp