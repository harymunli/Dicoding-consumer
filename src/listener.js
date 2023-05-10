class Listener {
    constructor(playlistServer, mailSender) {
        this._playlistServer = playlistServer;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    }
    async listen(message){
        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());
            const playlist = await this._playlistServer.getSongsFromPlaylist(playlistId);
            //console.log(JSON.stringify(playlist));
            await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlist));
        } catch(error) {
            console.log(error);
        }
    }
}
module.exports = Listener;