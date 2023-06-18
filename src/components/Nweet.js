import React , { useState }  from "react";
import {dbService, storageService} from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        
         if(ok) {
            //delete nweet
            //const data = doc(dbService, `nweets/%{nweetObj.id}`); //  ``안에 문서의 경로와 id를  넣어준다. 
            await deleteDoc(doc(dbService, "nweets", nweetObj.id));

            // 삭제하려는 파일의 레퍼런스 생성
            const deletRef = await ref(storageService, nweetObj.attachmentUrl);
            // 파일 삭제
            deleteObject(deletRef);
         }
    };

    const toggleEditting = () => setEditing((prev) => !prev);

    const onChange =  (event) => {
        const {
            target:{value},
        } = event;
       setNewNweet(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, "nweets", nweetObj.id), { text: newNweet });
        setEditing(false);
    }

    return(
        <div className="nweet"> 
           { editing ?
                (<>
                    <form onSubmit={onSubmit}  className="container nweetEdit">
                        <input type="text" placeholder="Edit your nweet" value={newNweet}   className="formInput" onChange ={onChange} autoFocus required/>
                        <input className="formBtn" type="submit" value="Update Nweet"/>
                    </form>
                    <button className="formBtn cancelBtn" onClick={toggleEditting}>Cancel</button>
                </>
                ) : (
                    <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
                        {isOwner && 
                           <div className="nweet__actions"> 
                                <span onClick={onDeleteClick}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </span>
                                <span onClick={toggleEditting}>
                                    <FontAwesomeIcon icon={faPencilAlt} />
                                </span>
                            </div>
                        }
                    </>
                )
           }
        </div>
    );

};

export default Nweet;