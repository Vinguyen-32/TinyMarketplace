let friendList_sidebar = document.getElementById("friends_wiget");
let payload = `
    <div class="widget widget-portfolio">
        <div class="wd-heady">
            <h3>Friends</h3>
        </div>
        <div class="search_form">
            <form>
                <input type="text" name="search" placeholder="Search..." onkeyup="renderFriendWidgetContent(this.value)">
            </form>
        </div>
        <div class="">
            <table class="table">
                <tbody id="friendWidgetContent">
                </tbody>
            </table>     
        </div>
    </div>`

friendList_sidebar.innerHTML = payload;

function renderFriendWidgetContent(search = ""){
    return $.ajax({
        type: "GET",
        url: (`/api/users/${currentUser.id}/friends?search=${search}`),

        success: function (body, res, xhr) {
            const friends = body || [];
            let payload = ""
            friends.map(function(friend){
                payload +=
                    `<tr>
                        <td>${friend.firstName || "User"} ${friend.lastName || ""}</td>
                        <td class="row d-flex justify-content-end"><i class="far fa-comment-dots"></i></td>
                    </tr>`
                
            })
            let friendWidgetContent = document.getElementById("friendWidgetContent");
            friendWidgetContent.innerHTML = payload;

        }
    })
}

renderFriendWidgetContent();