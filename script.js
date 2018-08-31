(function( $ ) {
  $(function() {


    const points = {
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
    };

    for (var point in points) {
      if (points.hasOwnProperty(point)) {

        var id = point;
        var value = points[point]['value'];
        var connections = points[point]['connections'];
        connections = connections.join();
        var X = Math.floor(Math.random() * 500) + 1;
        var Y = Math.floor(Math.random() * 500) + 1;
        var style = 'top:'+Y+'px;left:'+X+'px';


        $('#board').append('<input  style="" class="point" readonly type="text" id="' + id + '" value="' + value + '" data-connections="' + connections + '"/>')
      }
    }

    var drawnConnections = [];


      $('.point').each(function(){
        var spender = $(this);
        var spenderID = $(this).attr('id');
        var connections = spender.attr('data-connections');
        var recipients = connections.split(',');
        console.log(spenderID+'has '+recipients.length+'connections: '+recipients);

        for (var i = 0; i < recipients.length; i++) {


          var start = String(spenderID);
          var end = String(recipients[i]);
          if(start!=null && end!=null){


            if(drawnConnections.indexOf(""+end+"-"+start) == -1){
              new LeaderLine(document.getElementById(start),document.getElementById(end), {
                    startPlug: 'behind',
                    endPlug: 'behind'
              });
              drawnConnections.push(""+start+"-"+end);
            }


          }



        }

        spender.click(function(){
          sendMoney(spenderID,connections)
        });
      });



      function sendMoney(sender,to){
        var recipients = to.split(',');
        var senderValue = $('#'+sender).val();
        var sentValue = recipients.length;
        var newValue = senderValue-sentValue;
        console.log(sender+' sends 1 coin to '+sentValue+' people and so loses '+sentValue);
        console.log(sender+' loses '+sentValue+' now has '+newValue);
        $('#'+sender).val(newValue);

        for (var i = 0; i < recipients.length; i++) {

          var id = recipients[i];
          console.log(id+' gets 1 coin');
          var recipientValue = $('#'+id).val();
          recipientValue++;
          $('#'+id).val(recipientValue);
          //Do something
        }

        checkWin();

    }

    function checkWin(){

        var win = 1;

        $('.point').each(function() {
          if($(this).val() < 0){
            win = 0;
          }
        });

        if(win == 1){
          $('#win').show();
        }

    }








  });
})(jQuery);