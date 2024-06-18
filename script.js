let playlist = [];
let currentSongIndex = 0;

const searchSong = () => {
    let songName = document.getElementById('search-field').value;
    fetch(`https://api.lyrics.ovh/suggest/${songName}`)
        .then(res => res.json())
        .then(data => displaySong(data.data));
}

const displaySong = songs => {
    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML = '';
    songs.forEach(song => {
        const songDiv = document.createElement("div");
        songDiv.className = "single-result row align-items-center my-3 p-3";
        songDiv.innerHTML = `
            <div class="col-lg-2 text-center">
                <img src=${song.album.cover_medium} style="height: 50px;" alt=""/>
            </div>
            <div class="col-lg-4 text-center">
                <h3 class="lyrics-name">${song.title}</h3>
                <p class="author lead">Album by <span>${song.artist.name}</span></p>
            </div>
            <div class="col-lg-6 text-center">
                <button class="control-btn" onclick="playSong(${JSON.stringify(song).replace(/"/g, '&quot;')})">Play</button>
                <button class="control-btn" onclick="addToPlaylist(${JSON.stringify(song).replace(/"/g, '&quot;')})">Add to Playlist</button>
            </div>
        `;
        songContainer.appendChild(songDiv);
    });
}

const addToPlaylist = song => {
    playlist.push(song);
    updatePlaylistUI();
}

const updatePlaylistUI = () => {
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.style.display = 'block';
    playlistContainer.innerHTML = '';
    playlist.forEach((song, index) => {
        const playlistItem = document.createElement("div");
        playlistItem.className = "playlist-item";
        playlistItem.innerHTML = `
            <div>
                <img src=${song.album.cover_small} style="height: 30px; margin-right: 10px;" alt=""/>
                <span>${song.title}</span>
            </div>
            <div>
                <button class="control-btn" onclick="playSongFromPlaylist(${index})">Play</button>
                <button class="control-btn" onclick="removeFromPlaylist(${index})">Remove</button>
            </div>
        `;
        playlistContainer.appendChild(playlistItem);
    });
}

const playSong = song => {
    currentSongIndex = -1;
    displayAudioPlayer(song);
}

const playSongFromPlaylist = index => {
    currentSongIndex = index;
    displayAudioPlayer(playlist[currentSongIndex]);
}

const displayAudioPlayer = song => {
    const audioPlayerContainer = document.getElementById("audio-player-container");
    const audioPlayer = document.getElementById("audio-player");
    audioPlayerContainer.style.display = 'block';
    audioPlayer.innerHTML = `
        <div class="audio-player">
            <div class="current-song">
                <img src=${song.album.cover_medium} style="height: 100px;" alt=""/>
                <h3>${song.title}</h3>
                <p>${song.artist.name}</p>
            </div>
            <audio id="audio" src=${song.preview} controls autoplay></audio>
            <div class="controls">
                <button class="control-btn" onclick="playPrevious()">&#9664;</button>
                <button class="control-btn" onclick="playPause()">&#9654;/&#10074;&#10074;</button>
                <button class="control-btn" onclick="playNext()">&#9654;</button>
            </div>
        </div>
    `;
    const audio = document.getElementById('audio');
    audio.addEventListener('ended', playNext);
}

const playPrevious = () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        playSongFromPlaylist(currentSongIndex);
    }
}

const playNext = () => {
    if (currentSongIndex < playlist.length - 1) {
        currentSongIndex++;
        playSongFromPlaylist(currentSongIndex);
    }
}

const playPause = () => {
    const audio = document.getElementById('audio');
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

const removeFromPlaylist = index => {
    playlist.splice(index, 1);
    updatePlaylistUI();
}

const showSongList = () => {
    document.getElementById("playlist-container").style.display = 'block';
    document.getElementById("audio-player-container").style.display = 'none';
    document.getElementById("song-container").style.display = 'block';
}

const hideAudioPlayer = () => {
    document.getElementById("audio-player-container").style.display = 'none';
    document.getElementById("song-container").style.display = 'block';
}



document.getElementById("playlist-toggle").addEventListener("click", togglePlaylist);
const togglePlayer = () => {
    const playlistContainer = document.getElementById("playlist-container");
    const audioPlayerContainer = document.getElementById("audio-player-container");

    if (audioPlayerContainer.style.display === 'none') {
        audioPlayerContainer.style.display = 'block';
        playlistContainer.style.display = 'none';
    } else {
        audioPlayerContainer.style.display = 'none';
        playlistContainer.style.display = 'block';
    }
}
