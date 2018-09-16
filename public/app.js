// Grab the articles as a json
$.getJSON("/articles", function(data) {

  // For each one
  for (var i = 0; i < data.length; i++) {

      $("#articles").append(
        `<div class="container">
          <div class = "row">

            <div class="card" style = "border: black 1px solid; width: 80%; margin: 10px 0px 10px 20px;">
              <div>


                  <div class="card-header" style ="font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;">
                    Job Title: ${data[i].title}
                  </div>

                  <div style="margin: 20px;">
                    Job Location: ${data[i].location}
                  </div>
                  
                  <div style="margin: 20px;">
                    Job link: <a href="${data[i].link}" target="_blank">${data[i].link}</a>

                  </div>
                
              </div>

              <br>
              
              <div>
                <button type="button" class="btn btn-light" style="width:100%;" data-toggle="modal" data-id="${data[i]._id}" id="noteButton" data-target="#NotesModal">Click Here to Take Notes!</button>
              </div>

            </div>

          </div>
        </div>
        `)
  };
})

// Grab the articles as a json
$("#scrape").on("click", function() {
  $.ajax({
      method: "GET",
      url: "/scrape",
  }).done(function(data) {
      console.log(data)
      window.location = "/"
  })
});

  
  //TODO - NEED TO CHANGE TO MODAL UPON CLICK THAT WILL SHOW CURRENT AND NEW NOTE INPUT BOX!!!

  // Whenever someone clicks a p tag
  $(document).on("click", "#noteButton", function() {

    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
          

        $("#notes").empty();
        $("#notes").append("<input type='text' class='form-control' id='titleinput' name='title'>");
        $("#notes").append("<textarea type='text' class='form-control' id='bodyinput' name='body'>");
        $("#notes").append("<button type='submit' class='btn btn-success' data-id='" + data._id + "' id='savenote'>Save</button>");
  

        // If there's a note in the article
        if (data.note[0]) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note[0].title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note[0].body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);  
        // Hide modal
        $("#NotesModal").modal("hide");
        // Empty the notes section
        $("#notes").empty();
      });

  });
  