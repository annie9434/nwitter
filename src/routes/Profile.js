import { authService, dbService,storageService } from "fbase";
import React, { useEffect, useState, useRef } from "react";
import {v4 as uuidv4} from "uuid"
import { useNavigate } from "react-router-dom";
import {collection,  getDocs, query, where} from "firebase/firestore"
import {ref, uploadString, getDownloadURL} from "firebase/storage";
import {updateProfile} from "firebase/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const Profile = ({refreshUser, userObj}) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [newPhoto, setNewPhoto] = useState(userObj.photoURL);

    const navigate = useNavigate();

    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    
    }

    const getMyNweets = async() => {

        // dbService에서 userObj의 id와 동일한 creatorID를 가진 모든 문서를 요청하는 쿼리문 생성
        const info = query(
            collection(dbService, "nweets")
            , where("creatorId", "==", userObj.uid)
        );
        
        // getDocs()를 통해 쿼리문 실행 -> 결과 가져오기
        const snapshot = await getDocs(info);

       /* snapshot.forEach((doc) => {
            console.log(doc.id, "=>", JSON.stringify(doc.data()));
        }*/

    }

    useEffect(()=> {
        getMyNweets();
    }, []);

    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewDisplayName(value);
    }

    const onPhotoChange = (event) => {
        const {target : {files}} = event;   
        const theFile = files[0];

        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}, } = finishedEvent
            setNewPhoto(result);
        }
        
        if(theFile) {
            reader.readAsDataURL(theFile);
        }
    
        onClearPhoto();
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        let photoURL = "";
        
        if(newPhoto != userObj.photoURL && newPhoto != "") { // 현재 프로필 사진과 다르면 사진 업데이트 후 변경 진행
            const photoRef = ref(storageService, `${userObj.uid}/profile/photo/${uuidv4()}`);
            const response = await uploadString(photoRef, newPhoto, "data_url");
            photoURL = await getDownloadURL(ref(storageService, photoRef));
        } else if(newPhoto != "") {
            photoURL= userObj.photoURL;
        }
    

        if( userObj.displayName != newDisplayName || userObj.photoURL != newPhoto){
            await updateProfile(authService.currentUser, {
                displayName: newDisplayName, photoURL: photoURL
              }).then(() => {
                alert("성공적으로 프로필이 업데이트 되었습니다.");
                refreshUser();
              }).catch((error) => {
                alert("프로필 업데이트 중 오류가 발생하였습니다.");
                console.log(error)
              });
        }

        setNewPhoto(photoURL);
    }

    const fileInput = useRef();

    const onClearPhoto = () => {
        setNewPhoto("");
        fileInput.current.value = "";
    }
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                     {newPhoto && <div className="profileForm__attachment">
                                        <img src={newPhoto} style={{backgroundImage: newPhoto,}}/>
                                        <div className="profileForm__clear" onClick={onClearPhoto}>
                                            <span>Remove</span>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </div>
                                    </div>}
                 <label htmlFor="attach-file" className="profileForm__label">
                    <span>photos</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                <input  className="formInput" type="text" placeholder="Display name" onChange={onChange} value={newDisplayName} autoFocus/>
               
                <input type="file" id="attach-file" accept="image/*" onChange={onPhotoChange} ref={fileInput} style={{opacity: 0, }} />
               
                <input type="submit" value="Update Profile" className="formBtn"style={{marginTop: 10, }}/>

               
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}> Log Out </span>
    </div>
        
        
    )
}
export default Profile;