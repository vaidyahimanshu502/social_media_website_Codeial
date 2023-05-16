function toggleFriend(toggleFriendBtn){
    // console.log(toggleFriendBtn);
    console.log($(toggleFriendBtn));
    $(toggleFriendBtn).click((e) =>{
        e.preventDefault();
        $.ajax({
            type : "GET",
            url : $(toggleFriendBtn).attr("href"),
            success : (data) =>{
                console.log(data.deleted);
                if(!data.deleted){
                    $(toggleFriendBtn).html("Add Friend")
                }else{
                    $(toggleFriendBtn).html("Remove Friend")
                }  
            },
            error : (error) =>{
                console.log(error.responseText);
         }        
     })
  })
}

toggleFriend($(".toggle-friend-btn"));
