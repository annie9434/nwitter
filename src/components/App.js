import AppRouter from "./AppRouter"
import React, { useEffect, useState }  from "react";
import {authService} from "fbase"
import { updateCurrentUser } from "firebase/auth";

function App() { //currentUser
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user)=>{    
      if(user){
        setUserObj(user);
        // social 로그인이 아닌 경우 회원가입한 이메일 아이디를 displayname으로 지정
        if(user.displayName === null) { 
          user.displayName = user.email.split("@")[0];
        }
      } else {
        setUserObj(null);
      }
      setInit(true);
    }
  )
  }, []);

  const refreshUser = async () => {
    await updateCurrentUser(authService, authService.currentUser);
    setUserObj(authService.currentUser);
  }
 
  return ( <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
    </>
  );
}

export default App;
