var numberButton = document.getElementById('numberButton')
var validateButton = document.getElementById('validate')
var profile = document.getElementById('profile')
var login = document.getElementById('login')


//check if user is logged
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user.uid))                
        showProfile(user.uid)
    } else {
        hideProfile()
    }
  });
    

//login number
numberButton.addEventListener('click', function(){
    var number = document.getElementById('number').value
    console.log(number)
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    var appVerifier = window.recaptchaVerifier;
    
 
    firebase.auth().signInWithPhoneNumber(number, appVerifier)
        .then(function (confirmationResult) {                
        console.log(confirmationResult)
        
        //confirm(code)
        window.confirmationResult = confirmationResult                       

        }).catch(function (error) {
        // Error; SMS not sent
        console.log(error)
        // ...
        });

})


//validateUser
validateButton.addEventListener('click', function(){
    var code = document.getElementById('code').value
    console.log(code)
    window.confirmationResult.confirm(code)
    .then(function (result) {
    // User signed in successfully.
        var user = result.user;
        console.log(user)
        firebase.database().ref('phone/users/'+user.uid).update({
            uid:user.uid,
            phoneNumber:user.phoneNumber
        })
        showProfile(user.uid)
    
    // ...
    }).catch(function (error) {
    // User couldn't sign in (bad verification code?)
    // ...
    console.log(error)
    });
})   

function showProfile(uid){
    profile.setAttribute('class', 'show')
    login.setAttribute('class', 'hide')

    firebase.database().ref('phone/users/'+uid).on('value', function(res){
        console.log(res.val())
        document.getElementById('phone').value = res.val().phoneNumber
        document.getElementById('name').value = res.val().name
        document.getElementById('instagram').value = res.val().instagram
    })
}

function hideProfile(){
    profile.setAttribute('class', 'hide')
    login.setAttribute('class', 'show')
}


var editar = document.getElementById('editar')
editar.addEventListener('click', function(){
    var uid = JSON.parse(localStorage.getItem('user'))
    console.log(uid)
    var name = document.getElementById('name').value
    var instagram = document.getElementById('instagram').value
    firebase.database().ref('phone/users/'+uid).update({
        name:name,
        instagram:instagram
    })
})

//logout
var logout = document.getElementById('logout')
logout.addEventListener('click', function(){
    firebase.auth().signOut().then(function() {
        hideProfile()
        localStorage.removeItem('user')
      }).catch(function(error) {
        console.log(error)
      });
})
          

    