import React, {useState, useRef}  from "react";
import {dbService, storageService} from "fbase";
import {v4 as uuidv4} from "uuid"
import {ref, uploadString, getDownloadURL} from "firebase/storage";
import {collection, addDoc} from "firebase/firestore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactoy = ({userObj}) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }

        event.preventDefault();
        let attachmentUrl = "";
        if(attachment !== "") {
            // ref생성
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            // 파일 업로드
            const response = await uploadString(attachmentRef, attachment, "data_url");
            // 업로드된 파일 url 받아오기
            attachmentUrl = await getDownloadURL(ref(storageService, attachmentRef));
        }

        const content = {
            text: nweet,
            createdAt: Date.now(),
            creatorId:userObj.uid,
            attachmentUrl
        }

       await addDoc(collection(dbService, "nweets"), content);

        setNweet("");
        setAttachment("");
    }
    
    const onChange = (event) => {
        const {target : {value}} = event; // event의 target 안에 있는 value를 요청
        setNweet(value);
    }
  
    const onFileChange = (event) => {
        const {target : {files}} = event;   
        const theFile = files[0];

        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result}, } = finishedEvent
            setAttachment(result);
        }
        
        if(theFile) {
            reader.readAsDataURL(theFile);
        }

        onClearAttachment();
    }

    const fileInput = useRef();
    
    const onClearAttachment = () => {
        setAttachment("");
        fileInput.current.value = "";
    }
    

    return(
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input className="factoryInput__input" type="text" value={nweet} onChange={onChange} placeholder="What's on your mind?" maxLength={120}/>
                <input className="factoryInput__arrow" type="submit" value="&rarr;"  />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input type="file" id="attach-file"accept="image/*" onChange={onFileChange} ref={fileInput} style={{opacity: 0, }} />
        {attachment && <div className="factoryForm__attachment">
                            <img src={attachment} style={{backgroundImage: attachment,}}/>
                            <div className="factoryForm__clear" onClick={onClearAttachment}>
                                <span>Remove</span>
                                <FontAwesomeIcon icon={faTimes} />
                            </div>
            </div>}
        </form>
    )
}

export default NweetFactoy;