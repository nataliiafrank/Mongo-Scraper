$("#scrape").on("click", () => {
    $.get('/scrape', (res) => {
        // $('.modal').modal('open');
        if(res){
            
            location.reload();
        } else {
            alert("Scraping didn't work!")
        }
    })
})


$(".save").on("click", function() {
    const id = $(this).data("id");
    console.log(id)

    $.post("/saved/" + id, function(res){
        console.log("Made post request")
        $('.modal').modal('open');
    })
})


$(".delete-saved").on("click", function() {
    const id = $(this).data("id");
    console.log(id)

    $.get("/delete/" + id, function(res){
        if(res){
        console.log("Deleted the article");
        location.reload();
        } else {
            alert("Delete didn't work!")
        }
    })
})

$(".clear-all").on("click", function() {

    $.get("/delete-all", function(res){
        if(res){
        location.reload();
        } else {
            alert("Delete didn't work!")
        }
    });
});

$(".add-note").on("click", function(){
    const id = $(this).data("id"); 
    $("body").data("current-note-id", id);

    $.get("/notes/" + id, function(res){
        console.log("res", res)
        if(res.note.note){
            $(".notes").append(res.note.note);
        } else {
            $(".notes").text("No notes for this article yet");
        }
    })
    
    $('#modal2').modal('open');
});

$(".save-note").on("click", function() {
    // Grab the id associated with the article from the submit button
    const id = $("body").data("current-note-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/notes/" + id,
      data: {
        // Value taken from note textarea
        note: $(".note-body").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        // $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $(".note-body").val("");
  });





  // Or with jQuery

  $(document).ready(function(){
    $('.modal').modal();
  });
