$(function(){
    var urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.has('admin'));
    var store = new DevExpress.data.CustomStore({
        key: "description",
        load: function() {
            //return $.getJSON("https://localhost:44398/api/admin/")
            return $.getJSON("http://www.mrdeng.site/api/admin/")
                .fail(function() { throw "Data loading error" });
        },
        insert: function(event){
            return $.ajax({
                url: "http://www.mrdeng.site/api/admin/",
                //url: "https://localhost:44398/api/admin/",
                method:"POST",
                data: { SeatId: $("#seats").children("option:selected").val(), startdate: event.startDate, enddate:event.endDate,Cell:event.text },
                error: function(){throw "Insertion failed"}
            });
        },
        update: function (key, values) {
            return $.ajax({
                url: "http://www.mrdeng.site/api/admin/"+values.description,
                //url: "https://localhost:44398/api/admin/"+values.description,
                method: "PUT",
                data: {SeatId: $("#seats").children("option:selected").val(),SeatAvailabilityId:values.description, startdate: values.startDate, enddate:values.endDate,Cell:values.text},
                error: function(){throw "Update failed"}
            });
        },
        remove: function (key) {
            return $.ajax({
                url: "http://www.mrdeng.site/api/admin/"+key,
                //url: "https://localhost:44398/api/admin/"+key,
                method: "DELETE",
                error: function(){throw "Deletion failed"}
            })
        }
    });

    var scheduler = $("#scheduler").dxScheduler({
        dataSource: store,
        editing: {
            allowAdding: false,
            allowDeleting: false,
            allowUpdating: false,
            allowResizing: false,
            allowDragging: false
        },
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

    if (urlParams.has('admin')){
        scheduler.option("editing.allowAdding", true);
        scheduler.option("editing.allowDeleting", true);
        scheduler.option("editing.allowUpdating", true);
        scheduler.option("editing.allowDragging", true);
    }
});