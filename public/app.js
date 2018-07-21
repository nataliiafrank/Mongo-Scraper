$("#scrape").on("click", () => {
    $.get('/scrape', (req, res) => {
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

    $.post("/saved/" + id, function(req, res){
        console.log("Made post request")
        $('.modal').modal('open');
    })
})


$(".delete-saved").on("click", function() {
    const id = $(this).data("id");
    console.log(id)

    $.get("/delete/" + id, function(req, res){
        if(res){
        console.log("Deleted the article");
        location.reload();
        } else {
            alert("Delete didn't work!")
        }
    })
})

$(".clear-all").on("click", function() {

    $.get("/delete-all", function(req, res){
        if(res){
        location.reload();
        } else {
            alert("Delete didn't work!")
        }
    })
})
  // Or with jQuery

  $(document).ready(function(){
    $('.modal').modal();
  });
