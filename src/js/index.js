$(function() {
    $('.ipt').on('input', function() {
        $('.list').html('')
        var val = $(this).val();
        if (val) {
            $.ajax({
                url: '/api/list?val=' + val,
                dataType: "json",
                success: function(res) {
                    if (res.code === 0) {
                        render(res.data)
                    }
                }
            })
        }

    })

    function render(data) {
        var str = '';
        data.forEach(function(file) {
            str += `<li>${file.cont}</li>`
        })
        $('.list').html(str);
    }
})