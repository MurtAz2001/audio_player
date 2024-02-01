import React from 'react';
import delete_btn from '../img/trash.png'

const Playlist = ({ playlist, onPlay, onDelete }) => {
  return (
    <ul>
      {playlist.map((track, index) => (
        <li key={index}>
          <span onClick={() => onPlay(index)}>
            {track.name.length > 10 ? `${track.name.slice(0, 8)}` : track.name}
          </span>
          <button onClick={() => onDelete(index)} className='delete_btn'><img src={delete_btn} alt="" /></button>
        </li>
      ))}
    </ul>
  );
};

export default Playlist;
