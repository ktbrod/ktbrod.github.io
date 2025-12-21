
$(document).ready(function() {
    // Toggle text visibility
    $("#toggleText").click(function() {
        $("#textToToggle").toggle();
    });

    // AJAX request to load data
    $("#loadData").click(function() {
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts/1",
            type: "GET",
            success: function(data) {
                $("#ajaxData").html("<h3>" + data.title + "</h3><p>" + data.body + "</p>");
            },
            error: function() {
                $("#ajaxData").html("<p>Error loading data</p>");
            }
        });
    });
});
