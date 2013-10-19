$(document).ready(function(){

    if(localStorage.loginstatus){
        $("#login").hide();
        $("#mygrades").show();
        fetchMyGrades();
    }else{
        $("#schoolid").focus();
    }

    $("#refresh").on("click", function(){
       fetchMyGrades(); 
    });
    
    //login form submission    
    $("#theForm").submit(function(event){
        event.preventDefault();
    
        var schoolid = $("#schoolid").val();
        var username = $("#username").val();
        var password = $("#password").val();
    
        $.post("https://www.sycamoreeducation.com/api/v1.0/Login",
            {
                schoolid: schoolid,
                username: username,
                password: password
            }
        ).done(function(data){
            if(data.loginstatus){
                var type = data.entityType;
                if(type == 1){
                    localStorage.setItem("loginstatus", data.loginstatus);
                    localStorage.setItem("key", data.key);
                    localStorage.setItem("schoolid", data.schoolid);
                    localStorage.setItem("firstName", data.firstName);
                    localStorage.setItem("lastName", data.lastName);
                    localStorage.setItem("familyid", data.familyid);
                    localStorage.setItem("studentid", data.studentid);
                    localStorage.setItem("userid", data.userid);
                    localStorage.setItem("entityType", data.entityType);
                    localStorage.setItem("entityKey", data.entityKey);
                    localStorage.setItem("schoolyearid", data.schoolyearid);
                    localStorage.setItem("schoolname", data.schoolname);
                    localStorage.setItem("quarter", data.quarter);
                    
                    fetchMyGrades();
                    
                    clearInputs();        
                    $("#login").hide();
                    $("#mygrades").show();
                }else{
                    $("#message").empty().html("<p class='text-danger'>Sorry. Students only.</p>");
                    setTimeout(function() {
                        $('.text-danger').remove();
                    }, 2000);
                }
            }else{
                $("#message").empty().html("<p class='text-danger'>Login attempt failed!</p>");
                setTimeout(function() {
                    $('.text-danger').remove();
                }, 2000);
            }
        });
    });
    
    //logout button
    $("#logout").on("click", function(){
        localStorage.clear();
        //reset all DOM elements
        $("#mygrades").hide();
        $("#login").show();
        
    });
    
    //helper functions
    function clearInputs() {
        $("#theForm").find("input:text, input:password").val("");
    }
    
    function updateTime(){
        var currentdate = new Date(); 
        var datetime = "<small><em>Last Sync: " + (currentdate.getMonth()+1) + "/"
            + currentdate.getDate() + "/" 
            + currentdate.getFullYear() + " @ "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes()
            + "</em></small>";
        $("#updated").html(datetime);
    }
    
    function fetchMyGrades(){
        var schoolid = localStorage.getItem("schoolid");
        var studentid = localStorage.getItem("studentid");
        var userid = localStorage.getItem("userid");
        var key = localStorage.getItem("key");
        var entityKey = localStorage.getItem("entityKey");
        var schoolyearid = localStorage.getItem("schoolyearid");
        var quarter = localStorage.getItem("quarter");
        var schoolname = localStorage.getItem("schoolname");
        var firstName = localStorage.getItem("firstName");
        var lastName = localStorage.getItem("lastName");

        $("#mygrades h1").html(firstName + " " + lastName + "<small>" + schoolname + "</small>");
        //$("#mygrades > table > thead").text("Name: " + firstName);
    
        var url = "https://www.sycamoreeducation.com/api/v1.0";
        url += "/School/" + schoolid + "/Student/" + studentid + "/Grades";
        
        var table = $("#mygrade_table");
        table.find("tbody > tr").remove();
        
        $.getJSON(url,
            {
                userid: userid,
                key: key,
                entityKey: entityKey,
                schoolyearid: schoolyearid,
                quarter: quarter
            })
            .done(function(data){
                
                $.each(data, function(index, value){
                    if(value.ViewableGrades){
                        var tr = "<tr><td class='classname'>";
                        
                        if (value.ClassName.length > 23) {
                            tr += value.ClassName.substring(0, 20) + "...";
                        }else{
                            tr += value.ClassName + "</td>";
                        }
                        
                        tr += "<td class='number'>" + value.Number + "</td>";
                        tr += "<td class='letter'>" + value.Letter + "</td>";
                        if(value.Comments !== ""){
                            tr += "<td class='comments'>";
                            tr += "<a href='#' data-toggle='tooltip' data-placement='left' title='" + value.Comments + "'>";
                            tr += "...</a></td>";
                        }
                        
                        table.append(tr);
                        $("a").tooltip();
                    }  
                });
                
                updateTime();
            })
            .fail(function(jqxhr, textStatus, error){
               var err = textStatus + ", " + error;
               console.log("Request failed: " + err );
            });
    
    }// end function fetchMyGrades
    
});


