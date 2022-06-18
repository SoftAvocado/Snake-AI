var weights_path = ""

jQuery(function(){

// ------------------------------------Architecture-------------------------------
    // Architecture - dymamic form
    $(document).on('click', '.btn-add', function(e) {
        e.preventDefault();

        let countEntry = $("#architecture_buttons1 .row").length;
        if (countEntry>10)
        {
            alert('Превышен максимум скрытых слоев!');
        }
        else
        {
            let controlForm = $('#architecture_buttons1');
            let currentEntry = $(this).parents('.entry:first');
            let newEntry = $(currentEntry.clone()).appendTo(controlForm);

            newEntry.find('input[name="numberOfNodes"]').val('');
            controlForm.find('.entry:not(:last) .btn-add')
                .removeClass('btn-add').addClass('btn-remove')
                .removeClass('btn-primary').addClass('btn-secondary')
                .html('<span class="fa fa-minus"></span>');
            $(newEntry)[0].scrollIntoView(false);
            // let html_old = $(e.target).html();
            // $("#architecture_buttons1 .row").html(html_old+'<i class="fas fa-check-circle arch_warning_icon"></i><i class="fas fa-exclamation-circle arch_warning_icon"></i>');
        }
    });

    // Architecture - remove input
    $(document).on('click', '.btn-remove', function(e) {
        e.preventDefault();

        $(this).parents('.entry:first').remove();
        return false;
    });

    // Architecture - clears all messages in validation fields
    function clearInputMessageFor_arch(input) {
        const cont = input.parentElement.parentElement;
        var old_status = null;
        if (cont.classList.contains('success')){
            old_status = 'success';
        }
        else if (cont.classList.contains('error')){
            old_status = 'error';
        }
        if (old_status !=null){
            cont.classList.remove(old_status);
        }
    }

    // Architecture - sets error message
    function setErrorFor_arch(input, message) {
        clearInputMessageFor_arch(input);
        const cont = input.parentElement.parentElement;
        const small_cont = document.getElementById('architecture_buttons_group');
        const small = small_cont.querySelector('small');
        cont.className = cont.className+' error';
        small.innerText = message;
        $('.arch_small').show();
    }

    // Architecture - sets success message
    function setSuccessFor_arch(input) {
        clearInputMessageFor_arch(input);
        const cont = input.parentElement.parentElement;
        cont.className = cont.className+' success';
        $('.arch_small').hide();
    }

    //Architecture - check if all inputs are filled
    function all_arch_inputs_filled(){
        let arch_layers = document.getElementById('architecture_buttons1');
        let num_layers = 0;
        num_layers = arch_layers.childElementCount-1;

        let filled_inputs = true;
        for (let i=0; i<num_layers; i++){
            if (arch_layers.children[i].children[0].children[1].value=="")
            {
                filled_inputs = false;
            }
        }
        return filled_inputs;
    }

    //Architecture - check if all inputs are correct and filled
    function all_arch_correct(){
        //Get amount of inputs
        let arch_layers = document.getElementById('architecture_buttons1');
        let num_layers = 0;
        num_layers = arch_layers.childElementCount-1;

        //read and check all inputs
        let success_all = true;
        let filled_inputs = true;
        for (let i=0; i<num_layers; i++){
            if (arch_layers.children[i].classList.contains('error'))
            {
                success_all = false;
            }
            filled_inputs = all_arch_inputs_filled();
            if (filled_inputs==false)
            {
                const small_cont = document.getElementById('architecture_buttons_group');
                const small = small_cont.querySelector('small');
                small.innerText = "Заполните все поля!";
                $('.arch_small').show();
            }
        }
        //console.log("success_all: "+success_all+"   filled_inputs: "+filled_inputs);
        return success_all&&filled_inputs;
    }
    //Architecture - read form into array
    function readArch(){
        let arch_layers = document.getElementById('architecture_buttons1');
        let num_layers = 0;
        num_layers = arch_layers.childElementCount-1;

        //read all boxes into array
        let arr_layers = [];
        for (let i=0; i<num_layers; i++){
            arr_layers.push(arch_layers.children[i].children[0].children[1].value)
        }
        return arr_layers;
    }

    //Architecture - change architecture picture with info from one input - 0ajax
    function sendPicREquest(){
        let arr_layers = readArch();
        //stringify array and post it to server
        var server_data = [{"arr_layers": arr_layers},{"pic_id": 0}];
        $.ajax({
            type: 'POST',
            url:'/layersPic',
            cache: false,
            data: JSON.stringify(server_data),
            contentType: "application/json; charset=utf-8",
            dataType: 'json'
        }).done(function() {
            //change arch__pic with generated picture
            $("#arch__pic").attr("src", "../static/layer_pictures/0.png"+ '?' + (new Date()).getTime());
        });
    }

    // Architecture - check inputs and generate new picture
    $(document).on("focusout", '.form-control, .btn-remove', function(ev) {
        (ev).preventDefault();
        var cur_input = ev.target;

        checkInput_int(cur_input, '1', '500', setErrorFor_arch,setSuccessFor_arch);
        if ((ev.target.value!="")&&(all_arch_correct()==true))
        {
            //get amount of layer boxes
            sendPicREquest();
            $(cur_input.parentElement).removeClass('success');
        }
        else if ((cur_input.parentElement.classList.contains('success'))&&(all_arch_inputs_filled()==false)){
            $(cur_input.parentElement).removeClass('success');
        }
        // sleep(100);
    });

    // Architecture - when button remove pressed, generate new picture
    $(document).on("click", '.btn-remove', function(ev) {
        (ev).preventDefault();

        if ((ev.target.value!="")&&(all_arch_correct()==true))
        {
            //get amount of layer boxes
            sendPicREquest();
        }
    });

// ------------------------------------Parameters-------------------------------
    // Parameters - sets error message
    function setErrorFor(input, message) {
        clearInputMessageFor(input);
        const cont = input.parentElement;
        const small = cont.querySelector('small');
        cont.className = cont.className+' error';
        small.innerText = message;
    }

    // Parameters - sets success message
    function setSuccessFor(input) {
        clearInputMessageFor(input);
        const cont = input.parentElement;
        cont.className = cont.className+' success';
    }

    // Parameters - clears message
    function clearInputMessageFor(input) {
        const cont = input.parentElement;
        var old_status = null;
        if (cont.classList.contains('success')){
            old_status = 'success';
        }
        else if (cont.classList.contains('error')){
            old_status = 'error';
        }
        if (old_status !=null){
            cont.classList.remove(old_status);
        }
    }

// ------------------------------------Validation Learning forms-------------------------------
    // Validation - generates success/error messages for input of type float
    function checkInput_float(el, min, max, setErrorFunc, setSuccessFunc){
        var el_val = el.value.trim();

        if (el_val === ''){
            setErrorFunc(el, 'Заполните поле!');
        }
        else if (/^[0-9]*[\.\/]?[0-9]+$/.test(el_val)==false){
            setErrorFunc(el, 'Встречены недопустимые символы!');
        }
        else if (el_val.includes('/'))
        {
            let sign = '/';
            let i_sign = el_val.indexOf(sign);
            if (i_sign==0){
                setErrorFunc(el, 'Введите делимое числа!');
            }
            else if (i_sign==el_val.length-1){
                setErrorFunc(el, 'Введите делитель числа!');
            }
            else{
                let part1 = el_val.substring(0,i_sign);
                let part2 = el_val.substring(i_sign+1,el_val.length);
                let res = Number(part1)/Number(part2);
                if (res < min || res > max){
                    setErrorFunc(el, 'Введите число от '+min+' до '+max+'!');
                }
                else {
                    setSuccessFor(el);
                }
            }
        }
        else if (Number(el_val) < min || Number(el_val) > max){
            setErrorFunc(el, 'Введите число от '+min+' до '+max+'!');
        }
        else {
            setSuccessFunc(el);
        }
    }

    // Validation - generates success/error messages for input of type integer
    function checkInput_int(el, min, max, setErrorFunc, setSuccessFunc){
        var el_val = el.value.trim();

        if (el_val === ''){
            setErrorFunc(el, 'Заполните поле!');
        }
        else if (/^[0-9]+$/.test(el_val)==false){
            setErrorFunc(el, 'Введите целое число!');
        }
        else if (Number(el_val) < min || Number(el_val) > max){
            setErrorFunc(el, 'Введите число от '+min+' до '+max+'!');
        }
        else {
            setSuccessFunc(el);
        }
    }

    // ValidationL - check if all inputs are correct
    function all_other_inputs_correct(){
        var par1 = document.getElementById('par_epsilon_decay_linear');
        var par2 = document.getElementById('par_learning_rate');
        var par3 = document.getElementById('par_memory_size');
        var par4 = document.getElementById('par_batch_size');
        var par5 = document.getElementById('par_games_amount');
        var par_display1 = document.getElementById('par_display');
        var par_speed = document.getElementById('par_speed');
        let filled_inputs = true;
        let success_all = false;

        if ((par1.value=="")||(par2.value=="")||(par3.value=="")||(par4.value=="")||(par5.value=="")){
            filled_inputs=false;
        }
        if ((par1.parentElement.classList.contains('success'))&&+
        (par2.parentElement.classList.contains('success'))&&+
        (par3.parentElement.classList.contains('success'))&&+
        (par4.parentElement.classList.contains('success'))&&+
        (par5.parentElement.classList.contains('success')))
        {
            success_all = true;
        }

        if (par_display1.checked) {
            if (par_speed.value==""){
                filled_inputs=false;
            }
            if (!(par_speed.parentElement.classList.contains('success'))){
                success_all = false;
            }
        }
        console.log("success_all: "+success_all+"   filled_inputs: "+filled_inputs);
        return success_all&&filled_inputs;
    }

    // ValidationL - validation for all inputs - 1ajax, start learning
    $(document).on('click', '#start__btn', function(e) { 
        e.preventDefault();

        if (!($('#start__btn').hasClass('stop_game'))){
            var par1 = document.getElementById('par_epsilon_decay_linear');
            var par2 = document.getElementById('par_learning_rate');
            var par3 = document.getElementById('par_memory_size');
            var par4 = document.getElementById('par_batch_size');
            var par5 = document.getElementById('par_games_amount');
            var par_display1 = document.getElementById('par_display');
            var par_speed1 = document.getElementById('par_speed');
    
            checkInput_float(par1, '0', '1', setErrorFor,setSuccessFor);
            checkInput_float(par2, '0.000001', '1', setErrorFor,setSuccessFor);
            checkInput_int(par3, '100', '10000', setErrorFor,setSuccessFor);
            checkInput_int(par4, '1', '10000', setErrorFor,setSuccessFor);
            checkInput_int(par5, '2', '10000', setErrorFor,setSuccessFor);
            if (par_display1.checked) {      
                checkInput_int(par_speed1, '1', '500', setErrorFor,setSuccessFor);
            }
    
            //if validation passed, send data to server
            //console.log(all_other_inputs_correct());
            //console.log(all_arch_correct());
            if (all_other_inputs_correct()&&all_arch_correct()){
                var vpar1=par1.value;
                var vpar2=par2.value;
                var vpar3=par3.value;
                var vpar4=par4.value;
                var vpar5=par5.value;
                var vlayers_arr = readArch();
                var vpar_speed1=0;
    
                par_display1.noshow = par_display1.checked ? false : true;
                console.log(par_speed1);
                console.log(par_display1);
                console.log(par_speed1.noshow);
                if (!par_display1.noshow) {
                    vpar_speed1=par_speed1.value;
                }
                if (vpar_speed1==0){
                    loadingScreen();
                }
    
                console.log(vpar1);
                console.log(vpar2);
                console.log(vpar3);
                console.log(vpar4);
                console.log(vpar5);
                console.log(vpar_speed1);
                console.log(vlayers_arr);
    
                var server_data = [
                    {"epsilon_decay_linear":vpar1},
                    {"learning_rate":vpar2},
                    {"memory_size":vpar3},
                    {"batch_size":vpar4},
                    {"games_amount":vpar5},
                    {"speed1":vpar_speed1},
                    {"layers":vlayers_arr}
                ];
    
                $.ajax({
                    type: 'POST',
                    url:'/startLearning',
                    data: JSON.stringify(server_data),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json'
                });
    
                $('#start__btn').val("Остановить обучение");
                $('#start__btn').addClass("stop_game");
            }
        }
    });

// ------------------------------------Upload weights--------------------------------------

    //Upload weights - read a single number from file name
    function readNumber(file, cur_id, type){
        cur_sym = file[cur_id];
        num = "";
        while ((cur_sym!="_")&&(file[cur_id]!='h')){
            cur_sym = file[cur_id];
            num+=cur_sym;
            cur_id+=1;
        };
        if (type=='int'){
            return [parseInt(num.slice(0, num.length-1)), cur_id];
        }
        else if (type=='float'){
            return [parseFloat(num.slice(0, num.length-1)), cur_id];
        }
    };

    //Upload weights - read all parameters from file name
    function readWeights(file){
        let arch = [];
        let par1,par2,par3,par4 = 0;
        let cur_id = file.indexOf("arch_")+5;
        let cur_sym = "";
        while (cur_sym!='p'){
            rn = readNumber(file, cur_id,'int');
            arch.push(rn[0]);
            cur_id = rn[1];
            cur_sym = file[cur_id];
        }
        cur_id+=5;
        rn = readNumber(file, cur_id,'float');
        par1 = rn[0];
        cur_id = rn[1];

        cur_id+=5;
        rn = readNumber(file, cur_id,'float');
        par2 = rn[0];
        cur_id = rn[1];

        cur_id+=5;
        rn = readNumber(file, cur_id,'int');
        par3 = rn[0];
        cur_id = rn[1];

        cur_id+=5;
        rn = readNumber(file, cur_id,'int');
        par4 = rn[0];
        cur_id = rn[1];

        return [arch,par1,par2,par3,par4];
    };

    //Upload weights - check file name validation and upload button functionality 
    $(document).on("change", ".file-upload-field", function(){ 
        let file_name = $(this).val().replace(/.*(\/|\\)/, '');
        console.log($(this).val().replace(/.*(\/|\\)/, ''));
        if (file_name==""){
            //$(this).parent(".file-upload-wrapper").attr("data-text", "Выберите файл!");
        }
        else{
            // file_name = file_name.slice(0, 32);
            $(this).parent(".file-upload-wrapper").attr("data-text", file_name);
            var par_upload = document.getElementById('upload_form');
            checkInput_file(par_upload,setErrorFor,setSuccessFor);
            if (par_upload.classList.contains('success')){
                let rn = readWeights(file_name);
                        
                $('#par_epsilon_decay_linear_intro2').val(rn[1]);
                $('#par_learning_rate_intro2').val(rn[2]);
                $('#par_memory_size_intro2').val(rn[3]);
                $('#par_batch_size_intro2').val(rn[4]);
                $('#par_games_amount_intro2').val(100);

                let arr_layers = rn[0];
                //stringify array and post it to server
                let server_data = [{"arr_layers": arr_layers},{"pic_id": 1}];
                $.ajax({
                    type: 'POST',
                    url:'/layersPic',
                    cache: false,
                    data: JSON.stringify(server_data),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json'
                }).done(function() {
                    //change arch__pic with generated picture
                    console.log("Picture changed!");
                    $("#arch__pic_intro2").attr("src", "../static/layer_pictures/1.png"+ '?' + (new Date()).getTime());
                });
                //$("#arch__pic_intro2").attr("src", "../static/images/architecture1.png")
            }
        }
    });

    //Upload weights - file name validation
    function isFileNameCorrect(file){
        let pattern1 = /weights_arch_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern2 = /weights_arch_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern3 = /weights_arch_\d{1,3}_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern4 = /weights_arch_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern5 = /weights_arch_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern6 = /weights_arch_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern7 = /weights_arch_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern8 = /weights_arch_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern9 = /weights_arch_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;
        let pattern10 = /weights_arch_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_\d{1,3}_par1_0.[0-9]{1,13}_par2_0.[0-9]{1,13}_par3_\d{1,5}_par4_\d{1,5}.h5/;

        let result = pattern1.test(file)||pattern2.test(file)||pattern3.test(file)||pattern4.test(file)||pattern5.test(file)||pattern6.test(file)||pattern7.test(file)||pattern8.test(file)||pattern9.test(file)||pattern10.test(file);
        return result;
    }

    //Upload weights - set an error or success class to upload button
    function checkInput_file(el,setErrorFunc,setSuccessFunc){
        var checked_weight = whatWeightChecked();
        if (checked_weight=='res_icon4'){
            let file = el.getAttribute('data-text');
            if (!((file[file.length-3]==".")&&(file[file.length-2]=="h")&&file[file.length-1]=="5")){
                console.log("Error!");
                setErrorFunc(el.firstChild, 'Формат файла должен быть .h5');
            }
            else if (!isFileNameCorrect(file)){
                setErrorFunc(el.firstChild, 'Нетиповое имя файла!');
            }
            else{
                console.log("Success!");
                setSuccessFunc(el.firstChild);
            }
        }
    }

// ------------------------------------Validation Game forms-------------------------------
    // ValidationG - check if all inputs are correct
    function all_other_inputs_intro2_correct(){
        var par5 = document.getElementById('par_games_amount_intro2');
        var par_display2 = document.getElementById('par_display_intro2');
        var par_speed = document.getElementById('par_speed_intro2');
        var par_upload = document.getElementById('upload_form');
        let filled_inputs = true;
        let success_all = false;

        if (par5.value==""){
            filled_inputs=false;
        }
        if ((whatWeightChecked()=='res_icon4')&&(par_upload.getAttribute('data-text')=="Выберите файл!")){
            filled_inputs=false;
        }
        if (par5.parentElement.classList.contains('success'))
        {
            success_all = true;
        }
        if ((whatWeightChecked()=='res_icon4')&&(par_upload.classList.contains('success'))){
            success_all = true;
        }
        if (par_display2.checked) {
            if (par_speed.value==""){
                filled_inputs=false;
            }
            if (!(par_speed.parentElement.classList.contains('success'))){
                success_all = false;
            }
        }
        console.log("success_all: "+success_all+"   filled_inputs: "+filled_inputs);
        return success_all&&filled_inputs;
    }

    // ValidationG - vValidation for all inputs - 2ajax, start learning
    $(document).on('click', '#start__btn_intro2', function(e) {
        e.preventDefault();
        if (!($('#start__btn_intro2').hasClass('stop_game'))){
            var par1 = document.getElementById('par_epsilon_decay_linear_intro2');
            var par2 = document.getElementById('par_learning_rate_intro2');
            var par3 = document.getElementById('par_memory_size_intro2');
            var par4 = document.getElementById('par_batch_size_intro2');
            var par5 = document.getElementById('par_games_amount_intro2');
            var par_display1 = document.getElementById('par_display_intro2');
            var par_speed1 = document.getElementById('par_speed_intro2');
            var par_upload = document.getElementById('upload_form');
    
            checkInput_int(par5, '2', '10000', setErrorFor,setSuccessFor);
            checkInput_int(par_speed1, '1', '500', setErrorFor,setSuccessFor);
            checkInput_file(par_upload,setErrorFor,setSuccessFor);
            //if validation passed, send data to server
            if (all_other_inputs_intro2_correct()){
                var vpar1=par1.value;
                var vpar2=par2.value;
                var vpar3=par3.value;
                var vpar4=par4.value;
                var vpar5=par5.value;
                var vlayers_arr = [];
                var vpar_speed1=0;
    
                par_display1.noshow = par_display1.checked ? false : true;
                console.log(par_speed1);
                console.log(par_display1);
                console.log(par_speed1.noshow);
                if (!par_display1.noshow) {
                    vpar_speed1=par_speed1.value;
                }
                if (vpar_speed1==0){
                    loadingScreen();
                }
    
                var checked_weight = whatWeightChecked();
                if (checked_weight=='res_icon1'){
                    vlayers_arr = [100,50,20];
                    weights_path = "static/weights/weights_1.h5";
                }
                else if (checked_weight=='res_icon2'){
                    vlayers_arr = [100,50,20];
                    weights_path = "static/weights/weights_2.h5";
                }
                else if (checked_weight=='res_icon3'){
                    vlayers_arr = [100,70,50,100,20];
                    weights_path = "static/weights/weights_3.h5";
                }
                else if (checked_weight=='res_icon4'){
                    let rn = readWeights(par_upload.getAttribute('data-text'));
                    vlayers_arr = rn[0];
                    weights_path = "static/weights/"+par_upload.getAttribute('data-text');
                }
    
                console.log(vpar1);
                console.log(vpar2);
                console.log(vpar3);
                console.log(vpar4);
                console.log(vpar5);
                console.log(vpar_speed1);
                console.log(vlayers_arr);
                console.log(weights_path);
                console.log(par_upload.getAttribute('data-text'));
    
                var server_data = [
                    {"epsilon_decay_linear":vpar1},
                    {"learning_rate":vpar2},
                    {"memory_size":vpar3},
                    {"batch_size":vpar4},
                    {"games_amount":vpar5},
                    {"speed1":vpar_speed1},
                    {"layers":vlayers_arr},
                    {"weight_path":weights_path}
                ];
    
                $.ajax({
                    type: 'POST',
                    url:'/startGaming',
                    data: JSON.stringify(server_data),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json'
                });
    
                $('#start__btn_intro2').val("Остановить игру");
                $('#start__btn_intro2').addClass("stop_game");
            }  
        }  
    });

    // ValidationG - hide all weight checks
    function hideAllWeightChecks(){
        var el;
        for (let i=1; i<5; i++){
            el = document.getElementById('res_icon'+i);
            if (el.parentElement.classList.contains('active_weights')){
                el.parentElement.classList.remove('active_weights');
            }
        }
        var par_upload = document.getElementById('upload_form');
        var old_status = null;
        if (par_upload.classList.contains('success')){
            old_status = 'success';
        }
        else if (par_upload.classList.contains('error')){
            old_status = 'error';
        }
        if (old_status !=null){
            par_upload.classList.remove(old_status);
            par_upload.setAttribute('data-text',"Выберите файл!");
        }
    }

    // ValidationG - determine what weight button is checked right now
    function whatWeightChecked(){
        var el;
        for (let i=1; i<5; i++){
            el = document.getElementById('res_icon'+i);
            if (el.parentElement.classList.contains('active_weights')){
                return 'res_icon'+i;
            }
        }
    }

    // ValidationG - set prepare weights #1
    $(document).on('click', '#weight_btn1', function(e) {
        e.preventDefault();

        hideAllWeightChecks()
        let res = document.getElementById('res_icon1');
        res.parentElement.classList.add('active_weights');

        $('#par_epsilon_decay_linear_intro2').val("1/140");
        $('#par_learning_rate_intro2').val("0.0001677712073867976");
        $('#par_memory_size_intro2').val("2500");
        $('#par_batch_size_intro2').val("500");
        $('#par_games_amount_intro2').val("150");
        $("#arch__pic_intro2").attr("src", "../static/images/architecture1.png")

    });

    // ValidationG - set prepare weights #2
    $(document).on('click', '#weight_btn2', function(e) {
        e.preventDefault();
        
        hideAllWeightChecks()
        let res = document.getElementById('res_icon2');
        res.parentElement.classList.add('active_weights');

        $('#par_epsilon_decay_linear_intro2').val("1/400");
        $('#par_learning_rate_intro2').val("0.0001677712073867976");
        $('#par_memory_size_intro2').val("2500");
        $('#par_batch_size_intro2').val("1000");
        $('#par_games_amount_intro2').val("500");
        $("#arch__pic_intro2").attr("src", "../static/images/architecture2.png")

    });

    // ValidationG - set prepare weights #3
    $(document).on('click', '#weight_btn3', function(e) {
        e.preventDefault();
        
        hideAllWeightChecks()
        let res = document.getElementById('res_icon3');
        res.parentElement.classList.add('active_weights');

        $('#par_epsilon_decay_linear_intro2').val("1/150");
        $('#par_learning_rate_intro2').val("0.0001677712073867976");
        $('#par_memory_size_intro2').val("2500");
        $('#par_batch_size_intro2').val("500");
        $('#par_games_amount_intro2').val("150");
        $("#arch__pic_intro2").attr("src", "../static/images/architecture3.png")

    });

    // ValidationG - set prepare weights #4
    $(document).on('click', '#weight_btn4', function(e) {
        
        hideAllWeightChecks()
        let res = document.getElementById('res_icon4');
        res.parentElement.classList.add('active_weights');

    });

// ------------------------------------Download weights-------------------------------

    // Download - download file on user's PC 
    function download(url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop();
        document.body.appendChild(a);
        console.log(a);
        a.click();
        document.body.removeChild(a);
    };

    // Download - download generated weights on user's PC
    $(document).on('click', '#download_weights', function(e) {
        (e).preventDefault();
        download(weights_path);
    });

});

