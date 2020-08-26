$(function(){
    var store = new DevExpress.data.CustomStore({
        key: "description",
        load: function() {
           /*  var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); */
            //return $.getJSON("https://localhost:44398/api/admin/?date="+date)
            return $.getJSON("https://localhost:44398/api/admin/")
                .fail(function() { throw "Data loading error" });
        },
        insert: function(event){
            return $.ajax({
                url: "https://localhost:44398/api/admin/",
                method:"POST",
                data: { SeatId: $("#seats").children("option:selected").val(), startdate: event.startDate, enddate:event.endDate,CustomerId:event.text },
                error: function(){throw "Insertion failed"}
            });
        },
        update: function (key, values) {
            return $.ajax({
                url: "https://localhost:44398/api/admin/"+values.description,
                method: "PUT",
                data: {SeatId: $("#seats").children("option:selected").val(),SeatAvailabilityId:values.description, startdate: values.startDate, enddate:values.endDate,CustomerId:values.text},
                error: function(){throw "Update failed"}
            });
        },
        remove: function (key) {
            return $.ajax({
                url: "https://localhost:44398/api/admin/"+key,
                method: "DELETE",
                error: function(){throw "Deletion failed"}
            })
        }
    });

    var scheduuler = $("#scheduler").dxScheduler({
        dataSource: store,
        onAppointmentAdded: function(event) {
            console.log(event.appointmentData.text,event.appointmentData.startDate,event.appointmentData.endDate)
            return event;
        }, 
        onAppointmentUpdating: function (e) {
            console.log(e.newData.text,e.newData.startDate,e.newData.endDate)
            return e.newData.values;
        },
        onAppointmentDeleting: function (e){
            console.log(e.appointmentData.description)
            key = e.appointmentData.description
            return key;
        },

        views: ["day"],
        currentView: "day",
        currentDate: Date.now(),
        startDayHour: 9,
        height: 600
    }).dxScheduler("instance");
});