import React, {useState, useContext} from 'react';
import axios from 'axios/index';
import {Token, HomeDispatch, DarkMode} from '../home/Home';
import EditBookmark from './EditBookmark';


function Bookmark(props) {

    const token = useContext(Token);
    const darkMode = useContext(DarkMode);
    const dispatch = useContext(HomeDispatch);

    let book = props.bookmark;

    const id = book._id;
    const date = book.addDate;
    const parent = book.parentId;

    const [title, setTitle] = useState(book.title);
    const [url, setUrl] = useState(book.url);
    const [fave, setFave] = useState(book.fave);

    const faveChange = () => {

        // Update favorite status in database
        axios.post('https://astrostore.io/api/bookmark/fave',
            {parentId: parent, addDate: date, fave: !fave},
            {headers: {Authorization: `JWT ${token}`}}
        );

        // Update favorite status in local 'book' object
        book.fave = !book.fave;

        // Update favorite status in the general app state with updated 'book' object
        if (fave) {
            dispatch({type: 'deleteFave', id: id});
        } else {
            dispatch({type: 'addFave', payload: book});
        }

        setFave(!fave);
    };

    const updateBookmark = (someTitle, someUrl) => {
        axios.post('https://astrostore.io/api/bookmark/update',
            {parentId: parent, addDate: date, title: someTitle, url: someUrl},
            {headers: {Authorization: `JWT ${token}`}}
        ).then(res => {
            if (res.data.success === true) {
                setTitle(someTitle);
                setUrl(someUrl);
                dispatch({
                    type: 'updateBook',
                    pId: parent,
                    payload: {title: someTitle, url: someUrl, id: id}
                });
                if (fave) {
                    dispatch({
                        type: 'updateFave',
                        payload: {id: id, title: someTitle, url: someUrl}
                    });
                }
            }
        });
    };

    const bookDelete = () => {
        props.delete(parent, date, id);
    };

    return (
        <div className="bookRow" >

            <div className="borderCont">

                <div className="favColumn" onClick={() => faveChange()}>
                    <img className={'faveIcon ' + (!fave && 'unFave ')} src={require('./moon.png')} alt='Dark Mode Indicator' />
                </div>

                <div className='titleColumn'>
                    <a className={"bookTitle " + (darkMode && 'darkGlow')} href={url} target="_blank" rel="noopener noreferrer" >{title}</a>
                </div>

                <div className="controls">
                    <EditBookmark title={title} url={url} update={updateBookmark} delete={bookDelete} />
                </div>

            </div>

        </div>
    );
}

export default Bookmark;