// ------------------------------------Theory-------------------------------
// Theory - show clicked parameter in theory
function showParamPage(ev, t_n) {
    (ev).preventDefault();

    $(".nav-menu li").removeClass("active");
    $('#tnav'+5).addClass("active");

    let n = 5;
    let idj;
    let xj;
    for (let i=1; i<n+1; i++){
        idj = "theory"+i;
        xj = document.getElementById(idj);
        xj.style.display = "none";
    }

    new_id = "theory"+5;
    $('#'+new_id).show();
    location.href="index.html#par_theory";

    let id = "t_par"+t_n;
    let seconds = 2;
    var element = document.getElementById(id);
    var origcolor = 'rgb(85, 148, 39)';
    element.style.color = 'rgb(198, 60, 193)';
    var t = setTimeout(function(){
    element.style.color = origcolor;
    },(seconds*1000));
};

// Theory - animation for theory navigation
$(function() {
        $("li").click(function(e) {
        e.preventDefault();
        $("li").removeClass("active");
        $(this).addClass("active");
        });
    });

// Theory - animation for theory context
function showContent(ev, id) {
    (ev).preventDefault();

    let n = 5;
    let idj;
    let xj;
    for (let i=1; i<n+1; i++){
        idj = "theory"+i;
        xj = document.getElementById(idj);
        xj.style.display = "none";
    }
    new_id = "theory"+id.slice(-1);
    $('#'+new_id).show();
    };

// ------------------------------------Speed button-------------------------------
// SpeedBtn - hide and show speed input
function EnableDisableSpeed() {
    const cb = document.querySelector("#cbLearnPlay");
    if (cb.checked)
    {
        // Game mode
        let par_display = document.getElementById('par_display_intro2');
        let par_speed = $('#par_speed_intro2');
        par_speed.noshow = par_display.checked ? false : true;
        if (!par_speed.noshow) {
            $('#speed__inner_intro2').show();
        }
        else
        {
            $('#speed__inner_intro2').hide();
        }
    }
    else
    {
        // Train mode
        let par_display = document.getElementById('par_display');
        let par_speed = $('#par_speed');
        par_speed.noshow = par_display.checked ? false : true;
        if (!par_speed.noshow) {
            $('#speed__inner').show();
            par_speed.val('50');
        }
        else
        {
            $('#speed__inner').hide();
        }
    };
};
