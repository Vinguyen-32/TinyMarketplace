let topnav = document.getElementById("topnav");
var currentUser = JSON.parse(localStorage.getItem("currentUser" || "{}")); 

console.log("was ehe")
topnav.innerHTML = `<header>
<div class="container">
    <div class="header-data">
        <div class="logo">
            
            <a href="index.html" title=""><img style="transform: rotateX(180deg);" src="images/logo.png" alt=""></a>
        </div>
        <!--logo end-->
        <div class="search-bar">
            <form>
                <input type="text" name="search" placeholder="Search...">
                <button type="submit"><i class="fas fa-search"></i></button>
            </form>
        </div>
        <!--search-bar end-->
        <nav>
            <ul>
                <li>
                    <a href="/landingPage" title="">
                        <span><img src="images/icon1.png" alt=""></span>
                        Home
                    </a>
                </li>
                <li>
                    <a href="/personal?profileId=${currentUser.id}" title="">
                        <span><img src="images/icon4.png" alt=""></span>
                        Profiles
                    </a>
                    <!-- <ul>
                        <li><a href="user-profile.html" title="">User Profile</a></li>
                        <li><a href="my-profile-feed.html" title="">my-profile-feed</a></li>
                    </ul> -->
                </li>
                <li>
                    <a href="#" title="" class="not-box-openm">
                        <span><img src="images/icon6.png" alt=""></span>
                        Messages
                    </a>
                    <div class="notification-box msg" id="message">
                        <div class="nt-title">
                            <h4>Setting</h4>
                            <a href="#" title="">Clear all</a>
                        </div>
                        <div class="nott-list">
                            <div class="notfication-details">
                                <div class="noty-user-img">
                                    <img src="images/ny-img1.png" alt="">
                                </div>
                                <div class="notification-info">
                                    <h3><a href="messages.html" title="">Jassica William</a> </h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do.</p>
                                    <span>2 min ago</span>
                                </div>
                                <!--notification-info -->
                            </div>
                            <div class="notfication-details">
                                <div class="noty-user-img">
                                    <img src="images/ny-img2.png" alt="">
                                </div>
                                <div class="notification-info">
                                    <h3><a href="messages.html" title="">Jassica William</a></h3>
                                    <p>Lorem ipsum dolor sit amet.</p>
                                    <span>2 min ago</span>
                                </div>
                                <!--notification-info -->
                            </div>
                            <div class="notfication-details">
                                <div class="noty-user-img">
                                    <img src="images/ny-img3.png" alt="">
                                </div>
                                <div class="notification-info">
                                    <h3><a href="messages.html" title="">Jassica William</a></h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                        eiusmod tempo incididunt ut labore et dolore magna aliqua.</p>
                                    <span>2 min ago</span>
                                </div>
                                <!--notification-info -->
                            </div>
                            <div class="view-all-nots">
                                <a href="messages.html" title="">View All Messsages</a>
                            </div>
                        </div>
                        <!--nott-list end-->
                    </div>
                    <!--notification-box end-->
                </li>
                <li>
                    <a href="#" title="" class="not-box-open">
                        <span><img src="images/icon7.png" alt=""></span>
                        Notification
                    </a>
                    <div class="notification-box noti" id="notification">
                        <div class="nt-title">
                            <h4>Setting</h4>
                            <a href="#" title="">Clear all</a>
                        </div>
                        <div class="nott-list">
                            <div class="notfication-details">
                                <div class="noty-user-img">
                                    <img src="images/ny-img1.png" alt="">
                                </div>
                                <div class="notification-info">
                                    <h3><a href="#" title="">Jassica William</a> Comment on your project.
                                    </h3>
                                    <span>2 min ago</span>
                                </div>
                                <!--notification-info -->
                            </div>
                            <div class="notfication-details">
                                <div class="noty-user-img">
                                    <img src="images/ny-img2.png" alt="">
                                </div>
                                <div class="notification-info">
                                    <h3><a href="#" title="">Jassica William</a> Comment on your project.
                                    </h3>
                                    <span>2 min ago</span>
                                </div>
                                <!--notification-info -->
                            </div>
                            <div class="notfication-details">
                                <div class="noty-user-img">
                                    <img src="images/ny-img3.png" alt="">
                                </div>
                                <div class="notification-info">
                                    <h3><a href="#" title="">Jassica William</a> Comment on your project.
                                    </h3>
                                    <span>2 min ago</span>
                                </div>
                                <!--notification-info -->
                            </div>
                            <div class="notfication-details">
                                <div class="noty-user-img">
                                    <img src="images/ny-img2.png" alt="">
                                </div>
                                <div class="notification-info">
                                    <h3><a href="#" title="">Jassica William</a> Comment on your project.
                                    </h3>
                                    <span>2 min ago</span>
                                </div>
                                <!--notification-info -->
                            </div>
                            <div class="view-all-nots">
                                <a href="#" title="">View All Notification</a>
                            </div>
                        </div>
                        <!--nott-list end-->
                    </div>
                    <!--notification-box end-->
                </li>
                <li>
                    <a href="/shoppingCart?profileId=${currentUser.id}" title="">
                        <span><i class="fas fa-shopping-cart"></i></span>
                        Cart
                    </a>
                </li>
            </ul>
        </nav>
        <!--nav end-->
        <div class="menu-btn">
            <a href="#" title=""><i class="fa fa-bars"></i></a>
        </div>
        <!--menu-btn end-->
        <div class="user-account">
            <div class="user-info">
                <img src="${currentUser.avatar || "User"}" width="30" height="30" alt="">
                <a href="/personal?profileId=${currentUser.id}" title="">${currentUser.firstName || "User"}</a>
                <i class="fas fa-sort-down"></i>
            </div>
            <div class="user-account-settingss">
                <!-- <h3>Online Status</h3>
                <ul class="on-off-status">
                    <li>
                        <div class="fgt-sec">
                            <input type="radio" name="cc" id="c5">
                            <label for="c5">
                                <span></span>
                            </label>
                            <small>Online</small>
                        </div>
                    </li>
                    <li>
                        <div class="fgt-sec">
                            <input type="radio" name="cc" id="c6">
                            <label for="c6">
                                <span></span>
                            </label>
                            <small>Offline</small>
                        </div>
                    </li>
                </ul>
                <h3>Custom Status</h3>
                <div class="search_form">
                    <form>
                        <input type="text" name="search">
                        <button type="submit">Ok</button>
                    </form>
                </div>
                <h3>Setting</h3>
                <ul class="us-links">
                    <li><a href="profile-account-setting.html" title="">Account Setting</a></li>
                    <li><a href="#" title="">Privacy</a></li>
                    <li><a href="#" title="">Faqs</a></li>
                    <li><a href="#" title="">Terms & Conditions</a></li>
                </ul> -->
                <h3 class="tc"><a href="/login" title="">Logout</a></h3>
            </div>
            <!--user-account-settingss end-->
        </div>
    </div>
    <!--header-data end-->
</div>
</header>`