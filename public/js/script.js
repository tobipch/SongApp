$(document).ready(function(){
    var m_song = Backbone.Model.extend({
        defaults: {
            songTitle: "Song Title",
            interpreter: "Interpreter",
            releaseYear: "Release Year"
        }
    });
    
    var c_songList = Backbone.Collection.extend({
        model: m_song
    });
    
    var v_songList = Backbone.View.extend({
        el: $("body"),
        
        events: {
            "click #addSongBtn" : "addSong",
            "click .song": "deleteSong"
        },
        
        initialize: function(){
            _.bindAll(this, "render","addSong","appendSong");
            
            this.collection = new c_songList();
            this.collection.bind("add",this.appendSong);
            
            this.counter = 0;
            this.render();
        },
        
        render: function(){
            this.$el.empty();
            var self = this;
            $(this.el).append("<input type='text' placeholder='Song Title' id='songTitleInput'></input>");
            $(this.el).append("<input type='text' placeholder='Interpreter' id='interpreterInput'></input>");
            $(this.el).append("<input type='text' placeholder='Release Year' id='releaseYearInput'></input>");
            $(this.el).append("<input type='button' id='addSongBtn' value='Add Song'/>");
            $(this.el).append("<ul id='songList'></ul>");
            
            _(this.collection.models).each(function(song){
                self.appendSong(song);
            },this);
        },
        
        addSong: function(p_songTitle, p_interpreter, p_releaseYear, addSongToDB){
            if(addSongToDB !== false) addSongToDB = true;
            this.counter++;
            var song = new m_song();
            if(typeof p_songTitle != "string")p_songTitle="";
            song.set({
                songTitle: p_songTitle || $("#songTitleInput").val(),
                interpreter: p_interpreter || $("#interpreterInput").val(),
                releaseYear: p_releaseYear || $("#releaseYearInput").val()
            });
            this.collection.add(song);
            
            if(addSongToDB){
                //Add Song to MongoDB
                var sendData = {
                    songTitle: p_songTitle || $("#songTitleInput").val(),
                    interpreter: p_interpreter || $("#interpreterInput").val(),
                    releaseYear: p_releaseYear || $("#releaseYearInput").val()
                };
                
                $.ajax({
                    type: "post",
                    url: "/newSong",
                    async: true,
                    dataType: "json",
                    data: sendData
                });
            }
        },
        
        appendSong: function(song){
            $("ul",this.el).append("<li class='song' id=" + song.cid + "><b>" + song.get("songTitle") + "</b> - " + song.get("interpreter") + " <i>(" + song.get("releaseYear") + ")</i></li>")
        },
        
        deleteSong: function(song){
            if(confirm("Delete this song?")){
                //Get Song-CID and related element
                var songid = song.target.id || song.currentTarget.id;
                var element = this.collection.get(songid);
                
                //Delete song from MongoDB
                var sendData = {
                    songTitle: element.attributes.songTitle,
                    interpreter: element.attributes.interpreter,
                    releaseYear: element.attributes.releaseYear,
                }

                $.ajax({
                    type: "post",
                    url: "/deleteSong",
                    async: true,
                    dataType: "json",
                    data: sendData
                });

                //Delete element from Collection
                this.collection.remove(element);


                //Re-render
                this.render();
            };
        }
    });
    
    //Create new SongList
    var songList = new v_songList();
    
    //Load Songs from MongoDB and add them to songList-Collection
    $.ajax({
        type: "post",
        url: "/getSongs",
        async: true,
        dataType: "json",
        success: function(resArr){
            for(index in resArr){
                var local_songTitle = resArr[index].songTitle;
                var local_interpreter = resArr[index].interpreter;
                var local_releaseYear = resArr[index].releaseYear;
                
                songList.addSong(local_songTitle, local_interpreter, local_releaseYear, false);
            }
        }
    });
});