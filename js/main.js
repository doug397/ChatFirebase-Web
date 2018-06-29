      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyCI8DmQ5LShsZw3UGUYNKjOY9JxoR5qdXs",
        authDomain: "chatweb-a7d86.firebaseapp.com",
        databaseURL: "https://chatweb-a7d86.firebaseio.com",
        projectId: "chatweb-a7d86",
        storageBucket: "chatweb-a7d86.appspot.com",
        messagingSenderId: "438627184960"
      };
      firebase.initializeApp(config);

 $(document).ready(function(){
    $('.materialboxed').materialbox().click(function(){
        
        alert("Clicjou");
    });
     console.log("Jquery entrou");
  });



function cadastrar(){
    const email= document.getElementById('email').value;
    const senha= document.getElementById('senha').value;

    firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then(function(){
        console.log("cadsatrado com Sucesso");
    })
     .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
  // ...
    });
   
}

function logar(){
    const email= document.getElementById('email').value;
    const senha= document.getElementById('senha').value;
    firebase.auth().signInWithEmailAndPassword(email, senha)
        .then(function (){
        
        console.log("Logado com Sucesso!");
    })
        .catch(function(error) {
     // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
  // ...
    });
}

function initApp(){
    
    document.getElementById('file').addEventListener('change', handleFileSelect, false);
     // document.getElementById('file').disabled = true;
 
 firebase.auth().onAuthStateChanged(function(user) {

      if (user) {
        
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
          console.log(email);
       // var providerData = user.providerData;
       firebase.database().ref('usuarios/javascript/' + uid).set({
        displayName: displayName,
        email: email,
        uid : uid,
        emailVerified :emailVerified,
        photoURL : photoURL,
       // providerData : providerData      
      });    
         
 
     var commentsRef = firebase.database().ref('mensagens/').orderByChild('timestamp');
        commentsRef.on('child_added', function(data) {
         // addCommentElement(postElement, data.key, data.val().text, data.val().author);
              var objScrDiv = document.getElementById("lista-mensagem");
            
              var timestamp   = data.val().timestamp.toString().substring(0,10),
              date = new Date(timestamp * 1000),
              datevalues  = [
                   date.getFullYear(),
                   date.getMonth()+1,
                   date.getDate(),
                   date.getHours(),
                   date.getMinutes(),
                   date.getSeconds(),
                ];
             
            var formatDate =  datevalues[2]+"/"+datevalues[1]+"/"+datevalues[0]+ " "+datevalues[3]+":"+datevalues[4];
             console.log (formatDate);
            
            if(data.val().photo === undefined){
                $('#lista-mensagem').append("<li class='collection-item'>"+
                                                    "<p id='email'><strong>"+data.val().email+" Diz :</strong></h6>"+
                                                    "<p id='mensage' >"+data.val().mensagem+"</p>"+
                                                    "<p id='data' class'right'>"+formatDate+"</p>"+
                                                   "</li> ");
                
                
            }else{
                 $('#lista-mensagem').append("<li class='collection-item'>"+
                                                    "<p id='email'><strong>"+data.val().email+" Diz :</strong></h6><br><br>"+
                                                    " <a href='"+data.val().photo+"'><img  class='materialboxed' id='photo' width='150'  src='"+data.val().photo+"'> </a>"+
                                                    "<p id='data' class'right'>"+formatDate+"</p>"+
                                                   "</li> ");
            }
             
            /*faz com que va pro final da lista*/
            var div = $('#lista-mensagem');
            div.prop("scrollTop", div.prop("scrollHeight"));
        
            /*adiciona no comeco*/
          /*prepend*/
            
        });
          
        loadUsuarios();
          
              
          
      } else {
      console.log("Não há uusuarios");
      }
 });
    
    
      const database = firebase.database().ref();
       const  msgRef=database.child('mensagens');
          
     /*   msgRef.on('value',snap =>{
              var msgs= snap.val();
            
                if(msgs == undefined ){
                 // window.location.reload();
                    $('#lista').prepend("<div class='alert alert-danger' role='alert'> <strong>Não tem Lista</strong> Adicione na Lista</div>");
                }else{
                console.log(msgs);
             
                for (var dados in msgs) {

                    console.log("Data" + ' = ' + msgs[dados].data);
                    var data = msgs[dados].data;
                    var email=  msgs[dados].email;
                    var hora=  msgs[dados].hora;
                    var mensagem= msgs[dados].mensagem;

                   $('#lista-mensagem').prepend("<li class='collection-item'>"+
                                                    "<p>"+email+"</p>"+
                                                    "<p >"+mensagem+"</p>"+
                                                    "<p>"+data+"</p>"+
                                                   "</li> ");
                    }
                
              }
            });*/
    
    
    
    
}

