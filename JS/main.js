$(function() {
     $('#rangestart').calendar({
        today:true,
        touchReadonly:false,
        disableMinute: true,
        formatter: {
            date: function (date, settings) {
              if (!date) return '';
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getFullYear();
              return year + '-' + month + '-' + day;
            }
          },
          text: {
            days: ['周日', '周二', '周三', '周四', '周五', '周六', '周一'],
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            today: '今日',
            now: '今日',
            am: 'AM',
            pm: 'PM'
          },
        endCalendar: $('#rangeend')
      });
      $('#rangeend').calendar({
        today: true,
        touchReadonly:false,
        disableMinute: true,
        formatter: {
            date: function (date, settings) {
              if (!date) return '';
              var day = date.getDate();
              var month = date.getMonth() + 1;
              var year = date.getFullYear();
              return year + '-' + month + '-' + day;
            }
          },
          text: {
            days: ['周日', '周二', '周三', '周四', '周五', '周六', '周一'],
            months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthsShort:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            today: '今日',
            now: '今日',
            am: 'AM',
            pm: 'PM'
          },
        startCalendar: $('#rangestart')
      });


        var visibleDiv = 0;
        var SeatId= [];
        var Amount;
        showDiv();
        function showDiv(){
            $(".tab").hide();
            $(".tab:eq("+ visibleDiv +")").show();
            if(visibleDiv==0){
            $("#prevBtn").hide();
            }
            else if (visibleDiv==1){
              $("#prevBtn").show();
              getAvailability($('#calstart').val(),$('#calend').val());
            }
            else{
                $("#prevBtn").show();
            }

            if(visibleDiv == $(".tab").length-1)
            { 
                var seats = [];
                var regexp = /(\d+):(\d+)/g;
                var match = regexp.exec($('#calstart').val());
                var start = match[1]*1.0 + (match[2] / 60.0);
                var regexp = /(\d+):(\d+)/g;
                var match2 = regexp.exec($('#calend').val());
                var end = match2[1]*1.0 + (match2[2] / 60.0);
                $('#ReservationDate').val($('#calstart').val()+'至'+$('#calend').val());
                $.each($("input[type='checkbox']:checked"),function(){
                  seats.push($(this).val());
                })
                $('#SeatId').val(seats.join(", "));
                $('#Amount').val((end-start)*seats.length+"元");
                $('#nextBtn').html("提交");
                Amount = (end-start)*seats.length;
            }
            else
            {$('#nextBtn').html("下一步")} 
        }
        $('#nextBtn').click(function(){
            if (visibleDiv==0){
               if(!validationCalendar()){return false} 
            }
            else if (visibleDiv==1){
                if(!validationCheckbox()){
                    return false
                }
            }
            else if (visibleDiv ==$(".tab").length-1 ){
              var startT= $('#calstart').val();
              var endT = $('#calend').val();
              var cell = $('Cell').val();
              try{
                $.each(SeatId,function(index,value){
                  //$.post("http://www.mrdeng.site/api/SeatAvailabilities",{"SeatId":value,"enddate":endT,"startdate":startT,"CustomerId":cell}).done (function(){
                $.post("https://localhost:44398/api/SeatAvailabilities",{"SeatId":value,"enddate":endT,"startdate":startT,"CustomerId":cell}).done (function(){  
                  alert ("订座成功"); 
                  })
                  //console.log("index: "+index,"value: "+value);
                })
                //$.post( "http://www.mrdeng.site/api/payrequest",{"itemBody":"3333","subject":"邓老师自习室","totalAmount":Amount,"tradeno":"112"}).done(function(data){
                $.post( "https://localhost:44398/api/payrequest",{"itemBody":"3333","subject":"邓老师自习室","totalAmount":Amount,"tradeno":"112"}).done(function(data){
                const div = document.createElement('div');
                  div.innerHTML = data
                  document.body.appendChild(div);
                  document.forms[0].submit();
               })  
              }
              catch (error){
                console.error();
              }
              return false;
            }
           ++visibleDiv;
            showDiv()
        });
        $('#prevBtn').click(function(){
            if (visibleDiv == 0){visibleDiv= $(".tab").length-1}
            else {
                visibleDiv--;
            }
            showDiv();
        })


          $("input[type='checkbox']").click(function(){
            if($(this).is(':checked')){
              SeatId.push($(this).val());
            }else {
              SeatId.splice($.inArray($(this).val(),SeatId),1);
            }
          })

          function validationCalendar(){
                if($('#calstart').val().length===0){
                  $("#startLabel").html('请选择开始时间');
                  $("#startLabel").css('color','red');
                    return false;
                }
                else if($('#calend').val().length===0){
                  $("#endLabel").html('请选择结束时间');
                  $("#endLabel").css('color','red');
                  return false;
                }
                else{
                  $("#startLabel").html('开始时间');
                  $("#startLabel").css('color','black');
                  $("#endLabel").html('结束时间');
                  $("#endLabel").css('color','black');
                  return true;
                } 
          } 

          function validationCheckbox(){
              if ($('input[name="checkbox[]"]:checked').length>2){
                  alert("最多只能选择两个座位");
                  return false;
              }
              else if($('input[name="checkbox[]"]:checked').length==0){
                alert("请选择至少一个座位");
                return false;
              }
              else{return true}
          }

          function getAvailability(start,end){
              //var seatAPI = "http://www.mrdeng.site/api/SeatAvailabilities?startdate="+start+"&enddate="+end;
              var seatAPI = "https://localhost:44398/api/SeatAvailabilities?startdate="+start+"&enddate="+end;
              $.get( seatAPI).done(function(data){
                if($('#tab2').is(':visible')){
                  $.each(data,function(key,value){
                    console.log(value.SeatId);
                    $('#check_'+value.SeatId).prop('disabled',true);
                    $('#check_'+value.SeatId).addClass('input[type="checkbox"]:disabled + label');
                    
                  })
                }

              })
          }

});
