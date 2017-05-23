//variables
var commentRef = firebase.database().ref("/Comments");
var provider1 = new firebase.auth.GithubAuthProvider();
var provider2 = new firebase.auth.GoogleAuthProvider();
var UserToken = null;


//functions
function authenticateGit(){
    firebase.auth().signInWithPopup(provider1).then(function(result) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
        UserToken = user;
    
    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    
    console.log(error.message);
  
    
        // return null;
    });
}//authenticate function git


function authenticateGoogle(){
    firebase.auth().signInWithPopup(provider2).then(function(result) {
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
        UserToken = user;
        
    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log(error.message);
        
        // return null;
    });
    
}//authenticate function google

function commentsDraw(comment, snapshot){
    
    var list = document.getElementById("comments");
    
    var linkContainer = document.createElement("a");
    linkContainer.setAttribute("class","list-group-item list-group-item-action flex-column align-items-start");
    
    var headContainer = document.createElement("span");
    headContainer.setAttribute("class"," row");
    
    var commentPicElement = document.createElement("img");
    commentPicElement.setAttribute("src",comment.userPic);
    commentPicElement.setAttribute("class","comment-profile-pic");
    
    var commentNameElement = document.createElement("h4");
    var commentUName = document.createTextNode(comment.userName);
    commentNameElement.setAttribute("class", "mb-1");
    commentNameElement.appendChild(commentUName);
    
    var commentTextElement = document.createElement("p");
    var commentText = document.createTextNode(comment.comment);
    commentTextElement.appendChild(commentText);
    commentTextElement.setAttribute("class","mb-1");
    
    headContainer.appendChild(commentPicElement);
    headContainer.appendChild(commentNameElement);
    
    // linkContainer.appendChild(commentPicElement);
    // linkContainer.appendChild(commentNameElement);
    linkContainer.appendChild(headContainer);
    linkContainer.appendChild(commentTextElement);
    
    
    list.appendChild(linkContainer);
    
}

function editCommentData(commentId, commentData) {
  firebase.database().ref('Comments/' + commentId).set({
    comment: commentData 
  });
}//could use this as a overwrite


function readCommentData(){
    
    var commentsRef = firebase.database().ref('Comments/');
    commentsRef.on('child_added', function(snapshot) {
        commentsDraw(snapshot.val());
    
    });
    
}//read/update comment section

function addComment(){
    
    var commentData = document.getElementById("commentData").value;
    document.getElementById("commentData").value  = "";
    
    var ProfilePic;
    
    
    
    
    if(UserToken == null){
        alert("You need to login first");
    }else{
    
        if( UserToken.photoURL == null ){
            ProfilePic = "https://www.appointbetterboards.co.nz/Custom/Appoint/img/avatar-large.png";
        }else{ ProfilePic = UserToken.photoURL; }
    
    
        commentRef.push({
            userName: UserToken.displayName,
            userPic: ProfilePic,
            userId: UserToken.uid,
            comment: commentData
            });
        
    }
}

function logout()
{
    //uses a promise to detect success/error
    firebase.auth().signOut().then(function()
    {
        console.log("Logged Out");
    },
    function(error)
    {
        console.log("Something went wrong, is this helpful?");
    });
}//logout function


readCommentData();
