import React from 'react';

const Navigation = ({ onRouteChange, isSignedIn }) => {
    return (
        <nav id='navigation' className='bg-white border-b-2 border-blue-400' style={{ display: 'flex', justifyContent: 'flex-end'}}>
            {isSignedIn ? (
                <>
                    <p onClick={() => onRouteChange('signout')} className="f5 link dim blue pa3 pr4 pointer">Log out</p>
                    <button onClick={() => onRouteChange('scoreboard')} className="f5 link dim blue pa3 pr4 pointer">Scoreboard</button>
                </>
            ) : (
                <>
                    <p onClick={() => onRouteChange('signin')} className="f5 link dim blue pa3 pointer">Log in</p>
                    <p onClick={() => onRouteChange('register')} className="f5 link dim blue pa3 pr4 pointer">Sign up</p>
                </>
            )}
        </nav>
    );
}

export default Navigation;
