let followList_sidebar = document.getElementById("follow_wiget");
let followList_sidebar_payload = `
    <div class="widget widget-portfolio">
        <div class="wd-heady">
            <h3>Following</h3>
        </div>
        <div class="search_form">
            <form>
                <input type="text" name="search" placeholder="Search..." onkeyup="renderFollowWidgetContent(this.value)">
            </form>
        </div>
        <div class="">
            <table class="table">
                <tbody id="followWidgetContent">
                </tbody>
            </table>     
        </div>
    </div>`

followList_sidebar.innerHTML = followList_sidebar_payload;

function renderFollowWidgetContent(search = ""){
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
            let followWidgetContent = document.getElementById("followWidgetContent");
            followWidgetContent.innerHTML = payload;

        }
    })
}

renderFollowWidgetContent();