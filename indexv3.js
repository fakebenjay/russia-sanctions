// const spreadsheetId = '1Bcy8P5nLIMFCluYKjNzyOAm1OHeli5uykjqWWoNdxyM'
const spreadsheetId = '12-391zELR7-a8H16bax2rvWo5SiQOtfFVnoeJsIR9Cs'
fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&tq&gid=0`)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2))
    populateDataTable(json)
  })

// populate the data table with JSON data
function populateDataTable(data) {

  console.log("populating data table...");
  // clear the table before populating it with more data
  var table = $("#antitrust-table").DataTable().clear();

  var dataset = data.table.rows
  var length = dataset.length;
  var keyC = Object.keys(data.table.rows[0])[0]
  var keyV = Object.keys(data.table.rows[0][keyC][0])[0]
  var keyF = Object.keys(data.table.rows[0][keyC][3])[1]
  for (var i = 0; i < length; i++) {

    let name = dataset[i][keyC][0][keyV];
    let alias = !!dataset[i][keyC][1] ? dataset[i][keyC][1][keyV] : '';
    let date = dataset[i][keyC][3][keyF];
    // let name = `<a href="${dataset[i][keyC][11][keyV]}" target="_blank">${dataset[i][keyC][3][keyV]}</a>`;
    let type = dataset[i][keyC][5][keyV];
    let status = dataset[i][keyC][4][keyV];
    let allegation = dataset[i][keyC][6][keyV];
    let desc = dataset[i][keyC][7][keyV];

    // let coverage = `<strong><a href="${dataset[i][keyC][12][keyV]}" target="_blank">Click here for Law360 Coverage</a></strong>`

    var dataParam = [name, alias, type, date, allegation, desc]

    $('#antitrust-table').dataTable().fnAddData(dataParam);
  }
  if (window.innerWidth > 767) {
    $("#antitrust-table tfoot th").each(function(i) {
      if ($(this).text() !== '') {
        var colName = $(this).text()
        if (colName === 'Date') {
          var select = $("<div class='selectize-input selectize-control single input-group date' id='date-input' data-provide='datepicker'><input type='text' class='form-control'><div class='input-group-addon'><span class='glyphicon glyphicon-th'></span></div></div>")
            // var select = $("<input class='datepicker selectize-input selectize-control single' type='month' id='month' name='month' min='2021-01'>")
            .datepicker({
              format: "m/yyyy",
              startView: "months",
              minViewMode: "months",
              clearBtn: true,
              autoclose: true
            })
            .appendTo($(this).empty())
            .on('change', function() {
              var val = $('#date-input .form-control').val()

              if (val) {
                var month = val.split('/')[0]
                var year = val.split('/')[1]
                var monthYear = `${month}\/.*\/${year}`
              } else {
                var monthYear = ''
              }

              table.column(i)
                .search(monthYear, true, false)
                .draw();
            })
        }
        // else if (colName === 'Alias') {
        //   var select = $('<select><option value=""></option></select>')
        //     .appendTo($(this).empty())
        //     .on('change', function() {
        //       var vals = $(this).val();
        //       vals = vals === null ? '' : vals.replaceAll('"', '').split(';').map(d => d.trim())
        //       vals.forEach((val) => {
        //         table.column(i)
        //           .search(val ? $(this).val() : val, false, false)
        //           .draw();
        //       })
        //     });
        // }
        else {
          var select = $('<select><option value=""></option></select>')
            .appendTo($(this).empty())
            .on('change', function() {
              var val = $(this).val();

              val = val === null ? '' : val
              table.column(i)
                .search(val ? $(this).val() : val, false, false)
                .draw();
            });
        }
        if (colName === 'Name' || colName === 'Summary') {
          var statusItems = [];

          /* ### IS THERE A BETTER/SIMPLER WAY TO GET A UNIQUE ARRAY OF <TD> data-filter ATTRIBUTES? ### */
          table.column(i).nodes().to$().each(function(d, j) {
            var thisStatus = j.innerText;
            if ($.inArray(thisStatus, statusItems) === -1) statusItems.push(thisStatus);
          });

          statusItems.sort();
          $.each(statusItems, function(i, item) {
            select.append('<option value="' + item + '">' + item + '</option>');
          });
        } else if (colName === 'Alias') {
          var statusItems = [];

          /* ### IS THERE A BETTER/SIMPLER WAY TO GET A UNIQUE ARRAY OF <TD> data-filter ATTRIBUTES? ### */
          table.column(i).nodes().to$().each(function(d, j) {
            var thisStatus = j.innerText;
            var statuses = thisStatus.replaceAll('"', '').split(';').map(d => d.trim().replaceAll('. ', '').replaceAll('(JOINT-STOCK COMPANY PSZ YANTAR', 'JOINT-STOCK COMPANY PSZ YANTAR'))
            statuses.forEach((s) => {
              if ($.inArray(s, statusItems) === -1) statusItems.push(s);
            })
          });

          statusItems.sort();
          $.each(statusItems, function(i, item) {
            select.append('<option value="' + item + '">' + item + '</option>');
          });
        } else if (colName !== 'Date') {
          table.column(i).data().unique().sort().each(function(d, j) {
            select.append('<option value="' + d + '">' + d + '</option>');
          });
        }
      }
    });
  }
  //

  document.querySelector('#antitrust-table_wrapper').insertAdjacentHTML('afterbegin', "<button id='reset-btn'>Clear All Filters</button>")
  document.getElementById('reset-btn')
    .addEventListener('click', (e) => {
      e.preventDefault()
      var $select = $('.selectized').selectize()
      for (let i = 0; i < $select.length; i++) {
        $select[i].selectize.clear()
      }

      document.querySelectorAll('.selectize-input input').forEach(d => d.value = '')
      $('.selectize-input input').trigger('change')

      $("#antitrust-table").DataTable().search('').draw()
    })

  if (window.innerWidth > 768) {
    document.getElementById('date-input')
      .addEventListener('keydown', (e) => {
        e.preventDefault()
        if (e.keyCode == 8) {
          e.target.value = ''
        }
      })
    // .on('click', () => {
    //
    // })

    $(function() {
      $("tfoot select").selectize({
        searchField: ['text', 'optgroup']
      });
    });
  }
}