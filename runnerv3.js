$(document).ready(function() {
  jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "date-eu-pre": function(date) {
      date = date.replace(" ", "");

      if (!date) {
        return 0;
      }

      var year;
      var eu_date = date.split(/[\.\-\/]/);

      /*year (optional)*/
      if (eu_date[2]) {
        year = eu_date[2];
      } else {
        year = 0;
      }

      /*month*/
      var month = eu_date[0];
      if (month.length == 1) {
        month = 0 + month;
      }

      /*day*/
      var day = eu_date[1];
      if (day.length == 1) {
        day = 0 + day;
      }

      return (year + month + day) * 1;
    },

    "date-eu-asc": function(a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-eu-desc": function(a, b) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
  });

  $('#usa-table').dataTable({
    dom: 'frtip',
    // "scrollY": "500px",
    // "scrollCollapse": true,
    // "paging": false,
    // fixedHeader: {
    //   header: true,
    //   footer: true
    // },
    responsive: {
      breakpoints: [{
          name: 'desktop',
          width: 768
        },
        {
          name: 'screen-xs',
          width: 767
        }
      ]
    },
    columnDefs: [{
        className: 'desktop',
        targets: [0, 1, 2, 3]
      }, {
        className: 'screen-xs',
        targets: [4, 5]
      }, {
        id: 'month',
        targets: [3]
      },
      // {
      //   searchable: false,
      //   targets: 7
      // },
      {
        type: 'date-eu',
        targets: [3]
      }
    ]
    // createdRow: function(row, data, dataIndex) {
    //   if (data[8] == `R`) {
    //     $(row).addClass('republican');
    //   } else if (data[8] == `D`) {
    //     $(row).addClass('democratic');
    //   } else {
    //     $(row).addClass('mixed');
    //   }
    // }
  });
})