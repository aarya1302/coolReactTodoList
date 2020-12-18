let req = new XMLHttpRequest();
let server_url = "http://127.0.0.1:3000/"
// fetching todos when page is opened
req.open("GET", server_url+"getTodos", true);
req.send();

var todo_array;
/* req.onload = () => {
  const json = JSON.parse(req.responseText);
   json.forEach(element => {
       console.log(element.todo);
       document.getElementById("container").append  (element.todo);
   }) 
} */
$(document).ready(function(){
    
    

    // creating new todos
    
    
    $("#create_button").click(function(){
        
        var input = $("#todo_entry").val();
        
        if (input === ""){
            alert("Please insert your todo")
        }
        console.log(server_url+"todo/"+input);
        
        req.open("POST", server_url+"todo/"+input, true);
        req.send();

        req.onload = () => {
            console.log("got your shit back")
        }
        
        
        
    })
}); 