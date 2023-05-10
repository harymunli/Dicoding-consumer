const { Pool } = require('pg');
const NotFoundError = require('./NotFoundError');
 
class PlaylistService {
  constructor() {
    this._pool = new Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
      });
  }

  async getSongsFromPlaylist(playlist_id){
    let query = {
        text: `Select Distinct d.id, d.name
        from playlist as d inner join playlist_songs as e
        on d.id = e.playlist_id
        inner join users as f
        on d.owner = f.id
        where e.playlist_id = $1`,
        values:[playlist_id]
    }

    let result1 = await this._pool.query(query);
    if (!result1.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
    }

    query = {
        text: `select f.id, f.title, f.performer
        from playlist_songs as e
        inner join song as f 
        on e.song_id = f.id
        where e.playlist_id = $1`, 
        values:[playlist_id]
    }
    let result2 = await this._pool.query(query);

    if (!result2.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan');
    }
    let formated = new Object();

    result1.rows[0]['songs'] =  result2.rows;
    formated["playlist"] = result1.rows[0];
    return formated;
  }
}

module.exports = PlaylistService;