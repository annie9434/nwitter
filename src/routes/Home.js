import React, {useEffect, useState}  from "react";
import {dbService} from "fbase";
import {collection, getDocs, onSnapshot} from "firebase/firestore"

import Nweet from "components/Nweet";
import NweetFactoy from "components/NweetFactoy";


const Home = ({userObj}) => {
    const [nweets, setNweets] = useState([]);

    useEffect(()=> {
        //방법1
        //getNweets();

        //방법2 
        // onSnapshot : 실시간으로 데이터베이스의 정보를 가져올 수 있다. 
        // 사용자가 제공하는 콜백이 최초로 호출될 때 단일 문서의 현재 콘텐츠로 문서 스냅샷이 즉시 생성된다.
        // 그런 다음 콘텐츠가 변경될 때마다 콜백이 호출되어 문서 스냅샷을 업데이트 한다.
        onSnapshot(collection(dbService, "nweets"), (snapshot) => { 
            const nweetArray = snapshot.docs.map(doc => ({
                id:doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    },[]);

    const getNweets = async() => {
        const dbSweets = await getDocs(collection(dbService, "nweets"));
        dbSweets.forEach((doc) => {
            const nweetObject = {
                ...doc.data(),
                id:doc.id,
            }
            setNweets(prev => [nweetObject, ...prev]);
        });
    }

    return (
                <div className="container"> 
                   <NweetFactoy userObj={userObj}/>
                   <div style={{ marginTop: 30 }}>
                        {nweets.map( nweet => <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>)}
                    </div>
                </div>
            )
}
export default Home;
