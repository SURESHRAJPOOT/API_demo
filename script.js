document.getElementById("inputForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  var testStringField = document.getElementById("testString");
  var testString = testStringField.value.trim();

  if (testString !== "") {
    var apiUrl = `https://clabs.smarter.codes/nlx/parsetree/test/string/json?test_string=${encodeURIComponent(testString)}`;

    fetch(apiUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error("API request failed");
        }
        return response.json();
      })
      .then(function(data) {
        var outputContainer = document.getElementById("outputContainer");
        outputContainer.innerHTML = ""; // Clear previous output

        var entities = data.entities;

        if (Object.keys(entities).length > 0) {
          var table = document.createElement("table");
          table.classList.add("table", "table-bordered");

          // Create table header
          var headerRow = document.createElement("tr");
          var headers = ["Entity Type", "Entity", "Knowledge Base Reference", "Properties"];
          for (var i = 0; i < headers.length; i++) {
            var th = document.createElement("th");
            th.textContent = headers[i];
            headerRow.appendChild(th);
          }
          table.appendChild(headerRow);

          // Create table rows
          for (var key in entities) {
            if (entities.hasOwnProperty(key)) {
              var entityArr = entities[key];
              for (var i = 0; i < entityArr.length; i++) {
                var entity = entityArr[i];
                var row = document.createElement("tr");

                var entityTypeCell = document.createElement("td");
                entityTypeCell.textContent = key;
                row.appendChild(entityTypeCell);

                var entityCell = document.createElement("td");
                var lastWord = entity.surface_text.split("/").pop();
                entityCell.textContent = lastWord;
                row.appendChild(entityCell);

                var uriCell = document.createElement("td");
                var uriLink = document.createElement("a");
                uriLink.href = entity.uri;
                uriLink.textContent = lastWord;
                uriCell.appendChild(uriLink);
                row.appendChild(uriCell);

                var propertiesCell = document.createElement("td");
                var propertiesList = document.createElement("ul");
                propertiesList.classList.add("list-unstyled");

                // Iterate over properties and their values
                for (var prop in entity) {
                  if (entity.hasOwnProperty(prop) && prop !== "surface_text" && prop !== "uri") {
                    var propValue = entity[prop];
                    var propItem = document.createElement("li");

                    // Process links and display only the last word
                    if (propValue.startsWith("http")) {
                      var linkText = propValue.split("/").pop();
                      var link = document.createElement("a");
                      link.href = propValue;
                      link.textContent = linkText;

                      var propName = prop.charAt(0).toUpperCase() + prop.slice(1); // Capitalize the property name
                      propItem.textContent = propName + " - ";
                      propItem.appendChild(link);
                    } else {
                      propItem.textContent = prop + " - " + propValue;
                    }

                    propertiesList.appendChild(propItem);
                  }
                }

                propertiesCell.appendChild(propertiesList);
                row.appendChild(propertiesCell);

                table.appendChild(row);
              }
            }
          }

          outputContainer.appendChild(table);
        } else {
          outputContainer.textContent = "No entities found.";
        }
      })
      .catch(function(error) {
        console.log("An error occurred:", error);
      });
  }
});

var testStringField = document.getElementById("testString");
testStringField.addEventListener("input", function() {
  var inputValue = testStringField.value.trim().toLowerCase();
  var exampleStrings = document.querySelectorAll("#exampleStrings option");

  exampleStrings.forEach(function(option) {
    var optionValue = option.value.toLowerCase();
    if (optionValue.startsWith(inputValue)) {
      option.style.display = "block";
    } else {
      option.style.display = "none";
    }
  });
});