function deslogar(){
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    });
     
}

function enviarMensagem(){
    const messaging = firebase.messaging();
    messaging.requestPermission().then(function() {
    console.log('Notification permission granted.');
        
     
    }).catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
    
    
    const user = firebase.auth().currentUser;
    var mensagem= document.getElementById('mensagem').value;
    
    if (user) {
        
        const data = new Date();
        const uid =user.uid;
        const email =user.email;
        
         var mensagemUser = {
            uid: uid,
            email: email,
            mensagem: mensagem,
            data:  data.getDate()+'/'+data.getMonth()+'/'+data.getFullYear(),
            hora: data.getHours()+':'+data.getMinutes()+':'+data.getSeconds(),
            timestamp: firebase.database.ServerValue.TIMESTAMP
          };

         // Get a key for a new Post.
      var newMsgKey = firebase.database().ref().child('mensagens').push().key;
        
      var updates = {};
        
      updates['/mensagens/' + newMsgKey] = mensagemUser;
  
      firebase.database().ref().update(updates);
        var mensagem= document.getElementById('mensagem').value=' ';
  
        
    } else {
      console.log("Para mandar msgn precisa estar logado");
    }    
    
}


 function handleFileSelect(evt) {
      const storageRef = firebase.storage().ref();
      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];
      console.log(file.name);
     
      
    const user = firebase.auth().currentUser;
    var mensagem= document.getElementById('mensagem').value;
    
     
     
      var metadata = {
        'contentType': file.type
      };

     var urlImage ;
      // Push to child path.
      // [START oncomplete]
      storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        snapshot.ref.getDownloadURL().then(function(url) {
          console.log('File available at', url);
          // [START_EXCLUDE]
            urlImage=url;
          document.getElementById('linkbox').innerHTML = '<a href="' +  url + '">Click For File</a>';
            
            /*Outra parte do codigo para mostra a url de mensga*/
            
          if (user) {

            const data = new Date();
            const uid =user.uid;
            const email =user.email;

             var mensagemUser = {
                uid: uid,
                email: email,
                data:  data.getDate()+'/'+data.getMonth()+'/'+data.getFullYear(),
                hora: data.getHours()+':'+data.getMinutes()+':'+data.getSeconds(),
                timestamp: firebase.database.ServerValue.TIMESTAMP, 
                photo : urlImage
              };

             // Get a key for a new Post.
          var newMsgKey = firebase.database().ref().child('mensagens').push().key;

          var updates = {};

          updates['/mensagens/' + newMsgKey] = mensagemUser;

          firebase.database().ref().update(updates);
            var mensagem= document.getElementById('mensagem').value=' ';


        }
       /* Fim Outra parte do codigo para mostra a url de mensga*/ 
            
              
          // [END_EXCLUDE]
        });
      }).catch(function(error) {
        // [START onfailure]
        console.error('Upload failed:', error);
        // [END onfailure]
      });
      // [END oncomplete]
 }

function loadUsuarios(){
    
              
        const database = firebase.database().ref();
        const  userRef=database.child('usuarios/').child('/javascript/');
        userRef.on('child_added',function(data){

             var email = data.val().email;


             $('#lista-user').append("<li class='collection-item'><i class='material-icons left' style='font-size:48px;'>account_circle</i>"+
                      "<span class='title'>"+email+"</span>"+
                     "<p>First Line <br>"+
                      "</p></li>");

            console.log(email);
        });
    
}



window.onload = function() {
    initApp();

}


