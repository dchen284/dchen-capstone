//External Imports
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
//Internal Imports
import * as errorsActions from '../../store/error';
import * as favoritePlayerActions from '../../store/favorite_player';
import * as playSessionActions from '../../store/playsession';
import FavoriteButton from '../utils/FavoriteButton';

const TablePlaySessions = () => {

    //hooks and state variables
    const dispatch = useDispatch();
    // const favoritePlayers = useSelector(state => state.favoritePlayers);
    const playSessionsOfBoard = useSelector((state) => state.playSessions.boardSessions);
    const playSessionsOfBoardValues = Object.values(playSessionsOfBoard).sort((a, b) => b.score - a.score);
    const playSessionsOfUser = useSelector((state) => state.playSessions.userSessions);
    const playSessionsOfUserValues = Object.values(playSessionsOfUser).sort((a, b) => b.score - a.score);
    const loggedInUser = useSelector((state) => state.session.user);
    // const [isLoaded, setIsLoaded] = useState(false);

    const { boardId, userId } = useParams();

    const [errors, setErrors] = useState([]);
    const errorsFromStore = useSelector(state => state.errors);

    useEffect(() => {
        if (boardId) {
            dispatch(playSessionActions.fetchPlaySessionsOfBoard(boardId));
        }
        if (userId) {
            dispatch(playSessionActions.fetchPlaySessionsOfUser(userId));
        }
        // setIsLoaded(true)
    }, [dispatch, boardId, userId]);

    useEffect(() => {
        dispatch(favoritePlayerActions.fetchAllFavoritesOfUser(loggedInUser.id));
    }, [dispatch, loggedInUser]);

    useEffect(() => {
        if (errorsFromStore.length) {
            console.log('got here');
            setErrors(errorsFromStore);
            dispatch(errorsActions.clearErrors());
        }
    }, [dispatch, errorsFromStore, setErrors]);

    // useEffect(() => {
    //     setIsLoaded(false);
    //     if (boardId) {
    //         dispatch(playSessionActions.fetchPlaySessionsOfBoard(boardId));
    //     }
    //     if (userId) {
    //         dispatch(playSessionActions.fetchPlaySessionsOfUser(userId));
    //     }
    //     if (!isLoaded) {
    //         dispatch(favoritePlayerActions.fetchAllFavoritesOfUser(loggedInUser.id));
    //     }
    //     setIsLoaded(true);
    // }, [dispatch, boardId, userId, loggedInUser]);

    const isIndexOdd = (index) => {
        if (index % 2 === 1) {return 'pure-table-odd'}
        else {return 'pure-table-even'}
    }

    // JSX

    // if (!isLoaded) {
    //     return null;
    // }

    if (errors.length) {
        return (
        <ul>
            {errors.map(error => {
                return (
                    <li key={error}>{error}</li>
                )
            })}
        </ul>)
    }

    if (boardId) { //Display for play sessions of board
        return (
            <div className="tabledisplay_container">
                <div className="tabledisplay_text">
                    <h1>Play Sessions of Board #{boardId}</h1>
                    <table className="pure-table">
                        <thead>
                            <tr>
                                <th>Play Session #</th>
                                <th>Username</th>
                                <th>Favorite Player?</th>
                                <th>Play Session Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playSessionsOfBoardValues.map( (playSession, index) => {
                            return (
                                <tr key={playSession.id} className={isIndexOdd(index)}>
                                    <td>
                                        <Link to={`/playsession/${playSession.id}`}>
                                            Session #{playSession.id}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/users/${playSession.user_id}/playsessions`}>
                                            {playSession.username}
                                        </Link>
                                    </td>
                                    <td><FavoriteButton loggedInUserId={loggedInUser.id} favoriteId={playSession.user_id}/></td>
                                    <td>{playSession.score}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    if (userId) { //Display for play sessions of user

        let usernameOfPage = playSessionsOfUserValues.length ? playSessionsOfUserValues[0].username : null

        return (
            <div className="tabledisplay_container">
                <div className="tabledisplay_text">
                    <h1>Play Sessions of {usernameOfPage}
                        <FavoriteButton loggedInUserId={loggedInUser.id} favoriteId={userId}/>
                    </h1>
                    <table className="pure-table">
                        <thead>
                            <tr>
                                <th>Play Session #</th>
                                <th>Board #</th>
                                <th>Play Session Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playSessionsOfUserValues.map( (playSession, index) => {
                            return (
                                <tr key={playSession.id} className={isIndexOdd(index)}>
                                    <td>
                                        <Link to={`/playsession/${playSession.id}`}>
                                            Session #{playSession.id}
                                        </Link>
                                    </td>
                                    <td>{playSession.board_id}</td>
                                    <td>{playSession.score}</td>
                                </tr>

                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    // if (isLoaded && boardId && !playSessionsOfBoardValues.length) {
    //     return (
    //         <div>404: This Board ID doesn't exist, please select Boards from the navigation bar.</div>
    //     )
    // }

    // if (isLoaded && userId && !playSessionsOfUserValues.length) {
    //     return (
    //         <div>404: This Player ID doesn't exist, please select Players from Favorites or Leaderboard.</div>
    //     )
    // }
}

export default TablePlaySessions;
