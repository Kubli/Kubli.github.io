(function ($) {
  $(function () {

    const nodesNumber = 5;
    const connectionNumber = 5;
    var genius = 0;
    /*const points = {
      1: {
        value: 1,
        connections: [2,3]
      },
      2: {
        value: -2,
        connections: [1,3,5]
      },
      3: {
        value: 3,
        connections: [1,4,2]
      },
      4: {
        value:2,
        connections: [3]
      },
      5: {
        value: -1,
        connections: [2]
      }
    };*/
    const points = [];
    var drawnConnections = [];

    function addPoints (points) {
      for (var x = 0; x < points.length; x++) {


        var id = x;
        var value = points[x]['value'];
        var connections = points[x]['connections'];
        connections = connections.join();
        var X = Math.floor(Math.random() * 500) + 1;
        var Y = Math.floor(Math.random() * 500) + 1;
        var style = 'top:' + Y + 'px;left:' + X + 'px';


        $('#board').append('<input  style="" class="point" readonly type="text" id="' + id + '" value="' + value + '" data-connections="' + connections + '"/>')

      }
    }

    function drawConnections(){
      $('.point').each(function () {
        var spender = $(this);
        var spenderID = $(this).attr('id');
        var connections = spender.attr('data-connections');
        var recipients = connections.split(',');
        console.log(spenderID + 'has ' + recipients.length + 'connections: ' + recipients);

        for (var i = 0; i < recipients.length; i++) {


          var start = String(spenderID);
          var end = String(recipients[i]);
          if (start != null && end != null) {


            if (drawnConnections.indexOf("" + end + "-" + start) == -1 && start != end) {
              new LeaderLine(document.getElementById(start), document.getElementById(end), {
                startPlug: 'behind',
                endPlug: 'behind'
              });
              points[start]['realConnections'].push(end);
              points[end]['realConnections'].push(start);
              drawnConnections.push("" + start + "-" + end);
            }


          }


        }

      });
    }


    function fixConnections(){
      $('.point').each(function () {
        var spenderID = $(this).attr('id');
        var realConnections = points[spenderID]['realConnections']
        realConnections = realConnections.join();
        $(this).attr('data-connections',realConnections);
      });
    }

    function addFunctionality () {


      $('.point').each(function () {

        var spender = $(this);
        var spenderID = $(this).attr('id');
        var connections = spender.attr('data-connections');


        spender.click(function () {
          sendMoney(spenderID, connections)
        });
      });
    }


    function sendMoney (sender, to) {
      var recipients = to.split(',');
      var senderValue = $('#' + sender).val();
      var sentValue = recipients.length;
      var newValue = senderValue - sentValue;
      console.log(sender + ' sends 1 coin to ' + sentValue + ' people and so loses ' + sentValue);
      console.log(sender + ' loses ' + sentValue + ' now has ' + newValue);
      $('#' + sender).val(newValue);

      for (var i = 0; i < recipients.length; i++) {

        var id = recipients[i];
        console.log(id + ' gets 1 coin');
        var recipientValue = $('#' + id).val();
        recipientValue++;
        $('#' + id).val(recipientValue);
        //Do something
      }

      checkWin();

    }

    function checkWin () {

      var win = 1;

      $('.point').each(function () {
        if ($(this).val() < 0) {
          win = 0;
        }
      });

      if (win == 1) {
        $('#win').show();
      }

    }


    function generateNodes (n) {

      for (var i = 0; i < n; i++) {
        var money = Math.floor(Math.random() * 5) + 1; // this will get a number between 1 and 5;
        money *= Math.floor(Math.random() * 2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
        var connection1 = 0;
        var connection2 = 0;
        while (connection2 == connection1) {
          connection1 = Math.floor(Math.random() * 4) + 1;
          connection2 = Math.floor(Math.random() * 4) + 1;
        }

        var point = {
          value: money,
          connections: [connection1, connection2],
          realConnections: []
        };
        points.push(point);
      }
      console.log(points);
    }

    function checkIfSolveable () {
      var pointCount = points.length;
      var connectionsCount = drawnConnections.length;
      var moneyCount = 0;
      for (var x = 0; x < points.length; x++) {
        var point = points[x];
        moneyCount = point["value"];
      }
      var genius = connectionsCount - pointCount + 1;
      console.log('connections='+connectionsCount);
      console.log('genius=' + genius);
      console.log('money=' + moneyCount);
      if (moneyCount >= genius) {
        console.log('solvable');
      } else {
        console.log('not solvable');
      }
    }


    generateNodes(5);
    addPoints(points);
    drawConnections();
    addFunctionality();
    fixConnections();
    checkIfSolveable();
    console.log(points);


  });
})(jQuery);