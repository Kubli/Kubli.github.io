(function ($) {
  $(function () {

    const nodesNumber = 5;
    const connectionNumber = 5;

    const points = [];
    var drawnConnections = [];

    function randomIntFromInterval(min,max)
    {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    function addPoints () {
      var positioner = 0;


      for (var x = 0; x < points.length; x++) {
        var X = 0;
        var Y = 0;
        positioner++;
        if(positioner>4){

          if((points.length -x ) >=4){
            positioner = 0;
          }
        }

        switch(positioner){
          case 1:
            X = randomIntFromInterval(20,230);
            Y = randomIntFromInterval(20,230);
            break;
          case 2:
            X = randomIntFromInterval(270,480);
            Y = randomIntFromInterval(20,230);
            break;
          case 3:
            X = randomIntFromInterval(20,230);
            Y = randomIntFromInterval(270,480);
            break;
          case 4:
            X = randomIntFromInterval(270,480);
            Y = randomIntFromInterval(270,480);
            break;
          default:
            X = randomIntFromInterval(125,375);
            Y = randomIntFromInterval(125,375);
            break;

        }

        var id = x;
        var value = points[x]['value'];
        var connections = points[x]['connections'];
        connections = connections.join();
        var style = 'top:' + Y + 'px;left:' + X + 'px';


        $('#board').append('<input  style="'+style+'" class="point" readonly type="text" id="' + id + '" value="' + value + '" data-connections="' + connections + '"/>')

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
                color: "#000000",
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
      console.log(to);
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


    function cleanupBoard(){

      drawnConnections.length = 0;
      points.length = 0;
      $('.point').remove();
      $('.leader-line').remove();
    }

    function generateNodes (n) {
      cleanupBoard();
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
      var genius = 0;
      for (var x = 0; x < points.length; x++) {
        var point = points[x];
        moneyCount = moneyCount + point["value"];
      }
      if(moneyCount <0){
        console.log('not solvable because '+moneyCount+' is not enough money');
        loadGame();
        return false;
      }
      genius = connectionsCount - pointCount + 1;
      console.log('connections='+connectionsCount);
      console.log('genius=' + genius);
      console.log('money=' + moneyCount);
      if (moneyCount >= genius) {
        console.log('difficulty: '+(moneyCount-genius));
        if((moneyCount - genius) > 5){
          console.log('easy solvable');
        }
        console.log('solvable');
        $('.lds-ripple').hide();
        clearInterval(checker);
        return true;
      } else {
        console.log('not solvable');
        loadGame();
        return false;
      }
    }


    function loadGame(){
      generateNodes(nodesNumber);
      addPoints();
      drawConnections();
      fixConnections();
      addFunctionality();
    }

    loadGame();
    var checked = 0;
    var checker = setInterval(function() {
      checked++;
      if(checked <=10) {
        checkIfSolveable();
      } else {
        clearInterval(checker);
      }
    },2000);


    console.log(points);


  });
})(jQuery);